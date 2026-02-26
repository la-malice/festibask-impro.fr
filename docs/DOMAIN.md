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
| **Match** | Match d'impro: two teams, referee, short rounds; hockey-inspired format. Opponents: Belgique, France (EDF), Suisse. |
| **Équipe de France (EDF)** | French national improvisation team; appears as opponent (Samedi) and with player bios/slider. |
| **Témoignage** | Quote from a person (e.g. marraine); displayed in carousel; data from `temoignages.json` (name, role, quote, image, optional signature/AVIF). |
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
- **Spectacle:** Either “format long” or “match”; has time, title, image, pitch. Match has opponent (Belgique, France, Suisse). France match has EDF player slider. IDs e.g. `spectacle-vendredi-format-long`, `spectacle-samedi-match`.
- **EDF player:** name, role (optional, e.g. Coach, Capitaine), image, bio. Hardcoded in `script.js`; no separate JSON.
- **Témoignage:** name, role, quote, image; optional signature, imageAvif128, imageAvif256. Stored in `temoignages.json` array; order by array index.
- **Atelier:** id (e.g. atelier-vendredi-11h-initiation), title, time, description, instructor(s), flip-back content; optional “COMPLET” and waitlist. Registration/waitlist forms point to Sibforms.
- **Tarif:** Pass 1 jour, Pass 3 jours, Stage; each has price, description, flip-back details; anchors #pass-1j, #pass-3j, #stage.
- **Malix (jeu):** 27 types (fichiers 01.svg–27.svg dans assets/img/doodles/), 4 variantes de couleur ; entrée de collection = paire (type, variante). Collection complète = 108 entrées ; fin de jeu avec écran « Bravo » et animation. Spec : docs/SPEC-Malix.md.

## Domain Rules (Observed in Code)

1. Testimonials: array in `temoignages.json`; each item must have name, role, quote, image for a card to be rendered; section hidden if list empty or fetch fails.
2. Spectacles: three days; each day exactly one format long + one match. Match France (Samedi) has EDF slider (multiple slides); other spectacles (format long, other matchs) open a single-slide slider (image + details). No fullscreen modal for spectacles.
3. Programme day tabs and “À l’affiche” day slider are synchronized (same day index).
4. Images: under `assets/img/`; logos in `assets/img/logos/`; long-form show images in `assets/img/long/`.
5. Brevo: client_key in index.html and sw.js (key from query in sw); forms are Sibforms (Brevo backend).

## Assumptions and Uncertainties

- [ASSUMPTION] “La Malice” is the organizing entity name used consistently (Schema.org, hero “présente”).
- [UNCERTAIN] Whether “team” (lineup) and “EDF players” are the same set; EDF players are a fixed list in script.js; no generic “team member” JSON.
- [UNCERTAIN] Lifecycle of testimonial content (who edits, how often); only JSON structure and docs/temoignages-carousel.md define it.
