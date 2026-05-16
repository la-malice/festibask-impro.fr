# Plan

## Current phase

Places disponibles **pass spectacles** et **stages** (CSV Google → `remaining-seats.json`, affichage tarifs + cartes ateliers) livré — [places-stages-ateliers.md](slices/places-stages-ateliers.md). Optionnel : alimentation automatique des totaux HelloAsso dans le Sheet — [helloasso-jauge-sync.md](slices/helloasso-jauge-sync.md).

## Slices

| Slice | Goal | Status |
|-------|------|--------|
| Places spectacles (Sheet → JSON) | CSV publié → `remaining-seats.json` au build ; affichage places / complet sur pass Vendredi, Samedi, Dimanche (et optionnel 3 jours). | Done |
| Places stages / ateliers | Même fichier JSON que les pass ; clés `atelier-*` ; CSV avec colonne `id`/`cle` pour alimenter les stages au build. | Done |
| HelloAsso → Sheet (jauge) | Apps Script + API OAuth pour mettre à jour les totaux billetterie dans le Google Sheet (amont du CSV) ; script versionné dans le dépôt. | Done |
| — | Marketing site live (hero, programme, stages, tarifs, témoignages, modals, deploy) | Done |
| Témoignages (carousel JSON) | Carousel of testimonies loaded from JSON; section hidden when JSON is empty; easy to add testimonies by editing JSON (procedure in docs). | Done |
| Fullscreen programme — animations and auto-schedule | Add per-block animation/carousel when an event is selected in fullscreen, and time-based auto-schedule on show days; keep existing layout and day/event selection unchanged. No animation during shows. | Planned |
| Stages masterclass → stages confirmés | Rename "masterclass" to "stage confirmé" everywhere; 4 stages confirmés Samedi (2 salles × 2 créneaux); update instructor bio and copy. | Done |
| Malix — échange 1↔1 | Échange de Malix depuis le Malidex par scans mutuels de QR courts, commit local, popup de bienvenue post-échange. | Done |
| Malix — identifiant joueur + HoF PostHog (staff) | UUID `malix-player-id`, `posthog.identify`, snapshots, dashboard Hall of Fame PostHog. | Done |
| Malix HoF in-game — slice 1 | Contrat API, SPEC/ARCH, HogQL validée | Planned |
| Malix HoF in-game — slice 2 | `worker-malix-api` local + tests parsing | Planned |
| Malix HoF in-game — slice 3 | Deploy prod, CORS, cache, rate limit | Planned |
| Malix HoF in-game — slice 4 | `leaderboard-client.js` | Planned |
| Malix HoF in-game — slice 5 | Onglet Malidex « Classement » + UI | Planned |
| Malix HoF in-game — slice 6 | Finition, checklist festival | Planned |

See [Slices (detail)](#slices-detail) below for full behaviour.

## Slices (detail)

- **Témoignages (carousel JSON):** [docs/slices/temoignages-carousel.md](slices/temoignages-carousel.md)
- **Fullscreen programme — animations and auto-schedule:** [docs/slices/fullscreen-programme-animations.md](slices/fullscreen-programme-animations.md)
- **Stages masterclass → stages confirmés:** [docs/slices/stages-confirmes-wording.md](slices/stages-confirmes-wording.md)
- **Places stages / ateliers:** [docs/slices/places-stages-ateliers.md](slices/places-stages-ateliers.md)
- **HelloAsso → Sheet (jauge) :** [docs/slices/helloasso-jauge-sync.md](slices/helloasso-jauge-sync.md)
- **Malix — Hall of Fame in-game (6 slices) :** [docs/slices/malix-hall-of-fame-in-game.md](slices/malix-hall-of-fame-in-game.md) — ordre obligatoire 1 → 6 ; **ne pas implémenter hors session dédiée par slice**.

## Tasks

- [x] Témoignage Julie Ferrier actif (JSON + AVIF via `npm run build:images` / `scripts/image-assets.json`) ; procédure [docs/temoignages-carousel.md](slices/temoignages-carousel.md) ; sauvegarde `docs/temoignages-sauvegarde.json`.
- [ ] (Ongoing) Content and date updates as festival approaches (e.g. 2026-05-15 to 2026-05-17).
- [ ] **Images PageSpeed + cache long** : déplacer les images optimisées vers `assets/img/long/` et mettre à jour les références (HTML, JS, doc Cloudflare). Détail : [docs/slices/images-pagespeed-long-cache.md](slices/images-pagespeed-long-cache.md).

No other active delivery tasks at this time. Use this file to track new slices or tasks when they are defined.
