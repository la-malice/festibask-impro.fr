# Plan révisé : tracking d'événements PostHog (La Malice / Festibask'Impro)

Ce document décrit le plan d'implémentation révisé selon tes retours : pas de tracking fullscreen programme ; tracking des switchers de journée, spectacles, stages, CTA, modales, formulaires (optionnel succès), FAQ, brochure, nav, doodles flottants ; pour la vidéo hero, uniquement le clic sur le bouton play pour revoir.

---

## 1. Garde-fou et convention

- Tous les appels utiliseront **window.posthog** (déjà exposé par le snippet dans `index.html`). Avant chaque `posthog.capture()`, vérifier `if (window.posthog)`.
- Nommage : **snake_case** pour les noms d'événements et les propriétés.

---

## 2. Événements à implémenter

**Hors périmètre** : clic sur le programme (fullscreen) ; nombre de lectures vidéo (autoplay).  
**Inclus** : uniquement le clic sur le bouton play pour revoir la vidéo hero.

| Événement | Où | Propriétés |
|-----------|-----|-------------|
| **hero_video_play** | Clic sur le bouton play (revoir la vidéo hero) | `source`: `'youtube'` ou `'self'` |
| **day_switch** | Clic sur un onglet de journée (Vendredi / Samedi / Dimanche) | `section`: `'valeur'` (spectacles) ou `'stages'`, `day_index`: 0 / 1 / 2 |
| **spectacle_details_open** | Ouverture du détail d'un spectacle (clic sur bloc format long ou match) | `spectacle_id`: ex. spectacle-vendredi-format-long |
| **stage_details_open** | Clic sur « Détails » ou ouverture du verso d'une carte stage | `stage_id`: id de l'atelier (ex. atelier-vendredi-11h-initiation) |
| **stage_inscription_click** | Clic sur « S'inscrire » (stage) | `stage_id`: id de l'atelier |
| **cta_click** | Clic sur « Prendre mon ticket » ou « S'inscrire » (billetterie / inscription stage) | `cta_name`: `'billetterie'` ou `'inscription_stage'`, `section`: id section |
| **modal_open** | Ouverture modale newsletter (« Tenez-moi au courant ») ou liste d'attente (« Ça m'intéresse! ») | `modal`: `'newsletter'` ou `'waitlist'` |
| **form_submit** | Soumission d'un formulaire Sibforms (avant réponse) | `form`: `'newsletter'` ou `'waitlist'` |
| **form_submit_success** | (Optionnel) Succès affiché après soumission | `form`: `'newsletter'` ou `'waitlist'` |
| **faq_question_open** | Ouverture d'une question FAQ (clic sur un details) | `question`: texte du summary (tronqué si besoin) |
| **brochure_download** | Clic sur le lien de téléchargement de la brochure partenaire (PDF) | — |
| **nav_click** | Clic sur un lien du menu (header, drawer mobile, footer) | `target`: hash ou href, `source`: `'header'` / `'drawer'` / `'footer'` |
| **floating_doodle_click** | Clic sur un doodle flottant (smash) | — |

---

## 3. Modifications dans assets/js/script.js

### 3.1 Hero vidéo — hero_video_play

- **Mode YouTube** : dans le callback du clic sur `heroVideoPlayOverlay` (vers L553), juste avant d'appeler `createYoutubePlayer()`, `if (window.posthog) posthog.capture('hero_video_play', { source: 'youtube' })`.
- **Mode self-hosted** : au début de `startVideo()` (L582), `if (window.posthog) posthog.capture('hero_video_play', { source: 'self' })`.

### 3.2 Switcher de journée — day_switch

- **Section Spectacles** : dans le forEach sur `dayTabs` (L794–800), dans le handler click, après `currentDaySlide = index` et `updateDaySlider()`, ajouter `if (window.posthog) posthog.capture('day_switch', { section: (daySliderContainer.closest('section') && daySliderContainer.closest('section').id) || 'valeur', day_index: index })`.
- **Section Stages** : dans le forEach sur `stagesDayTabs` (L932–936), dans le handler click, après `setCurrentDay(index)`, ajouter `if (window.posthog) posthog.capture('day_switch', { section: 'stages', day_index: index })`.
- Ne pas tracker les onglets du programme (programmeDayTabs / fullscreen).

### 3.3 Spectacles — spectacle_details_open

- **Format long** : dans le block.addEventListener('click', …) des `.format-long-block` (L1183–1195), quand on appelle `initSpectacleSingleSlide(block, …)`, ajouter juste avant `if (blockId && window.posthog) posthog.capture('spectacle_details_open', { spectacle_id: blockId })`.
- **Match** : dans le block.addEventListener('click', …) des `.match-block` (L1490–1536), quand on appelle `initMatchSlider(…)` ou `initSpectacleSingleSlide(…)`, ajouter avant l'appel `if (blockId && window.posthog) posthog.capture('spectacle_details_open', { spectacle_id: blockId })`.

### 3.4 Stages — stage_details_open et stage_inscription_click

- **Détails** : dans le handler du `.stage-details-btn` (L1020–1026), après `openStageVerso(flipContainer)`, récupérer `stage_id = link.closest('.atelier-card').id` et `if (stage_id && window.posthog) posthog.capture('stage_details_open', { stage_id })`. Faire de même dans le handler du `.flip-front` (L1030–1036) quand on ouvre le verso.
- **S'inscrire** : ajouter un listener sur les `.link-billetterie.btn-inscription` (ou délégation dans #stages) : au clic, `stage_id = el.closest('.atelier-card').id` et `if (window.posthog) posthog.capture('stage_inscription_click', { stage_id })`. Ne pas empêcher la navigation.

### 3.5 CTA — cta_click

- Dans le même forEach que l'attribution de BILETTERIE_URL aux `.link-billetterie` (L721–726), ajouter un addEventListener('click', …) : `cta_name = el.classList.contains('btn-inscription') ? 'inscription_stage' : 'billetterie'`, `section = (el.closest('section') && el.closest('section').id) || (el.closest('[id]') && el.closest('[id]').id) || 'unknown'`, `if (window.posthog) posthog.capture('cta_click', { cta_name, section })`. Ne pas empêcher le comportement par défaut.

### 3.6 Modales — modal_open

- **Newsletter** : dans le handler qui ouvre #notify (L693–698), juste après `dlg.showModal()`, `if (window.posthog) posthog.capture('modal_open', { modal: 'newsletter' })`.
- **Waitlist** : dans le handler qui ouvre #waitlist (L708–712), juste après `dlgWaitlist.showModal()`, `if (window.posthog) posthog.capture('modal_open', { modal: 'waitlist' })`.

### 3.7 Formulaires Sibforms — form_submit et optionnel form_submit_success

- **form_submit** : sur `#sib-form` et `#sib-form-waitlist`, addEventListener('submit', …) avec `if (window.posthog) posthog.capture('form_submit', { form: 'newsletter' | 'waitlist' })` (déduire le formulaire depuis l'id).
- **form_submit_success** (optionnel) : observer la visibilité des panneaux #success-message et #success-message-waitlist (MutationObserver) et envoyer form_submit_success quand le message de succès devient visible. À documenter comme optionnel si non implémenté.

### 3.8 FAQ — faq_question_open

- Délégation sur #faq ou .faq-list : écouter `toggle` sur les `<details>`, et si `details.open === true`, récupérer le texte du premier `<summary>` et `if (window.posthog) posthog.capture('faq_question_open', { question: summaryText.trim().slice(0, 200) })`.

### 3.9 Brochure partenaire — brochure_download

- Sélecteur : `a[href*="plaquette-sponsoring"][download]` ou lien dont l'href contient le nom du PDF brochure. Au click, `if (window.posthog) posthog.capture('brochure_download')`. Ne pas empêcher le téléchargement.

### 3.10 Navigation — nav_click

- **Header** : `document.querySelectorAll('header .primary a')` — au clic, `posthog.capture('nav_click', { target: el.getAttribute('href') || '', source: 'header' })`.
- **Drawer** : `document.querySelectorAll('#drawer a')` — au clic, `posthog.capture('nav_click', { target: el.getAttribute('href') || '', source: 'drawer' })`.
- **Footer** : `document.querySelectorAll('footer a')` — au clic, `posthog.capture('nav_click', { target: el.getAttribute('href') || '', source: 'footer' })`.
- Ne pas empêcher la navigation.

### 3.11 Doodles flottants — floating_doodle_click

- Dans la création du doodle flottant (fonction qui contient `wrap.addEventListener('click', function (e) { … doSmash(); })`, vers L347–351), à l'intérieur du handler de clic, avant ou après doSmash(), ajouter `if (window.posthog) posthog.capture('floating_doodle_click')`.

---

## 4. Documentation

### 4.1 Nouveau fichier docs/analytics-posthog.md

- Objectif : catalogue des événements PostHog du site principal (hors Malix).
- Événements automatiques : $pageview (et autocapture selon config).
- Événements custom : tableau complet avec nom, déclencheur, propriétés pour chaque événement listé en section 2 (y compris form_submit et optionnel form_submit_success).
- RGPD : rappel (données d'usage, pas d'identifiants personnels ; politique de confidentialité et consentement à la charge du site).
- Périmètre : site principal uniquement ; pas de tracking dans /malix dans ce doc.

### 4.2 Référence depuis la spec et l'architecture

- docs/SPEC.md : dans la phrase qui mentionne PostHog, ajouter une référence vers docs/analytics-posthog.md pour le catalogue d'événements.
- docs/ARCH.md : dans la ligne External qui mentionne PostHog, préciser « voir docs/analytics-posthog.md pour les événements custom ».

---

## 5. Ordre d'implémentation suggéré

1. Créer docs/analytics-posthog.md avec le catalogue complet (tous les événements de la section 2).
2. Ajouter les appels posthog.capture() dans assets/js/script.js dans l'ordre des sections 3.1 à 3.11.
3. Mettre à jour docs/SPEC.md et docs/ARCH.md pour pointer vers le doc analytics.

Aucun changement dans index.html, copy-to-dist ou le build.
