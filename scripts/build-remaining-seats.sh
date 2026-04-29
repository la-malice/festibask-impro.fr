#!/usr/bin/env bash
# Charge SHEET_CSV_URL depuis .env à la racine du dépôt, puis régénère remaining-seats.json.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

ENV_FILE="$ROOT/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "build-remaining-seats: fichier .env introuvable à la racine du dépôt ($ENV_FILE)." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "${SHEET_CSV_URL:-}" ]]; then
  echo "build-remaining-seats: SHEET_CSV_URL est vide ou absent dans .env." >&2
  exit 1
fi

npm run build:places
