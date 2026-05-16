# ADR 0003 — Échange Malix sans WebRTC

## Statut

Accepté (2026-05-16)

## Contexte

L’échange 1↔1 Malix tentait d’abord une connexion **WebRTC DataChannel** entre deux téléphones, avec signalisation par QR (offer/answer SDP). Le fallback était un **QR court** (5 caractères).

En conditions festival (souvent 4G, NAT/CGNAT, pas de serveur TURN), la connexion WebRTC échoue fréquemment. L’implémentation n’incluait que du STUN public. L’UI remplaçait parfois le QR court fonctionnel par un QR RTC volumineux, difficile à afficher et à scanner.

Le flux par QR court seul couvre déjà le besoin métier : chaque joueur propose un Malix, les deux scannent le QR de l’autre, le protocole local valide et commit dans `localStorage`.

## Décision

- Supprimer entièrement **WebRTC** (`RTCPeerConnection`, DataChannel, signalisation offer/answer) du module Malix.
- Conserver uniquement l’échange par **QR court** + protocole d’état dans `malix/assets/trade-session.js`.
- Générer les QR côté client via le bundle local `malix/assets/vendor/qrcode.min.js` (pas d’API externe).

## Conséquences

### Positives

- Un seul flux utilisateur, plus simple à tester et à expliquer aux enfants.
- Plus de dépendance réseau P2P (NAT, opérateurs, TURN).
- `trade-session.js` allégé ; moins de code mort dans `app.js`.

### Négatives / acceptées

- Pas de synchronisation temps réel inter-appareils (déjà assurée par scans mutuels + état local).
- Pas de relais serveur pour l’échange (inchangé : choix « aucun backend » maintenu).

## Fichiers concernés

- `malix/assets/trade-session.js` — protocole uniquement
- `malix/assets/app.js` — UI échange, scan, QR court
- `docs/SPEC-Malix.md` § 5.6, `docs/ARCH.md`, `docs/ISSUES.md`, `docs/PLAN.md`
