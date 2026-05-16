# worker-malix-api

BFF Cloudflare pour le **Hall of Fame** Malix : `GET /malix/api/leaderboard?player_id=<uuid>`.

Agrège les données PostHog (projet EU **124663**) et renvoie le JSON du contrat défini dans [docs/slices/malix-hall-of-fame-in-game.md](../docs/slices/malix-hall-of-fame-in-game.md).

## Secrets

```bash
cd worker-malix-api
npx wrangler secret put POSTHOG_PERSONAL_API_KEY
```

Clé **Personal API Key** PostHog (lecture recommandée). À configurer en **local** (`wrangler dev`) et en **prod** (`wrangler deploy`). Ne jamais commiter ni exposer côté client Malix.

## Développement local

**Client Malix seul** (pas de changement Worker) : à la racine, `npm run dev` — le proxy Vite envoie `/malix/api` vers la **prod** (voir [docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md)).

**Worker en local** (deux terminaux) :

1. Copier `.dev.vars.example` → `.dev.vars` avec `POSTHOG_PERSONAL_API_KEY`, ou `npx wrangler secret put POSTHOG_PERSONAL_API_KEY`.
2. `npx wrangler dev`
3. Racine : `MALIX_API_LOCAL=1 npm run dev`

Sans secret sur `wrangler dev` : `502` `{ "error": "leaderboard_unavailable" }`.

Avec secret :

```bash
curl -s "http://127.0.0.1:8787/malix/api/leaderboard?player_id=6319a00c-a34b-4609-8b69-f6325558f557"
```

## Production

Route : `festibask-impro.fr/malix/api/*` → script `malix-api` (déclarée dans `wrangler.jsonc`).

```bash
npx wrangler deploy
```

URL : `https://festibask-impro.fr/malix/api/leaderboard?player_id=<uuid>`

Test curl :

```bash
curl -s "https://festibask-impro.fr/malix/api/leaderboard?player_id=6319a00c-a34b-4609-8b69-f6325558f557"
```

Depuis [https://festibask-impro.fr/malix/](https://festibask-impro.fr/malix/) (console) :

```javascript
fetch('/malix/api/leaderboard?player_id=' + localStorage.getItem('malix-player-id'))
  .then(function (r) { return r.json(); })
  .then(console.log);
```

Comportement prod : CORS (`https://festibask-impro.fr`), cache 180 s (Worker + `Cache-Control`), rate limit ~30 req/min/IP.

**Ne pas** héberger sur `e.festibask-impro.fr` (réservé au proxy PostHog ingest).
