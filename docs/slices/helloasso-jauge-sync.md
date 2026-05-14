# Synchronisation HelloAsso → feuille de jauge (Google Apps Script)

Slice : **comptage automatique** des réservations HelloAsso par jour pour alimenter le **Google Sheet** maître (lignes type « HelloAsso » / « HelloAsso 3J »), sans appeler HelloAsso depuis le site public.

## Hébergement (choix retenu)

**Google Apps Script** lié au classeur de jauge : secrets dans les **propriétés du script**, déclencheur temporel (ex. toutes les 10 minutes). Le dépôt contient une **copie de référence** du script : [`scripts/google-apps-script/helloasso-jauge-sync.gs`](../../scripts/google-apps-script/helloasso-jauge-sync.gs) (à coller dans Extensions → Apps Script du Sheet).

### Cellules par défaut (feuille `Jauge`)

Dans **`getConfig_()`** du script : **ligne 10** = totaux **pass 1 jour** (`B10`, `C10`, `D10`) ; **ligne 11** = **HelloAsso 3J** (`B11:D11`) ; colonne **F** « Dernier relevé » sur **`F10`** et **`F11`**. Adapter si votre tableur utilise d’autres numéros de ligne.

## OAuth et API (référence)

- **Token** : `POST https://api.helloasso.com/oauth2/token` — premier jeton avec `grant_type=client_credentials` + `client_id` / `client_secret` ; puis **`grant_type=refresh_token`** uniquement pour les appels suivants ; chaque réponse peut renvoyer un **nouveau** `refresh_token` à enregistrer ([doc HelloAsso](https://dev.helloasso.com/docs/getting-started)).
- **Articles vendus (prioritaire)** : `GET …/forms/{formType}/{formSlug}/items` — [référence](https://dev.helloasso.com/reference/get_organizations-organizationslug-forms-formtype-formslug-items). Cette liste est plus proche des **statistiques / filtres tarifs** de l’admin (y compris ventes sur d’anciens tarifs **désactivés** s’ils sont encore renvoyés par l’API). Le script pagine jusqu’à épuisement (`pageSize` 100, `continuationToken` si présent) et **ne s’arrête pas** sur un `totalPages` incohérent tant qu’une page pleine indique d’autres résultats.
- **Repli** : si `/items` échoue, utilisation de `…/orders` puis aplatissement des `items` de chaque commande (même logique d’agrégation, pagination corrigée).
- **Commandes seules** : `GET …/orders` — [référence](https://dev.helloasso.com/reference/get_organizations-organizationslug-forms-formtype-formslug-orders) (voir ci-dessus).
- Rôles / privilèges : **FormAdmin** ou **OrganizationAdmin** et **AccessTransactions** sur la clé API.
- **Repères Festibask** : organisation `arteateou`, formulaire événement `festibask-impro`, propriété **`HA_FORM_TYPE` = `Event`** pour une billetterie événement. **Ne pas** mettre `Form` : l’API renvoie une erreur 400 (*The value 'Form' is not valid*) et une URL du type `…/forms/Form/festibask-impro/orders` est incorrecte — l’URL valide contient **`…/forms/Event/festibask-impro/orders`**. Valeurs possibles côté API : `CrowdFunding`, `Membership`, `Event`, `Donation`, `PaymentForm`, `Checkout`, `Shop`. Le script versionné corrige une propriété `Form` en `Event` au moment de l’appel. Admin web : `https://admin.helloasso.com/arteateou/evenements/festibask-impro/statistiques`.

## Règles d’agrégation (alignement tableur)

Ces règles sont implémentées dans le script versionné ; toute évolution métier doit mettre à jour **ce fichier** et le `.gs` en parallèle.

### Source des lignes

- **Primaire** : réponse paginée du endpoint **`/items`** : tableau **`data`** d’**articles / billets** vendus (un enregistrement ≈ une place).
- **Un enregistrement** = une unité vendue (pas de quantité > 1 côté agrégation ; chaque ligne compte pour 1).
- **États exclus** du décompte (annulation / refus / panier non payé) : `Canceled`, `Refused`, `Abandoned`, `Deleted`, `Waiting`. **Inclus** entre autres : `Processed`, `Registered`, **`Unknown`** (utile pour certains historiques / tarifs retirés). Les libellés sans état explicite sont comptés.
- **Repli** : même logique sur les **`items`** imbriqués dans chaque commande (`/orders`) si `/items` n’est pas utilisable.

### Intitulé utilisé pour le classement

- Libellé du tarif : **`name`**, ou à défaut **`tier` / tierName / tierDescription`** (champs possibles selon la forme JSON). Chaîne normalisée (tirets typographiques → `-`, suppression des caractères invisibles, **minuscules**, **sans accents**) avant test des mots-clés jour.

### Filtres admin HelloAsso (référence pour le décompte)

Le script ne lit **pas** la case à cocher de l’UI : il applique les **mots-clés jour** ou la **règle « pass trois jours »** sur le libellé API (voir lignes HelloAsso / HelloAsso 3J). Les exemples ci-dessous correspondent aux filtres « Montants » que vous utilisez pour contrôler le total affiché dans l’admin (y compris tarifs **désactivés** tant qu’ils apparaissent dans l’API). Le chiffre affiché est le **nombre de réservations / ventes**, pas le nombre de lignes tarifaires cochées.

- **Vendredi** : `Pass Vendredi …`, `Pass 1 Jour - Vendredi 15 …` (y compris « Désactivé »), etc. — tout intitulé contenant **`vendredi`** (après normalisation).
- **Samedi** : `Pass Samedi …`, `Pass 1 Jour - Samedi 16 …` (y compris « Désactivé »), etc. — tout intitulé contenant **`samedi`** (ex. **154 résas** dans l’admin lorsque les six tarifs Samedi cochés sur votre capture sont sélectionnés).
- **Dimanche** : `Pass Dimanche …`, `Pass 1 Jour - Dimanche 17 …` (y compris « Désactivé »), etc. — tout intitulé contenant **`dimanche`** (ex. **21 résas** dans l’admin lorsque les six tarifs Dimanche cochés sur votre capture sont sélectionnés).
- **Pass 3 jours** : `Pass 3 Jours …` (plein, réduit, -12 ans, tarif enfants, y compris « Désactivé »), etc. — tout intitulé reconnu comme **pass trois jours** par le script (même motifs que la ligne **HelloAsso 3J**) ; ex. **5 résas** dans l’admin lorsque les six montants « Pass 3 Jours » de votre capture sont cochés.

### Ligne « HelloAsso » (pass 1 jour et tarifs jour unique)

- Incrémenter **Vendredi** si l’intitulé contient **`vendredi`**.
- Idem **samedi** / **dimanche** pour **`samedi`** / **`dimanche`**.
- **Pass 3 jours** (toutes variantes : plein tarif, réduit, -12 ans, tarif enfants, etc.) : **exclus** de cette ligne (voir ligne 3J).
- **Pass Stage** (mot entier **`stage`**, sans **`vendredi`** / **`samedi`** / **`dimanche`** dans l’intitulé) et articles sans aucun des trois mots-clés jour : **ignorés** sur cette ligne (pas d’attribution spectacle jour).
- **Pass groupe** (ou intitulé contenant **`groupe`**) : **ignoré** par défaut (souvent traité hors filtre « jour » ou manuellement dans le tableur) ; à adapter dans le script si vous vendez ce tarif uniquement sur HelloAsso et souhaitez une règle explicite.

### Ligne « HelloAsso 3J »

- Compter les items dont l’intitulé correspond à un **pass trois jours** : présence de **`3`** + **`jour`** (avec espace toléré), ou motifs **`pass 3`**, **`3 jours`** (après normalisation).
- Le **même total** est écrit dans les **trois colonnes** jour (ex. **`B11:D11`** par défaut), comme une répartition « une tête par jour » dans la jauge.
- Repère admin : filtre « Montants » avec les **six** tarifs **Pass 3 Jours** (actifs + désactivés) de votre capture → **5** ventes au moment du relevé ; le journal Apps Script `pass 3j (ligne dédiée)=` doit afficher ce total.

### Tarifs désactivés

- Les commandes passées restent dans l’API avec leurs items **traités** ; un tarif désactivé **n’empêche pas** de compter les ventes déjà enregistrées (équivalent à votre filtre statistiques incluant l’historique).

### États API et écart « Vendredi » (script plus bas que l’admin)

- Le script **exclut** du total les items dont l’état API est notamment **`Canceled`** / **`Cancelled`**, **`Refused`**, **`Abandoned`**, **`Deleted`**, **`Waiting`** (panier / paiement non finalisé). Les états **`Processed`**, **`Registered`**, **`Unknown`** (et libellé sans état) sont **comptés**.
- L’enum côté HelloAsso prévoit aussi entre autres **`Refunded`**, **`Contested`** ([référence générée SDK](https://github.com/HelloAsso/helloasso-php/blob/main/lib/Model/HelloAssoApiV5ModelsEnumsItemState.php)) ; ils ne sont **pas** dans la liste d’exclusion actuelle du script (comportement à garder ou à affiner si la jauge doit refléter uniquement les billets encore valides après remboursement).
- Si l’admin affiche **plus** de réservations Vendredi que la valeur **`ven=`** du journal (ex. **196** vs **191**), une cause fréquente est que l’écran statistiques / filtre « Montants » **inclut encore des lignes annulées** ou non valides que l’API renvoie avec un état exclu par le script.
- Après chaque synchro, le journal peut afficher une ligne **`Diagnostic Vendredi — billets exclus du total (libellé vendredi), par état API : {"Canceled":5,...}`** : elle résume les billets au libellé **vendredi** qui sont sortis du total à cause de l’état (pour vérifier l’hypothèse annulations).
- **Test de cohérence** : propriété du script **`HA_INCLUDE_CANCELED`** = **`1`** → les **`Canceled`** **sont comptés** comme le reste. Si **`ven=`** remonte d’autant que l’écart observé (ex. +5), l’écart venait bien des annulations. **À retirer ou remettre à vide** ensuite si la jauge doit rester sur les seules places valides.

### « Places restantes » et marge

- **Hors scope du script** : le tableur continue de calculer **places restantes**, **marge d’erreur**, **stages**, autres canaux (Eventim, invitations, etc.). Le script ne fait qu’écrire les **totaux HelloAsso** et la colonne **« Dernier relevé »** (F).

### Colonne « Dernier relevé » (F)

- Après écriture réussie des cellules compteur, le script remplit les cellules F configurées (ex. `F10`, `F11`) avec la date **`jj/mm/aaaa`** (fuseau **`Europe/Paris`**).

## Chaîne vers le site

1. Apps Script met à jour le Sheet → CSV publié inchangé en URL.
2. CI GitHub (`SHEET_CSV_URL`) → `npm run build:places` → `remaining-seats.json` → déploiement (voir `.github/workflows/pages.yml` : **toutes les 15 min** hors **01h–08h Europe/Paris** en équivalent UTC ; `push` / `workflow_dispatch` possibles à tout moment).

Voir aussi [places-stages-ateliers.md](places-stages-ateliers.md) et [ARCH.md](../ARCH.md).
