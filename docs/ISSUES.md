# Issues

## Bugs

(No known bugs recorded at doc creation. Add entries as defects are found.)

## Limitations

- **Testimonials:** Carousel is hidden when `assets/data/temoignages.json` is empty or invalid. Current repo has `[]`; backup/sample in `docs/temoignages-sauvegarde.json`.
- **No server-side rendering:** SEO relies on static HTML, meta tags, and Schema.org; no prerender.
- **Témoignages editing:** No CMS or admin UI; content is edited in JSON by hand. Schema and examples in `docs/temoignages-carousel.md`.
- **Service worker:** sw.js loads Brevo by query key; no cache strategy documented. [UNCERTAIN] Whether it is registered in production.
- **Malix échange QR:** L’échange repose sur scan/copie de QR ; sans canal temps réel, certains parcours peuvent nécessiter un second scan croisé pour finaliser la double confirmation sur les deux appareils.

## Deferred

- **Google Analytics:** Commented out in index.html (perf/RGPD); Search Console + Cloudflare used instead. Re-enable only if decided.
- (Add deferred items here as needed.)
