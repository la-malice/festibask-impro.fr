# Architecture

## Purpose

High-level structure and technology choices of the Festibask'Impro static site. Single-page, no backend; build outputs to `dist/` for GitHub Pages.

## High-Level Overview

Static site: `index.html` (accueil) et `video/index.html` (watch page pour la vidéo teaser), CSS et JS dans `assets/`. Build copie les fichiers (dont video/, sitemap-video.xml), puis PurgeCSS (CSS), PostCSS (cssnano) et Terser (JS, option `ascii_only` pour émettre des échappements `\u…` plutôt que des octets UTF-8 bruts dans `dist/`, afin d’éviter un décodage incorrect si la réponse HTTP ne précise pas `charset=utf-8`) sur les sorties dans `dist/`. Pas de bundler HTML ; Vite uniquement pour le dev server. Déploiement : GitHub Actions build et upload de `dist/` vers GitHub Pages.

```
Sources (index.html, assets/) → build:places (CSV → remaining-seats.json si SHEET_CSV_URL) → copy-to-dist → dist/
  (optionnel : Google Apps Script + API HelloAsso met à jour le Sheet en amont du CSV — voir docs/slices/helloasso-jauge-sync.md)
                                         → PurgeCSS → dist/assets/css/style.css
                                         → PostCSS (cssnano) → same
                                         → Terser(assets/js/script.js) → dist/assets/js/script.js
CI: checkout → npm ci → npm run build → upload dist → deploy Pages
```

## Components

| Component | Responsibility | Location / Tech |
|-----------|----------------|-----------------|
| **Markup** | Structure and content; critical CSS inline; preloads; meta, OG, Schema.org | index.html |
| **Watch page** | Page de lecture dédiée pour la vidéo teaser (VideoObject, og:video) ; SEO vidéo Google | video/index.html |
| **Styles** | Layout, theme, components; PurgeCSS scans index.html + script.js | assets/css/style.css |
| **Scripts** | Header, countdown, hero video (YouTube iframe or self-hosted &lt;video&gt; per HTML config), nav, modals, sliders, carousel, tooltips, fullscreen | assets/js/script.js |
| **Data** | Testimonials (carousel), hero video schedule (optional), places pass spectacles + stages (JSON) | assets/data/temoignages.json, assets/data/hero-video-schedule.json, assets/data/remaining-seats.json |
| **Places spectacles + stages (build)** | Si `SHEET_CSV_URL` est défini, télécharge le CSV publié Google Sheets et écrit `assets/data/remaining-seats.json` (`passes` et, si le CSV contient une colonne `id`/`cle`, `stages`) avant la copie vers `dist/` | scripts/build-places-from-sheet.mjs (`npm run build:places`) |
| **Sync HelloAsso → Sheet (hors build)** | Optionnel : Google Apps Script (dans le Sheet) appelle l’API HelloAsso OAuth et met à jour les cellules de jauge ; source versionnée dans le dépôt pour reprise / revue | `scripts/google-apps-script/helloasso-jauge-sync.gs` ; spec `docs/slices/helloasso-jauge-sync.md` |
| **Copy build** | Copy index.html, video/, sitemap.xml, sitemap-video.xml, CNAME, favicons, robots, sw.js, assets, festival-2026, PDFs to dist/ ; optionnellement remplacer `dist/malix/assets/access-config.js` par `malix/assets/access-config.local.js` si présent | scripts/copy-to-dist.js |
| **PurgeCSS** | Remove unused CSS for dist; safelist dynamic classes | purgecss.config.js |
| **PostCSS** | Minify CSS (cssnano) | postcss.config.js |
| **Terser** | Minify JS (invoked in npm run build on source script.js → dist) | npm script |
| **PWA / Brevo** | Service worker loads Brevo by query key | sw.js (root) |
| **CI/CD** | Build et déploiement GitHub Pages ; rafraîchissement planifié du CSV places (voir `pages.yml`, cron UTC) | .github/workflows/pages.yml |
| **Mini-jeu Malix** | App autonome sous /malix ; HTML/CSS/JS propres ; 27 SVG doodles ; stockage local | malix/ (dans dist après build) ; spec docs/SPEC-Malix.md |
| **Malix trade-session** | Protocole d’état d’échange 1↔1 (offres, acceptations, commit) ; QR courts générés côté client ; aucun backend | malix/assets/trade-session.js, malix/assets/vendor/qrcode.min.js |

## Technology Stack

- **Build:** Node; npm scripts. copy-to-dist.js (Node), then PurgeCSS CLI, PostCSS CLI, Terser CLI. No Vite in build.
- **Dev:** Vite (root, port 8000, open browser); serves index.html and assets as-is. Script `scripts/start-dev.sh` runs Vite with `--host` for access from the LAN (e.g. mobile on same Wi‑Fi).
- **Front-end:** Vanilla HTML/CSS/JS; no framework. Google Fonts (Hubot Sans) loaded async. Styles follow the graphic charter (Hubot Sans hierarchy, 6-color palette); see docs/slices/charte-graphique.md.
- **Data:** Static JSON (temoignages); EDF players and spectacle data in script.js.
- **Deploy:** GitHub Actions (ubuntu-latest, Node 20); artifact `dist/` → deploy-pages. Environment: github-pages. Planification `schedule` dans `.github/workflows/pages.yml` : **UTC** — en principe **toutes les 15 min** hors **01h–08h Europe/Paris** (expression cron dans le fichier) ; **push** `main` ou **workflow_dispatch** à tout moment.
- **Malix:** Application statique dans `dist/malix/` (index.html, assets dédiés, copies des 27 doodles). Aucun impact sur index.html ni sur le bundle principal (script.js, style.css). Le build inclut `malix/` dans `dist/`. Le fichier `malix/assets/access-config.js` (objet `MalixAccessConfig` vide par défaut, réservé aux extensions) est versionné ; un override `malix/assets/access-config.local.js` non versionné peut être injecté au build à la place de `access-config.js` dans `dist/malix/assets/` (voir scripts/copy-to-dist.js).
- **Malix échange:** QR courts + protocole local ; génération QR via bundle `qrcode` (MalixQR) ; aucun backend ni stockage serveur.

## Execution Model

- **Development:** `npm run dev` → Vite serves at http://localhost:8000; no build. Use `./scripts/start-dev.sh` (or `npm run dev -- --host`) to listen on all interfaces for access from the LAN (e.g. mobile at http://&lt;machine-ip&gt;:8000). JSON and assets served from repo.
- **Production:** User requests site URL; server (GitHub Pages) serves files from `dist/`. Single document; no routing. JS fetches `temoignages.json` et `remaining-seats.json` (URL avec paramètre de version, voir ci‑dessous); modals load Sibforms/Brevo when opened.
- **Service worker:** sw.js is copied to dist root; loads Brevo SDK with key from query string. [UNCERTAIN] Whether it is registered in production; no cache strategy in the observed snippet.

### Cache busting et versioning des assets (prod)

Les navigateurs (notamment sur mobile) et le CDN peuvent conserver longtemps des fichiers statiques **à URL identique**. **Purger le cache Cloudflare ne vide pas** le cache local du navigateur : les utilisateurs peuvent donc voir d’anciens CSS/JS ou un ancien JSON tant que l’URL ne change pas.

**Conventions (à appliquer lors des déploiements concernés) :**

1. **`index.html`** : les références à la feuille de styles et au script principal incluent un paramètre de requête **`?v=N`** sur `assets/css/style.css` et `assets/js/script.js` (preload, noscript et balise `script`). **Incrémenter `N` de concert** pour une même livraison lorsqu’un changement CSS ou JS doit être pris en compte immédiatement en prod sans dépendre d’une purge côté utilisateur.
2. **`assets/js/script.js`** : constante **`TEMOIGNAGES_JSON_QUERY_BUST`** — l’URL du `fetch` vers `assets/data/temoignages.json` inclut `?v=…` (même valeur que la constante). **Incrémenter** après modification du contenu du fichier JSON (données témoignages) pour éviter un JSON obsolète servi depuis le cache HTTP.
3. **`assets/js/script.js`** : constante **`REMAINING_SEATS_JSON_QUERY_BUST`** — l’URL du `fetch` vers `assets/data/remaining-seats.json` inclut `?v=…`. **Incrémenter** après changement de structure ou de logique d’affichage des places (pass spectacles et/ou stages), ou lorsque le déploiement doit forcer le rechargement du JSON côté navigateur.
4. **Cloudflare (hors dépôt)** : ne pas placer `assets/data/` dans une règle qui impose un **Browser TTL** long (ex. semaines) ; une règle **Bypass cache** ou un TTL court pour ce chemin est cohérent avec les points 2–3. Les points 1–3 restent la garantie principale côté site quelle que soit la config CDN.
5. **`malix/index.html`** : la balise script `./assets/app.js` inclut un paramètre **`?v=N`** ; **incrémenter `N`** lors des déploiements où le JS du mini-jeu doit être pris en compte immédiatement côté navigateur (même principe que le point 1 pour le bundle principal).

## Dependencies

- **Internal:** index.html references assets/css, assets/js, assets/img, assets/data, assets/video; script.js fetches `temoignages.json` et `remaining-seats.json` and manipulates DOM; no internal modules.
- **External:** Brevo (cdn.brevo.com/js/sdk-loader.js), Sibforms (forms, styles, main.js), PostHog (snippet dans `index.html`, `video/index.html` et `malix/index.html` ; ingestion via reverse proxy sur le sous-domaine dédié `https://e.festibask-impro.fr` ; `ui_host` sur `https://eu.posthog.com` ; voir `docs/analytics-posthog.md` pour les événements custom et le périmètre par page). Le Worker `worker-posthog/` est la configuration standard pour le proxy analytics. `festibask-impro.fr` (apex) reste réservé au site web (GitHub Pages) et ne doit pas être utilisé comme `api_host` PostHog. **Hall of Fame Malix** : contrat API validé (slice 1) ; lecture via Worker `worker-malix-api/` sur route `festibask-impro.fr/malix/api/*` (pas sur `e.festibask-impro.fr`) — implémentation Worker slice 2, deploy slice 3 — voir [docs/slices/malix-hall-of-fame-in-game.md](slices/malix-hall-of-fame-in-game.md). Google Fonts. No npm runtime deps; devDependencies: vite, postcss, postcss-cli, cssnano, purgecss, terser.

## Malix — API classement

Composant **BFF** séparé du proxy d’ingestion PostHog. **Contrat validé slice 1 (2026-05-16)** ; Worker non déployé tant que slice 3.

| Élément | Valeur |
|---------|--------|
| Dossier source | `worker-malix-api/` (implémentation slice 2) |
| Nom Wrangler | `malix-api` (ou `festibask-malix-api`) |
| Route prod cible | `GET https://festibask-impro.fr/malix/api/leaderboard?player_id=<uuid>` |
| Secret | `POSTHOG_PERSONAL_API_KEY` — projet PostHog EU **124663**, jamais dans le dépôt ni le client Malix |
| Cache | ~3 min (Worker / `Cache-Control`), clé incluant `player_id` |
| CORS | Origine `https://festibask-impro.fr` (+ localhost en dev si documenté) |
| Déploiement | Manuel via Wrangler (hors GitHub Actions Pages), même compte Cloudflare que `worker-posthog/` |

**Contrainte** : le sous-domaine `e.festibask-impro.fr` relaie **tout** le trafic vers PostHog ingest ; l’API classement **ne doit pas** être hébergée sur ce hostname.

## Key Files and Directories

| Path | Role |
|------|------|
| index.html | Page d'accueil ; sections, modals, critical CSS inline |
| video/index.html | Watch page vidéo teaser (VideoObject, og:video) ; lien depuis le footer |
| sitemap-video.xml | Sitemap vidéo (extension Google) pour /video/ ; soumis ou référencé Search Console |
| assets/css/style.css | Full stylesheet; source for PurgeCSS/PostCSS |
| assets/js/script.js | All client logic; source for Terser |
| assets/data/temoignages.json | Testimonials array for carousel |
| assets/data/hero-video-schedule.json | Hero video schedule (slots with publishAt, youtubeId); optional |
| assets/data/remaining-seats.json | Places restantes : `passes.*.remaining` (pass spectacles) et `stages.<id>.remaining` (cartes atelier, `id` = attribut HTML) ; `remaining` peut être `null` tant que non alimenté par le Sheet ; surchargé au build si `SHEET_CSV_URL` |
| assets/img/, assets/video/, assets/fonts/, assets/favicon/ | Static assets |
| scripts/build-places-from-sheet.mjs | CSV publié Google → `remaining-seats.json` (`npm run build:places`) ; format avec colonne `id`/`cle` pour fusionner lignes pass et stages |
| scripts/google-apps-script/helloasso-jauge-sync.gs | Copie de référence du script **Google Apps Script** (OAuth HelloAsso, pagination commandes, écriture lignes jauge / colonne F) ; à coller dans le Sheet, pas exécuté par `npm run build` |
| scripts/copy-to-dist.js | Copies site files into dist/ |
| scripts/start-dev.sh | Runs Vite with --host for dev access from LAN (e.g. mobile) |
| purgecss.config.js | Content: index.html, script.js; output: dist/assets/css/style.css; safelist for dynamic classes |
| postcss.config.js | cssnano for dist CSS |
| vite.config.js | Dev server only (root, port 8000) |
| .github/workflows/pages.yml | Build sur push `main`, `workflow_dispatch`, et `schedule` (rafraîchissement CSV → `dist/`, détail des heures UTC dans le fichier) |
| sw.js | Service worker; Brevo init from query |
| malix/assets/access-config.js | Objet `MalixAccessConfig` versionné (vide par défaut ; hook d’extension ; remplaçable au build par access-config.local.js) |
| malix/assets/access-config.local.js | Override non versionné injecté dans dist au build si présent |
| docs/temoignages-carousel.md | Documented schema for temoignages.json |
| docs/portraits-carrousels.md | Portraits joueurs (EDF, Malice, Belgique, All Stars) : dimensions, long/, script AVIF |
| scripts/image-assets.json | Spec déclarative des dérivés images (portraits, intervenants, témoignages, bannière match All Stars, logos partenaires) |
| scripts/build-optimized-images.mjs | Lit la spec et appelle ImageMagick (`magick`) ; exécuté via `npm run build:images` au début de `npm run build` |
| docs/slices/helloasso-jauge-sync.md | Règles métier, OAuth, endpoints API et lien vers le script Apps Script pour alimenter le Sheet HelloAsso |
| malix/ | Mini-jeu Malix (sources) ; copié ou généré dans dist/malix/ ; entrée malix/index.html ; isolation totale du site principal |
| malix/assets/player-id.js | UUID joueur (`malix-player-id`), code court 8 caractères |
| malix/assets/leaderboard-client.js | *(slice 4)* Client HTTP vers l’API classement — [docs/slices/malix-hall-of-fame-in-game.md](slices/malix-hall-of-fame-in-game.md) |
| worker-posthog/ | Proxy Cloudflare **ingestion** PostHog uniquement ; hostname `e.festibask-impro.fr` — **ne pas** y ajouter l’API classement |
| worker-malix-api/ | *(slice 2–3)* BFF Cloudflare : `GET /malix/api/leaderboard` → PostHog Query API (projet 124663) ; secret `POSTHOG_PERSONAL_API_KEY` |
| docs/SPEC-Malix.md | Spécification fonctionnelle normative du mini-jeu Malix |
| docs/slices/malix-hall-of-fame-in-game.md | Plan normatif + slices de livraison Hall of Fame in-game |

## Assumptions and Uncertainties

- [ASSUMPTION] Production is served from `dist/` (or equivalent) after GitHub Actions build.
- [UNCERTAIN] Whether sw.js is registered in production; registration not found in index.html snippet.
- [UNCERTAIN] CNAME, apple-touch-icon.png, brevo-frame.html: referenced in copy-to-dist; presence in repo may vary (copy skips missing entries).
