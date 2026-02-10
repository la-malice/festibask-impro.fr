# Architecture

## Purpose

High-level structure and technology choices of the Festibask'Impro static site. Single-page, no backend; build outputs to `dist/` for GitHub Pages.

## High-Level Overview

Single-page static site: one `index.html`, CSS and JS in `assets/`. Build step copies files, then runs PurgeCSS (CSS), PostCSS (cssnano), and Terser (JS) on outputs in `dist/`. No bundler for HTML; Vite used only for dev server. Deployment: GitHub Actions builds and uploads `dist/` as GitHub Pages artifact.

```
Sources (index.html, assets/) → copy-to-dist → dist/
                                         → PurgeCSS → dist/assets/css/style.css
                                         → PostCSS (cssnano) → same
                                         → Terser(assets/js/script.js) → dist/assets/js/script.js
CI: checkout → npm ci → npm run build → upload dist → deploy Pages
```

## Components

| Component | Responsibility | Location / Tech |
|-----------|----------------|-----------------|
| **Markup** | Structure and content; critical CSS inline; preloads; meta, OG, Schema.org | index.html |
| **Styles** | Layout, theme, components; PurgeCSS scans index.html + script.js | assets/css/style.css |
| **Scripts** | Header, countdown, hero video (YouTube iframe or self-hosted &lt;video&gt; per HTML config), nav, modals, sliders, carousel, tooltips, fullscreen | assets/js/script.js |
| **Data** | Testimonials (carousel), hero video schedule (optional) | assets/data/temoignages.json, assets/data/hero-video-schedule.json |
| **Copy build** | Copy index.html, CNAME, favicons, robots, sitemap, sw.js, assets, festival-2026, PDFs to dist/ ; optionnellement remplacer `dist/malix/assets/access-config.js` par `malix/assets/access-config.local.js` si présent | scripts/copy-to-dist.js |
| **PurgeCSS** | Remove unused CSS for dist; safelist dynamic classes | purgecss.config.js |
| **PostCSS** | Minify CSS (cssnano) | postcss.config.js |
| **Terser** | Minify JS (invoked in npm run build on source script.js → dist) | npm script |
| **PWA / Brevo** | Service worker loads Brevo by query key | sw.js (root) |
| **CI/CD** | Build and deploy to GitHub Pages | .github/workflows/pages.yml |
| **Mini-jeu Malix** | App autonome sous /malix ; HTML/CSS/JS propres ; 27 SVG doodles ; stockage local | malix/ (dans dist après build) ; spec docs/SPEC-Malix.md |
| **Malix trade-session** | Session d’échange P2P: signalisation WebRTC par QR (offer/answer), DataChannel pour synchronisation directe, fallback QR court sans backend | malix/assets/trade-session.js |

## Technology Stack

- **Build:** Node; npm scripts. copy-to-dist.js (Node), then PurgeCSS CLI, PostCSS CLI, Terser CLI. No Vite in build.
- **Dev:** Vite (root, port 8000, open browser); serves index.html and assets as-is. Script `scripts/start-dev.sh` runs Vite with `--host` for access from the LAN (e.g. mobile on same Wi‑Fi).
- **Front-end:** Vanilla HTML/CSS/JS; no framework. Google Fonts (Hubot Sans) loaded async. Styles follow the graphic charter (Hubot Sans hierarchy, 6-color palette); see docs/slices/charte-graphique.md.
- **Data:** Static JSON (temoignages); EDF players and spectacle data in script.js.
- **Deploy:** GitHub Actions (ubuntu-latest, Node 20); artifact `dist/` → deploy-pages. Environment: github-pages.
- **Malix:** Application statique dans `dist/malix/` (index.html, assets dédiés, copies des 27 doodles). Aucun impact sur index.html ni sur le bundle principal (script.js, style.css). Le build inclut `malix/` dans `dist/`. La config d’accès du garde (`malix/assets/access-config.js`) est versionnée avec les valeurs par défaut prod ; un override local non versionné (`malix/assets/access-config.local.js`) peut être injecté au build pour les tests dev.
- **Malix échange:** WebRTC DataChannel prioritaire (signalisation par QR), fallback QR court ; aucun backend ni stockage serveur.

## Execution Model

- **Development:** `npm run dev` → Vite serves at http://localhost:8000; no build. Use `./scripts/start-dev.sh` (or `npm run dev -- --host`) to listen on all interfaces for access from the LAN (e.g. mobile at http://&lt;machine-ip&gt;:8000). JSON and assets served from repo.
- **Production:** User requests site URL; server (GitHub Pages) serves files from `dist/`. Single document; no routing. JS fetches `temoignages.json` (relative to document base); modals load Sibforms/Brevo when opened.
- **Service worker:** sw.js is copied to dist root; loads Brevo SDK with key from query string. [UNCERTAIN] Whether it is registered in production; no cache strategy in the observed snippet.

## Dependencies

- **Internal:** index.html references assets/css, assets/js, assets/img, assets/data, assets/video; script.js fetches temoignages.json and manipulates DOM; no internal modules.
- **External:** Brevo (cdn.brevo.com/js/sdk-loader.js), Sibforms (forms, styles, main.js), PostHog (snippet in index.html; ingestion via reverse proxy Cloudflare Worker, code in worker-posthog/, deploy via Wrangler; api_host points to proxy, ui_host to eu.posthog.com; see docs/analytics-posthog.md for custom events), Google Fonts. No npm runtime deps; devDependencies: vite, postcss, postcss-cli, cssnano, purgecss, terser.

## Key Files and Directories

| Path | Role |
|------|------|
| index.html | Single entry; all sections, modals, inline critical CSS |
| assets/css/style.css | Full stylesheet; source for PurgeCSS/PostCSS |
| assets/js/script.js | All client logic; source for Terser |
| assets/data/temoignages.json | Testimonials array for carousel |
| assets/data/hero-video-schedule.json | Hero video schedule (slots with publishAt, youtubeId); optional |
| assets/img/, assets/video/, assets/fonts/, assets/favicon/ | Static assets |
| scripts/copy-to-dist.js | Copies site files into dist/ |
| scripts/start-dev.sh | Runs Vite with --host for dev access from LAN (e.g. mobile) |
| purgecss.config.js | Content: index.html, script.js; output: dist/assets/css/style.css; safelist for dynamic classes |
| postcss.config.js | cssnano for dist CSS |
| vite.config.js | Dev server only (root, port 8000) |
| .github/workflows/pages.yml | Build on push to main; deploy Pages from dist |
| sw.js | Service worker; Brevo init from query |
| malix/assets/access-config.js | Config d’accès Malix versionnée (coordonnées/date/rayon par défaut prod) |
| malix/assets/access-config.local.js | Override local dev non versionné, injecté dans dist au build si présent |
| docs/temoignages-carousel.md | Documented schema for temoignages.json |
| malix/ | Mini-jeu Malix (sources) ; copié ou généré dans dist/malix/ ; entrée malix/index.html ; isolation totale du site principal |
| docs/SPEC-Malix.md | Spécification fonctionnelle normative du mini-jeu Malix |

## Assumptions and Uncertainties

- [ASSUMPTION] Production is served from `dist/` (or equivalent) after GitHub Actions build.
- [UNCERTAIN] Whether sw.js is registered in production; registration not found in index.html snippet.
- [UNCERTAIN] CNAME, apple-touch-icon.png, brevo-frame.html: referenced in copy-to-dist; presence in repo may vary (copy skips missing entries).
