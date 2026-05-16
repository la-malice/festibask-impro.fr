# PostHog — Malix Hall of Fame

Dashboard de classement pour la **Chasse aux Malix** (projet PostHog [124663](https://eu.posthog.com/project/124663/)).

## Hall of Fame in-game

Affichage du classement **dans le jeu** (onglet Malidex « Classement ») : spécification normative et **6 slices** de livraison dans [docs/slices/malix-hall-of-fame-in-game.md](slices/malix-hall-of-fame-in-game.md). Suivi d’avancement : [docs/PLAN.md](PLAN.md).

- **Slice 1 (2026-05-16)** : contrat API et HogQL de référence validés (voir section *Validation slice 1* dans le slice doc).
- **API prod** : `GET https://festibask-impro.fr/malix/api/leaderboard?player_id=<uuid>` (Worker `malix-api` / dossier `worker-malix-api/`, pas le hostname `e.festibask-impro.fr`).
- **Slice 3 (2026-05-16)** : CORS, cache 180 s, rate limit dans le Worker ; route `festibask-impro.fr/malix/api/*` dans `wrangler.jsonc`. **Deploy** : `cd worker-malix-api && npx wrangler secret put POSTHOG_PERSONAL_API_KEY && npx wrangler deploy` (à exécuter sur le compte Cloudflare du site).
- **Statut** : API Worker prête ; client / UI non livrés (slices 4–6). Même HogQL que le dashboard staff ; API in-game `LIMIT 500`, insight dashboard `LIMIT 50`.

## Prérequis

- Déploiement du jeu avec `malix-player-id` et événements enrichis (`malix_player_id` sur chaque événement Malix).
- Les données historiques **avant** ce déploiement n’ont pas `malix_player_id` et n’apparaissent pas dans le Hall of Fame.

## Dashboard

- **Nom** : Malix Hall of Fame
- **URL** : [https://eu.posthog.com/project/124663/dashboard/684717](https://eu.posthog.com/project/124663/dashboard/684717) (épinglé)

## Insights

| Insight | Description |
|---------|-------------|
| Classement Malidex (top 50) | Table HogQL : joueurs triés par taille de Malidex, captures, photos, échanges |
| Top attrapeurs | Table HogQL : `count()` sur `malix_capture` par joueur |
| Top photographes | Table HogQL : `count()` sur `malix_photo_saved` par joueur |
| Top échangeurs | Table HogQL : `count()` sur `malix_trade_completed` par joueur |
| Collections complètes | Nombre de personnes avec `malix_collection_complete = true` |
| Joueurs actifs (7 j) | Trend : utilisateurs uniques sur `malix_game_start`, 7 derniers jours |

Liens directs des insights :

- [Classement Malidex (top 50)](https://eu.posthog.com/project/124663/insights/omUc9UwC)
- [Top attrapeurs](https://eu.posthog.com/project/124663/insights/YmzrJACs)
- [Top photographes](https://eu.posthog.com/project/124663/insights/VDgnC23R)
- [Top échangeurs](https://eu.posthog.com/project/124663/insights/qjoOBFNd)
- [Collections complètes (108)](https://eu.posthog.com/project/124663/insights/r00h2Rjf)
- [Joueurs actifs (7 j)](https://eu.posthog.com/project/124663/insights/yw8UUOri)

## Requête HogQL de référence (classement principal)

```sql
SELECT
  properties.malix_player_id AS player_id,
  max(person.properties.malidex_unique) AS malidex,
  countIf(event = 'malix_capture') AS captures,
  countIf(event = 'malix_photo_saved') AS photos,
  countIf(event = 'malix_trade_completed') AS trades
FROM events
WHERE properties.malix_player_id IS NOT NULL
  AND event IN (
    'malix_capture',
    'malix_photo_saved',
    'malix_trade_completed',
    'malix_player_snapshot',
    'malix_game_start'
  )
  AND timestamp >= now() - INTERVAL 90 DAY
GROUP BY player_id
ORDER BY malidex DESC, captures DESC
LIMIT 50
```

## Limites

- **Un appareil = un joueur** : pas de compte, pas de fusion entre téléphones.
- Effacement des données du navigateur → nouvel UUID.
- Identifiant **pseudonyme** (UUID) : pas de nom ni email ; mentionner dans la politique de confidentialité si besoin.

## Fichiers code liés

- [`malix/assets/player-id.js`](../malix/assets/player-id.js) — génération / affichage du code court
- [`malix/assets/app.js`](../malix/assets/app.js) — `identify`, `setPersonProperties`, `malix_player_snapshot`
- [`docs/analytics-posthog.md`](analytics-posthog.md) — catalogue événements
