# festibask-impro.fr
Festibask'impro — Festival d'improvisation à Anglet

## Développement local

**`npm run dev`** — lance le serveur de dev **Vite** (http://localhost:8000) avec **rechargement automatique** à chaque modification de HTML, CSS, JS ou données (ex. `assets/data/temoignages.json`). Idéal pour travailler sur le site.

Autres options : `npm run serve` (node) ou `python3 server.py` ; pas d’ouverture en `file://` (CORS bloque le chargement du JSON des témoignages).

## Build et déploiement

Le build (minification CSS/JS + PurgeCSS) s’exécute **en CI uniquement** (GitHub Actions) à chaque push sur `main`. Aucun build local n’est requis avant de push.

**Commandes utiles :**
- `npm ci` — installer les dépendances (dont les outils de build)
- `npm run build` — (optionnel) lancer le build en local pour vérifier ou prévisualiser

En dépôt, `assets/css/style.css` et `assets/js/script.js` restent les **sources** (non minifiées). Le build écrit dans `dist/` uniquement : les fichiers sources ne sont jamais écrasés, donc pas de risque de committer du code minifié par inadvertance. Le dossier `dist/` est ignoré par Git (voir `.gitignore`).

**Composants :** voir [docs/temoignages-carousel.md](docs/temoignages-carousel.md) pour le carrousel témoignages (données JSON, ajout de témoignages).
