# Functional Specification

## Purpose

Static marketing site for **Festibask'Impro**, the improvisation theatre festival in Anglet. Informs visitors about the event (dates, venue, programme, stages, pricing), lineup (Équipe de France, matches, long-form shows), newsletter signup, and practical/legal info. Primary audience: French-speaking visitors.

## Scope

- **In scope:** Single-page layout with hero (logo, dates, countdown, teaser video, bandes doodles décoratives, liens hero-tags); section “À l’affiche” (spectacles by day: format long + match); programme (three days, fullscreen mode); stages/ateliers (flip cards, registration/waitlist); tarifs (flip cards); FAQ; à propos; témoignages carousel (from JSON); sponsors; newsletter and waitlist modals (Brevo/Sibforms); legal/contact/footer.
- **Out of scope:** Ticketing, user accounts, backend CMS, server-side rendering. No routing; single HTML document. Google Analytics is commented out in code; Brevo and Sibforms are the active third-party integrations.

## Main Capabilities

1. **Hero:** Logo, dates (15–17 mai), location (Patinoire de la Barre, Anglet), countdown to 2026-05-15 10:30; teaser video (poster by default, play on click). Deux bandes décoratives doodles (images `doodles-top.avif` au-dessus du logo, `doodles-bottom.avif` sous les liens hero-tags), intégrées dans la même cellule que le logo et que les liens. Liens hero-tags : SPECTACLES, MATCHES, STAGES (ancres #valeur, #programme, #stages). Source vidéo : **YouTube** (video ID via `data-hero-video="youtube"` et `data-hero-youtube-id` sur `#heroVideoContainer`) ou **self-hosted** (MP4 depuis `data-src`, poster, sous-titres `assets/video/teaser-festibask-captions.vtt`).
2. **Spectacles (“À l’affiche”):** Day slider (Vendredi / Samedi / Dimanche); for each day: one “format long” block and one “match” block. Desktop: flip to show pitch; mobile: modal for spectacle details. Match France (Samedi) opens EDF player slider; other matches flip or open modal.
3. **Programme:** Tabs by day; grid of day cards; fullscreen mode; sync with “À l’affiche” day selection. In fullscreen, clicking the Braquage slot exits fullscreen and opens https://plamarque.github.io/braquage/ in a new tab.
4. **Stages:** Atelier cards (flip for details, instructor bio where applicable); “En savoir plus” / “COMPLET” trigger flip; registration and waitlist buttons open Sibforms modals.
5. **Tarifs:** Pass 1 jour, Pass 3 jours, Stage; flip cards for details.
6. **Témoignages:** Carousel built from `assets/data/temoignages.json`; section hidden if JSON empty or invalid. Fields: name, role, quote, image; optional signature, imageAvif128/256.
7. **Navigation:** Fixed header on scroll; burger + drawer on mobile; desktop nav links.
8. **Modals:** Newsletter (notify), waitlist; Sibforms CSS/JS loaded on first open. Spectacle details modal on mobile for spectacle blocks. On mobile, the spectacle details modal can be closed by tapping anywhere on the modal or by swiping down (except when the user is scrolling the text inside the modal).
9. **Tooltips:** “Format long” and “Match” explained (desktop: hover; mobile: click popup).
10. **SEO / meta:** Canonical, OpenGraph, Twitter Card, Schema.org Event (2026-05-15 to 2026-05-17, location, offers, organizer La Malice).

## Behavior

- **Entry:** `index.html`; assets from `assets/` (css, js, img, data, video, fonts, favicon). Build: `npm run build` → copy script + PurgeCSS + PostCSS (cssnano) + Terser; output in `dist/`. Deploy: GitHub Actions → GitHub Pages (`dist/` artifact).
- **Video:** Teaser poster shown by default; play on overlay click. Mode chosen in HTML: **YouTube** (`data-hero-video="youtube"`, `data-hero-youtube-id`) — iframe embed loaded on click; or **self-hosted** (default) — MP4 loaded and played on click, captions from `assets/video/teaser-festibask-captions.vtt` (referenced in HTML). To revert to self-hosted, remove or set `data-hero-video` to `"self"` and remove `data-hero-youtube-id`.
- **Data:** Testimonials from `assets/data/temoignages.json` (array); EDF players and spectacle pitches hardcoded in `script.js`. No backend API.

## Boundaries

- **Inputs:** User visits URL; testimonials from local JSON; form submissions to Brevo/Sibforms (external).
- **Outputs:** HTML/CSS/JS and static assets served to the browser; form data sent to Brevo.
- **External dependencies:** Brevo (tracker + forms), Sibforms (form UI), Google Fonts (Hubot Sans). [UNCERTAIN] Apple touch icon path (root vs assets/favicon) may vary by deploy.
- **Charte graphique:** Typography and colors are aligned with the Festi'Bask Impro graphic charter: Hubot Sans (Titre 1/2/3, Text, Description) and a 6-color palette (navy, blue-charte, cyan; coral, orange, pink). Variables and usage are documented in docs/slices/charte-graphique.md.

## Assumptions and Uncertainties

- [ASSUMPTION] Primary audience is French-speaking; content and UI are in French.
- [ASSUMPTION] Event dates 2026-05-15 to 2026-05-17 and venue (Patinoire de la Barre) are correct as in Schema.org and hero.
- [UNCERTAIN] Whether `sw.js` is used in production; it loads Brevo by query key and does not implement cache strategy in the snippet observed.
- [UNCERTAIN] Exact deployment URL (e.g. custom domain vs github.io); canonical and sitemap point to https://festibask-impro.fr.
