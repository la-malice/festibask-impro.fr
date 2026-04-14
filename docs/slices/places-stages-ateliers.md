# Places restantes — stages / ateliers (slice reportée)

Slice : **Affichage des places pour les cartes ateliers et le programme**  
Status : **Reporté** — à valider et implémenter dans un chantier distinct après la livraison « places spectacles / pass journées ».

## Contexte

- La slice **places spectacles** ([`assets/data/places-spectacles.json`](../ARCH.md)) couvre les **pass journée** (CSV Google publié → JSON au build, affichage section Tarifs).
- Les **stages** (cartes `#stages`, grille `#programme`) pourront réutiliser la même logique d’affichage (libellé, complet rayé, accessibilité) avec une **source de données** dédiée : second onglet du Sheet, colonnes supplémentaires, ou fichier JSON étendu.

## Objectif (quand la slice sera activée)

- Afficher le **nombre de places restantes** (ou « Complet » avec style rayé / indisponible) sur les **cartes atelier** et éventuellement les **liens programme** (`.salle-box`), sans masquer les créneaux complets.
- Rester aligné avec la [charte graphique](charte-graphique.md) et [`docs/SPEC.md`](../SPEC.md).

## Hors scope (cette slice)

- Pas de changement des formulaires Sibforms / HelloAsso dans cette slice seule.
- Pas d’obligation d’unifier la source Sheet avec les pass spectacles (peut être un onglet ou fichier séparé).

## Dépendances

- Recommandé : avoir finalisé le pipeline **CSV → JSON** et l’affichage **pass spectacles** pour réutiliser patterns (cache-bust, conventions de nommage, documentation ARCH).

## Critères de validation (brouillon)

- [ ] Schéma JSON ou lignes Sheet documentés (IDs = `atelier-*` existants).
- [ ] Affichage cohérent mobile / desktop ; `aria-live` ou équivalent si mise à jour dynamique.
- [ ] Comportement « complet » : carte visible, état visuel distinct (ex. line-through), liste d’attente toujours accessible si applicable.
