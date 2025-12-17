#!/usr/bin/env python3
"""
Serveur HTTP simple pour tester le site en local
Usage: python3 server.py
Puis ouvrez http://localhost:8000 dans votre navigateur
"""

import http.server
import socketserver
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Ajouter les en-têtes CORS si nécessaire
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        super().end_headers()

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 Serveur démarré sur http://localhost:{PORT}")
        print(f"📂 Répertoire: {os.getcwd()}")
        print(f"🌐 Ouvrez http://localhost:{PORT} dans votre navigateur")
        print("⏹️  Appuyez sur Ctrl+C pour arrêter le serveur")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Serveur arrêté")

