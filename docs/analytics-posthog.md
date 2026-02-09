# Analytics PostHog — catalogue des événements

## Objectif

Suivi des visites et des actions clés (conversions, engagement) sur le site Festibask'Impro via PostHog. Le snippet PostHog est chargé dans `index.html` avec `api_host` EU (https://eu.i.posthog.com). Ce document décrit le catalogue des événements envoyés au backend.

## Événements automatiques

- **$pageview** : chargement de la page (capture automatique par PostHog selon la config).
- Autres événements d’autocapture (clics, etc.) selon la configuration du projet PostHog.

## Événements custom

| Événement | Déclencheur | Propriétés |
|-----------|-------------|------------|
| **hero_video_play** | Clic sur le bouton play pour (re)voir la vidéo hero | `source`: `'youtube'` ou `'self'` |
| **day_switch** | Clic sur un onglet de journée (Vendredi / Samedi / Dimanche) dans la section Spectacles ou Stages | `section`: `'valeur'` (spectacles) ou `'stages'`, `day_index`: 0, 1 ou 2 |
| **spectacle_details_open** | Ouverture du détail d’un spectacle (clic sur un bloc format long ou match) | `spectacle_id`: ex. `spectacle-vendredi-format-long`, `spectacle-samedi-match` |
| **stage_details_open** | Clic sur « Détails » ou ouverture du verso d’une carte stage | `stage_id`: id de l’atelier (ex. `atelier-vendredi-11h-initiation`) |
| **stage_inscription_click** | Clic sur « S’inscrire » (stage) | `stage_id`: id de l’atelier |
| **pass_details_open** | Ouverture des détails d'un pass (section billetterie, clic pour retourner la carte tarif) | `pass_id`: `'pass-1j'`, `'pass-3j'` ou `'stage'` |
| **cta_click** | Clic sur « Prendre mon ticket » ou « S’inscrire » (billetterie / inscription stage) | `cta_name`: `'billetterie'` ou `'inscription_stage'`, `section`: id de la section (ex. `hero`, `tarifs`, `stages`) |
| **modal_open** | Ouverture de la modale newsletter (« Tenez-moi au courant ») ou liste d’attente (« Ça m’intéresse! ») | `modal`: `'newsletter'` ou `'waitlist'` |
| **form_submit** | Soumission d’un formulaire Sibforms (avant réponse serveur) | `form`: `'newsletter'` ou `'waitlist'` |
| **form_submit_success** | (Optionnel) Succès affiché après soumission du formulaire | `form`: `'newsletter'` ou `'waitlist'` — implémenté si détection du panneau succès possible |
| **faq_question_open** | Ouverture d’une question FAQ (clic sur un `<details>`) | `question`: texte du `<summary>` (tronqué à 200 caractères) |
| **brochure_download** | Clic sur le lien de téléchargement de la brochure partenaire (PDF) | — |
| **nav_click** | Clic sur un lien du menu (header, drawer mobile, footer) | `target`: href (ex. `#tarifs`), `source`: `'header'`, `'drawer'` ou `'footer'` |
| **floating_doodle_click** | Clic sur un doodle flottant (smash) | — |

## RGPD

Seules des données d’usage (pas d’identifiants personnels) sont envoyées dans ces événements. La politique de confidentialité du site et le mécanisme de consentement (bandeau, etc.) restent de la responsabilité du site ; mentionner PostHog et l’usage des données dans la politique de confidentialité.

## Périmètre

Site principal uniquement (index.html, assets/js/script.js). Aucun tracking PostHog dans le mini-jeu Malix (/malix) dans ce catalogue ; si un jour du tracking est ajouté sous /malix, ce document pourra être étendu.
