# Issues

## Bugs

(No known bugs recorded at doc creation. Add entries as defects are found.)

## Limitations

- **Malix Hall of Fame (in-game) :** un appareil ≈ un joueur PostHog ; effacement des données navigateur → nouvel UUID ; délai de sync (`malix_player_snapshot` + cache BFF Worker **180 s** + cache session client **60 s**) ; événements avant déploiement `malix_player_id` absents du classement ; l’onglet Classement nécessite le Worker `malix-api` déployé sur `festibask-impro.fr/malix/api/*` (voir [docs/slices/malix-hall-of-fame-in-game.md](slices/malix-hall-of-fame-in-game.md)).
- **Testimonials:** Carousel is hidden when `assets/data/temoignages.json` is empty or invalid. Backup copy of the active entry (Julie Ferrier) is in `docs/temoignages-sauvegarde.json`.
- **No server-side rendering:** SEO relies on static HTML, meta tags, and Schema.org; no prerender.
- **Témoignages editing:** No CMS or admin UI; content is edited in JSON by hand. Schema and examples in `docs/temoignages-carousel.md`.
- **Service worker:** sw.js loads Brevo by query key; no cache strategy documented. [UNCERTAIN] Whether it is registered in production.

## Deferred

- **Google Analytics:** Commented out in index.html (perf/RGPD); Search Console + Cloudflare used instead. Re-enable only if decided.
- **Formulaire « Tenez-moi au courant » (modal notify):** Retiré car la billetterie est ouverte (peu d’intérêt). Pour remettre le bouton et le modal ou une variante (ex. newsletter générique) plus tard : voir l’historique git avant le retrait — bloc `<dialog id="notify">` dans index.html, bouton `[data-open="notify"]` dans l’encart billetterie, et dans assets/js/script.js le bloc `const dlg=...` + listeners associés ; formulaire Sibforms (Brevo), même pattern que le modal waitlist.
