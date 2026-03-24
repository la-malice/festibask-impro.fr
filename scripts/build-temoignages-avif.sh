#!/usr/bin/env bash
# Génère les AVIF carrés des photos témoignages (128w, 256w) depuis les sources dans
# assets/img/, sortie dans assets/img/long/ (même cache Cloudflare que les autres long/).
#
# Prérequis : ImageMagick 7 avec support AVIF (libheif).
#   macOS : brew install imagemagick libheif

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC_DIR="$PROJECT_ROOT/assets/img"
OUT_DIR="$PROJECT_ROOT/assets/img/long"
SIZES="128 256"
QUALITY=80

# Associe fichier PNG/JPEG source -> préfixe de sortie dans long/
# Format : "fichier.png:prefix-sortie"
MAP="
julie-ferrier.png:julie-ferrier
"

if ! command -v magick &>/dev/null; then
  echo "Erreur: ImageMagick (magick) introuvable. Installez-le (ex: brew install imagemagick libheif)." >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

for entry in $MAP; do
  [[ -z "$entry" ]] && continue
  src_file="${entry%%:*}"
  prefix="${entry##*:}"
  src_path="$SRC_DIR/$src_file"
  if [[ ! -f "$src_path" ]]; then
    echo "Ignoré (fichier absent): $src_path"
    continue
  fi
  echo "Traitement: $src_file -> $prefix-{128,256}w.avif"
  for w in $SIZES; do
    out="$OUT_DIR/${prefix}-${w}w.avif"
    magick "$src_path" -resize "${w}x${w}" -quality "$QUALITY" "$out"
  done
done

echo "Terminé. Fichiers écrits dans $OUT_DIR"
