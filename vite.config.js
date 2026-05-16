import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const certsDir = path.join(__dirname, 'scripts', 'certs');
const keyPath = path.join(certsDir, 'dev.key');
const certPath = path.join(certsDir, 'dev.pem');

const https =
  fs.existsSync(keyPath) && fs.existsSync(certPath)
    ? { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) }
    : undefined;

/** Malix leaderboard BFF: prod by default (no local wrangler secret). Set MALIX_API_LOCAL=1 for worker-malix-api dev. */
const malixApiProxyTarget =
  process.env.MALIX_API_LOCAL === '1'
    ? 'http://127.0.0.1:8787'
    : 'https://festibask-impro.fr';

/** @type {import('vite').UserConfig} */
export default {
  root: '.',
  server: {
    port: 8000,
    open: true,
    host: true,
    ...(https && { https }),
    proxy: {
      '/malix/api': {
        target: malixApiProxyTarget,
        changeOrigin: true,
        secure: true
      }
    }
  },
};
