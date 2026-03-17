#!/usr/bin/env bash
# Génère les AVIF des portraits joueurs (EDF, La Malice, Belgique, Suisse) depuis les PNG 640×853
# sources dans assets/img/ : variantes 320w, 442w, 640w (ratio 3:4) dans assets/img/long/
# (cache long Cloudflare sur assets/img/long/).
#
# Prérequis : ImageMagick 7 avec support AVIF (libheif).
#   macOS : brew install imagemagick libheif
#   Si AVIF non disponible, voir en fin de script une variante avec ffmpeg.

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC_DIR="$PROJECT_ROOT/assets/img"
OUT_DIR="$PROJECT_ROOT/assets/img/long"
# Largeurs cibles (hauteur = largeur * 853/640 pour ratio 3:4)
SIZES="320 442 640"
QUALITY=80

# Associe fichier PNG source -> préfixe de sortie (même nom sans .png)
# EDF, La Malice, Belgique, Suisse
MAP="
edf-aurelie-desert.png:edf-aurelie-desert
edf-cecile-giroud.png:edf-cecile-giroud
edf-felix-philippart.png:edf-felix-philippart
edf-igor-potoczny.png:edf-igor-potoczny
edf-olivier-descargues.png:edf-olivier-descargues
malice-anneke-bossis.png:malice-anneke-bossis
malice-aurelien-silvestre.png:malice-aurelien-silvestre
malice-bruno-cellan.png:malice-bruno-cellan
malice-camille-mortreux.png:malice-camille-mortreux
malice-celine-fabisch.png:malice-celine-fabisch
malice-emilie-coeurdevache.png:malice-emilie-coeurdevache
malice-eve-arlandis.png:malice-eve-arlandis
malice-helene-morreel.png:malice-helene-morreel
malice-marjory-pinto.png:malice-marjory-pinto
malice-nicolas-teboul.png:malice-nicolas-teboul
malice-olivier-lebailly.png:malice-olivier-lebailly
malice-patrice-lamarque.png:malice-patrice-lamarque
malice-pierrick-deredin.png:malice-pierrick-deredin
malice-sophie-le-bourhis.png:malice-sophie-le-bourhis
malice-stephanie-balligand.png:malice-stephanie-balligand
adrien.png:belg-adrien
francois.png:belg-francois
julie.png:belg-julie
marielle.png:belg-marielle
sophie.png:belg-sophie-normand
suisse-loic.png:suisse-loic
suisse-romain.png:suisse-romain
suisse-virginie.png:suisse-virginie
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
  echo "Traitement: $src_file -> ${prefix}-{320,442,640}w.avif"
  for w in $SIZES; do
    h=$(( w * 853 / 640 ))
    out="$OUT_DIR/${prefix}-${w}w.avif"
    magick "$src_path" -resize "${w}x${h}" -quality "$QUALITY" "$out"
  done
done

echo "Terminé. Fichiers écrits dans $OUT_DIR"
echo "Pour utiliser les AVIF dans les sliders : pointer script.js vers assets/img/long/<préfixe>-640w.avif"

# --- Alternative avec ffmpeg (si ImageMagick sans AVIF) ---
# Ratio 3:4 (640×853). Exemple pour un fichier et une taille :
#   ffmpeg -y -i assets/img/edf-aurelie-desert.png -vf scale=640:853 -c:v libaom-av1 -strict experimental -b:v 0 -crf 30 assets/img/edf-aurelie-desert-640w.avif
# Boucle pour 320, 442, 640 :
#   for w in 320 442 640; do h=$((w*853/640)); ffmpeg -y -i assets/img/edf-aurelie-desert.png -vf "scale=$w:$h" -c:v libaom-av1 -strict experimental -b:v 0 -crf 30 assets/img/edf-aurelie-desert-${w}w.avif; done
