/**
 * Fetches published Google Sheet CSV (SHEET_CSV_URL) and writes assets/data/remaining-seats.json.
 * If SHEET_CSV_URL is unset, keeps existing committed JSON unchanged (local dev without secret).
 *
 * Formats CSV supportés :
 * - **Avec colonne d’identifiant** (`id`, `cle`, `key`, `identifiant`, **`billet`**) : chaque ligne a une clé
 *   `pass-vendredi` ou `vendredi`, `atelier-vendredi-11h-initiation`, etc., et une colonne places → remplit `passes` et `stages`.
 * - **Ancien format** (colonne `jour` + places) : uniquement les pass ; les `stages` existants du fichier
 *   `remaining-seats.json` déjà présent dans le dépôt sont conservés si le CSV ne contient pas de colonne id.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outPath = path.join(root, 'assets', 'data', 'remaining-seats.json');

const DAY_TO_PASS = new Map([
  ['vendredi', 'pass-vendredi'],
  ['samedi', 'pass-samedi'],
  ['dimanche', 'pass-dimanche'],
  ['les 3 jours', 'pass-3-jours'],
  ['les trois jours', 'pass-3-jours'],
  ['3 jours', 'pass-3-jours'],
]);

function stripBom(s) {
  if (s.charCodeAt(0) === 0xfeff) return s.slice(1);
  return s;
}

function normalizeDayKey(label) {
  return label
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function parseCsvLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
      continue;
    }
    cur += c;
  }
  result.push(cur.trim());
  return result;
}

function passIdFromDayLabel(label) {
  const n = normalizeDayKey(label);
  if (DAY_TO_PASS.has(n)) return DAY_TO_PASS.get(n);
  if (n.includes('3') && n.includes('jour')) return 'pass-3-jours';
  return null;
}

function normalizeHeaderCell(h) {
  return h
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Colonne de clé technique : id, cle, key, identifiant, billet (usage courant côté tableur). */
function headerIsKeyColumn(h) {
  const n = normalizeHeaderCell(h);
  return /^(id|cle|key)$/.test(n) || n === 'identifiant' || n === 'billet';
}

/** Colonne numérique des places restantes (éviter « resume » / résumé : pas de motif « rest » seul). */
function headerIsPlacesColumn(h) {
  const n = normalizeHeaderCell(h);
  if (/prix|price|€|eur|cout|co[uû]t/.test(n)) return false;
  return (
    /\bplaces?\b/.test(n) ||
    /restant|remaining|dispo(nible)?|stock|quota|rstante/.test(n) ||
    /^nb\b/.test(n)
  );
}

/** @returns {{ header: string[], idxKey: number, idxJour: number, idxPlaces: number }} */
function analyzeHeader(line0) {
  const header = parseCsvLine(line0).map((h) => h.trim().toLowerCase());
  const rawCells = parseCsvLine(line0);
  let idxKey = rawCells.findIndex((h) => headerIsKeyColumn(h));
  let idxJour = header.findIndex((h) => /jour/.test(h));
  let idxPlaces = rawCells.findIndex((h) => headerIsPlacesColumn(h));
  if (idxJour < 0) idxJour = 0;
  if (idxPlaces < 0) idxPlaces = header.length > 1 ? 1 : -1;
  return { header, idxKey, idxJour, idxPlaces };
}

function parsePlacesCell(numRaw) {
  const n = parseInt(String(numRaw).replace(/\s/g, ''), 10);
  if (Number.isNaN(n)) return null;
  return Math.max(0, n);
}

/**
 * Interprète la valeur colonne billet/id : pass explicite, atelier, ou jour seul (vendredi → pass-vendredi).
 * @returns {{ bucket: 'passes'|'stages', id: string } | null}
 */
function routeKeyedRow(rawKey) {
  const t = (rawKey || '').trim();
  if (!t) return null;
  if (t.startsWith('pass-')) return { bucket: 'passes', id: t };
  if (t.startsWith('atelier-')) return { bucket: 'stages', id: t };
  const passId = passIdFromDayLabel(t);
  if (passId) return { bucket: 'passes', id: passId };
  return null;
}

/**
 * Format avec colonne id/cle/billet : passes et stages.
 */
function parseCsvKeyed(text) {
  const raw = stripBom(text).trim();
  if (!raw) throw new Error('CSV vide');
  const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) throw new Error('CSV: besoin d’une ligne d’en-tête et d’au moins une ligne de données');

  const { idxKey, idxPlaces } = analyzeHeader(lines[0]);
  if (idxKey < 0) throw new Error('CSV: colonne id/cle attendue pour ce mode');
  if (idxPlaces < 0) throw new Error('CSV: colonne places introuvable');

  const passes = {};
  const stages = {};

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const key = (cols[idxKey] || '').trim();
    if (!key) continue;
    const numRaw = cols[idxPlaces];
    const remaining = parsePlacesCell(numRaw);
    if (remaining === null) continue;

    const routed = routeKeyedRow(key);
    if (!routed) continue;

    if (routed.bucket === 'passes') {
      passes[routed.id] = { remaining };
    } else {
      stages[routed.id] = { remaining };
    }
  }

  return { passes, stages };
}

/**
 * Ancien format : colonne jour + places (pass uniquement).
 */
function parseCsvLegacy(text) {
  const raw = stripBom(text).trim();
  if (!raw) throw new Error('CSV vide');
  const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) throw new Error('CSV: besoin d’une ligne d’en-tête et d’au moins une ligne de données');

  const { idxJour, idxPlaces } = analyzeHeader(lines[0]);
  if (idxPlaces < 0) throw new Error('CSV: colonne places introuvable');

  const passes = {};
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const dayLabel = cols[idxJour] || '';
    const numRaw = cols[idxPlaces];
    const passId = passIdFromDayLabel(dayLabel);
    if (!passId) continue;
    const remaining = parsePlacesCell(numRaw);
    if (remaining === null) continue;
    passes[passId] = { remaining };
  }

  return passes;
}

/** Ne garde que `{ remaining }` par entrée (supprime d’anciens champs `label` après migration). */
function slimPlaceBucket(bucket) {
  if (!bucket || typeof bucket !== 'object' || Array.isArray(bucket)) return {};
  const out = {};
  for (const k of Object.keys(bucket)) {
    const v = bucket[k];
    if (!v || typeof v !== 'object') continue;
    if (!('remaining' in v)) continue;
    const r = v.remaining;
    out[k] = { remaining: typeof r === 'number' && !Number.isNaN(r) ? r : null };
  }
  return out;
}

function csvHasKeyColumn(line0) {
  const rawCells = parseCsvLine(line0);
  return rawCells.some((h) => headerIsKeyColumn(h));
}

function readExistingJson() {
  if (!fs.existsSync(outPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(outPath, 'utf8'));
  } catch {
    return null;
  }
}

async function main() {
  const url = process.env.SHEET_CSV_URL;
  if (!url || !url.trim()) {
    console.log('build-places-from-sheet: SHEET_CSV_URL non défini — conservation du fichier existant.');
    if (!fs.existsSync(outPath)) {
      console.error('build-places-from-sheet: fichier manquant:', outPath);
      process.exit(1);
    }
    return;
  }

  const existing = readExistingJson();

  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} en téléchargeant le CSV`);
  }
  const text = await res.text();
  const rawLines = stripBom(text).trim().split(/\r?\n/).filter((l) => l.length > 0);
  const firstLine = rawLines[0] || '';

  let passes;
  /** @type {Record<string, { remaining: number | null }>} */
  let stages;

  const useKeyed = csvHasKeyColumn(firstLine);
  if (useKeyed) {
    const parsed = parseCsvKeyed(text);
    passes = parsed.passes;
    stages = parsed.stages;
  } else {
    passes = parseCsvLegacy(text);
    stages =
      existing && existing.stages && typeof existing.stages === 'object' && !Array.isArray(existing.stages)
        ? slimPlaceBucket(existing.stages)
        : {};
    console.warn(
      'build-places-from-sheet: aucune colonne id / cle / identifiant / billet dans le CSV — seuls les pass (colonne jour) sont mis à jour. Les stages sont repris du fichier remaining-seats.json existant (souvent avec remaining null). Utilisez une colonne "billet" (ou "id") + "places_restantes" avec les lignes atelier-… et vendredi/samedi/dimanche pour les pass.'
    );
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    source: 'sheet',
    passes,
    stages,
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  const pk = Object.keys(passes).length;
  const sk = Object.keys(stages).length;
  console.log(
    'build-places-from-sheet: écrit',
    outPath,
    '|',
    pk,
    'pass(es),',
    sk,
    'stage(s)',
    useKeyed
      ? '(colonnes id + places lues dans le CSV)'
      : '— stages non mis à jour depuis le Sheet (voir avertissement ci-dessus)'
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
