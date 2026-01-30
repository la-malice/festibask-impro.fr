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
| `npm run build` | Copy site to `dist/`, then PurgeCSS + PostCSS (cssnano) on CSS, Terser on JS. Output in `dist/`. |
| `npm run start` / `npm run serve` | Node HTTP server (server.js) for local testing if needed; avoid `file://` (CORS blocks JSON). |

No `preview` script in package.json; after `npm run build`, serve `dist/` with any static server to preview production build.

## Contribution

- Read **docs/SPEC.md**, **docs/DOMAIN.md**, and **docs/ARCH.md** before changing behavior or structure.
- Update normative docs when behavior or architecture changes; keep **docs/PLAN.md** and **docs/ISSUES.md** factual.
- Sources (index.html, assets/css, assets/js) stay in repo; only `dist/` is build output. Do not commit minified sources; build runs in CI on push to `main`.
- **Témoignages:** Edit `assets/data/temoignages.json`; schema and examples in `docs/temoignages-carousel.md`. Empty array hides the carousel.
