# ADR 0002 – Page de lecture dédiée (watch page) pour l’indexation vidéo Google

## Statut

Accepté.

## Contexte

La vidéo teaser affichée sur la page d’accueil (hero) n’était pas indexée par Google pour les résultats vidéo. Google Search Console indiquait : « La vidéo n’est pas sur une page de lecture ». Selon les critères Google, une watch page est une page dont l’objet principal est de montrer une seule vidéo ; la page d’accueil (hero + programme + stages + etc.) ne remplit pas ce critère.

## Décision

- Créer une **page de lecture dédiée** à l’URL **/video/** (`video/index.html`) dont le contenu principal est la vidéo teaser du festival (self-hosted MP4/WebM).
- Sur cette page : VideoObject (JSON-LD), balises Open Graph vidéo (og:video, og:video:url, og:video:type, og:video:image), thumbnail et contentUrl en URLs absolues stables.
- Conserver le hero actuel sur l’accueil (teaser avec mode YouTube programmé ou self-hosted) ; ajouter un lien « Voir la vidéo teaser » dans le footer vers /video/.
- Référencer /video/ dans le sitemap principal et fournir un sitemap vidéo (sitemap-video.xml) pour faciliter la découverte par Google.
- Ne pas tenter de faire indexer la vidéo depuis la seule page d’accueil (ajouter un VideoObject sur l’accueil ne suffirait pas à lever le refus « pas sur une page de lecture »).

## Conséquences

- Le site comporte deux pages HTML principales : index.html (accueil) et video/index.html (watch page). Le build (copy-to-dist) copie le dossier video/ et sitemap-video.xml dans dist/.
- La vidéo indexée par Google pour les résultats vidéo est celle de la watch page ; l’accueil reste la page de destination principale du site.
- SPEC.md et ARCH.md documentent la watch page et le lien depuis le footer.
