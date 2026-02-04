# Charte graphique – variables CSS

**Normative (source de vérité design).** Toute proposition ou implémentation de design (couleurs, typos, composants visuels) doit respecter cette charte. Voir AGENTS.md et docs/ADR/0001-charte-graphique.md.

Référence des variables CSS et recommandations d’usage pour aligner le site sur la charte graphique Festi'Bask Impro (typos Hubot Sans, palette 6 couleurs).

## Palette – codes couleurs (hex)

| Nom charte | Hex | Variable CSS | Rôle |
|------------|-----|--------------|------|
| Navy | **#21254e** | `--navy` | Fond sombre, dégradés hero/header |
| Bleu charte | **#21428f** | `--blue-charte` | Bleu moyen, dégradés |
| Cyan | **#01b3e4** | `--cyan` | Accent bleu (liens, boutons principaux) |
| Corail | **#e95842** | `--coral` / `--accent` | Accent principal (brand, countdown, badge COMPLET) |
| Orange | **#f0853a** | `--orange` | Touche (À propos, bouton liste d'attente) |
| Rose | **#df1279** | `--pink` | Titres sections, matchs programme |

**theme-color** (meta) : #21254e.

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

Fond des cartes intervenant (flip bio, stages) : **navy** (`--navy`).

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

## À l'affiche – titres bannières (format long + match)

Titres des bannières spectacle (format long et match) : même style partout — Hubot Sans, `clamp(1.5rem, 3.5vw, 2.6rem)`, `font-weight: normal`, blanc, `text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6)`. Bouton « Détails » en haut à droite des bannières (fond semi-transparent).

## Fichiers

- Variables définies dans `assets/css/style.css` (`:root`) et reflétées dans le critical CSS de `index.html`.
- `meta name="theme-color"` : #21254e (navy).
