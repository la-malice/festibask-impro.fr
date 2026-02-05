# Development

## Prerequisites

- Node 18+ (CI uses Node 20)
- npm (or pnpm; CI uses npm)

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
| `npm run build` | Copy site to `dist/`, then PurgeCSS + PostCSS (cssnano) on CSS, Terser on JS. Output in `dist/`. |
| `npm run start` / `npm run serve` | Node HTTP server (server.js) for local testing if needed; avoid `file://` (CORS blocks JSON). |

No `preview` script in package.json; after `npm run build`, serve `dist/` with any static server to preview production build.

## Contribution

- Read **docs/SPEC.md**, **docs/DOMAIN.md**, and **docs/ARCH.md** before changing behavior or structure.
- Update normative docs when behavior or architecture changes; keep **docs/PLAN.md** and **docs/ISSUES.md** factual.
- Sources (index.html, assets/css, assets/js) stay in repo; only `dist/` is build output. Do not commit minified sources; build runs in CI on push to `main`.
- **Témoignages:** Edit `assets/data/temoignages.json`; schema and examples in `docs/temoignages-carousel.md`. Empty array hides the carousel.
- **Vidéo hero programmée:** Edit `assets/data/hero-video-schedule.json`; schema and test params in `docs/slices/hero-video-schedule.md`.

## Tester les vidéos hero programmées

Pour vérifier quel créneau vidéo s’affiche sans changer l’heure du système :

| Paramètre (query string) | Valeur | Effet |
|--------------------------|--------|--------|
| `hero-video-slot` | 0, 1, 2, 3… | Force l’affichage du slot à cet index (0 = premier créneau). |
| `hero-video-simulate` | Date/heure ISO 8601 (ex. `2026-02-06T18:00:00+01:00`) | Utilisée comme « maintenant » pour choisir le slot. |

Exemples : `http://localhost:8000/?hero-video-slot=0` (première vidéo), `http://localhost:8000/?hero-video-simulate=2026-02-09T18:00:00+01:00` (comme si on était le 9 fév. 2026 à 18h Paris).
