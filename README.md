# festibask-impro.fr
Festibask'impro — Festival d'improvisation à Anglet

## Build et déploiement

Le build (minification CSS/JS + PurgeCSS) s’exécute **en CI uniquement** (GitHub Actions) à chaque push sur `main`. Aucun build local n’est requis avant de push.

**Commandes utiles :**
- `npm ci` — installer les dépendances (dont les outils de build)
- `npm run build` — (optionnel) lancer le build en local pour vérifier ou prévisualiser
- `npm start` / `npm run serve` — servir le site en local

En dépôt, `assets/css/style.css` et `assets/js/script.js` restent les **sources** (non minifiées). Le build écrit dans `dist/` uniquement : les fichiers sources ne sont jamais écrasés, donc pas de risque de committer du code minifié par inadvertance. Le dossier `dist/` est ignoré par Git (voir `.gitignore`).
