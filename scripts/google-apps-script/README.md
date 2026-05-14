# Google Apps Script (copies de référence)

Fichiers **non exécutés** par `npm run build` : à copier dans le projet Apps Script lié au Google Sheet (Extensions → Apps Script).

| Fichier | Rôle |
|---------|------|
| `helloasso-jauge-sync.gs` | OAuth HelloAsso, lecture **`/items`** (articles vendus) ou repli **`/orders`**, pagination, agrégation par jour, écriture jauge / colonne F « Dernier relevé ». |

Documentation : `docs/slices/helloasso-jauge-sync.md`.

## Dépannage (HTTP 400 sur les commandes)

Si l’URL ressemble à `…/forms/Form/festibask-impro/orders`, c’est **incorrect** : le segment doit être un type API valide, en général **`Event`** pour une billetterie événement :

`https://api.helloasso.com/v5/organizations/arteateou/forms/Event/festibask-impro/orders?…`

1. Mettez à jour le fichier **`helloasso-jauge-sync.gs`** depuis ce dépôt (le script **corrige** une propriété `HA_FORM_TYPE` = `Form` en `Event` au premier appel qui construit l’URL).  
2. Ou dans Apps Script → **Propriétés du script**, définissez **`HA_FORM_TYPE`** = **`Event`** (ou supprimez la propriété pour utiliser le défaut).

## Sous-décompte (ex. total Vendredi plus bas que l’admin HelloAsso)

- Utilisez la **dernière** version du script : source **`/items`** (articles vendus, proche des filtres « Montants » / statistiques), pagination complète (`continuationToken` + pages pleines), états **`Unknown`** inclus, libellés **`tier`** en secours de `name`.
- Après exécution, consultez le journal : **`Lignes billet HelloAsso agrégées : N`** — `N` doit être du même ordre que le nombre de lignes comptables côté API.
- Si **`ven=`** est **inférieur** au total Vendredi affiché dans l’admin (ex. 191 vs 196) alors que samedi / dimanche collent : regardez **`Diagnostic Vendredi — billets exclus du total (libellé vendredi), par état API : …`**. Souvent **`Canceled`** (billets annulés encore pris en compte dans la vue admin).
- **Test** : propriété du script **`HA_INCLUDE_CANCELED`** = **`1`** puis relancer la synchro — si **`ven=`** augmente jusqu’au chiffre admin, l’écart venait des annulations. Remettre la propriété à vide ensuite si vous ne voulez compter que les billets encore valides.
