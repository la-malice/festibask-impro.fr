#!/usr/bin/env bash
# Dérivés 16:9 pour la bannière match « La Malice vs Suisse » (aligné sur equipe-belgique).
# Source : assets/img/equipe-suisse.png (paysage recommandé ; autre ratio → recadrage centré cover).
# Sortie : AVIF 320/442/640w dans assets/img/long/ ; JPEG 320w, 640w + equipe-suisse.jpg dans assets/img/.
#
# Prérequis : ImageMagick 7 avec support AVIF (libheif).
#   macOS : brew install imagemagick libheif
#
# Usage : depuis la racine du projet, ./scripts/build-equipe-suisse-assets.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC="$PROJECT_ROOT/assets/img/equipe-suisse.png"
OUT_LONG="$PROJECT_ROOT/assets/img/long"
OUT_IMG="$PROJECT_ROOT/assets/img"

if ! command -v magick &>/dev/null; then
  echo "Erreur: ImageMagick (magick) introuvable. Installez-le (ex: brew install imagemagick libheif)." >&2
  exit 1
fi

if [[ ! -f "$SRC" ]]; then
  echo "Erreur: fichier source absent : $SRC" >&2
  exit 1
fi

mkdir -p "$OUT_LONG"

for spec in "320:180" "442:249" "640:360"; do
  w="${spec%%:*}"
  h="${spec##*:}"
  magick "$SRC" -resize "${w}x${h}^" -gravity center -extent "${w}x${h}" -quality 80 \
    "$OUT_LONG/equipe-suisse-${w}w.avif"
done

magick "$SRC" -resize "320x180^" -gravity center -extent "320x180" -quality 85 \
  "$OUT_IMG/equipe-suisse-320w.jpg"
magick "$SRC" -resize "640x360^" -gravity center -extent "640x360" -quality 85 \
  "$OUT_IMG/equipe-suisse-640w.jpg"
magick "$SRC" -resize "640x360^" -gravity center -extent "640x360" -quality 88 \
  "$OUT_IMG/equipe-suisse.jpg"

echo "OK : AVIF dans $OUT_LONG (equipe-suisse-*w.avif), JPEG dans $OUT_IMG."
