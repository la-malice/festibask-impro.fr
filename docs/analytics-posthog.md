# Analytics PostHog — catalogue des événements

## Objectif

Suivi des visites et des actions clés (conversions, engagement) sur le site Festibask'Impro via PostHog. Le snippet PostHog est chargé dans `index.html`, `video/index.html` et `malix/index.html` ; l’ingestion passe par le reverse proxy sur le sous-domaine dédié `https://e.festibask-impro.fr` (`api_host`), l’API PostHog cible restant la région EU (`ui_host: https://eu.posthog.com`).  
Le proxy est servi par le Worker Cloudflare (`worker-posthog/`) ; voir [posthog-cloudflare-proxy.md](posthog-cloudflare-proxy.md).
Ce document décrit le catalogue des événements envoyés au backend.

## Événements automatiques

- **$pageview** : chargement de la page (capture automatique par PostHog selon la config), sur l’accueil, `/video/` et `/malix/`.
- **Autocapture** : sur le site principal et la page vidéo, selon la configuration du projet PostHog. Sur **/malix**, l’init PostHog fixe **`autocapture: false`** pour limiter le bruit et la surface de collecte sur le jeu jeune public ; seuls les événements custom listés ci-dessous pour Malix sont envoyés depuis le jeu.

## Événements custom

| Événement | Déclencheur | Propriétés |
|-----------|-------------|------------|
| **hero_video_play** | Clic sur le bouton play pour (re)voir la vidéo hero | `source`: `'youtube'` ou `'self'` |
| **day_switch** | Clic sur un onglet ou une colonne de journée (Vendredi / Samedi / Dimanche) : onglets Spectacles, onglets Stages, colonnes du programme, en-tête ou carte stage (sélection du jour) | `section`: id technique (`valeur`, `stages`, `programme`), `section_name`: `'Spectacles'`, `'Stages'` ou `'Programme'`, `day_index`: 0, 1 ou 2, `day_name`: `'Vendredi'`, `'Samedi'` ou `'Dimanche'` |
| **spectacle_details_open** | Ouverture du détail d’un spectacle (clic sur un bloc format long ou match) | `spectacle_id`: id technique, `spectacle_name`: titre (ex. Braquage, La Malice vs France, Commis d'Office) |
| **stage_details_open** | Clic sur « Détails » ou ouverture du verso d’une carte stage | `stage_id`: id de l’atelier, `intervenant`: nom de l'intervenant, `stage_titre`: titre du stage |
| **stage_inscription_click** | Clic sur « S’inscrire » (stage) | `stage_id`: id de l’atelier, `intervenant`: nom de l'intervenant, `stage_titre`: titre du stage |
| **pass_details_open** | Ouverture des détails d'un pass (section billetterie, clic pour retourner la carte tarif) | `pass_id`: `'pass-1j'`, `'pass-3j'` ou `'stage'` |
| **cta_click** | Clic sur « Prendre mon ticket » ou « S’inscrire » (billetterie / inscription stage / verso pass) | `cta_name`, `section` ; `stage_id` (id atelier) si clic inscription stage ; `pass_id` (`pass-1j`, `pass-3j`, `stage`) si clic « J'achète » sur le verso d'un pass |
| **modal_open** | Ouverture de la modale newsletter (« Tenez-moi au courant ») ou liste d’attente (« Ça m’intéresse! ») | `modal`: `'waitlist'` (modal newsletter retiré) |
| **form_submit** | Soumission d’un formulaire Sibforms (avant réponse serveur) | `form`: `'waitlist'` (formulaire newsletter retiré) |
| **form_submit_success** | Succès affiché après soumission (MutationObserver sur panneaux succès Sibforms). (Formulaire newsletter retiré.) | `form`: `'waitlist'` |
| **faq_question_open** | Ouverture d’une question FAQ (clic sur un `<details>`) | `question`, `question_id` (ex. faq-0), `section`: `'faq'` |
| **brochure_download** | Clic sur le lien de téléchargement de la brochure partenaire (PDF) | `source`: `'button'` (lien « Téléchargez la brochure ») ou `'logo'` (« Votre logo ici ») |
| **partner_logo_click** | Clic sur un logo partenaire (section sponsors) | `partner`: slug (`anglet`, `aperock`, `rtl2`, `atlantic-change`), `url`: URL du site partenaire |
| **nav_click** | Clic sur un lien du menu (header, drawer mobile, footer) ou sur un slot du programme (lien atelier ou bouton spectacle) | `target`: href ou hash (ex. `#tarifs`, `#spectacle-vendredi-match`), `source`: `'header'`, `'drawer'`, `'footer'` ou `'programme'` |
| **floating_doodle_click** | Clic sur un doodle flottant (smash) | — |
| **programme_fullscreen_click** | Clic sur le bouton plein écran du programme | `resolution` (ex. `1920x1080`), `screen_width`, `screen_height` |
| **malix_link_click** | Clic sur le lien « Chasse aux Malix » | `source`: `'footer'` (lien footer) ou `'doodle_popin'` (lien dans le popin après clic sur un doodle) |
| **watch_video_play** | Première lecture effective de la vidéo sur la page `/video/` (événement `play` du `<video>`) | `source`: `'watch_page'` |
| **malix_game_start** | Clic sur « Démarrer » après accès autorisé, entrée dans l’écran de jeu | `malix_player_id` (UUID pseudonyme, sur tous les événements Malix ci-dessous) |
| **malix_capture** | Capture réussie d’un Malix (tap sur le spawn) | `is_new` : booléen (nouvelle entrée dans la collection) ; `collection_total` : nombre d’entrées distinctes après capture ; `malix_type` : 1–27 ; `malix_variant` : 1–4 (ids jeu, pas de nom lisible) ; `malix_player_id` |
| **malix_photo_saved** | Photo enregistrée dans l’album après prise de vue réussie (persistance locale) | `malix_type` : 1–27 ; `malix_variant` : 1–4 ; `malix_player_id` |
| **malix_photo_share** | Partage réussi d’une photo depuis l’album (feuille système ou téléchargement) | `malix_type` : 1–27 ; `malix_variant` : 1–4 ; `share_method` : `'native'` (feuille de partage) ou `'download'` (repli enregistrement) ; `malix_player_id` |
| **malix_trade_completed** | Échange 1↔1 validé entre deux joueurs | `incoming_type`, `incoming_variant` (Malix reçu) ; `outgoing_type`, `outgoing_variant` si l’offre locale est valide (Malix donné) ; `malix_player_id` |
| **malix_player_snapshot** | Synchronisation des totaux joueur (identify / capture / photo / échange / reset) | `malidex_unique`, `malix_captures_total`, `malix_photos_total`, `malix_trades_total`, `malix_collection_complete` ; `malix_player_id` |
| **malix_leaderboard_open** | Première ouverture réussie de l’onglet Malidex « Classement » (Hall of Fame in-game) | `malix_player_id` uniquement (aucune donnée sur les autres joueurs) |

**Propriétés personne PostHog** (mêmes noms que le snapshot, mises à jour via `setPersonProperties`) : `malidex_unique`, `malix_captures_total`, `malix_photos_total`, `malix_trades_total`, `malix_collection_complete`. Dashboard Hall of Fame : [docs/posthog-malix-hall-of-fame.md](posthog-malix-hall-of-fame.md).

## RGPD

Les événements Malix incluent un **identifiant technique pseudonyme** (`malix_player_id`, UUID généré localement) pour agréger la progression par appareil — pas de nom, email ni compte. Les autres événements du site restent sans identifiant personnel explicite. La politique de confidentialité du site et le mécanisme de consentement (bandeau, etc.) restent de la responsabilité du site ; mentionner PostHog et l’usage des données dans la politique de confidentialité.

Sous **/malix**, l’init PostHog inclut **`disable_session_recording: true`** (pas d’enregistrement de session replay sur le mini-jeu).

## Périmètre

| Zone | Fichiers | PostHog |
|------|----------|---------|
| Site principal | `index.html`, `assets/js/script.js` | Snippet + événements custom du tableau ci-dessus (hors lignes watch / malix jeu). |
| Page vidéo | `video/index.html` | Même clé et proxy ; événement **watch_video_play** ; pas de `script.js` partagé. |
| Mini-jeu Malix | `malix/index.html`, `malix/assets/app.js`, `malix/assets/player-id.js` | Même clé et proxy ; init avec **`disable_session_recording: true`** et **`autocapture: false`** ; `identify` + événements **malix_*** dont **malix_player_snapshot** (pas de code PostHog Malix dans le bundle principal). |

Le détail des événements Malix côté produit est aussi résumé dans [docs/SPEC-Malix.md](SPEC-Malix.md) § 1.4.
