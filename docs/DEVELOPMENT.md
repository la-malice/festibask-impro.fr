# Development

## Prerequisites

- Node 18+ (CI uses Node 20)
- npm (or pnpm; CI uses npm)
- **ImageMagick** avec écriture **AVIF** (`convert -list format` → ligne AVIF en **rw+**, pas **r--**) : ex. macOS `brew install imagemagick libheif`. Sous Ubuntu, si AVIF est en lecture seule, installer aussi **`libheif-plugin-aomenc`** (la CI GitHub Actions installe `imagemagick` et ce plugin). Pour ignorer la génération d’images (déconseillé) : `SKIP_IMAGE_BUILD=1 npm run build`.

## Setup

```bash
git clone <repo>
cd festibask-impro.fr
npm install
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server at http://localhost:8000 (open in browser). Hot reload for HTML, CSS, JS, and data (e.g. temoignages.json). |
| `./scripts/start-dev.sh` | Same as above but with `--host`: server listens on all interfaces so the site is reachable from the LAN (e.g. mobile at http://&lt;machine-ip&gt;:8000). |
| `npm run build:images` | Régénère les AVIF / JPEG dérivés (ImageMagick) selon `scripts/image-assets.json` → `assets/`. |
| `npm run build:places` | Si la variable d’environnement **`SHEET_CSV_URL`** pointe vers le CSV publié Google Sheets, régénère `assets/data/places-spectacles.json`. Sinon, conserve le fichier existant (ex. valeurs par défaut sans chiffres). |
| `npm run build` | `build:images`, `build:places`, puis copie vers `dist/`, PurgeCSS + PostCSS (cssnano) sur le CSS, Terser sur le JS. Sortie dans `dist/`. |
| `npm run start` / `npm run serve` | Node HTTP server (server.js) for local testing if needed; avoid `file://` (CORS blocks JSON). |

No `preview` script in package.json; after `npm run build`, serve `dist/` with any static server to preview production build.

## Override local de géolocalisation Malix (dev)

Pour tester Malix avec un autre point GPS sans commiter de coordonnées de test :

1. Copier `malix/assets/access-config.local.example.js` en `malix/assets/access-config.local.js`.
2. Modifier `geoTarget.lat` / `geoTarget.lon` dans ce fichier local.
3. Lancer `npm run build`.

Le script de build injecte automatiquement `malix/assets/access-config.local.js` dans `dist/malix/assets/access-config.js` s’il existe.

- `malix/assets/access-config.js` (versionné) = valeurs par défaut prod.
- `malix/assets/access-config.local.js` (ignoré par git) = override local dev uniquement.

## Contribution

- Read **docs/SPEC.md**, **docs/DOMAIN.md**, and **docs/ARCH.md** before changing behavior or structure.
- Update normative docs when behavior or architecture changes; keep **docs/PLAN.md** and **docs/ISSUES.md** factual.
- Sources (index.html, assets/css, assets/js) stay in repo; only `dist/` is build output. Do not commit minified sources; build runs in CI on push to `main`.
- **Témoignages:** Edit `assets/data/temoignages.json`; schema and examples in `docs/temoignages-carousel.md`. Empty array hides the carousel.
- **Vidéo hero programmée:** Edit `assets/data/hero-video-schedule.json`; schema and test params in `docs/slices/hero-video-schedule.md`.
- **Places pass spectacles:** En CI, le secret GitHub **`SHEET_CSV_URL`** alimente `build:places`. En local, exportez `SHEET_CSV_URL` ou utilisez le JSON par défaut dans le dépôt (pas d’affichage de chiffres tant que `remaining` est `null`). Voir `docs/ARCH.md` (cache-bust `PLACES_SPECTACLES_JSON_QUERY_BUST`).
- **Images optimisées (AVIF / responsive) :** La spec est dans **`scripts/image-assets.json`** ; l’exécuteur est **`scripts/build-optimized-images.mjs`**, invoqué au début de **`npm run build`** (`npm run build:images`). Y ajouter une entrée (source, préfixe, job `temoignages`, `player-portraits`, `instructors`, `equipe-suisse`, `sponsor-logos`, etc.) après ajout d’une image source. Portraits joueurs (ratio 3:4) : job `player-portraits` ; témoignages (carrés 128/256) : job `temoignages` — ne pas confondre avec les portraits. Logos partenaires : job `sponsor-logos` (Atlantic Change reste fourni en .avif hors spec). Bannière Suisse : source `assets/img/equipe-suisse.png`, job `equipe-suisse` (AVIF dans `assets/img/long/`, JPEG de repli dans `assets/img/`). Pour les témoignages : après mise à jour du JSON, voir `docs/temoignages-carousel.md` (`image`, `imageAvif128`, `imageAvif256`).

## Tester les vidéos hero programmées

Pour vérifier quel créneau vidéo s’affiche sans changer l’heure du système :

| Paramètre (query string) | Valeur | Effet |
|--------------------------|--------|--------|
| `hero-video-slot` | 0, 1, 2, 3… | Force l’affichage du slot à cet index (0 = premier créneau). |
| `hero-video-simulate` | Date/heure ISO 8601 (ex. `2026-02-06T18:00:00+01:00`) | Utilisée comme « maintenant » pour choisir le slot. |

Exemples : `http://localhost:8000/?hero-video-slot=0` (première vidéo), `http://localhost:8000/?hero-video-simulate=2026-02-09T18:00:00+01:00` (comme si on était le 9 fév. 2026 à 18h Paris).
