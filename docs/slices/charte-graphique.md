# Charte graphique – variables CSS

Référence des variables CSS utilisées pour aligner le site sur la charte graphique Festi'Bask Impro (typos Hubot Sans, palette 6 couleurs).

## Typographie (Hubot Sans)

| Variable | Usage | Valeur type |
|----------|--------|-------------|
| `--font-heading` | Titres (Titre 1, 2, 3) | "Hubot Sans", system-ui, … |
| `--font-body` | Corps de texte | system-ui, … |
| `--titre-1-size` | Titre principal (h1) | clamp(2.5rem, 5vw, 4rem) |
| `--titre-1-weight` | Titre 1 | 800 |
| `--titre-2-size` | Sous-titre section (h2) | clamp(2rem, 4vw, 3rem) |
| `--titre-2-weight` | Titre 2 | 700 |
| `--titre-3-size` | Sous-titre bloc (h3) | clamp(1.5rem, 3vw, 2.25rem) |
| `--titre-3-weight` | Titre 3 | 600 |
| `--text-size` | Corps | 1.125rem |
| `--text-weight` | Corps | 400 |
| `--description-size` | Légende, secondaire (.small) | 1rem |
| `--description-weight` | Description | 400 |

Classes utilitaires : `.titre-1`, `.titre-2`, `.titre-3`, `.text-charte`, `.description-charte`.

## Couleurs – 3 principales (charte)

| Variable | Hex | Usage |
|----------|-----|--------|
| `--navy` | #21254e | Fond sombre principal, dégradés hero/header |
| `--blue-charte` | #21428f | Bleu moyen, dégradés |
| `--cyan` | #01b3e4 | Accent bleu (liens, countdown, highlights) |

## Couleurs – touches d'accent (charte)

| Variable | Hex | Usage dans le site |
|----------|-----|---------------------|
| `--coral` | #e95842 | Même valeur que `--accent` ; visible sur brand, countdown, liens hover, badge COMPLET, titres footer, bordures/accents (slots programme, early-bird). |
| `--orange` | #f0853a | Phrase d'accroche section À propos (`.intro-highlight`) ; bouton « Ça m'intéresse! » (liste d'attente stages). |
| `--pink` | #df1279 | Titres h2 de toutes les sections sur fond sombre. |

Boutons : **principal** (Prévenez-moi, billetterie) = **cyan** ; **inscription** aux stages = **cyan** ; **liste d'attente** (« Ça m'intéresse! ») = **orange**.

Variables dérivées : `--accent` et `--accent-pink` = coral ; `--blue`, `--blue-border`, etc. = cyan.

## Programme – convention liserets (couleurs par type de créneau)

| Variable | Couleur | Usage |
|----------|---------|--------|
| `--programme-slot-stage` | orange | Stages / ateliers (`.slot-atelier`) |
| `--programme-slot-long` | cyan | Format long (`.slot-format-long`) |
| `--programme-slot-match` | pink | Matchs (`.slot-spectacle`) |
| `--programme-slot-other` | navy | Autres (accueil, pause, fin de soirée – `.slot` sans sous-classe) |
| `--programme-slot-festif` | blue-charte | Soirée festif (`.slot-festif`) |

Liseret gauche = 3px (4px pour festif), dégradé vers transparent en bas.

## Fichiers

- Variables définies dans `assets/css/style.css` (`:root`) et reflétées dans le critical CSS de `index.html`.
- `meta name="theme-color"` : #21254e (navy).
