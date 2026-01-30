# Carrousel témoignages

Composant de la page d'accueil qui affiche un carrousel de témoignages chargé depuis un fichier JSON. Si le JSON est vide ou invalide, le bloc ne s'affiche pas.

## Emplacement dans la page

- **Position** : entre la section « Le mot des organisateurs » et la section « Partenaires & sponsors ».
- **Ancre** : `#temoignages` (pour les liens internes).

## Fichiers concernés

| Rôle | Fichier |
|------|---------|
| Données | `assets/data/temoignages.json` |
| HTML | Bloc `#temoignages` dans `index.html` (structure vide, remplie en JS) |
| JS | Chargement JSON, construction des cartes/dots, init carrousel dans `assets/js/script.js` |
| CSS | `#temoignages` / `.testimonials-block` et sous-classes dans `assets/css/style.css` |

## Schéma du JSON

Le fichier `assets/data/temoignages.json` doit contenir un **tableau** d'objets. Chaque objet représente un témoignage :

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `name` | string | oui | Nom affiché (ex. "Julie Ferrier") |
| `role` | string | oui | Rôle / titre (ex. "Marraine 2026") |
| `quote` | string | oui | Citation (1–2 phrases, ~40–50 mots max) |
| `signature` | string | non | Ligne de signature (ex. "— Julie Ferrier") |
| `image` | string | oui | URL de l'image fallback (ex. `assets/img/julie-ferrier.jpg`) |
| `imageAvif128` | string | non | URL AVIF 128w pour `srcset` |
| `imageAvif256` | string | non | URL AVIF 256w pour `srcset` |

### Exemple minimal (une carte, sans AVIF)

```json
[
  {
    "name": "Julie Ferrier",
    "role": "Marraine 2026",
    "quote": "L'improvisation, c'est le plaisir de l'instant partagé.",
    "signature": "— Julie Ferrier",
    "image": "assets/img/julie-ferrier.jpg"
  }
]
```

### Exemple avec images AVIF (recommandé pour le responsive)

```json
[
  {
    "name": "Julie Ferrier",
    "role": "Marraine 2026",
    "quote": "L'improvisation, c'est le plaisir de l'instant partagé. Festibask'Impro réunit tout ce que j'aime.",
    "signature": "— Julie Ferrier",
    "image": "assets/img/julie-ferrier.jpg",
    "imageAvif128": "assets/img/julie-ferrier-128w.avif",
    "imageAvif256": "assets/img/julie-ferrier-256w.avif"
  }
]
```

### Tableau vide (carrousel masqué)

Pour masquer le carrousel (par ex. en attendant une validation), laisser un tableau vide :

```json
[]
```

**Sauvegarde :** une copie de sauvegarde avec le témoignage Julie est dans `docs/temoignages-sauvegarde.json`. Pour réactiver : copier son contenu dans `assets/data/temoignages.json` (source).

## Comment ajouter un témoignage

1. Éditer **`assets/data/temoignages.json`** (fichier **source**, à la racine du dépôt).
2. Ajouter un objet au tableau avec au minimum : `name`, `role`, `quote`, `image`.
3. Placer l'image dans `assets/img/` (ex. `julie-ferrier.jpg`).
4. Optionnel : générer des versions AVIF 128×128 et 256×256 pour le responsive et renseigner `imageAvif128` et `imageAvif256`.
5. Rebuild / déploiement : le build copie `assets/` dans `dist/`, donc le JSON et les images sont inclus.

**Test en local :** il faut **toujours** passer par un serveur HTTP. Ouvrir `index.html` ou `dist/index.html` en `file://` provoque une erreur CORS : le navigateur bloque les `fetch()` vers des URLs `file://` (origine `null`).

Utilise un serveur HTTP (pas `file://`). En dev, le plus simple : **`npm run dev`** (Vite, http://localhost:8000) — rechargement automatique à chaque modification. Sinon : `npm run serve` ou `python3 server.py`. Les serveurs partent de la racine du dépôt (sources), donc le JSON chargé est `assets/data/temoignages.json` en source. Pour tester le site buildé (dist) : `cd dist && python3 -m http.server 8000`.

## Comportement

- **JSON vide ou absent** : le bloc `#temoignages` reste masqué (`display: none`). Aucun carrousel affiché.
- **JSON invalide ou erreur réseau** : le bloc reste masqué.
- **Au moins un témoignage valide** : les cartes et les dots sont générés en JS, le bloc reçoit la classe `.is-visible` et s'affiche. Le carrousel fonctionne : une carte par slide, boutons précédent/suivant, dots, scroll horizontal (swipe sur mobile), navigation clavier (Tab + Enter/Space sur les boutons). Pas d'autoplay.

## Accessibilité

- Le conteneur a `role="region"` et `aria-label="Témoignages"`.
- Les boutons prev/next ont `aria-label="Témoignage précédent"` / `"Témoignage suivant"`.
- Les dots ont `role="tab"`, `aria-label="Témoignage N"`, `aria-selected` selon l'état.
- Les images ont un `alt` descriptif ("Photo de [nom]").
