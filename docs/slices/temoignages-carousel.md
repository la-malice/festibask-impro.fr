# Témoignages (carousel JSON)

Slice: **Témoignages (carousel JSON)**  
Status: **Done**

## What was delivered

- **Component:** Home page block `#temoignages` (between "Le mot des organisateurs" and "Partenaires & sponsors"). Content is built in JS from a JSON file; no hardcoded testimonies in HTML.
- **Data:** `assets/data/temoignages.json` — array of testimonies. The component fetches this file; build copies it into `dist/`.
- **Hide when empty:** If the JSON is an empty array `[]` or invalid or the fetch fails, the block is not shown (`display: none`). No carousel is rendered.
- **Carousel behaviour:** When at least one valid testimony is present: cards, prev/next buttons, dots, keyboard and swipe; no autoplay. Accessibility: region, aria-labels, tab roles.

## How to add a testimony

To add a new testimony: edit `assets/data/temoignages.json`, add an object with at least `name`, `role`, `quote`, `image`; put the image in `assets/img/`. Optional: `signature`, `imageAvif128`, `imageAvif256`.

**Full schema and step-by-step:** [docs/temoignages-carousel.md](../temoignages-carousel.md) (section "Comment ajouter un témoignage"). Backup sample: `docs/temoignages-sauvegarde.json`.
