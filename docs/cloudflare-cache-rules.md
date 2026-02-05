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
| 9 | URI Path | contains | `equipe-belgique`      |
| 10 | URI Path | contains | `equipe-suisse`       |

**Then :**

- Cache eligibility : **Eligible for cache**
- **Browser TTL** : **Override** → **2592000** secondes (30 jours)

---

## Règle 2 — Cache 1 an (fonts et favicons)

**Nom :** `Cache 1 an - Fonts et favicons`

**When incoming requests match** (Custom filter expression, toutes les conditions en **Or**) :

| # | Field    | Operator | Value                    |
|---|----------|----------|---------------------------|
| 1 | URI Path | contains | `assets/fonts`            |
| 2 | URI Path | contains | `favicon`                  |
| 3 | URI Path | contains | `apple-touch-icon`         |

Couvre : polices (`assets/fonts/`), favicon à la racine (`/favicon.ico`, `/favicon.svg`, `/apple-touch-icon.png`) et tout le dossier `assets/favicon/`.

**Then :**

- Cache eligibility : **Eligible for cache**
- **Browser TTL** : **Override** → **31536000** secondes (1 an)

---

## Règle optionnelle — Cache 7 jours (CSS et JS)

Pour améliorer le score Lighthouse Performance (desktop et mobile) sans retarder trop les mises à jour :

**Nom :** `Cache 7j - CSS et JS`

**When incoming requests match** (Custom filter expression, Or) :

| # | Field    | Operator | Value                    |
|---|----------|----------|---------------------------|
| 1 | URI Path | contains | `assets/css/style.css`   |
| 2 | URI Path | contains | `assets/js/script.js`     |

**Then :**

- Cache eligibility : **Eligible for cache**
- **Browser TTL** : **Override** → **604800** secondes (7 jours)

Lors des déploiements, invalidation manuelle du cache Cloudflare ou versioning (query string / nom de fichier) si besoin pour forcer le rechargement.

---

## À ne pas modifier (par défaut)

- `style.css`, `script.js` : pas de règle si vous privilégiez des mises à jour immédiates. Sinon, utiliser la règle optionnelle « Cache 7j » ci-dessus.

---

## Images responsives (variantes 320w, 442w, poster hero, fond)

Les variantes d’images utilisées pour PageSpeed (équipes Belgique/Suisse, EDF Colisée, poster hero, fond 1920px) sont couvertes par la règle « Cache 30j » dès que le chemin correspond :

- **hero-video-poster** (contains) → `hero-video-poster-336w.avif`, `hero-video-poster-672w.avif`
- **image-fond-01** (contains) → `image-fond-01_1920px.avif`, `image-fond-01_4000px.avif`
- **assets/img/long/** (contains) → spectacles (edf-colisee-442w.avif, braquage, commis-d-office, promo-2006), image de fond (`image-fond-01_1920px.avif`), doodles hero (`doodles-top.avif`, `doodles-bottom.avif`), photos instructeurs (quentin-ostanel, laetitia-landelle, emilie-coeurdevache, anneke-bossis), variantes equipe-belgique (320w, 442w, 640w), poster hero (festibask-impro__logo_ss-baseline_fd-fonce-720w.avif, 800w.avif), logos sociaux 49w (Instagram_Glyph_Gradient-49w.avif, Facebook_Logo_Primary-49w.avif), etc.
- **equipe-belgique** (contains) → les variantes sont désormais sous `assets/img/long/` (320w, 442w, 640w) et donc couvertes par la règle `assets/img/long/` ci-dessus. La condition « equipe-belgique » reste utile si d’autres URLs (hors long/) contiennent encore ce segment.
- **equipe-suisse** (contains) → `equipe-suisse-320w.avif`, `equipe-suisse-640w.avif`, `equipe-suisse-320w.jpg`, `equipe-suisse-640w.jpg`, etc.

---

## Vidéo hero (teaser)

La vidéo hero (`assets/video/teaser-festibask-placeholder.mp4`) n’est **pas chargée au premier coup d’œil** : seule la vignette (poster) s’affiche ; la vidéo est chargée uniquement au clic sur le bouton play. L’impact des règles de cache sur ce MP4 est donc réduit pour l’audit PageSpeed initial. La règle « Cache 30j » pour `assets/video` reste utile pour les utilisateurs qui cliquent sur play.

---

## Legacy JavaScript (Lighthouse)

Lighthouse peut signaler ~11 KiB d’« ancien JavaScript ». Le fichier first-party `assets/js/script.js` utilise déjà une syntaxe moderne (ES6+). Le signalement concerne en général les scripts **tiers** (Sibforms `main.js`, Brevo, Wonderpush, etc.) dont le code n’est pas modifiable. Conserver leur chargement asynchrone / différé (Sibforms chargé à l’ouverture du modal) pour ne pas dégrader le premier rendu.
