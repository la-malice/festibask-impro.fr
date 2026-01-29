# Règles de cache Cloudflare (Cache Rules)

Référence des règles à configurer dans Cloudflare pour optimiser le cache (SEO / PageSpeed). Plan gratuit : 5 règles max.

---

## Règle 1 — Cache 30 jours

**Nom :** `Cache 30j - Images, logos, posters, placeholders, vidéos`

**When incoming requests match** (Custom filter expression, toutes les conditions en **Or**) :

| # | Field    | Operator | Value                    |
|---|----------|----------|---------------------------|
| 1 | URI Path | contains | `edf-`                   |
| 2 | URI Path | contains | `assets/img/long/`       |
| 3 | URI Path | contains | `image-fond-01`          |
| 4 | URI Path | contains | `hero-video-poster`     |
| 5 | URI Path | contains | `instructor-placeholder`|
| 6 | URI Path | contains | `assets/img/logos`      |
| 7 | URI Path | contains | `festival-2026/headliners` |
| 8 | URI Path | contains | `assets/video`         |

**Then :**

- Cache eligibility : **Eligible for cache**
- **Browser TTL** : **Override** → **2592000** secondes (30 jours)

---

## Règle 2 — Cache 1 an (fonts)

**Nom :** `Cache 1 an - Fonts`

**When incoming requests match :**

- URI Path **contains** `assets/fonts`

**Then :**

- Cache eligibility : **Eligible for cache**
- **Browser TTL** : **Override** → **31536000** secondes (1 an)

---

## À ne pas modifier

- `equipe-belgique`, `equipe-suisse` : pas de règle (cache court, photos à venir).
- `style.css`, `script.js` : pas de règle (mises à jour fréquentes).
