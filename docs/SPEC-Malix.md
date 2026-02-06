# Spécification fonctionnelle – Mini-jeu Malix

**Document normatif.** Comportement et périmètre du mini-jeu Malix. Toute implémentation doit s’y conformer. Voir AGENTS.md et docs/WORKFLOW.md.

---

## 1. Contraintes critiques

### 1.1 Isolation stricte

- Le mini-jeu **ne doit en aucun cas déstabiliser le site existant**.
- Il est chargé **uniquement** sous le chemin **/malix** (ex. `https://festibask-impro.fr/malix/`).
- **Aucun** script, feuille de style ni ressource du jeu ne doit être référencé depuis `index.html` ni depuis `assets/js/script.js` du site principal.
- Inversement, le site principal ne charge rien depuis /malix.
- Aucun code du jeu ne doit figurer dans `assets/js/script.js` ni `assets/css/style.css`.

### 1.2 Déploiement GitHub Pages

- Le site est déployé via GitHub Pages (artifact `dist/`). Pas de rewrites serveur, pas de backend.
- Le jeu est servi comme **application statique** dans un sous-dossier : `dist/malix/` avec `index.html` et assets dédiés.
- **Chemins** : depuis `malix/index.html`, tous les chemins d’assets sont **relatifs** (ex. `./assets/script.js`, `./assets/doodles/01.svg`) afin de fonctionner quelle que soit la base du site (racine ou sous-dossier). Ne pas dépendre d’une base absolue type `/malix/` dans le HTML sauf si le déploiement l’exige (alors documenter `<base href="/malix/">` ou équivalent).

### 1.3 Réutilisation des doodles

- Les **Malix** sont les **doodles** déjà présents dans le dépôt : 26 fichiers SVG dans `assets/img/doodles/` (`01.svg` à `26.svg`).
- Le jeu **réutilise** ces 26 types. Les fichiers SVG du site principal **ne sont pas modifiés**.
- **Où vivent les assets du jeu** : pour une **isolation totale**, le build doit copier ou exposer les 26 SVG dans le dossier du jeu (ex. `malix/assets/doodles/` ou `malix/doodles/`). Les chemins dans le jeu pointent alors vers ces copies. Alternative : références relatives depuis `malix/index.html` vers `../assets/img/doodles/` si le build place `malix/` au même niveau que `assets/` dans `dist/`. La SPEC impose : **aucune requête du jeu ne doit charger des ressources hors du sous-arbre /malix en production** si cela peut impacter le site principal (ex. erreur 404 sur une URL du site). Donc **copier les 26 SVG dans l’arbre malix/** est recommandé.

---

## 2. Contexte et objectif

### 2.1 Contexte

- **Projet** : Festibask’Impro (festival d’improvisation à Anglet).
- **Public** : enfants d’environ 6–12 ans.
- **Usage** : pendant le festival, sur smartphone, en français.
- **Nom du jeu** : **Malix**.

### 2.2 Objectif utilisateur

- Collectionner **26 Malix différents**, chacun en **4 variantes de couleur** (26 × 4 = 104 entrées).
- Une fois la **collection complète** : le jeu affiche une fin spectaculaire ; l’enfant peut aller retirer un petit cadeau au stand du festival.

### 2.3 Inspirations

- Collection et complétion (type Pokédex / Pokémon Go).
- Mini-jeu casual, fun, **sans compte**, **mono-utilisateur**.
- **Simple et sans explication** : l’enfant comprend en jouant (tap pour attraper, voir la collection). Pas de tutoriel ni de blocs de texte explicatifs.
- **Fun, rigolo, joli** : ambiance joyeuse, couleurs vives, animations sympas ; pas de pression, pas de score affiché, pas de compétition.

### 2.4 Langue

- **Tout le jeu est en français** : textes, boutons, messages, écran de fin.

---

## 3. Périmètre

### 3.1 In scope

- Jeu autonome sous **/malix**.
- Spawn, capture, collection (Malidex).
- Fin de jeu spectaculaire (grand « Bravo », super animation des doodles).
- Stockage local uniquement ; persistance ; option de réinitialisation.
- **Mobile-first, portrait uniquement** (voir section Design).
- Effets visuels et vibration (si supportée).
- **Identité visuelle propre au jeu** (voir section Design) ; **point commun avec le site : uniquement les 26 doodles**.
- PWA optionnelle (installation, icône, hors-ligne basique) si simple à intégrer sans impacter l’isolement.

### 3.2 Out of scope

- Compte utilisateur, backend, données serveur.
- Impact sur le site principal (index, script.js, style.css).
- Orientation paysage comme mode principal (le jeu est portrait uniquement).
- Score, classement, compétition.
- Texte complexe ou explications longues.

### 3.3 Contrainte critique

- **Isolation totale** vis-à-vis du site principal ; chargement **uniquement** sous **/malix**.

---

## 4. Vocabulaire et entités

| Terme | Définition |
|-------|------------|
| **Malix** | Un doodle (un des 26 SVG) dans une des 4 variantes de couleur ; unité collectable. |
| **Malidex** | La collection / catalogue dans le jeu : liste des 26 types avec les 4 couleurs chacune ; vue dédiée dans l’UI. |
| **Spawn** | Apparition d’un Malix à l’écran (position et variante aléatoires). |
| **Capture** | Tap ou clic sur un Malix → ajout à la collection, feedback, disparition. |
| **Type** | Identifiant du doodle : 1 à 26 (correspondant aux fichiers `01.svg` … `26.svg`). |
| **Variante (couleur)** | Une des 4 couleurs appliquées au SVG (par remplissage CSS ou équivalent). Identifiants 1 à 4 ou noms de couleur définis dans la SPEC. |
| **Entrée de collection** | Paire (type, variante). Une entrée est soit collectée soit manquante. 26 × 4 = 104 entrées au total. |

---

## 5. Mécaniques de jeu

### 5.1 Spawn

- **Intervalle** : apparition pseudo-aléatoire dans le temps. Fourchette recommandée : **3 à 12 secondes** entre deux spawns (à ajuster pour garder un rythme fun sans surcharge). Un seul Malix à l’écran à la fois (spawn suivant uniquement après disparition du précédent, par capture ou timeout).
- **Position** : aléatoire dans la **zone visible** de l’écran, avec **marges** (ex. 10 % des bords) pour que le Malix reste entièrement visible.
- **Type et variante** : à chaque spawn, choix aléatoire parmi les 26 types et les 4 variantes (pas d’obligation d’éviter les déjà collectés ; l’enfant peut avoir des “doublons” visuels mais une entrée (type, variante) n’est enregistrée qu’une fois dans la collection).
- **Durée de vie** : si le Malix n’est **pas attrapé**, il disparaît après une durée limitée (recommandation : **5 à 10 secondes**). Aucun ajout à la collection dans ce cas.
- **Mouvement** : flottement, rebonds doux, **gravité faible**. Comportement type “cosmonaute” : légère dérive, rebonds sur les bords. Les constantes (vitesse, gravité, jitter) sont à définir dans le code du jeu ; s’inspirer si besoin des ordres de grandeur utilisés pour les doodles flottants du site (sans importer le script du site).

### 5.2 Capture

- **Déclencheur** : tap (mobile) ou clic (desktop) sur le Malix affiché.
- **Actions immédiates** :
  - Disparition du Malix (retrait du DOM après une courte animation).
  - **Effet visuel** : pop / sparkles / petit effet de célébration (joli, court).
  - **Vibration** : si l’API Vibration est supportée, déclencher une courte vibration (ex. 50 ms) ; ne pas bloquer le jeu si absente.
  - **Enregistrement** : ajout de l’entrée (type, variante) à la collection locale (sans doublon).
- **Feedback** : l’enfant voit que le Malix a été “attrapé” (animation + disparition) et peut consulter le Malidex pour voir la collection mise à jour.

### 5.3 Malidex (collection)

- **Vue dédiée** : liste ou grille des **26 Malix** (26 types).
- **Pour chaque type** : afficher les **4 variantes de couleur** ; pour chaque variante, indiquer **collectée** ou **non collectée** (icône, couleur, ou case cochée / vide).
- **Progression** : affichage clair du nombre d’entrées collectées, ex. « 42 / 104 » ou « 12 / 26 types » avec détail des couleurs. L’objectif est que l’enfant comprenne qu’il doit remplir toutes les cases.
- **Accès** : depuis l’écran de jeu, un bouton ou un onglet (ex. « Collection » / « Malidex ») ouvre cette vue ; retour simple vers l’écran de jeu.

### 5.4 Fin de jeu

- **Condition** : collection **complète** (les 104 entrées : 26 types × 4 variantes).
- **Détection** : automatique après chaque capture (vérifier si le nombre d’entrées collectées atteint 104).
- **Comportement** :
  - Affichage d’un **écran de fin spectaculaire**.
  - **Grand « Bravo »** bien visible (texte principal).
  - **Super animation des doodles** : animation marquante mettant en scène les 26 doodles (ex. pluie, parade, explosion de couleurs, tous les types qui défilent ou rebondissent). L’objectif est que la fin soit **mémorable et joyeuse**.
  - **Message** invitant à aller chercher le cadeau au stand (ex. « Tu as tout collecté ! Va chercher ton cadeau au stand du festival. »).
- Aucun compte ni envoi de données ; la preuve de complétion est locale (l’enfant peut montrer l’écran ou le Malidex complet au stand).

---

## 6. Données et stockage

### 6.1 Principes

- **Mono-utilisateur** : un seul joueur par appareil.
- **Aucun compte** : pas d’authentification.
- **Aucune donnée serveur** : tout reste dans le navigateur.

### 6.2 Stockage local

- **Choix** : **localStorage**.
- **Justification** : la collection contient au plus 104 entrées (paires type + variante). Un tableau JSON ou une structure sérialisée reste très petite (< 10 Ko). localStorage est suffisant, simple, et compatible avec tous les environnements ciblés (mobile, GitHub Pages). IndexedDB n’est pas nécessaire pour ce volume.
- **Schéma recommandé** :
  - **Clé** : `malix-collection` (préfixe ou nom unique pour éviter les collisions avec d’éventuelles autres clés du même domaine).
  - **Valeur** : JSON. Exemple : tableau de paires `[{ "type": 1, "variant": 2 }, ...]` ou ensemble de chaînes `["1-2", "3-1", ...]`. Chaque paire (type, variante) n’apparaît qu’une fois. Type : entier 1–26, Variant : entier 1–4.
- **Persistance** : à chaque capture, sauvegarder la collection mise à jour. Au chargement de la page, recharger la collection depuis localStorage pour afficher le Malidex à jour et détecter une éventuelle complétion (redirection vers écran de fin si déjà 104).

### 6.3 Réinitialisation

- **Optionnelle** : un moyen simple de **recommencer** (effacer la collection) doit exister.
- **Comportement** : ex. bouton « Recommencer » ou « Tout effacer » dans les paramètres ou le Malidex, avec **confirmation** (ex. « Tu vas perdre ta collection. Continuer ? »). Au confirm, effacer la clé `malix-collection` (ou équivalent) et recharger l’état initial du jeu (écran jeu, collection vide).

---

## 7. Technique et architecture

### 7.1 Emplacement

- **URL** : **/malix** (minuscules). Ex. `https://festibask-impro.fr/malix/`.
- **Dans le dépôt et dans dist/** : dossier **malix/** à la racine du site déployé. Entrée : **malix/index.html**.

### 7.2 Stack

- **HTML / CSS / JavaScript** autonomes. **Aucune** dépendance au bundle du site principal (pas d’import depuis `assets/js/script.js` ni `assets/css/style.css`).
- **Recommandation** : vanilla HTML/CSS/JS pour rester léger et compatible GitHub Pages. Framework léger accepté si pertinent (ex. pour état ou routing interne), à condition de ne pas impacter l’isolement ni le chargement.

### 7.3 Build et déploiement

- **Compatible** avec le workflow actuel (GitHub Actions, `scripts/copy-to-dist.js`). Le build doit **inclure** la copie ou la génération du dossier **malix/** dans **dist/**.
- **Options** : (1) Ajouter `malix` à la liste des dossiers copiés par `copy-to-dist.js` (si le dossier source `malix/` existe à la racine du repo). (2) Ou script de build dédié qui produit `dist/malix/` (HTML, CSS, JS, copies des 26 SVG). La SPEC n’impose pas l’outil, seulement le résultat : après build, `dist/malix/index.html` existe et le jeu fonctionne sous /malix.
- **Zéro backend** ; chargement rapide ; **aucun impact** sur le bundle ou les perfs du site principal (fichiers entièrement séparés).

### 7.4 Assets du jeu

- **26 SVG** : copiés dans l’arbre du jeu (ex. `malix/assets/doodles/01.svg` … `26.svg`) pour isolation et chemins relatifs simples.
- **Couleurs** : les 4 variantes sont appliquées en **CSS** (ou en JS par remplacement de couleurs dans le SVG, comme sur le site pour les doodles flottants). Les SVG sources utilisent du blanc `#fff` / `#ffffff` ; le jeu remplace par une des 4 couleurs de la palette du jeu (voir Design).

---

## 8. Design et UI

### 8.1 Identité visuelle

- Le jeu **peut avoir sa propre identité visuelle**. Il **n’est pas obligatoire** de réutiliser la charte graphique du site (Hubot Sans, palette navy/bleu/cyan/coral/orange/rose).
- **Seul point commun avec le site** : les **26 doodles** (mêmes visuels que sur le site et sur le programme). Le reste (couleurs, typo, fonds, boutons) peut être **propre au jeu** : fun, rigolo, joli, adapté aux enfants.
- **Couleurs des 4 variantes** : **fun et rigolotes**, appliquées en CSS. Exemples possibles : couleurs vives et contrastées (ex. bleu, rose, orange, vert menthe), ou palette cohérente mais gaie. À définir dans l’implémentation ; la SPEC impose seulement « 4 variantes de couleur distinctes et sympas pour les enfants ».

### 8.2 Orientation : portrait uniquement

- Le jeu fonctionne en **mode portrait uniquement**.
- **En paysage** : afficher un **écran d’attente** ou un message invitant à tourner l’appareil (ex. « Tourne ton téléphone pour jouer ») avec une icône ou illustration. Pas de jeu jouable en paysage.

### 8.3 Écrans

1. **Écran de jeu** : zone où les Malix apparaissent (spawn), flottent et sont attrapables ; accès au Malidex (bouton ou onglet) ; éventuellement indicateur de progression (ex. X/104).
2. **Malidex** : liste/grille des 26 types × 4 couleurs avec état collecté / non collecté ; bouton retour vers l’écran de jeu ; option « Recommencer » avec confirmation.
3. **Écran de fin** : affiché quand la collection est complète ; grand « Bravo » ; super animation des doodles ; message pour aller chercher le cadeau au stand.

### 8.4 Principes UI

- **Très simple** : pas de texte complexe ; public enfant.
- **Joli** : animations fluides, couleurs agréables, feedback visuel à chaque action.
- **Effets** : apparition sympa à chaque spawn ; pop / sparkles à la capture ; désactiver ou réduire les animations si `prefers-reduced-motion: reduce` (voir Accessibilité).

---

## 9. Accessibilité et bonnes pratiques

- **Vibration** : optionnelle ; si l’API n’est pas supportée, le jeu continue sans vibration.
- **Réduction de mouvement** : respect de `prefers-reduced-motion: reduce` pour les animations (spawn, capture, flottement, écran de fin). Réduire ou supprimer les animations non essentielles ; garder l’usage fonctionnel (tap pour capturer, lecture du Malidex).
- **Contraste et lisibilité** : textes courts et lisibles ; contraste suffisant pour les boutons et les états (collecté / non collecté).

---

## 10. PWA (optionnelle)

- **Souhaité** si simple à intégrer sans impacter l’isolement : installation sur mobile, icône dédiée, fonctionnement hors-ligne basique (cache des assets du jeu sous /malix).
- Vibration et permissions : pas de garde en tâche de fond complexe. Le scope du service worker doit être limité au jeu (ex. sous /malix) pour ne pas interférer avec le site principal.

---

## 11. Tests et qualité (attentes pour l’agent implémenteur)

L’agent qui implémente le jeu doit prévoir ou exécuter :

### 11.1 Tests unitaires (logique de collection)

- Ajout d’une entrée (type, variante) à la collection : l’entrée est présente une seule fois (pas de doublon).
- Détection de la complétion : lorsque 104 entrées sont présentes, la condition « fin de jeu » est vraie.
- Persistance : après sauvegarde puis rechargement (simulation localStorage), la collection est identique.

### 11.2 Tests de non-régression (site principal)

- **Aucune** ressource sous /malix n’est chargée depuis la page d’accueil (index.html) : vérifier l’absence de liens ou scripts pointant vers /malix dans le site principal.
- **Aucun** code du jeu (Malix, Malidex, spawn, capture) ne figure dans le bundle principal (`assets/js/script.js`, `assets/css/style.css`).

### 11.3 Vérification du stockage local

- Lecture/écriture de la collection (localStorage) ; persistance après rechargement de la page ; réinitialisation efface bien la clé et remet la collection à zéro.

### 11.4 Vérification de l’isolement

- Le jeu fonctionne **uniquement** sous /malix (accès direct à l’URL du jeu).
- Le site à la racine (/) reste inchangé : pas de lien automatique vers Malix dans le menu principal sauf décision future documentée.

---

## 12. Hypothèses et incertitudes

- [ASSUMPTION] Les 26 types correspondent aux fichiers `01.svg` … `26.svg` dans `assets/img/doodles/`.
- [ASSUMPTION] Les 4 variantes sont des couleurs appliquées au SVG (remplacement du blanc) ; pas de fichier SVG différent par couleur.
- [ASSUMPTION] L’URL de production du site est du type `https://festibask-impro.fr` ; /malix donne donc `https://festibask-impro.fr/malix/`.
- [UNCERTAIN] Comportement exact si localStorage est plein (quota) : afficher un message d’erreur simple et ne pas bloquer la lecture ; l’écriture peut échouer silencieusement ou avec message.
- [UNCERTAIN] Politique de cache PWA (durée, stratégie) si PWA est implémentée.

---

## 13. Documentation et gouvernance

Après implémentation du jeu, les documents normatifs du projet doivent être mis à jour :

- **docs/SPEC.md** : ajouter une courte section « Mini-jeu Malix » avec renvoi vers le présent document (docs/SPEC-Malix.md).
- **docs/DOMAIN.md** : ajouter les termes Malix, Malidex, spawn, capture (et type, variante si pertinent).
- **docs/ARCH.md** : décrire l’ajout du dossier malix/, son intégration au build (copy ou génération), et l’absence d’impact sur index.html et le bundle principal.
- **AGENTS.md** : citer docs/SPEC-Malix.md comme source de vérité pour le comportement du mini-jeu Malix (voir section « Sources of truth » ou « Project-specific »).
