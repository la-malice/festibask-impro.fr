# ADR 0001 – Charte graphique normative

## Statut

Accepté.

## Contexte

Le site Festibask'Impro doit respecter une charte graphique (typos Hubot Sans, palette 6 couleurs, conventions d’usage pour boutons, titres, programme). Pour éviter les écarts et garantir la cohérence des propositions de design, la charte doit être une source de vérité normative.

## Décision

- La **charte graphique** est documentée dans **docs/slices/charte-graphique.md** et est une **source de vérité normative** (référencée dans AGENTS.md).
- Toute proposition ou implémentation de design (couleurs, typographie, composants visuels) doit s’aligner sur cette charte : variables CSS, usage des couleurs (principales / touches), hiérarchie typo (Titre 1/2/3, Text, Description), conventions (boutons, liserets programme).
- En cas d’évolution de la charte (nouvelle couleur, nouvelle règle d’usage), **docs/slices/charte-graphique.md** est mis à jour en priorité ; WORKFLOW.md indique quand le faire.

## Conséquences

- Les agents et contributeurs doivent lire la charte avant de proposer ou coder du design.
- Les écarts par rapport à la charte doivent être justifiés (ex. ADR) ou la charte doit être mise à jour.
- Référence détaillée : codes hex, variables CSS, recommandations d’usage dans docs/slices/charte-graphique.md.
