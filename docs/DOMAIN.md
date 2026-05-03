# Domain Model

## Purpose

Vocabulary and concepts for the Festibask'Impro festival site: event, spectacles, programme, stages, testimonials, and organizing entity. Shared vocabulary for specs, code, and content.

## Key Terms

| Term | Definition |
|------|------------|
| **Festibask'Impro** | Festival name; improvisation theatre festival in Anglet. |
| **La Malice** | Organizing entity (théâtre d'improvisation); appears as presenter and Schema.org organizer. |
| **Patinoire de la Barre** | Venue; 299 Av. de l'Adour, Anglet. |
| **Format long** | Long-form improvisation show; one narrative piece per evening (e.g. Braquage, Commis d'Office, Promo 2006). |
| **Match** | Match d'impro: two teams, referee, short rounds; hockey-inspired format. Opponents: Belgique, France (EDF), All Stars (coaches des ateliers, dimanche). |
| **Équipe de France (EDF)** | French national improvisation team; opponent on Samedi. |
| **Équipe Malice (samedi)** | La Malice team for Saturday match (vs France): MC, arbitres, coach, joueurs; appears in player slider after Équipe de France slides. |
| **Commis d'Office (cast)** | Cast of the long-form spectacle Commis d'Office (Saturday): 6 members; appears in carousel on spectacle-samedi-format-long. |
| **Témoignage** | Quote from a person (e.g. marraine); carousel on home page after “À l’affiche”, before “Stages”; data from `temoignages.json` (name, role, quote, image, optional signature/AVIF). |
| **Atelier / Stage** | Workshop (initiation, stage confirmé, famille); has title, time, description, instructor; some “COMPLET” (waitlist); registration via Sibforms. |
| **Pass 1 jour / Pass 3 jours** | Day pass (2 spectacles + 1 drink); 3-day pass (all three evenings). |
| **Programme** | Schedule by day (Vendredi, Samedi, Dimanche); each day has format long + match. |
| **Malix** | Mini-jeu enfant (collection de doodles). Un Malix = un doodle (un des 27 SVG) dans une des 4 variantes de couleur ; unité collectable. Jeu autonome sous /malix ; spec : docs/SPEC-Malix.md. |
| **Malidex** | Dans le jeu Malix : la collection / catalogue listant les 27 types de Malix avec les 4 couleurs chacune (27 × 4 = 108 entrées). |
| **Spawn** | Dans le jeu Malix : apparition d’un Malix à l’écran (position et variante aléatoires). |
| **Capture** | Dans le jeu Malix : tap ou clic sur un Malix → ajout à la collection, feedback, disparition. |
| **Échange (Malix)** | Transaction 1↔1 entre deux appareils : chaque joueur propose un Malix, les deux valident, puis transfert croisé des entrées. |
| **Offre d’échange (Malix)** | Entrée (type, variante) proposée par un joueur pendant une session d’échange. |
| **Validation bilatérale (Malix)** | Condition où les deux joueurs ont explicitement accepté l’échange ; seul cas autorisant le commit. |
| **Zone de jeu (Malix)** | Zone géographique autorisée pour jouer sur mobile : rayon cible autour de la Patinoire de la Barre (100 m + tolérance fixe de 20 m). |
| **Fenêtre festival (Malix)** | Période temporelle pendant laquelle le jeu est autorisé (configuration dates/horaires de l’édition en cours). |
| **Bypass cheat (Malix)** | Contournement volontaire du garde d’accès en mode `?cheat=1` via un bouton « Ignorer » visible uniquement dans ce mode : autorise le jeu hors zone et hors fenêtre tout en gardant l’affichage normal du garde. |

## Entities and Relationships

- **Event:** One festival edition; dates 2026-05-15 to 2026-05-17; location Patinoire de la Barre; organizer La Malice. Represented in Schema.org and hero.
- **Spectacle:** Either “format long” or “match”; has time, title, image, pitch. Match has opponent (Belgique, France, All Stars). France match (Samedi) has Malice team slider. Belgique match has Belgique player slider. IDs e.g. `spectacle-vendredi-format-long`, `spectacle-samedi-match`.
- **Malice team member (samedi):** name, role (MC, Arbitre, Arbitre assistant, Coach, Joueur), image, bio. Hardcoded in `script.js` as `maliceSamediPlayers`; images AVIF responsive in `assets/img/long/` (malice-*-320w/442w/640w.avif). Voir docs/portraits-carrousels.md.
- **Commis d'Office cast member:** name, image, bio. Hardcoded in `script.js` as `commisDOfficeCast`; réutilise les images malice-* dans `assets/img/long/`.
- **EDF player:** name, role (optional, e.g. Coach, Capitaine), image, bio. Hardcoded in `script.js`; images AVIF responsive in `assets/img/long/` (edf-*-320w/442w/640w.avif). Belgique : `belgPlayers` (belg-* dans long/). All Stars (dimanche) : `allStarsPlayers` (allstars-* dans long/).
- **Témoignage:** name, quote, image; role required unless `omitHeader` is true (then attribution may appear only in `signature`); optional signature, imageAvif128, imageAvif256. Stored in `temoignages.json` array; order by array index.
- **Atelier:** id (e.g. atelier-vendredi-11h-initiation), title, time, description, instructor(s), flip-back content; optional “COMPLET” and waitlist. Registration/waitlist forms point to Sibforms.
- **Tarif:** Pass 1 jour, Pass 3 jours, Stage; each has price, description, flip-back details; anchors #pass-1j, #pass-3j, #stage.
- **Malix (jeu):** 27 types (fichiers 01.svg–27.svg dans assets/img/doodles/), 4 variantes de couleur ; entrée de collection = paire (type, variante). Collection complète = 108 entrées ; fin de jeu avec écran « Bravo » et animation. Spec : docs/SPEC-Malix.md.

## Domain Rules (Observed in Code)

1. Testimonials: array in `temoignages.json`; each item must have name, quote, image, and role unless `omitHeader` is set; section hidden if list empty or fetch fails. A single valid entry shows the card without carousel navigation (no arrows, no dots); two or more entries use arrows, dots, and horizontal scroll/swipe.
2. Spectacles: three days; each day exactly one format long + one match. Match France (Samedi) has combined slider: Équipe de France (intro + players) then La Malice (intro + players: MC, arbitres, coach, joueurs); Commis d'Office (format long, Samedi) has cast carousel (intro + 6 members); match Belgique has Belgique player slider; match dimanche (All Stars) enchaîne les portraits coaches (`allStarsPlayers`) puis La Malice (`maliceVsAllStarsPlayers`), sans slide d'intro équipe; other spectacles (Braquage, Promo 2006) open a single-slide slider (image + details). No fullscreen modal for spectacles.
3. Programme day tabs and “À l’affiche” day slider are synchronized (same day index).
4. Images: under `assets/img/`; logos in `assets/img/logos/`; long-form show images in `assets/img/long/`.
5. Brevo: client_key in index.html and sw.js (key from query in sw); forms are Sibforms (Brevo backend).

## Assumptions and Uncertainties

- [ASSUMPTION] “La Malice” is the organizing entity name used consistently (Schema.org, hero “présente”).
- [UNCERTAIN] Whether “team” (lineup) and “EDF players” are the same set; EDF players are a fixed list in script.js; no generic “team member” JSON.
- [UNCERTAIN] Lifecycle of testimonial content (who edits, how often); only JSON structure and docs/temoignages-carousel.md define it.
