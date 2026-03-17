#!/usr/bin/env bash
# Génère les AVIF des intervenants de stages (640, 340, 192, 96 px) depuis les PNG
# sources dans assets/img/ et les place dans assets/img/long/ avec le nommage attendu.
#
# Prérequis : ImageMagick 7 avec support AVIF (libheif).
#   macOS : brew install imagemagick libheif
#   Si AVIF non disponible, voir en fin de script une variante avec ffmpeg.

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC_DIR="$PROJECT_ROOT/assets/img"
OUT_DIR="$PROJECT_ROOT/assets/img/long"
SIZES="640 340 192 96"
QUALITY=80

# Associe fichier PNG source -> préfixe de sortie dans long/
# Format : "fichier.png:prefix-sortie"
MAP="
quentin.png:quentin-ostanel
laetitia.png:laetitia-landelle
jeremy.png:jeremy
loraine.png:lorraine
emilie.png:emilie-coeurdevache
anneke.png:anneke-bossis
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
  echo "Traitement: $src_file -> $prefix-{640,340,192,96}w.avif"
  for w in $SIZES; do
    out="$OUT_DIR/${prefix}-${w}w.avif"
    magick "$src_path" -resize "${w}x${w}" -quality "$QUALITY" "$out"
  done
done

echo "Terminé. Fichiers écrits dans $OUT_DIR"

# --- Alternative avec ffmpeg (si ImageMagick sans AVIF) ---
# Pour une seule taille (ex. 640) et un fichier :
#   ffmpeg -y -i assets/img/quentin.png -vf scale=640:640 -c:v libaom-av1 -strict experimental -b:v 0 -crf 30 assets/img/long/quentin-ostanel-640w.avif
# Boucle pour quentin (à répéter pour chaque intervenant et chaque taille) :
#   for w in 640 340 192 96; do
#     ffmpeg -y -i assets/img/quentin.png -vf "scale=$w:$w" -c:v libaom-av1 -strict experimental -b:v 0 -crf 30 assets/img/long/quentin-ostanel-${w}w.avif
#   done
