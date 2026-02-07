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

/** @type {import('vite').UserConfig} */
export default {
  root: '.',
  server: {
    port: 8000,
    open: true,
    host: true,
    ...(https && { https }),
  },
};
