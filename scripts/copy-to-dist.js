/**
 * Copy static site files to dist/ for deployment.
 * Sources stay untouched; only dist/ gets the built (minified) CSS/JS later.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

const toCopy = [
  'index.html',
  'CNAME',
  'favicon.svg',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  'sw.js',
  'brevo-frame.html',
  'apple-touch-icon.png',
  'assets',
  'malix',
  'festival-2026',
  'festibask-impro-mentions-legales.pdf',
  'plaquette-sponsoring-festibak-impro-2026.pdf'
];

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true });
}
fs.mkdirSync(dist, { recursive: true });

for (const entry of toCopy) {
  const src = path.join(root, entry);
  if (!fs.existsSync(src)) continue;
  const dest = path.join(dist, entry);
  copyRecursive(src, dest);
}

const localMalixAccessConfig = path.join(root, 'malix', 'assets', 'access-config.local.js');
const distMalixAccessConfig = path.join(dist, 'malix', 'assets', 'access-config.js');
if (fs.existsSync(localMalixAccessConfig)) {
  fs.mkdirSync(path.dirname(distMalixAccessConfig), { recursive: true });
  fs.copyFileSync(localMalixAccessConfig, distMalixAccessConfig);
  console.log('Applied local Malix access config override in dist/malix/assets/access-config.js');
}

console.log('Copied site files to dist/');
