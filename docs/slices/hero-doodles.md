# Hero — bandes doodles

## Description

Deux bandes décoratives (images) dans le hero, alignées sur l’affiche officielle du festival :

- **Doodles top** : `assets/img/doodles-top.avif` — au-dessus du logo, dans la même cellule que le logo (`.hero-logo-wrapper`).
- **Doodles bottom** : `assets/img/doodles-bottom.avif` — sous les liens SPECTACLES • MATCHS • STAGES, dans la même cellule que les hero-tags (`.hero-tags`).

## Structure HTML

- `.hero-doodles-top` est le premier enfant de `.hero-logo-wrapper` (avant le `<picture>` du logo).
- `.hero-doodles` est le dernier enfant de `.hero-tags` (après `.hero-tags-inner`).
- Les deux images sont décoratives : `alt=""`, `role="presentation"`.

## Comportement responsive (CSS)

- **Mobile** : max-height 56px ; largeur 120 % avec débordement centré (-10 %). Tentative de pleine largeur viewport (100vw) en ≤767px avec overflow-x visible.
- **Tablette (≥768px)** : doodles-top 88px, doodles-bottom 110px.
- **Desktop (≥1024px)** : doodles-top max-height 165px, doodles-bottom 185px ; largeur 100 % de la cellule ; doodles-bottom en 120 % avec débordement (-10 %) pour dépasser visuellement.
- Grille hero : row-gap réduit ; column-gap 0 en desktop ; logo et tags centrés (justify-self: center) ; vidéo avec margin-top pour aligner sur le haut du logo.

## Fichiers

- Images : `assets/img/doodles-top.avif`, `assets/img/doodles-bottom.avif`.
- Styles : `assets/css/style.css` (blocs `.hero-doodles-top`, `.hero-doodles`, grille hero).
