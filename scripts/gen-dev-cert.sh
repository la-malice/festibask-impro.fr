#!/usr/bin/env sh
# Génère un certificat auto-signé pour le dev HTTPS local (localhost + 192.168.1.134).
# Usage: ./scripts/gen-dev-cert.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CERTS_DIR="${SCRIPT_DIR}/certs"
CONFIG="${CERTS_DIR}/openssl-san.cnf"
KEY="${CERTS_DIR}/dev.key"
CERT="${CERTS_DIR}/dev.pem"

mkdir -p "$CERTS_DIR"

openssl req -x509 -nodes -days 825 -newkey rsa:2048 \
  -keyout "$KEY" -out "$CERT" \
  -config "$CONFIG" -extensions req_ext

echo "Certificat généré: $CERT"
echo "Clé privée: $KEY"
echo "Pour HTTPS en dev: npm run dev (ou ./scripts/start-dev.sh)"
