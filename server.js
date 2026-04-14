#!/usr/bin/env node
/**
 * Serveur HTTP simple pour tester le site en local
 * Usage: node server.js
 * Puis ouvrez http://localhost:8000 dans votre navigateur
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

// Types MIME
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.otf': 'font/otf',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
};

const server = http.createServer((req, res) => {
  // Déterminer le chemin du fichier
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  // Obtenir l'extension du fichier
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // Lire et servir le fichier
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Fichier non trouvé</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Erreur serveur: ${error.code}`, 'utf-8');
      }
    } else {
      const typeWithCharset =
        extname === '.html' || extname === '.css' || extname === '.js' || extname === '.json'
          ? `${contentType}; charset=utf-8`
          : contentType;
      res.writeHead(200, {
        'Content-Type': typeWithCharset,
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📂 Répertoire: ${process.cwd()}`);
  console.log(`🌐 Ouvrez http://localhost:${PORT} dans votre navigateur`);
  console.log('⏹️  Appuyez sur Ctrl+C pour arrêter le serveur');
});


