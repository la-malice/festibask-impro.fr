# Reverse proxy PostHog (Cloudflare Worker) — legacy

Ce document est conservé à titre de **référence legacy / rollback**.
Le chemin principal en production utilise désormais le **Managed Reverse Proxy PostHog** avec `api_host: 'https://festibask-impro.fr'` dans `index.html`.

Le reverse proxy via Cloudflare Worker (ex. `e.festibask-impro.fr`) n’est plus la configuration standard.

Le code source du Worker est dans [worker-posthog/src/index.js](../worker-posthog/src/index.js). Déploiement via Wrangler depuis le dossier `worker-posthog/`.

Référence : [PostHog – Cloudflare reverse proxy](https://posthog.com/docs/advanced/proxy/cloudflare).

---

## Statut

- **Statut actuel:** déprécié (legacy).
- **Usage autorisé:** uniquement en cas de rollback ou de diagnostic ciblé.
- **Ne plus déployer par défaut** depuis `worker-posthog/` tant que le Managed Reverse Proxy fonctionne.

---

## Prérequis

- Compte Cloudflare ; domaine `festibask-impro.fr` (idéalement zone DNS gérée par Cloudflare).
- Node.js 16.17+ pour Wrangler (ou `npx wrangler`).

---

## 1. Procédure de rollback (si nécessaire)

1. Cloner le repo (ou se placer dans le dossier du projet).
2. Aller dans le dossier du Worker : `cd worker-posthog`
3. Déployer : `npx wrangler deploy`  
   - Si demandé : `npx wrangler login` pour se connecter à Cloudflare.
4. Vérifier dans **Cloudflare Dashboard** → **Workers & Pages** que le Worker `posthog-proxy` apparaît et est déployé.

---

## 2. Attacher un custom domain (sous-domaine neutre)

1. Dans **Workers & Pages** → **posthog-proxy** → **Settings** → **Triggers** → **Custom Domains** → **Add**.
2. Choisir le sous-domaine **e** → `e.festibask-impro.fr`.  
   Éviter des noms évidents pour les adblockers : `analytics`, `tracking`, `telemetry`, `posthog`.
3. Si la zone DNS est sur Cloudflare, l’enregistrement (CNAME ou route Workers) est en général créé automatiquement. Sinon, créer manuellement le CNAME indiqué par Cloudflare.

---

## 3. Vérifier le DNS (si zone hors Cloudflare)

- Créer un **CNAME** : nom `e`, cible celle indiquée par Cloudflare pour le Worker.
- Vérifier qu’un enregistrement existe pour `e.festibask-impro.fr`.

---

## 4. SSL

- Dans **SSL/TLS** pour la zone du domaine : utiliser **Full** ou **Full (strict)** pour éviter des redirections 301 qui peuvent casser CORS.

---

## 5. CORS (si besoin)

Si des erreurs CORS apparaissent en production (ex. `No 'Access-Control-Allow-Origin' header`), ajouter dans [worker-posthog/src/index.js](../worker-posthog/src/index.js) la fonction `addCorsHeaders` et l’appliquer à la réponse, comme décrit dans la [doc PostHog – CORS errors](https://posthog.com/docs/advanced/proxy/cloudflare#cors-errors-in-browser-console). Puis redéployer : `cd worker-posthog && npx wrangler deploy`.

---

## 6. Vérification (mode rollback)

1. Ouvrir le site en production (ou une preview) avec les DevTools → onglet **Network**.
2. Déclencher une pageview ou un événement (navigation, clic, etc.).
3. Vérifier qu’il existe des requêtes vers `e.festibask-impro.fr` avec réponse **200 OK**.
4. Dans l’app PostHog (eu.posthog.com), confirmer que les événements arrivent bien.

En mode rollback, vérifier que `index.html` contient `api_host: 'https://e.festibask-impro.fr'` et `ui_host: 'https://eu.posthog.com'` dans l’appel à `posthog.init()`.
