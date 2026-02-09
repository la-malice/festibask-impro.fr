# Calendrier vidéo hero (teasers J-3 → officielle)

Composant hero : la vidéo teaser affichée peut être programmée via un fichier JSON. Plusieurs créneaux (ex. J-3, J-2, J-1, vidéo officielle) sont définis avec une date/heure de publication ; le script affiche automatiquement la vidéo dont le créneau est passé, sans republier le site.

## Emplacement

- **Bloc** : `#heroVideoContainer` (hero, bloc vidéo / poster).
- **Modes** : youtube (toujours YT + calendrier), self (toujours auto-hébergée), scheduled (avant dernier slot = YT calendrier ; après = data-hero-official-source : self ou youtube) (`data-hero-video="youtube"` et `data-hero-youtube-id` sur le container). Le calendrier ne s’applique qu’en mode YouTube.

## Fichiers concernés

| Rôle | Fichier |
|------|---------|
| Données | `assets/data/hero-video-schedule.json` |
| HTML | `#heroVideoContainer` dans `index.html` (data-hero-video, data-hero-youtube-id en fallback) |
| JS | Chargement JSON, résolution du slot actif, init YouTube avec l’ID effectif dans `assets/js/script.js` |

## Schéma du JSON

Le fichier `assets/data/hero-video-schedule.json` contient un **objet** avec :

| Champ | Niveau | Type | Obligatoire | Description |
|-------|--------|------|-------------|-------------|
| `fallbackYoutubeId` | racine | string | non | Vidéo affichée **avant** le premier créneau (ou si JSON invalide). Si absent, le script utilise `data-hero-youtube-id` du HTML. |
| `slots` | racine | array | oui | Liste de créneaux, **ordonnée par date** (chronologique). |
| `slots[].publishAt` | slot | string (ISO 8601) | oui | Date/heure de publication (ex. `2026-02-06T18:00:00+01:00` pour 18h Paris en hiver). |
| `slots[].youtubeId` | slot | string | oui | ID YouTube (ex. `xRlKmZgSxd0`). |
| `slots[].label` | slot | string | non | Libellé pour debug (ex. "Teaser J-3"). |

**Fuseau** : stocker les heures en ISO 8601 avec offset (ex. `+01:00` Paris en hiver, `+02:00` en été).

## Règle de sélection

- **Heure de référence** : date/heure du client (`new Date()`), sauf en mode test (voir ci-dessous).
- **Slot actif** : le **dernier** slot tel que `new Date(slot.publishAt) <= now`.
- **Si aucun slot actif** (avant le premier créneau) : utilisation de `fallbackYoutubeId` ou de `data-hero-youtube-id`.
- **Si le JSON est absent, invalide ou sans slots** : utilisation de `data-hero-youtube-id` (comportement identique à l’absence de calendrier).

## Mode test (query string)

Pour tester sans changer l’heure du système :

| Paramètre | Valeur | Effet |
|-----------|--------|--------|
| `hero-video-slot` | Indice entier (0, 1, 2, 3…) | Force le slot à cet index (0 = premier créneau). Ignore la date. |
| `hero-video-simulate` | Date/heure ISO 8601 | Utilisée comme « maintenant » pour choisir le slot. |

**Priorité** : si `hero-video-slot` est présent et valide, il prime ; sinon `hero-video-simulate` si présent ; sinon l’heure réelle.

**Exemples d’URL :**

- `?hero-video-slot=0` → première vidéo (J-3).
- `?hero-video-slot=3` → quatrième vidéo (officielle).
- `?hero-video-simulate=2026-02-06T17:00:00+01:00` → avant J-3 → fallback.
- `?hero-video-simulate=2026-02-06T18:00:00+01:00` → J-3.
- `?hero-video-simulate=2026-02-09T18:00:00+01:00` → J officielle.

## Mode scheduled : choix du reveal (officielle)

En `data-hero-video="scheduled"`, après l’heure du **dernier** slot (ex. 9 fév. 2026 18h), la vidéo affichée dépend de `data-hero-official-source` sur `#heroVideoContainer` :

| Valeur | Effet après l’heure officielle |
|--------|--------------------------------|
| `self` | Vidéo auto-hébergée (MP4/WebM). |
| `youtube` (ou absent) | Vidéo YouTube du dernier slot (ex. Short officiel). |

Pour basculer : changer uniquement `data-hero-official-source="self"` en `data-hero-official-source="youtube"` (ou l’inverse) dans `index.html`.

## Exemple (février 2026, Paris UTC+1)

```json
{
  "fallbackYoutubeId": "yF2rYy8qMv8",
  "slots": [
    { "publishAt": "2026-02-06T18:00:00+01:00", "youtubeId": "xRlKmZgSxd0", "label": "Teaser J-3" },
    { "publishAt": "2026-02-07T17:00:00+01:00", "youtubeId": "xPV8R_ZR0g8", "label": "Teaser J-2" },
    { "publishAt": "2026-02-08T17:00:00+01:00", "youtubeId": "pntN-GNdlC0", "label": "Teaser J-1" },
    { "publishAt": "2026-02-09T18:00:00+01:00", "youtubeId": "UWL_MniVJ-4", "label": "Officielle J" }
  ]
}
```

Pour changer la vidéo affichée à une date donnée (ex. mettre à jour l’ID de la vidéo officielle) : éditer uniquement `assets/data/hero-video-schedule.json` ; pas besoin de republier le site pour que le changement soit pris en compte au prochain chargement.
