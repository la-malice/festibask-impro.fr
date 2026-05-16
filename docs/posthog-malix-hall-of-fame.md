# PostHog — Malix Hall of Fame

Dashboard de classement pour la **Chasse aux Malix** (projet PostHog [124663](https://eu.posthog.com/project/124663/)).

## Hall of Fame in-game (planifié)

Affichage du classement **dans le jeu** (onglet Malidex « Classement ») : spécification normative et **6 slices** de livraison dans [docs/slices/malix-hall-of-fame-in-game.md](slices/malix-hall-of-fame-in-game.md). Suivi d’avancement : [docs/PLAN.md](PLAN.md).

- **API cible (après slice 3)** : `GET https://festibask-impro.fr/malix/api/leaderboard?player_id=<uuid>` (Worker `worker-malix-api`, pas le hostname `e.festibask-impro.fr`).
- **Statut** : non implémenté — les requêtes HogQL ci-dessous alimentent le dashboard staff ; le Worker réutilisera la même logique de classement.

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
