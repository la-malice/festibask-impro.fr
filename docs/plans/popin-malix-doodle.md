# Plan : popin Malix au clic sur un doodle

## Objectifs

1. Au clic sur un doodle flottant : afficher un **popin** (même style visuel que les tooltips « format long » / « match ») au lieu de seulement faire disparaître le doodle, tout en conservant l’envoi de `floating_doodle_click` et le smash.
2. Contenu du popin : texte ci-dessous + lien **« Chasse au Malix »** vers `/malix/`.
3. Tracker les clics sur ce lien avec `malix_link_click` et **`source: 'doodle_popin'`** (à côté de `source: 'footer'`).

---

## Copy à utiliser dans le popin

Texte exact à afficher (HTML avec le lien sur « chasse au Malix ») :

**Paragraphe 1**  
Vous venez d'attraper un malix ! Ces petits dessins représentent chacun un souvenir d'une impro vécue par un.e Malicieux.se. Ils peuvent apparaître spontanément un peu n'importe où et dans n'importe quelle direction, puis ils disparaissent. À l'image de nos impros. Ils arrivent d'on ne sait pas trop où et sont un peu lourdingues parfois, mais toujours attachants !

**Paragraphe 2**  
Vous en trouverez plein au festival, il y aura même une chasse au Malix organisée !

**Lien** : les mots « chasse au Malix » doivent être un lien `<a href="/malix/">chasse au Malix</a>`.

---

## Implémentation

### Contexte actuel

- Clic doodle : [assets/js/script.js](assets/js/script.js) ~348-353 → `floating_doodle_click` + `doSmash()`.
- Tooltips spectacle : overlay `.tooltip-overlay` + popup `.tooltip-popup` ([script.js](assets/js/script.js) 1706-1932, [style.css](assets/css/style.css) ~7302-7472). Mobile : overlay plein écran + popup centré.
- `malix_link_click` : déjà envoyé pour le footer avec `source: 'footer'` ([script.js](assets/js/script.js) ~814-817).

### Modifications [assets/js/script.js](assets/js/script.js)

1. **Fonctions dédiées au popin Malix** (après le bloc tooltips)  
   - `getOrCreateMalixDoodlePopin()` : crée une fois un overlay + un popup (id `malix-doodle-popin`), classes `tooltip-overlay` et `tooltip-popup`, contenu en `innerHTML` avec la copy ci-dessus (paragraphes + lien `/malix/`).  
   - `showMalixDoodlePopin()` : affiche overlay + popup (position fixe centrée, style mobile).  
   - `hideMalixDoodlePopin()` : masque overlay + popup.  
   - Fermeture : clic sur l’overlay, touche Escape.

2. **Clic sur le doodle**  
   Dans le handler du doodle flottant : appeler `showMalixDoodlePopin()`, conserver `posthog.capture('floating_doodle_click')` et `doSmash()`.

3. **Clic sur le lien « Chasse au Malix » dans le popin**  
   Délégation sur le popup : si clic sur `a[href*="/malix/"]`, envoyer `malix_link_click` avec `source: 'doodle_popin'`, puis laisser la navigation.

### Documentation [docs/analytics-posthog.md](docs/analytics-posthog.md)

- Pour **malix_link_click**, préciser que `source` peut valoir `'footer'` ou `'doodle_popin'`.

### Fichiers

| Fichier | Action |
|---------|--------|
| [assets/js/script.js](assets/js/script.js) | Ajouter création/affichage/fermeture du popin Malix, show au clic doodle, déléguer clic lien → `malix_link_click` avec `source: 'doodle_popin'`. |
| [docs/analytics-posthog.md](docs/analytics-posthog.md) | Documenter `source`: `'footer'` ou `'doodle_popin'` pour `malix_link_click`. |

Réutilisation stricte des classes `.tooltip-overlay` et `.tooltip-popup` (pas de nouveau CSS nécessaire).
