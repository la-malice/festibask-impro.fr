/**
 * Fetches published Google Sheet CSV (SHEET_CSV_URL) and writes assets/data/places-spectacles.json.
 * If SHEET_CSV_URL is unset, keeps existing committed JSON unchanged (local dev without secret).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outPath = path.join(root, 'assets', 'data', 'places-spectacles.json');

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

function parseCsv(text) {
  const raw = stripBom(text).trim();
  if (!raw) throw new Error('CSV vide');
  const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) throw new Error('CSV: besoin d’une ligne d’en-tête et d’au moins une ligne de données');

  const header = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  let idxJour = header.findIndex((h) => /jour/.test(h));
  let idxPlaces = header.findIndex((h) => /place|rstante|dispo|rest/.test(h));
  if (idxJour < 0) idxJour = 0;
  if (idxPlaces < 0) idxPlaces = header.length > 1 ? 1 : -1;
  if (idxPlaces < 0) throw new Error('CSV: colonne places introuvable');

  const passes = {};
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const dayLabel = cols[idxJour] || '';
    const numRaw = cols[idxPlaces];
    const passId = passIdFromDayLabel(dayLabel);
    if (!passId) continue;
    const n = parseInt(String(numRaw).replace(/\s/g, ''), 10);
    if (Number.isNaN(n)) continue;
    passes[passId] = {
      label: dayLabel.trim(),
      remaining: Math.max(0, n),
    };
  }

  return passes;
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

  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} en téléchargeant le CSV`);
  }
  const text = await res.text();
  const passes = parseCsv(text);

  const payload = {
    generatedAt: new Date().toISOString(),
    source: 'sheet',
    passes,
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log('build-places-from-sheet: écrit', outPath, Object.keys(passes).length, 'pass(es)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
