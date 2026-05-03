# Portraits joueurs — sliders matchs et format long

Documentation des images portrait utilisées dans les carrousels/sliders des équipes (EDF, La Malice, Belgique, All Stars) et du cast Commis d'Office.

## Périmètre

- **Sliders joueurs** : Équipe de France (`edfPlayers`), La Malice samedi (`maliceSamediPlayers`), Belgique (`belgPlayers`), All Stars dimanche (`allStarsPlayers`), cast Commis d'Office (`commisDOfficeCast`).
- **Emplacement** : données en dur dans `assets/js/script.js` ; images dans `assets/img/long/` (cache long Cloudflare).

## Dimensions et format

- **Ratio cible** : 3:4 portrait (640×853 px).
- **Variantes générées** : 320w (320×427), 442w (442×589), 640w (640×853), en AVIF.
- **Nommage** : `<préfixe>-320w.avif`, `<préfixe>-442w.avif`, `<préfixe>-640w.avif` dans `assets/img/long/`.

## Responsive

Le rendu utilise `<picture>` + `<source type="image/avif" srcset="...">` avec les trois largeurs ; le navigateur choisit la variante selon la taille du calque (insets réservés aux flèches et à la croix). Référence dans le JS : `player.image` pointe vers la version 640w ; les URLs 320w/442w sont dérivées pour le `srcset`.

## Génération des AVIF

Spec : **`scripts/image-assets.json`**, job **`player-portraits`** ; exécution : **`npm run build:images`** ou **`npm run build`**.

- **Entrée** : PNG sources 640×853 dans `assets/img/` (liste dans le job `entries`).
- **Sortie** : AVIF 320w, 442w, 640w dans `assets/img/long/`.
- **Prérequis** : ImageMagick 7 avec support AVIF (libheif). Ex. macOS : `brew install imagemagick libheif`.

Pour ajouter une équipe ou un joueur : ajouter un objet `{ "source", "prefix" }` dans le job `player-portraits`, placer le PNG dans `assets/img/`, lancer le build, puis mettre à jour dans `script.js` le champ `image` du joueur vers `assets/img/long/<préfixe>-640w.avif`.

## Fichiers concernés

| Équipe / usage      | Préfixes (ex.)                    | Sources PNG (ex.)              |
|---------------------|------------------------------------|--------------------------------|
| EDF                 | edf-aurelie-desert, edf-cecile-giroud, … | edf-aurelie-desert.png, …      |
| La Malice / Commis  | malice-stephanie-balligand, malice-olivier-lebailly, … | malice-*.png                   |
| Belgique            | belg-adrien, belg-francois, belg-sophie-normand, … | adrien.png → belg-adrien, …    |
| All Stars (dimanche) | allstars-quentin-ostanel, allstars-laetitia-landelle, allstars-loraine, allstars-jeremy, allstars-carole-bertrand | quentin.png / laetitia.png / loraine.png / jeremy.png / carole-bertrand.png |

Voir le job `player-portraits` dans `scripts/image-assets.json` pour la liste à jour.
