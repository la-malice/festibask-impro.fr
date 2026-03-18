#!/usr/bin/env bash
# Génère les AVIF des logos partenaires (section Partenaires & sponsors) depuis les
# sources PNG/JPG/JPEG dans assets/img/logos/ et écrit les .avif dans le même dossier.
# Atlantic Change est déjà fourni en .avif ; ce script convertit les autres.
#
# Prérequis : ImageMagick 7 avec support AVIF (libheif).
#   macOS : brew install imagemagick libheif
#
# Usage : depuis la racine du projet, ./scripts/build-sponsor-logos-avif.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOGOS_DIR="$PROJECT_ROOT/assets/img/logos"
QUALITY=80

# Fichier source -> nom de sortie .avif (sans chemin)
# Atlantic Change : déjà en .avif dans le repo, ne pas écraser.
# Anglet : nom source avec apostrophe → sortie logo-anglet.avif (éviter les pièges de quoting).
MAP="
logo-cornec.png:logo-cornec.avif
rtl2-logo.png:rtl2-logo.avif
logo-aperock.jpeg:logo-aperock.avif
"

if ! command -v magick &>/dev/null; then
  echo "Erreur: ImageMagick (magick) introuvable. Installez-le (ex: brew install imagemagick libheif)." >&2
  exit 1
fi

for entry in $MAP; do
  [[ -z "$entry" ]] && continue
  src_file="${entry%%:*}"
  out_file="${entry##*:}"
  src_path="$LOGOS_DIR/$src_file"
  out_path="$LOGOS_DIR/$out_file"
  if [[ ! -f "$src_path" ]]; then
    echo "Ignoré (fichier absent): $src_path"
    continue
  fi
  echo "Traitement: $src_file -> $out_file"
  magick "$src_path" -quality "$QUALITY" "$out_path"
done

# Ville d'Anglet : nom avec apostrophe, sortie logo-anglet.avif
anglet_src="Logo_de_la_ville_d'Anglet_2010.jpg"
if [[ -f "$LOGOS_DIR/$anglet_src" ]]; then
  echo "Traitement: $anglet_src -> logo-anglet.avif"
  magick "$LOGOS_DIR/$anglet_src" -quality "$QUALITY" "$LOGOS_DIR/logo-anglet.avif"
fi

echo "Terminé. Fichiers AVIF écrits dans $LOGOS_DIR"
echo "Penser à mettre à jour index.html pour utiliser les .avif (src ou <picture>)."
