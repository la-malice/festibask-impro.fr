# Places restantes — stages / ateliers

Slice : **Affichage des places sur les cartes atelier** à partir du même fichier que les pass spectacles.  
Status : **Implémenté** — données dans `assets/data/remaining-seats.json` (`stages`), alimentées manuellement via le **Google Sheet** (CSV publié) au build ; pas d’API HelloAsso.

## Source de données

- Fichier : [`assets/data/remaining-seats.json`](../ARCH.md) — objet **`stages`** en plus de **`passes`**.
- Build : [`scripts/build-places-from-sheet.mjs`](../../scripts/build-places-from-sheet.mjs). Si le CSV contient une colonne **`billet`**, **`id`**, **`cle`** ou **`identifiant`**, chaque ligne alimente `passes` ou `stages` avec un objet **`{ "remaining": nombre }`** par clé (pas de champ `label`). Sinon, seul l’ancien format « jour + places » est parsé pour les pass, et l’objet **`stages` déjà présent** est **conservé** et nettoyé (d’où des `remaining: null` tant que le Sheet n’a pas la bonne colonne).
- Clés `stages` : identiques aux attributs **`id`** des `<article class="atelier-card">` dans `index.html` (ex. `atelier-vendredi-11h-initiation`, `atelier-samedi-10h-emotions-ecriture`, `atelier-dimanche-10h30-famille`, …).

## Comportement (SPEC)

- Si `stages[id].remaining` est un **nombre entier** ≥ 0 : mise à jour du chip `.meta-chip-places-restantes`, ligne d’alerte `.stage-places-alert` (dans le footer recto, à droite de « S'inscrire au stage ») si `0 < remaining < 5` (seuil distinct des pass spectacles, &lt; 100), état **complet** (`.atelier-card.complet`) si `remaining ≤ 0` : au **recto**, `.stage-cta-complet-block--open-verso` « Complet » (clavier + clic → ouverture du verso) ; au **verso**, bouton **« Ça m'intéresse! »** pour la liste d’attente, sans bloc « Complet » dans le footer.
- Unité **duos** : chip avec `data-capacity-unit="duos"` (stage famille) ; libellés « N duos », alertes « plus que N duos ».
- Si `remaining` est **`null`** ou absent : **aucune** mise à jour dynamique pour cette carte (affichage HTML statique).

## Hors scope

- Pas d’intégration API HelloAsso pour cette slice ; la billetterie est consultée manuellement et les valeurs sont saisies dans le Sheet.

## Critères de validation

- [x] Schéma JSON et convention CSV documentés (ARCH, DEVELOPMENT, ce fichier).
- [x] Affichage cohérent ; `aria-live` sur `.stage-places-alert`.
- [x] Comportement « complet » : classe `.complet`, liste d’attente / overlay conformément au CSS existant.
