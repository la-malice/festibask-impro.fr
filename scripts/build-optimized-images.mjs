#!/usr/bin/env node
/**
 * Lit scripts/image-assets.json et génère les dérivés via ImageMagick.
 * Utilise `magick` (IM7, ex. macOS brew) ou `convert` (IM6, ex. apt install imagemagick sur Ubuntu).
 * Prérequis : délégué AVIF (libheif) pour l’écriture AVIF.
 *
 * SKIP_IMAGE_BUILD=1 : n’exécute rien (sortie 0).
 */

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/** @type {string | null} */
let magickBin = null;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SPEC_PATH = path.join(__dirname, 'image-assets.json');

function die(msg) {
  console.error(msg);
  process.exit(1);
}

/** Chemins dans la spec : POSIX sous assets/ uniquement */
function assertPathInAssets(rel) {
  if (typeof rel !== 'string' || rel.includes('..') || rel.includes('\\')) {
    die(`Chemin invalide : ${rel}`);
  }
  if (!rel.startsWith('assets/')) die(`Chemin hors assets/ : ${rel}`);
}

function resolveRel(rel) {
  return path.join(ROOT, ...rel.split('/'));
}

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function runMagick(args, label) {
  const r = spawnSync(magickBin, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (r.status !== 0) {
    const err = (r.stderr || r.stdout || '').trim();
    die(`${magickBin} a échoué (${label}) : ${err || 'code ' + r.status}`);
  }
}

function resolveMagickBin() {
  for (const bin of ['magick', 'convert']) {
    const r = spawnSync(bin, ['-version'], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout) return bin;
  }
  return null;
}

function checkMagick() {
  magickBin = resolveMagickBin();
  if (!magickBin) {
    die(
      'ImageMagick introuvable (essayez `magick` ou `convert`). macOS : brew install imagemagick libheif ; Ubuntu CI : apt install imagemagick.'
    );
  }
}

function checkAvifWrite() {
  const r = spawnSync(magickBin, ['-list', 'format'], { encoding: 'utf8' });
  if (r.status !== 0) return;
  const line = r.stdout.split('\n').find((l) => l.trim().startsWith('AVIF'));
  if (!line || !line.includes('rw+')) {
    die(
      `ImageMagick ne peut pas écrire le format AVIF (délégué manquant). Vérifiez libheif ; ${magickBin} -list format | grep AVIF`
    );
  }
}

function substituteTemplate(tpl, vars) {
  let s = tpl;
  for (const [k, v] of Object.entries(vars)) {
    s = s.split(`{${k}}`).join(String(v));
  }
  if (s.includes('{')) die(`Pattern de sortie incomplet : ${tpl}`);
  return s;
}

function loadSpec() {
  if (!fs.existsSync(SPEC_PATH)) die(`Fichier spec introuvable : ${SPEC_PATH}`);
  const raw = fs.readFileSync(SPEC_PATH, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    die(`JSON invalide dans image-assets.json : ${e.message}`);
  }
  if (data.version !== 1) die(`Version de schéma non supportée : ${data.version}`);
  if (!Array.isArray(data.jobs)) die('image-assets.json : jobs doit être un tableau');
  return data;
}

function processFitSquare(job, defaults) {
  const quality = job.quality ?? defaults.quality ?? 80;
  const widths = job.widths;
  const tpl = job.outputTemplate;
  if (!Array.isArray(widths) || !tpl) die(`Job ${job.id} : widths et outputTemplate requis`);
  for (const entry of job.entries || []) {
    const src = entry.source;
    const prefix = entry.prefix;
    if (!src || !prefix) die(`Job ${job.id} : source et prefix requis`);
    assertPathInAssets(src);
    const srcAbs = resolveRel(src);
    if (!fs.existsSync(srcAbs)) {
      console.warn(`Ignoré (fichier absent) : ${src}`);
      continue;
    }
    for (const w of widths) {
      const outRel = substituteTemplate(tpl, { prefix, width: w });
      assertPathInAssets(outRel);
      const outAbs = resolveRel(outRel);
      ensureDirForFile(outAbs);
      runMagick([srcAbs, '-resize', `${w}x${w}`, '-quality', String(quality), outAbs], outRel);
    }
  }
}

function processFitBox(job, defaults) {
  const quality = job.quality ?? defaults.quality ?? 80;
  const ref = job.referenceSize;
  const widths = job.widths;
  const tpl = job.outputTemplate;
  if (!Array.isArray(ref) || ref.length !== 2 || !Array.isArray(widths) || !tpl) {
    die(`Job ${job.id} : referenceSize [w,h], widths et outputTemplate requis`);
  }
  const [rw, rh] = ref;
  for (const entry of job.entries || []) {
    const src = entry.source;
    const prefix = entry.prefix;
    if (!src || !prefix) die(`Job ${job.id} : source et prefix requis`);
    assertPathInAssets(src);
    const srcAbs = resolveRel(src);
    if (!fs.existsSync(srcAbs)) {
      console.warn(`Ignoré (fichier absent) : ${src}`);
      continue;
    }
    for (const w of widths) {
      const h = Math.floor((w * rh) / rw);
      const outRel = substituteTemplate(tpl, { prefix, width: w, height: h });
      assertPathInAssets(outRel);
      const outAbs = resolveRel(outRel);
      ensureDirForFile(outAbs);
      runMagick([srcAbs, '-resize', `${w}x${h}`, '-quality', String(quality), outAbs], outRel);
    }
  }
}

function processCoverBatch(job) {
  const src = job.source;
  if (!src) die(`Job ${job.id} : source requis`);
  assertPathInAssets(src);
  const srcAbs = resolveRel(src);
  if (!fs.existsSync(srcAbs)) {
    die(`Fichier source absent : ${src}`);
  }
  for (const out of job.outputs || []) {
    const { path: outRel, width: w, height: h, quality: q } = out;
    if (!outRel || w == null || h == null || q == null) {
      die(`Job ${job.id} : chaque output doit avoir path, width, height, quality`);
    }
    assertPathInAssets(outRel);
    const outAbs = resolveRel(outRel);
    ensureDirForFile(outAbs);
    runMagick(
      [
        srcAbs,
        '-resize',
        `${w}x${h}^`,
        '-gravity',
        'center',
        '-extent',
        `${w}x${h}`,
        '-quality',
        String(q),
        outAbs
      ],
      outRel
    );
  }
}

function processEncodeOnly(job, defaults) {
  const quality = job.quality ?? defaults.quality ?? 80;
  for (const entry of job.entries || []) {
    const src = entry.source;
    const outRel = entry.out;
    if (!src || !outRel) die(`Job ${job.id} : source et out requis`);
    assertPathInAssets(src);
    assertPathInAssets(outRel);
    const srcAbs = resolveRel(src);
    if (!fs.existsSync(srcAbs)) {
      console.warn(`Ignoré (fichier absent) : ${src}`);
      continue;
    }
    const outAbs = resolveRel(outRel);
    ensureDirForFile(outAbs);
    runMagick([srcAbs, '-quality', String(quality), outAbs], outRel);
  }
}

function main() {
  if (process.env.SKIP_IMAGE_BUILD === '1') {
    console.log('SKIP_IMAGE_BUILD=1 — génération d’images ignorée.');
    return;
  }

  checkMagick();
  checkAvifWrite();

  const data = loadSpec();
  const defaults = data.defaults || {};

  for (const job of data.jobs) {
    if (!job.id || !job.mode) die('Chaque job doit avoir id et mode');
    switch (job.mode) {
      case 'fitSquare':
        processFitSquare(job, defaults);
        break;
      case 'fitBox':
        processFitBox(job, defaults);
        break;
      case 'coverBatch':
        processCoverBatch(job);
        break;
      case 'encodeOnly':
        processEncodeOnly(job, defaults);
        break;
      default:
        die(`Mode inconnu : ${job.mode} (job ${job.id})`);
    }
  }

  console.log('Images optimisées : OK (spec scripts/image-assets.json).');
}

main();
