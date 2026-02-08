# Plan

## Current phase

Site in production; content and minor improvements as needed. No formal slices in progress.

## Slices

| Slice | Goal | Status |
|-------|------|--------|
| — | Marketing site live (hero, programme, stages, tarifs, témoignages, modals, deploy) | Done |
| Témoignages (carousel JSON) | Carousel of testimonies loaded from JSON; section hidden when JSON is empty; easy to add testimonies by editing JSON (procedure in docs). | Done |
| Fullscreen programme — animations and auto-schedule | Add per-block animation/carousel when an event is selected in fullscreen, and time-based auto-schedule on show days; keep existing layout and day/event selection unchanged. No animation during shows. | Planned |
| Stages masterclass → stages confirmés | Rename "masterclass" to "stage confirmé" everywhere; update instructor bio and copy so stages are presented as confirmed internships (accessible, interesting). Content/UX only. | Planned |
| Malix — échange 1↔1 | Ajouter l’échange de Malix depuis le Malidex (QR-only, scan croisé de confirmation, commit atomique, popup de bienvenue post-échange). | Done |

See [Slices (detail)](#slices-detail) below for full behaviour.

## Slices (detail)

- **Témoignages (carousel JSON):** [docs/slices/temoignages-carousel.md](slices/temoignages-carousel.md)
- **Fullscreen programme — animations and auto-schedule:** [docs/slices/fullscreen-programme-animations.md](slices/fullscreen-programme-animations.md)
- **Stages masterclass → stages confirmés:** [docs/slices/stages-confirmes-wording.md](slices/stages-confirmes-wording.md)

## Tasks

- [ ] (Optional) Add testimonial entries when needed (schema and steps in [docs/temoignages-carousel.md](slices/temoignages-carousel.md); backup in `docs/temoignages-sauvegarde.json` if needed).
- [ ] (Ongoing) Content and date updates as festival approaches (e.g. 2026-05-15 to 2026-05-17).
- [ ] **Images PageSpeed + cache long** : déplacer les images optimisées vers `assets/img/long/` et mettre à jour les références (HTML, JS, doc Cloudflare). Détail : [docs/slices/images-pagespeed-long-cache.md](slices/images-pagespeed-long-cache.md).

No other active delivery tasks at this time. Use this file to track new slices or tasks when they are defined.
