# Functional Specification

## Purpose

Static marketing site for **Festibask'Impro**, the improvisation theatre festival in Anglet. Informs visitors about the event (dates, venue, programme, stages, pricing), lineup (Équipe de France, matchs, long-form shows), newsletter signup, and practical/legal info. Primary audience: French-speaking visitors.

## Scope

- **In scope:** Single-page layout with hero (logo, dates, countdown, teaser video, bandes doodles décoratives, liens hero-tags); section “À l’affiche” (spectacles by day: format long + match); programme (three days, fullscreen mode); stages/ateliers (flip cards, registration/waitlist); tarifs (flip cards); FAQ; à propos; témoignages carousel (from JSON); sponsors; newsletter and waitlist modals (Brevo/Sibforms); legal/contact/footer.
- **Out of scope:** Ticketing, user accounts, backend CMS, server-side rendering. No routing; single HTML document. Google Analytics is commented out in code; Brevo, Sibforms and PostHog (analytics: visites, optionally custom events) are the active third-party integrations.
- **Mini-jeu Malix :** Jeu enfant autonome (collection de Malix), disponible **uniquement** sous **/malix**. Comportement et périmètre détaillés dans [docs/SPEC-Malix.md](SPEC-Malix.md). Le site principal (index.html, assets/) ne charge rien depuis /malix ; aucun code du jeu dans le bundle principal.

## Main Capabilities

1. **Hero:** Logo, dates (15–17 mai), location (Patinoire de la Barre, Anglet), countdown to 2026-05-15 10:30; teaser video (poster by default, play on click). La vidéo teaser est affichée à la place du logo hero, avec le logo du festival en image poster et un ratio 1000/607 (celui du logo). Deux bandes décoratives doodles (images `assets/img/long/doodles-top.avif` au-dessus du bloc vidéo/logo, `assets/img/long/doodles-bottom.avif` sous les liens hero-tags), intégrées dans la même cellule que le bloc vidéo et que les liens. Liens hero-tags : SPECTACLES, MATCHS, STAGES (ancres #valeur, #programme, #stages). Source vidéo : **YouTube** (video ID via `data-hero-video="youtube"` et `data-hero-youtube-id` sur `#heroVideoContainer`) ou **self-hosted** (MP4 depuis `data-src`, poster, sous-titres `assets/video/teaser-festibask-captions.vtt`). En mode YouTube, la vidéo affichée peut être **pilotée par un calendrier** : le fichier `assets/data/hero-video-schedule.json` définit des créneaux (ex. teasers J-3, J-2, J-1, vidéo officielle) avec date/heure de publication ; le script choisit automatiquement la vidéo dont le créneau est passé (dernier `publishAt` ≤ heure du client). En l’absence de calendrier ou avant le premier créneau, le fallback est `data-hero-youtube-id` ou `fallbackYoutubeId` du JSON.
2. **Spectacles (“À l’affiche”):** Day slider (Vendredi / Samedi / Dimanche); for each day: one “format long” block and one “match” block. On mobile and desktop, tap/click on a spectacle banner opens a slider in the block (no fullscreen modal). Match France (Samedi) has multiple slides (EDF intro + players); other spectacles (format long and other matchs) have a single slide (image + details). Slider is closed via the close button or by clicking the block again.
3. **Programme:** Tabs by day; grid of day cards; fullscreen mode; sync with “À l’affiche” day selection. Spectacle slots (format long, match) use solid tinted background (no texture), aligned with tariff cards. Stage slots show instructor image on the right and room label in meta position (like LONG FORM / MATCH); avatar width reduced in normal mode to leave room for the stage title. In fullscreen, clicking the Braquage slot exits fullscreen and opens https://plamarque.github.io/braquage/ in a new tab.
4. **Stages:** Atelier cards (flip for details, instructor bio where applicable); “En savoir plus” / “COMPLET” trigger flip; registration and waitlist buttons open Sibforms modals.
5. **Tarifs:** Pass 1 jour, Pass 3 jours, Stage; flip cards for details.
6. **Témoignages:** Carousel built from `assets/data/temoignages.json`; section hidden if JSON empty or invalid. Fields: name, role, quote, image; optional signature, imageAvif128/256.
7. **Navigation:** Fixed header on scroll; burger + drawer on mobile; desktop nav links.
8. **Modals:** Newsletter (notify), waitlist; Sibforms CSS/JS loaded on first open. Spectacle details are shown in a slider within the block (not a modal).
9. **Tooltips:** “Format long” and “Match” explained (desktop: hover; mobile: click popup).
10. **SEO / meta:** Canonical, OpenGraph, Twitter Card, Schema.org Event (2026-05-15 to 2026-05-17, location, offers, organizer La Malice). La page /malix a son propre jeu de meta (description, canonical, OpenGraph, Twitter Card, entrée sitemap) pour le référencement et le partage, en cohérence avec l’accueil (voir docs/SPEC-Malix.md § SEO / découvrabilité).
11. **Doodles flottants au scroll:** Pendant le scroll vers le bas, un petit doodle peut apparaître de façon aléatoire, dériver lentement à l’écran (effet « cosmonaute », faible gravité) devant le contenu, et disparaître au clic avec un effet « smash » (écrasement). Un seul doodle flottant à la fois ; désactivé si l’utilisateur a `prefers-reduced-motion: reduce`.

## Behavior

- **Entry:** `index.html`; assets from `assets/` (css, js, img, data, video, fonts, favicon). Build: `npm run build` → copy script + PurgeCSS + PostCSS (cssnano) + Terser; output in `dist/`. Deploy: GitHub Actions → GitHub Pages (`dist/` artifact).
- **Video:** Teaser poster shown by default; play on overlay click. Mode chosen in HTML: **YouTube** (`data-hero-video="youtube"`, `data-hero-youtube-id`) — iframe embed loaded on click; or **self-hosted** (default) — MP4 loaded and played on click, captions from `assets/video/teaser-festibask-captions.vtt` (referenced in HTML). In YouTube mode, which video is shown can be **scheduled** via `assets/data/hero-video-schedule.json` (slots with `publishAt` and `youtubeId`); the script picks the last slot whose time has passed; fallback to `data-hero-youtube-id` or JSON `fallbackYoutubeId` when no schedule or before first slot. To revert to self-hosted, remove or set `data-hero-video` to `"self"` and remove `data-hero-youtube-id`.
- **Data:** Testimonials from `assets/data/temoignages.json` (array); hero video schedule from `assets/data/hero-video-schedule.json` (optional); EDF players and spectacle pitches hardcoded in `script.js`. No backend API.
- **Doodles flottants:** Apparition aléatoire au scroll (scroll vers le bas), dérive lente (physique type cosmonaute), clic sur le doodle = animation smash puis suppression ; désactivés si `prefers-reduced-motion: reduce`.

## Boundaries

- **Inputs:** User visits URL; testimonials from local JSON; form submissions to Brevo/Sibforms (external).
- **Outputs:** HTML/CSS/JS and static assets served to the browser; form data sent to Brevo.
- **External dependencies:** Brevo (tracker + forms), Sibforms (form UI), PostHog (analytics, snippet in index.html, api_host EU), Google Fonts (Hubot Sans). [UNCERTAIN] Apple touch icon path (root vs assets/favicon) may vary by deploy.
- **Charte graphique:** Typography and colors are aligned with the Festi'Bask Impro graphic charter: Hubot Sans (Titre 1/2/3, Text, Description) and a 6-color palette (navy, blue-charte, cyan; coral, orange, pink). Variables and usage are documented in docs/slices/charte-graphique.md.

## Assumptions and Uncertainties

- [ASSUMPTION] Primary audience is French-speaking; content and UI are in French.
- [ASSUMPTION] Event dates 2026-05-15 to 2026-05-17 and venue (Patinoire de la Barre) are correct as in Schema.org and hero.
- [UNCERTAIN] Whether `sw.js` is used in production; it loads Brevo by query key and does not implement cache strategy in the snippet observed.
- [UNCERTAIN] Exact deployment URL (e.g. custom domain vs github.io); canonical and sitemap point to https://festibask-impro.fr.
