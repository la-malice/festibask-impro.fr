# Optimisation images PageSpeed — noms et déplacement vers long/

Plan pour les images redimensionnées (mobile PageSpeed) et leur déplacement dans `assets/img/long/` afin qu’elles soient mises en cache longue durée par les règles Cloudflare (règle « Cache 30j » sur `assets/img/long/`).

Référence : [docs/cloudflare-cache-rules.md](../cloudflare-cache-rules.md).

---

## 1. Vérification des fichiers

**Déjà dans `assets/img/long/`** (rien à déplacer pour eux) :

- `anneke-bossis-92w.avif`
- `doodles-top-637w.avif`, `doodles-top-721w.avif`
- `doodles-bottom-600w.avif`, `doodles-bottom-909w.avif`
- `laetitia-landelle-92w.avif`, `laetitia-landelle-161w.avif`
- `emilie-coeurdevache-92w.avif`
- `quentin-ostanel-92w.avif`, `quentin-ostanel-665w.avif`
- `promo-2006-235w.avif`, `promo-2006-442w.avif`, `promo-2006-640w.avif`

**À confirmer** : `assets/img/equipe-belgique-320w.avif` (référencé dans le HTML ; si présent dans `img/`, le déplacer vers `long/` avec les autres variantes equipe-belgique).

---

## 2. Noms des images redimensionnées (rappel)

| Fichier / usage | Dimensions | Nom suggéré (dans long/) |
|-----------------|------------|---------------------------|
| Logo Instagram | 49×49 | `Instagram_Glyph_Gradient-49w.avif` |
| Logo Facebook | 49×49 | `Facebook_Logo_Primary-49w.avif` (ou `.png`) |
| Doodles top | 637×165, 721×187 | `doodles-top-637w.avif`, `doodles-top-721w.avif` |
| Doodles bottom | 600×168, 909×255 | `doodles-bottom-600w.avif`, `doodles-bottom-909w.avif` |
| Laetitia Landelle | 92×93, 161×163 | `laetitia-landelle-92w.avif`, `laetitia-landelle-161w.avif` |
| Émilie Coeurdevache | 92×92 | `emilie-coeurdevache-92w.avif` |
| Quentin Ostanel | 92×92, 665×665 | `quentin-ostanel-92w.avif`, `quentin-ostanel-665w.avif` |
| Anneke Bossis | 92×92 | `anneke-bossis-92w.avif` |
| Logo poster vidéo | 720×438, 800×486 | `festibask-impro__logo_ss-baseline_fd-fonce-720w.avif`, `-800w.avif` |
| Équipe Belgique | 320w (compression), 442×320 | `equipe-belgique-320w.avif`, `equipe-belgique-442w.avif` |
| Promo 2006 | 235×170 | `promo-2006-235w.avif` |

---

## 3. Déplacement vers `assets/img/long/` (cache Cloudflare)

Tous les fichiers listés ci‑dessous doivent résider dans `assets/img/long/` pour être couverts par la règle Cloudflare « Cache 30j » (`URI Path contains assets/img/long/`). Les fichiers déjà dans `long/` restent en place ; les autres sont déplacés et les références dans le code sont mises à jour.

### 3.1 Fichiers à déplacer vers `long/`

**Depuis `assets/img/`** :

- `equipe-belgique-320w.avif`
- `equipe-belgique-320w.jpg`
- `equipe-belgique-442w.avif`
- `equipe-belgique-640w.avif`
- `equipe-belgique-640w.jpg`
- `laetitia-landelle-161w.avif` (supprimer le doublon dans `img/` si présent, garder uniquement celui dans `long/`)

**Depuis `assets/img/logos/`** (variantes 49w et poster 720w/800w uniquement) :

- `Instagram_Glyph_Gradient-49w.avif`
- `Facebook_Logo_Primary-49w.avif`
- `Facebook_Logo_Primary-49w.png` (optionnel, si utilisé)
- `festibask-impro__logo_ss-baseline_fd-fonce-720w.avif`
- `festibask-impro__logo_ss-baseline_fd-fonce-800w.avif`

Les autres logos (logo ligne, La Malice, etc.) restent dans `assets/img/logos/` (déjà couverts par la règle « URI Path contains assets/img/logos »).

### 3.2 Mise à jour des références

- **index.html**  
  - Preload : `assets/img/equipe-belgique-320w.avif` → `assets/img/long/equipe-belgique-320w.avif`  
  - Tous les `srcset` / `src` pour equipe-belgique (320w, 442w, 640w, .avif et .jpg) → préfixe `assets/img/long/`  
  - Si utilisation des logos 49w ou des posters 720w/800w : remplacer `assets/img/logos/...` par `assets/img/long/...` pour ces fichiers précis (Instagram_Glyph_Gradient-49w, Facebook_Logo_Primary-49w, festibask-impro__logo_ss-baseline_fd-fonce-720w.avif, -800w.avif).  
  - Poster vidéo : si on sert une variante 720w/800w au lieu du 1000, mettre à jour l’attribut `poster` vers `assets/img/long/festibask-impro__logo_ss-baseline_fd-fonce-720w.avif` (ou équivalent avec `picture`/srcset si implémenté).
- **assets/js/script.js**  
  - `assets/img/equipe-belgique-640w.avif` → `assets/img/long/equipe-belgique-640w.avif` (ligne ~1067).

### 3.3 Documentation

- **docs/cloudflare-cache-rules.md**  
  - Dans la section « Images responsives », préciser que les variantes equipe-belgique (320w, 442w, 640w) et les logos sociaux/poster 49w et 720w/800w sont désormais sous `assets/img/long/` et donc couverts par la règle `assets/img/long/` (pas besoin de règle séparée « equipe-belgique » pour ces fichiers une fois déplacés ; la condition `equipe-belgique` reste utile si d’autres URLs contiennent encore ce segment).

---

## 4. Ordre des opérations

1. Déplacer les fichiers listés en 3.1 vers `assets/img/long/` (sans doublon pour `laetitia-landelle-161w.avif`).
2. Mettre à jour [index.html](../../index.html) et [assets/js/script.js](../../assets/js/script.js) selon 3.2.
3. Mettre à jour [docs/cloudflare-cache-rules.md](../cloudflare-cache-rules.md) selon 3.3.
4. Tester le build (`npm run build`) et vérifier que les URLs d’images sont correctes en production (pas de 404).
5. Optionnel : vérifier PageSpeed après déploiement pour confirmer le cache long sur `assets/img/long/`.
