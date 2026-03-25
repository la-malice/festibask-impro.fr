  const BILETTERIE_URL = 'https://www.helloasso.com/associations/arteateou/evenements/festibask-impro';
  var DAY_SWITCH_DAY_NAMES = ['Vendredi', 'Samedi', 'Dimanche'];

  // Données des joueurs de l'Équipe de France — portraits AVIF responsive (long/)
  const edfPlayers = [
    {
      name: 'Aurélie Desert',
      image: 'assets/img/long/edf-aurelie-desert-640w.avif',
      bio: 'Comédienne, chanteuse et auteure, formée au théâtre et à l\'improvisation à Bordeaux. Membre de l\'Équipe de France depuis 2018, elle évolue entre scène, rue et formats improvisés. Représente Bordeaux.'
    },
    {
      name: 'Cécile Giroud',
      role: 'Capitaine',
      image: 'assets/img/long/edf-cecile-giroud-640w.avif',
      bio: 'Comédienne, humoriste et musicienne. Figure majeure de l\'impro française, multiple championne du monde. Capitaine de l\'Équipe de France, reconnue pour sa polyvalence, son énergie collective et son sens du jeu. Représente Lyon.'
    },
    {
      name: 'Félix Philippart',
      image: 'assets/img/long/edf-felix-philippart-640w.avif',
      bio: 'Formé à Caen puis à Paris, improvisateur professionnel et pilier de l\'Équipe de France depuis 2021. Il joue dans de nombreux spectacles et enseigne le théâtre à la Manufacture de l\'Acteur. Représente Caen.'
    },
    {
      name: 'Igor Potoczny',
      image: 'assets/img/long/edf-igor-potoczny-640w.avif',
      bio: 'Improvisateur parmi les plus titrés de France, membre de l\'Équipe de France depuis 1997. Triple champion du monde, habitué des scènes internationales, notamment au festival Juste pour Rire à Montréal. Représente Niort.'
    },
    {
      name: 'Olivier Descargues',
      role: 'Coach',
      image: 'assets/img/long/edf-olivier-descargues-640w.avif',
      bio: 'Improvisateur depuis 1987, membre historique de l\'Équipe de France, triple champion du monde. Coach de l\'équipe depuis 2015. Cofondateur de la Ligue Majeure, créateur et interprète de nombreux spectacles de référence.'
    }
  ];

  // Données de l'équipe La Malice pour le samedi (match vs France) — portraits AVIF responsive (long/)
  const maliceSamediPlayers = [
    { name: 'Stéphanie Balligand', role: 'MC', image: 'assets/img/long/malice-stephanie-balligand-640w.avif', bio: '' },
    { name: 'Sophie Le Bourhis', role: 'Arbitre', image: 'assets/img/long/malice-sophie-le-bourhis-640w.avif', bio: '' },
    { name: 'Eve Arlandis', role: 'Arbitre\nassistante', image: 'assets/img/long/malice-eve-arlandis-640w.avif', bio: '' },
    { name: 'Patrice Lamarque', role: 'Arbitre\nassistant', image: 'assets/img/long/malice-patrice-lamarque-640w.avif', bio: '' },
    { name: 'Camille Mortreux', role: 'Coach', image: 'assets/img/long/malice-camille-mortreux-640w.avif', bio: '' },
    { name: 'Hélène Morreel', role: 'Joueuse', image: 'assets/img/long/malice-helene-morreel-640w.avif', bio: '' },
    { name: 'Marjory Pinto', role: 'Joueuse', image: 'assets/img/long/malice-marjory-pinto-640w.avif', bio: '' },
    { name: 'Nicolas Teboul', role: 'Joueur', image: 'assets/img/long/malice-nicolas-teboul-640w.avif', bio: '' },
    { name: 'Pierrick Deredin', role: 'Joueur', image: 'assets/img/long/malice-pierrick-deredin-640w.avif', bio: '' }
  ];

  // Cast du spectacle Commis d'Office (format long, samedi) — réutilise les images malice-* (mêmes personnes)
  const commisDOfficeCast = [
    { name: 'Olivier Lebailly', image: 'assets/img/long/malice-olivier-lebailly-640w.avif', bio: '' },
    { name: 'Émilie Coeurdevache', image: 'assets/img/long/malice-emilie-coeurdevache-640w.avif', bio: '' },
    { name: 'Céline Fabisch', image: 'assets/img/long/malice-celine-fabisch-640w.avif', bio: '' },
    { name: 'Bruno Cellan', image: 'assets/img/long/malice-bruno-cellan-640w.avif', bio: '' },
    { name: 'Aurélien Silvestre', image: 'assets/img/long/malice-aurelien-silvestre-640w.avif', bio: '' },
    { name: 'Anneke Bossis', image: 'assets/img/long/malice-anneke-bossis-640w.avif', bio: '' }
  ];

  // Braquage (vendredi, format long) — PNG / AVIF : voir scripts/image-assets.json (préfixes malice-*)
  const maliceBraquagePlayers = [
    { name: 'Camille Mortreux', role: 'Joueuse', image: 'assets/img/long/malice-camille-mortreux-640w.avif', bio: '' },
    { name: 'Antoine Brousseau', role: 'Joueur', image: 'assets/img/long/malice-antoine-brousseau-640w.avif', bio: '' },
    { name: 'Patrice Lamarque', role: 'Joueur', image: 'assets/img/long/malice-patrice-lamarque-640w.avif', bio: '' },
    { name: 'William Drouet', role: 'Joueur', image: 'assets/img/long/malice-william-drouet-640w.avif', bio: '' },
    { name: 'Véronique Duhart', role: 'Joueuse', image: 'assets/img/long/malice-veronique-duhart-640w.avif', bio: '' },
    { name: 'Angélique Arambel', role: 'Joueuse', image: 'assets/img/long/malice-angelique-arambel-640w.avif', bio: '' }
  ];

  // La Malice — match vs Belgique (équipe locale, après la Belgique dans le slider)
  const maliceVsBelgiquePlayers = [
    { name: 'Fermin Neme', role: 'MC', image: 'assets/img/long/malice-fermin-neme-640w.avif', bio: '' },
    { name: 'Nicolas Teboul', role: 'Arbitre', image: 'assets/img/long/malice-nicolas-teboul-640w.avif', bio: '' },
    { name: 'Sandrine Voiement', role: 'Arbitre\nassistante', image: 'assets/img/long/malice-sandrine-voiement-640w.avif', bio: '' },
    { name: 'Edouard Le Besnerais', role: 'Arbitre\nassistant', image: 'assets/img/long/malice-edouard-le-besnerais-640w.avif', bio: '' },
    { name: 'Anneke Bossis', role: 'Joueuse', image: 'assets/img/long/malice-anneke-bossis-640w.avif', bio: '' },
    { name: 'Rachid Falaki', role: 'Joueur', image: 'assets/img/long/malice-rachid-falaki-640w.avif', bio: '' },
    { name: 'Bruno Cellan', role: 'Joueur', image: 'assets/img/long/malice-bruno-cellan-640w.avif', bio: '' },
    { name: 'Eve Arlandis', role: 'Joueuse', image: 'assets/img/long/malice-eve-arlandis-640w.avif', bio: '' },
    { name: 'Maxime Cieutat', role: 'Joueur', image: 'assets/img/long/malice-maxime-cieutat-640w.avif', bio: '' }
  ];

  // Promo 2006 (dimanche, format long)
  const malicePromo2006Players = [
    { name: 'Sophie Le Bourhis', role: 'Joueuse', image: 'assets/img/long/malice-sophie-le-bourhis-640w.avif', bio: '' },
    { name: 'Hélène Morreel', role: 'Joueuse', image: 'assets/img/long/malice-helene-morreel-640w.avif', bio: '' },
    { name: 'Pierrick Deredin', role: 'Joueur', image: 'assets/img/long/malice-pierrick-deredin-640w.avif', bio: '' },
    { name: 'Nicolas Nasciet', role: 'Joueur', image: 'assets/img/long/malice-nicolas-nasciet-640w.avif', bio: '' },
    { name: 'Nicolas Teboul', role: 'Joueur', image: 'assets/img/long/malice-nicolas-teboul-640w.avif', bio: '' },
    { name: 'Viviane Herouard', role: 'Joueuse', image: 'assets/img/long/malice-viviane-herouard-640w.avif', bio: '' }
  ];

  // La Malice — match vs Suisse (équipe locale, après la Suisse dans le slider)
  const maliceVsSuissePlayers = [
    { name: 'Émilie Coeurdevache', role: 'MC', image: 'assets/img/long/malice-emilie-coeurdevache-640w.avif', bio: '' },
    { name: 'Bruno Cellan', role: 'Arbitre', image: 'assets/img/long/malice-bruno-cellan-640w.avif', bio: '' },
    { name: 'Aurélien Silvestre', role: 'Arbitre\nassistant', image: 'assets/img/long/malice-aurelien-silvestre-640w.avif', bio: '' },
    { name: 'Charlène Friconnet', role: 'Arbitre\nassistante', image: 'assets/img/long/malice-charlene-friconnet-640w.avif', bio: '' },
    { name: 'Ghislain Campistrau', role: 'Joueur', image: 'assets/img/long/malice-ghislain-campistrau-640w.avif', bio: '' },
    { name: 'Laura Soudre', role: 'Joueuse', image: 'assets/img/long/malice-laura-soudre-640w.avif', bio: '' },
    { name: 'Céline Fabisch', role: 'Joueuse', image: 'assets/img/long/malice-celine-fabisch-640w.avif', bio: '' },
    { name: 'Edouard Le Besnerais', role: 'Joueur', image: 'assets/img/long/malice-edouard-le-besnerais-640w.avif', bio: '' },
    { name: 'Fermin Neme', role: 'Joueur', image: 'assets/img/long/malice-fermin-neme-640w.avif', bio: '' }
  ];

  // Données des joueurs de l'Équipe de Belgique — portraits AVIF responsive (long/)
  const belgPlayers = [
    { name: 'Adrien De Goes', image: 'assets/img/long/belg-adrien-640w.avif', bio: '42 ans, dont 20 à improviser. L\'un des jouteurs les plus complets de sa génération : il construit les histoires, sublime celles des autres, transforme chaque scène en terrain de jeu. Humour tenace, imagination débordante, charisme fou. Bête de scène et partenaire en or ; avec lui, l\'impro est un voyage dont on ne revient pas pareil.' },
    { name: 'François Ghislain', image: 'assets/img/long/belg-francois-640w.avif', bio: 'Meneur au sourire facile et à l\'imagination turbo : lancer une impro, rattraper un partenaire en chute libre et écouter profondément, tout ça dans la même minute. Perfectionniste, à l\'écoute, chaleureux ; il fédère, fait briller les autres et transforme le grain de folie en moment magique. Avec lui ça part en vrille, toujours avec bienveillance, humour et l\'envie de partager.' },
    { name: 'Julie De Greef', image: 'assets/img/long/belg-julie-640w.avif', bio: 'Julie a l\'air tranquille, presque sage… puis sur scène, BOUM : énergie explosive. Créative discrète dans la vie, tornade sous les projecteurs, elle embarque tout le monde dans son univers sensible, drôle et parfois barré. Elle improvise avec ses tripes, son cœur et une belle dose de folie.' },
    { name: 'Marielle Chuffart', image: 'assets/img/long/belg-marielle-640w.avif', bio: 'Pile électrique au cœur XXL, humour délicieusement douteux. Énergique, elle plonge dans les personnages les plus improbables et transforme les catégories en terrain de jeu déjanté. Spontanéité contagieuse, générosité sur scène. Avec Marielle : énergie brute, vannes assumées et une présence chaleureuse qui embarque tout le monde.' },
    { name: 'Sophie Normand', image: 'assets/img/long/belg-sophie-normand-640w.avif', bio: 'Depuis plus de dix ans, Sophie navigue dans l\'impro comme une tour de contrôle : calme, précise, elle transforme le moindre détail en récit cohérent. Elle écoute, relie et équilibre pour faire décoller les histoires. Sous sa rigueur, une Sophie délicieusement déjantée : voix improbables, personnages barrés. Carrée et folle, toujours au service du jeu.' }
  ];

  // Données des joueurs de l'Équipe de Suisse — portraits AVIF responsive (long/)
  const suissePlayers = [
    { name: 'Loïc Vazquez', role: 'Joueur', image: 'assets/img/long/suisse-loic-640w.avif', bio: '' },
    { name: 'Romain Genolet', role: 'Joueur', image: 'assets/img/long/suisse-romain-640w.avif', bio: '' },
    { name: 'Virginie Van De Moortele', role: 'Joueuse', image: 'assets/img/long/suisse-virginie-640w.avif', bio: '' }
  ];

  // Révéler le header quand le hero sort du viewport
  const hero = document.getElementById('hero');
  const header = document.getElementById('siteHeader');
  const io = new IntersectionObserver(es=>es.forEach(e=> header.classList.toggle('show', !e.isIntersecting)), {threshold:0.01});
  io.observe(hero);

  // Doodles burst au chargement (centre du logo) puis fondu vers .avif — désactivé si prefers-reduced-motion
  const heroConfetti = document.querySelector('.hero-confetti');
  const doodlesTop = document.querySelector('.hero-doodles-top');
  const doodlesBottom = document.querySelector('.hero-doodles');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    if (doodlesTop) doodlesTop.classList.add('is-visible');
    if (doodlesBottom) doodlesBottom.classList.add('is-visible');
  } else if (heroConfetti) {
    const DOODLE_COLORS = ['#53B1E4', '#F9F9FE', '#D48C55', '#D95E5A'];
    const DOODLE_COUNT = 46;
    const ANIM_DURATION_MS = 3500;
    const FADE_DELAY_MS = 4500;

    function colorizeSvgText(svgText, color) {
      let s = svgText.replace(/<\?xml[^?]*\?>\s*/i, '').trim();
      s = s
        .replace(/#fff\b/gi, color)
        .replace(/#ffffff/gi, color)
        .replace(/\bwhite\b/gi, color)
        .replace(/fill:\s*#fff\b/gi, 'fill:' + color)
        .replace(/stroke:\s*#fff\b/gi, 'stroke:' + color)
        .replace(/fill="#fff"/gi, 'fill="' + color + '"')
        .replace(/stroke="#fff"/gi, 'stroke="' + color + '"');
      return s;
    }

    Promise.all(Array.from({ length: 27 }, (_, i) => {
      const n = String(i + 1).padStart(2, '0');
      return fetch('assets/img/doodles/' + n + '.svg').then(r => r.text());
    })).then(function (svgTexts) {
      const perZone = 23;
      const half = perZone;
      const isNarrow = window.innerWidth < 768;
      const TARGET_ROWS = 3;
      const MIN_SLOT_SIZE = isNarrow ? 28 : 36;
      const GATHER_SCALE = 1;
      const FINAL_SCALE = 0.78;
      const SETTLE_DURATION_MS = 500;
      const JITTER = isNarrow ? 6 : 10;
      const BAND_HEIGHT_FACTOR = 0.78;
      const NUDGE_LEFT_PX = 24;
      const burstRect = heroConfetti.getBoundingClientRect();
      const burstCenterX = burstRect.left + burstRect.width / 2;
      const burstCenterY = burstRect.top + burstRect.height / 2;
      const videoRef = document.querySelector('.hero-video-container') || document.querySelector('.hero-logo-wrapper');
      const videoRect = videoRef ? videoRef.getBoundingClientRect() : null;
      const refWidth = videoRect ? videoRect.width : 0;
      const topRectRaw = doodlesTop ? doodlesTop.getBoundingClientRect() : null;
      const bottomRectRaw = doodlesBottom ? doodlesBottom.getBoundingClientRect() : null;
      const topCenterX = topRectRaw ? topRectRaw.left + topRectRaw.width / 2 : burstCenterX;
      const topRect = topRectRaw && refWidth > 0
        ? { left: topCenterX - refWidth / 2 - NUDGE_LEFT_PX, top: topRectRaw.top, width: refWidth, height: topRectRaw.height }
        : topRectRaw;
      const bottomRect = bottomRectRaw && refWidth > 0
        ? { left: burstCenterX - refWidth / 2 - NUDGE_LEFT_PX, top: bottomRectRaw.top, width: refWidth, height: bottomRectRaw.height }
        : bottomRectRaw;

      function buildSlots(rect, n, scale, jitterArr) {
        if (!rect || rect.width <= 0 || rect.height <= 0) return null;
        scale = scale == null ? 1 : scale;
        const w = rect.width * scale;
        const h = rect.height * scale;
        const left = rect.left + (rect.width - w) / 2;
        const top = rect.top + (rect.height - h) / 2;
        const colsUsed = Math.ceil(n / TARGET_ROWS);
        const stepX = Math.max(MIN_SLOT_SIZE, w / colsUsed);
        const gridH = h * BAND_HEIGHT_FACTOR;
        const stepY = gridH / TARGET_ROWS;
        const startX = left + stepX / 2;
        const startY = top + (h - gridH) / 2 + stepY / 2;
        const slots = [];
        for (let i = 0; i < n; i++) {
          const row = Math.floor(i / colsUsed);
          const col = i % colsUsed;
          let x = startX + col * stepX - burstCenterX;
          let y = startY + row * stepY - burstCenterY;
          if (jitterArr && jitterArr[i]) {
            x += jitterArr[i].dx;
            y += jitterArr[i].dy;
          }
          slots.push({ x: x, y: y });
        }
        return slots;
      }

      function getNeighborSlotIndices(k, n, colsUsed) {
        const row = Math.floor(k / colsUsed);
        const col = k % colsUsed;
        const out = [];
        if (col > 0) out.push(k - 1);
        if (col < colsUsed - 1 && k + 1 < n) out.push(k + 1);
        if (row > 0) out.push(k - colsUsed);
        if (row < Math.floor((n - 1) / colsUsed) && k + colsUsed < n) out.push(k + colsUsed);
        return out;
      }

      function assignSvgIndicesNoAdjacent(n, colsUsed) {
        const arr = new Array(n);
        for (let k = 0; k < n; k++) {
          const neighbors = getNeighborSlotIndices(k, n, colsUsed);
          const used = new Set(neighbors.map(function (j) { return arr[j]; }).filter(function (v) { return v !== undefined; }));
          let pick;
          do { pick = Math.floor(Math.random() * 27); } while (used.has(pick));
          arr[k] = pick;
        }
        return arr;
      }

      function shuffledIndices(n) {
        const a = Array.from({ length: n }, (_, i) => i);
        for (let k = a.length - 1; k > 0; k--) {
          const j = Math.floor(Math.random() * (k + 1));
          const t = a[k]; a[k] = a[j]; a[j] = t;
        }
        return a;
      }

      function makeJitter(n) {
        return Array.from({ length: n }, () => ({
          dx: (Math.random() * 2 - 1) * JITTER,
          dy: (Math.random() * 2 - 1) * JITTER
        }));
      }

      const topJitter = makeJitter(perZone);
      const bottomJitter = makeJitter(perZone);
      const topGather = buildSlots(topRect, perZone, GATHER_SCALE, topJitter) || Array.from({ length: perZone }, (_, i) => ({ x: (Math.random() * 2 - 1) * 320, y: -(140 + (i / perZone) * 120) }));
      const topFinal = buildSlots(topRect, perZone, FINAL_SCALE, topJitter) || topGather;
      const bottomGather = buildSlots(bottomRect, perZone, GATHER_SCALE, bottomJitter) || Array.from({ length: perZone }, (_, i) => ({ x: (Math.random() * 2 - 1) * 320, y: 140 + (i / perZone) * 120 }));
      const bottomFinal = buildSlots(bottomRect, perZone, FINAL_SCALE, bottomJitter) || bottomGather;
      const topShuffled = shuffledIndices(perZone);
      const bottomShuffled = shuffledIndices(perZone);
      const colsUsed = Math.ceil(perZone / TARGET_ROWS);
      const topSvgIndices = assignSvgIndicesNoAdjacent(perZone, colsUsed);
      const bottomSvgIndices = assignSvgIndicesNoAdjacent(perZone, colsUsed);

      let ended = 0;
      for (let i = 0; i < DOODLE_COUNT; i++) {
        const goTop = i < half;
        const idx = goTop ? i : i - half;
        const shuffled = goTop ? topShuffled : bottomShuffled;
        const slotIdx = shuffled[idx];
        const svgIndex = goTop ? topSvgIndices[slotIdx] : bottomSvgIndices[slotIdx];
        const color = DOODLE_COLORS[Math.floor(Math.random() * DOODLE_COLORS.length)];
        const coloredSvg = colorizeSvgText(svgTexts[svgIndex], color);

        const angleRad = Math.random() * Math.PI * 2;
        const burstRadius = isNarrow ? (100 + Math.random() * 140) : (220 + Math.random() * 280);
        const burstX = Math.round(Math.cos(angleRad) * burstRadius);
        const burstY = Math.round(Math.sin(angleRad) * burstRadius);
        const gather = goTop ? topGather[slotIdx] : bottomGather[slotIdx];
        const finalSlot = goTop ? topFinal[slotIdx] : bottomFinal[slotIdx];
        const endX = Math.round(gather.x);
        const endY = Math.round(gather.y);
        const finalX = Math.round(finalSlot.x);
        const finalY = Math.round(finalSlot.y);

        const delay = (Math.random() * 200) / 1000;
        const rotation = Math.round((Math.random() * 2 - 1) * 180);

        const wrap = document.createElement('div');
        wrap.className = 'hero-doodle-svg';
        wrap.style.setProperty('--burst-x', burstX + 'px');
        wrap.style.setProperty('--burst-y', burstY + 'px');
        wrap.style.setProperty('--end-x', endX + 'px');
        wrap.style.setProperty('--end-y', endY + 'px');
        wrap.style.setProperty('--final-x', finalX + 'px');
        wrap.style.setProperty('--final-y', finalY + 'px');
        wrap.style.setProperty('--final-scale', String(FINAL_SCALE));
        wrap.style.setProperty('--doodle-rotation', rotation + 'deg');
        wrap.style.setProperty('--doodle-delay', delay + 's');
        const size = isNarrow ? (32 + Math.floor(Math.random() * 16)) : (64 + Math.floor(Math.random() * 32));
        wrap.style.setProperty('--doodle-size', size + 'px');
        wrap.innerHTML = coloredSvg;
        heroConfetti.appendChild(wrap);

        wrap.addEventListener('animationend', function onEnd() {
          wrap.removeEventListener('animationend', onEnd);
          ended++;
          if (ended >= DOODLE_COUNT) {
            const doodles = heroConfetti.querySelectorAll('.hero-doodle-svg');
            doodles.forEach(function (d) { d.classList.add('settle-final'); });
          }
        });
      }
      setTimeout(function () {
        const doodles = heroConfetti.querySelectorAll('.hero-doodle-svg');
        if (doodles.length && !doodles[0].classList.contains('settle-final')) {
          doodles.forEach(function (d) { d.classList.add('settle-final'); });
        }
      }, FADE_DELAY_MS);
    }).catch(function () {
      if (heroConfetti.parentNode) heroConfetti.remove();
      if (doodlesTop) doodlesTop.classList.add('is-visible');
      if (doodlesBottom) doodlesBottom.classList.add('is-visible');
    });
  }

  // Doodles flottants (scroll + fullscreen programme) — logique partagée, désactivé si prefers-reduced-motion
  let spawnFloatingDoodleIn = null;
  if (!reduceMotion) {
    const FLOAT_DOODLE_COLORS = ['#53B1E4', '#F9F9FE', '#D48C55', '#D95E5A'];
    function colorizeSvgTextFloat(svgText, color) {
      let s = svgText.replace(/<\?xml[^?]*\?>\s*/i, '').trim();
      s = s
        .replace(/#fff\b/gi, color)
        .replace(/#ffffff/gi, color)
        .replace(/\bwhite\b/gi, color)
        .replace(/fill:\s*#fff\b/gi, 'fill:' + color)
        .replace(/stroke:\s*#fff\b/gi, 'stroke:' + color)
        .replace(/fill="#fff"/gi, 'fill="' + color + '"')
        .replace(/stroke="#fff"/gi, 'stroke="' + color + '"');
      return s;
    }
    let floatSvgTextsCache = null;
    function loadFloatSvgTexts() {
      if (floatSvgTextsCache) return Promise.resolve(floatSvgTextsCache);
      return Promise.all(Array.from({ length: 27 }, (_, i) => {
        const n = String(i + 1).padStart(2, '0');
        return fetch('assets/img/doodles/' + n + '.svg').then(function (r) { return r.text(); });
      })).then(function (texts) {
        floatSvgTextsCache = texts;
        return texts;
      });
    }
    const FLOAT_SIZE_MIN = 48;
    const FLOAT_SIZE_MAX = 78;
    const FLOAT_VELOCITY = 0.15;
    const FLOAT_GRAVITY = 0.012;
    const FLOAT_ROTATION_SPEED = 0.08;
    const FLOAT_JITTER = 0.04;

    spawnFloatingDoodleIn = function (container, state, options) {
      if (!container || state.active) return;
      state.autoSmashTimeoutId = state.autoSmashTimeoutId || null;
      loadFloatSvgTexts().then(function (svgTexts) {
        if (state.active) return;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const margin = 60;
        const size = FLOAT_SIZE_MIN + Math.floor(Math.random() * (FLOAT_SIZE_MAX - FLOAT_SIZE_MIN + 1));
        const half = size / 2;
        let x, y;
        const edge = Math.floor(Math.random() * 4);
        if (edge === 0) {
          x = margin + Math.random() * (W - 2 * margin);
          y = -half - 10;
        } else if (edge === 1) {
          x = W + half + 10;
          y = margin + Math.random() * (H - 2 * margin);
        } else if (edge === 2) {
          x = margin + Math.random() * (W - 2 * margin);
          y = H + half + 10;
        } else {
          x = -half - 10;
          y = margin + Math.random() * (H - 2 * margin);
        }
        let vx = (Math.random() * 2 - 1) * FLOAT_VELOCITY;
        let vy = (Math.random() * 2 - 1) * FLOAT_VELOCITY * 0.5;
        let rotation = (Math.random() * 2 - 1) * 180;
        const svgIndex = Math.floor(Math.random() * 27);
        const color = FLOAT_DOODLE_COLORS[Math.floor(Math.random() * FLOAT_DOODLE_COLORS.length)];
        const coloredSvg = colorizeSvgTextFloat(svgTexts[svgIndex], color);

        const wrap = document.createElement('div');
        wrap.className = 'floating-doodle';
        wrap.style.width = size + 'px';
        wrap.style.height = size + 'px';
        wrap.style.left = (x - half) + 'px';
        wrap.style.top = (y - half) + 'px';
        wrap.style.transform = 'rotate(' + rotation + 'deg)';
        const inner = document.createElement('div');
        inner.className = 'floating-doodle-inner';
        inner.innerHTML = coloredSvg;
        wrap.appendChild(inner);
        container.appendChild(wrap);
        state.active = wrap;

        let rafId = null;

        function doSmash() {
          if (!wrap.parentNode) return;
          if (state.autoSmashTimeoutId) {
            clearTimeout(state.autoSmashTimeoutId);
            state.autoSmashTimeoutId = null;
          }
          cancelAnimationFrame(rafId);
          wrap.style.setProperty('--floating-doodle-transform', 'rotate(' + rotation + 'deg)');
          wrap.classList.add('floating-doodle-squashed');
          wrap.addEventListener('animationend', function onEnd() {
            wrap.removeEventListener('animationend', onEnd);
            if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
            if (state.active === wrap) state.active = null;
          }, { once: true });
        }

        wrap.addEventListener('click', function (e) {
          e.stopPropagation();
          e.preventDefault();
          showMalixDoodlePopin();
          if (window.posthog) window.posthog.capture('floating_doodle_click');
          doSmash();
        }, { passive: false });

        if (options.autoSmashMs) {
          state.autoSmashTimeoutId = setTimeout(doSmash, options.autoSmashMs);
        }

        let currentX = x;
        let currentY = y;

        function tick() {
          if (!wrap.parentNode) return;
          vx += (Math.random() * 2 - 1) * FLOAT_JITTER;
          vy += FLOAT_GRAVITY;
          vy += (Math.random() * 2 - 1) * FLOAT_JITTER;
          currentX += vx;
          currentY += vy;
          rotation += (Math.random() * 2 - 1) * FLOAT_ROTATION_SPEED;
          if (currentX < half) { currentX = half; vx = Math.abs(vx) * 0.85; }
          if (currentX > W - half) { currentX = W - half; vx = -Math.abs(vx) * 0.85; }
          if (currentY < half) { currentY = half; vy = Math.abs(vy) * 0.85; }
          if (currentY > H - half) { currentY = H - half; vy = -Math.abs(vy) * 0.85; }
          wrap.style.left = (currentX - half) + 'px';
          wrap.style.top = (currentY - half) + 'px';
          wrap.style.transform = 'rotate(' + rotation + 'deg)';
          wrap.style.setProperty('--floating-doodle-transform', 'rotate(' + rotation + 'deg)');
          rafId = requestAnimationFrame(tick);
        }
        rafId = requestAnimationFrame(tick);
      }).catch(function () {});
    };
  }

  // Doodles flottants au scroll (cosmonaute + smash au clic)
  const floatingDoodlesContainer = document.getElementById('floating-doodles');
  if (!reduceMotion && floatingDoodlesContainer) {
    const scrollDoodleState = { active: null, autoSmashTimeoutId: null };
    let lastScrollY = window.scrollY || 0;
    let scrollAccum = 0;
    let lastSpawnTime = 0;
    const FLOAT_COOLDOWN_MS = 22000;
    const FLOAT_SCROLL_THRESHOLD = 350;
    const FLOAT_SPAWN_PROB = 0.11;

    window.addEventListener('scroll', function () {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= lastScrollY) {
        lastScrollY = currentScrollY;
        return;
      }
      scrollAccum += currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      if (scrollDoodleState.active) return;
      if (Date.now() - lastSpawnTime < FLOAT_COOLDOWN_MS) return;
      if (scrollAccum < FLOAT_SCROLL_THRESHOLD) return;
      if (Math.random() > FLOAT_SPAWN_PROB) return;
      scrollAccum = 0;
      lastSpawnTime = Date.now();
      spawnFloatingDoodleIn(floatingDoodlesContainer, scrollDoodleState, {});
    }, { passive: true });
  }

  // Countdown timer
  const countdownDays = document.getElementById('countdown-days');
  const countdownHours = document.getElementById('countdown-hours');
  const countdownMinutes = document.getElementById('countdown-minutes');
  const countdownSeconds = document.getElementById('countdown-seconds');
  
  // Date cible: 15 mai 2026 à 10:30 (lancement du festival)
  const targetDate = new Date('2026-05-15T10:30:00').getTime();
  
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
      // Le festival a commencé ou est terminé
      countdownDays.textContent = '00';
      countdownHours.textContent = '00';
      countdownMinutes.textContent = '00';
      countdownSeconds.textContent = '00';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    countdownDays.textContent = String(days).padStart(2, '0');
    countdownHours.textContent = String(hours).padStart(2, '0');
    countdownMinutes.textContent = String(minutes).padStart(2, '0');
    countdownSeconds.textContent = String(seconds).padStart(2, '0');
  }
  
  // Mettre à jour immédiatement puis toutes les secondes
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Vidéo hero : youtube | self | scheduled (calendrier + choix reveal YT ou self-hosted)
  const heroVideoContainer = document.getElementById('heroVideoContainer');
  const heroVideo = document.getElementById('heroVideo');
  const heroVideoPlayOverlay = document.getElementById('heroVideoPlayOverlay');

  if (heroVideoContainer && heroVideo && heroVideoPlayOverlay) {
    const heroVideoMode = (heroVideoContainer.dataset.heroVideo || 'self').toLowerCase();
    const heroYoutubeId = heroVideoContainer.dataset.heroYoutubeId;
    const posterUrl = heroVideo.getAttribute('poster') || 'assets/img/hero-video-poster-336w.avif';
    const isYoutubeMode = heroVideoMode === 'youtube' && heroYoutubeId;

    function hidePlayOverlay() {
      heroVideoPlayOverlay.classList.add('hidden');
    }

    function showPlayOverlay() {
      heroVideoPlayOverlay.classList.remove('hidden');
    }

    function resolveEffectiveYoutubeId(done) {
      const params = new URLSearchParams(window.location.search);
      const slotParam = params.get('hero-video-slot');
      const simulateParam = params.get('hero-video-simulate');
      const scheduleUrl = new URL('assets/data/hero-video-schedule.json', document.documentElement.baseURI || window.location.href).href;
      fetch(scheduleUrl)
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
          let effectiveYoutubeId = heroYoutubeId;
          if (data && Array.isArray(data.slots) && data.slots.length > 0) {
            if (slotParam !== null && slotParam !== '') {
              const idx = parseInt(slotParam, 10);
              if (!isNaN(idx) && idx >= 0 && idx < data.slots.length) {
                effectiveYoutubeId = data.slots[idx].youtubeId;
              } else {
                effectiveYoutubeId = data.fallbackYoutubeId || heroYoutubeId;
              }
            } else {
              let now;
              if (simulateParam) {
                now = new Date(simulateParam);
                if (isNaN(now.getTime())) now = new Date();
              } else {
                now = new Date();
              }
              let lastActive = null;
              for (let i = 0; i < data.slots.length; i++) {
                const slotTime = new Date(data.slots[i].publishAt);
                if (slotTime.getTime() <= now.getTime()) lastActive = data.slots[i];
              }
              if (lastActive) effectiveYoutubeId = lastActive.youtubeId;
              else effectiveYoutubeId = data.fallbackYoutubeId || heroYoutubeId;
            }
          }
          done(effectiveYoutubeId);
        })
        .catch(function () { done(heroYoutubeId); });
    }

    function initYoutubeMode(effectiveYoutubeId) {
      heroVideo.classList.add('hidden');
      heroVideoContainer.style.backgroundImage = 'url(' + posterUrl + ')';
      heroVideoContainer.style.backgroundSize = 'contain';
      heroVideoContainer.style.backgroundPosition = 'center';

      let youtubePlayer = null;
      let youtubePlayerDiv = null;

      function restorePoster() {
        heroVideoContainer.style.backgroundImage = 'url(' + posterUrl + ')';
        heroVideoContainer.style.backgroundSize = 'contain';
        heroVideoContainer.style.backgroundPosition = 'center';
        showPlayOverlay();
      }

      function onPlayerStateChange(event) {
        if (event.data === 0) {
          if (youtubePlayer && typeof youtubePlayer.destroy === 'function') youtubePlayer.destroy();
          if (youtubePlayerDiv && youtubePlayerDiv.parentNode) youtubePlayerDiv.remove();
          youtubePlayer = null;
          youtubePlayerDiv = null;
          restorePoster();
        }
      }

      function createYoutubePlayer() {
        youtubePlayerDiv = document.createElement('div');
        youtubePlayerDiv.id = 'hero-youtube-player';
        youtubePlayerDiv.style.position = 'absolute';
        youtubePlayerDiv.style.inset = '0';
        youtubePlayerDiv.style.width = '100%';
        youtubePlayerDiv.style.height = '100%';
        heroVideoContainer.style.backgroundImage = '';
        heroVideoContainer.insertBefore(youtubePlayerDiv, heroVideoContainer.firstChild);
        youtubePlayer = new window.YT.Player('hero-youtube-player', {
          videoId: effectiveYoutubeId,
          playerVars: { autoplay: 1, rel: 0 },
          events: {
            onReady: function (event) { event.target.playVideo(); },
            onStateChange: onPlayerStateChange
          }
        });
        hidePlayOverlay();
      }

      heroVideoPlayOverlay.addEventListener('click', function () {
        if (window.posthog) window.posthog.capture('hero_video_play', { source: 'youtube' });
        if (window.YT && window.YT.Player) {
          createYoutubePlayer();
        } else {
          window.onYouTubeIframeAPIReady = function () {
            window.onYouTubeIframeAPIReady = null;
            createYoutubePlayer();
          };
          const tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
          document.head.appendChild(tag);
        }
      });
    }

    function initSelfHostedMode() {
      heroVideo.classList.add('hidden');
      heroVideoContainer.style.backgroundImage = 'url(' + posterUrl + ')';
      heroVideoContainer.style.backgroundSize = 'contain';
      heroVideoContainer.style.backgroundPosition = 'center';

      function restorePoster() {
        heroVideoContainer.style.backgroundImage = 'url(' + posterUrl + ')';
        heroVideoContainer.style.backgroundSize = 'contain';
        heroVideoContainer.style.backgroundPosition = 'center';
        heroVideo.classList.add('hidden');
        heroVideoContainer.classList.remove('hero-video-playing');
        showPlayOverlay();
      }

      function startVideo() {
        if (window.posthog) window.posthog.capture('hero_video_play', { source: 'self' });
        heroVideoContainer.style.backgroundImage = '';
        heroVideoContainer.classList.add('hero-video-playing');
        heroVideo.classList.remove('hidden');
        heroVideo.muted = true;
        const hasSrc = heroVideo.src || heroVideo.currentSrc;
        if (hasSrc) {
          heroVideo.play().catch(function () {});
          hidePlayOverlay();
          return;
        }
        if (heroVideo.dataset.src) {
          heroVideo.src = heroVideo.dataset.src;
        }
        heroVideo.load();
        heroVideo.addEventListener('loadeddata', function onLoaded() {
          heroVideo.removeEventListener('loadeddata', onLoaded);
          heroVideo.play().catch(function () {});
          hidePlayOverlay();
        }, { once: true });
      }

      heroVideoPlayOverlay.addEventListener('click', startVideo);

      heroVideo.addEventListener('ended', function () {
        heroVideo.currentTime = 0;
        restorePoster();
      });
    }

    if (isYoutubeMode) {
      resolveEffectiveYoutubeId(initYoutubeMode);
    } else if (heroVideoMode === 'scheduled' && heroYoutubeId) {
      const params = new URLSearchParams(window.location.search);
      const simulateParam = params.get('hero-video-simulate');
      const scheduleUrl = new URL('assets/data/hero-video-schedule.json', document.documentElement.baseURI || window.location.href).href;
      fetch(scheduleUrl)
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
          const officialSource = (heroVideoContainer.dataset.heroOfficialSource || 'youtube').toLowerCase();
          let now;
          if (simulateParam) {
            now = new Date(simulateParam);
            if (isNaN(now.getTime())) now = new Date();
          } else {
            now = new Date();
          }
          if (!data || !Array.isArray(data.slots) || data.slots.length === 0) {
            if (officialSource === 'self') initSelfHostedMode();
            else initYoutubeMode(heroYoutubeId);
            return;
          }
          const lastSlot = data.slots[data.slots.length - 1];
          const officialTime = new Date(lastSlot.publishAt);
          const officialYoutubeId = lastSlot.youtubeId;
          if (now.getTime() < officialTime.getTime()) {
            resolveEffectiveYoutubeId(initYoutubeMode);
          } else {
            if (officialSource === 'self') initSelfHostedMode();
            else initYoutubeMode(officialYoutubeId);
          }
        })
        .catch(function () {
          const officialSource = (heroVideoContainer.dataset.heroOfficialSource || 'youtube').toLowerCase();
          if (officialSource === 'self') initSelfHostedMode();
          else initYoutubeMode(heroYoutubeId);
        });
    } else {
      initSelfHostedMode();
    }

    // Lancer la vidéo au premier scroll si elle n’est pas encore lancée
    window.addEventListener('scroll', () => {
      if (!heroVideoPlayOverlay.classList.contains('hidden')) {
        heroVideoPlayOverlay.click();
      }
    }, { once: true, passive: true });
  }

  // Burger / drawer mobile
  const burger=document.getElementById('burger'), drawer=document.getElementById('drawer'), drawerClose=document.getElementById('drawerClose');
  burger.addEventListener('click',()=>drawer.classList.toggle('open'));
  if(drawerClose) drawerClose.addEventListener('click',()=>drawer.classList.remove('open'));
  drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>drawer.classList.remove('open')));

  // Load Sibforms CSS on first modal open (deferred from head for PageSpeed)
  function ensureSibStylesLoaded() {
    if (document.querySelector('link[href*="sib-styles.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://sibforms.com/forms/end-form/build/sib-styles.css';
    document.head.appendChild(link);
  }

  // Load Sibforms main.js on first modal open (deferred for PageSpeed)
  function ensureSibScriptLoaded() {
    const url = 'https://sibforms.com/forms/end-form/build/main.js';
    const existing = document.querySelector('script[src*="sibforms.com/forms/end-form/build/main.js"]');
    if (existing) return Promise.resolve();
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.body.appendChild(script);
    });
  }

  // Modal waitlist open/close
  const dlgWaitlist = document.getElementById('waitlist');
  document.querySelectorAll('[data-open="waitlist"]').forEach(b => b.addEventListener('click', () => {
    ensureSibStylesLoaded();
    ensureSibScriptLoaded().then(() => {
    dlgWaitlist.showModal();
    if (window.posthog) window.posthog.capture('modal_open', { modal: 'waitlist' });
  });
  }));
  dlgWaitlist.addEventListener('click', e => {
    const r = dlgWaitlist.querySelector('.modal-card').getBoundingClientRect();
    const inside = r.top <= e.clientY && e.clientY <= r.bottom && r.left <= e.clientX && e.clientX <= r.right;
    if (!inside) dlgWaitlist.close();
  });

  // Liens billetterie : URL centralisée, ouverture nouvel onglet
  document.querySelectorAll('.link-billetterie').forEach(a => {
    a.href = BILETTERIE_URL;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.addEventListener('click', function () {
      if (window.posthog) {
        var ctaName = a.classList.contains('btn-inscription') ? 'inscription_stage' : 'billetterie';
        var section = (a.closest('section') && a.closest('section').id) || (a.closest('[id]') && a.closest('[id]').id) || 'unknown';
        var ctaPayload = { cta_name: ctaName, section: section };
        var priceEl = a.closest('.price');
        if (priceEl && priceEl.id) {
          ctaPayload.pass_id = priceEl.id;
        }
        if (a.classList.contains('btn-inscription')) {
          var card = a.closest('.atelier-card');
          if (card && card.id) {
            var stageTitleEl = card.querySelector('h3');
            var intervenantEl = card.querySelector('.instructor-name, .instructor-name-small');
            ctaPayload.stage_id = card.id;
            window.posthog.capture('stage_inscription_click', {
              stage_id: card.id,
              intervenant: intervenantEl ? intervenantEl.textContent.trim() : '',
              stage_titre: stageTitleEl ? stageTitleEl.textContent.trim() : ''
            });
          }
        }
        window.posthog.capture('cta_click', ctaPayload);
      }
    });
  });

  // Brevo gère automatiquement le masquage du formulaire avec AUTOHIDE = Boolean(1)
  // Le bouton "Fermer" dans le message de succès permet de fermer la popup explicitement

  // PostHog : soumission formulaire Sibforms (modal waitlist uniquement ; formulaire « Tenez-moi au courant » retiré, voir docs/ISSUES.md)
  var sibFormWaitlist = document.getElementById('sib-form-waitlist');
  if (sibFormWaitlist) sibFormWaitlist.addEventListener('submit', function () { if (window.posthog) window.posthog.capture('form_submit', { form: 'waitlist' }); });

  // PostHog : succès affiché après soumission Sibforms (MutationObserver sur les panneaux succès)
  function observeSibSuccessPanel(panelId, formName) {
    var el = document.getElementById(panelId);
    if (!el || !window.posthog) return;
    var sent = false;
    function checkVisible() {
      if (sent) return;
      var style = window.getComputedStyle(el);
      if (style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null) {
        sent = true;
        window.posthog.capture('form_submit_success', { form: formName });
        observer.disconnect();
      }
    }
    var observer = new MutationObserver(function () { checkVisible(); });
    observer.observe(el, { attributes: true, attributeFilter: ['class', 'style'] });
    var parent = el.parentElement;
    if (parent) observer.observe(parent, { attributes: true, attributeFilter: ['class', 'style'] });
  }
  observeSibSuccessPanel('success-message-waitlist', 'waitlist');

  // PostHog : FAQ (ouverture d'une question)
  var faqEl = document.getElementById('faq');
  if (faqEl) {
    faqEl.addEventListener('toggle', function (e) {
      if (!e.target.open || e.target.tagName !== 'DETAILS') return;
      var details = e.target;
      var summary = details.querySelector('summary');
      var question = summary ? (summary.textContent || '').trim().slice(0, 200) : '';
      var detailsList = faqEl.querySelectorAll('.faq-list details');
      var questionIndex = -1;
      for (var i = 0; i < detailsList.length; i++) { if (detailsList[i] === details) { questionIndex = i; break; } }
      var questionId = questionIndex >= 0 ? 'faq-' + questionIndex : '';
      if (window.posthog) window.posthog.capture('faq_question_open', { question: question, question_id: questionId, section: 'faq' });
    }, true);
  }

  // PostHog : brochure partenaire (téléchargement PDF) — source = 'button' (lien texte) ou 'logo' (Votre logo ici)
  document.querySelectorAll('a[href*="plaquette-sponsoring"][download]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.posthog) window.posthog.capture('brochure_download', { source: a.classList.contains('sponsor-placeholder') ? 'logo' : 'button' });
    });
  });

  // PostHog : clic sur logo partenaire (section sponsors)
  document.querySelectorAll('#sponsors a.sponsor-link').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.posthog) {
        window.posthog.capture('partner_logo_click', {
          partner: a.getAttribute('data-partner') || '',
          url: a.getAttribute('href') || ''
        });
      }
    });
  });

  // PostHog : navigation (header, drawer, footer)
  document.querySelectorAll('header .primary a').forEach(function (a) {
    a.addEventListener('click', function () { if (window.posthog) window.posthog.capture('nav_click', { target: a.getAttribute('href') || '', source: 'header' }); });
  });
  document.querySelectorAll('#drawer a').forEach(function (a) {
    a.addEventListener('click', function () { if (window.posthog) window.posthog.capture('nav_click', { target: a.getAttribute('href') || '', source: 'drawer' }); });
  });
  document.querySelectorAll('footer a').forEach(function (a) {
    a.addEventListener('click', function () { if (window.posthog) window.posthog.capture('nav_click', { target: a.getAttribute('href') || '', source: 'footer' }); });
  });
  // PostHog : navigation depuis le programme (liens ateliers + boutons spectacle)
  document.querySelectorAll('#programme a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () { if (window.posthog) window.posthog.capture('nav_click', { target: a.getAttribute('href') || '', source: 'programme' }); });
  });

  // PostHog : clic spécifique sur le lien Chasse aux Malix (footer)
  document.querySelectorAll('footer a[href*="/malix/"]').forEach(function (a) {
    a.addEventListener('click', function () { if (window.posthog) window.posthog.capture('malix_link_click', { source: 'footer' }); });
  });

  // Slider jour par jour — setCurrentDay permet à Programme et Stages de synchroniser le slider
  let setCurrentDay = function() {};
  const daySliderContainer = document.getElementById('daySlider');
  if (daySliderContainer) {
    const daySlides = daySliderContainer.querySelectorAll('.day-slide');
    const daySlider = daySliderContainer.closest('.day-slider');
    const dayDots = daySlider?.querySelectorAll('.carousel-dot');
    const dayTabs = daySlider?.querySelectorAll('.day-tab');
    let currentDaySlide = 0;
    setCurrentDay = function(dayIndex) {
      currentDaySlide = dayIndex;
      updateDaySlider();
    };
    
    function updateDaySlider(){
      daySliderContainer.style.transform = `translateX(-${currentDaySlide * 33.333333}%)`;
      // Mettre à jour les dots
      if (dayDots) {
        dayDots.forEach((dot,index)=>{
          dot.classList.toggle('active', index === currentDaySlide);
        });
      }
      // Mettre à jour les tabs
      if (dayTabs) {
        dayTabs.forEach((tab,index)=>{
          tab.classList.toggle('active', index === currentDaySlide);
        });
      }
      // Synchroniser avec le programme
      updateProgramDayHighlight(currentDaySlide);
    }
    
    function nextDaySlide(){
      currentDaySlide = (currentDaySlide + 1) % daySlides.length;
      updateDaySlider();
    }
    
    function prevDaySlide(){
      currentDaySlide = (currentDaySlide - 1 + daySlides.length) % daySlides.length;
      updateDaySlider();
    }
    
    // Délégation d'événements pour les chevrons dans chaque slide
    daySliderContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('carousel-arrow')) {
        if (e.target.classList.contains('next')) {
          nextDaySlide();
        } else if (e.target.classList.contains('prev')) {
          prevDaySlide();
        }
      }
    });
    
    // Gestion des clics sur les dots
    if (dayDots) {
      dayDots.forEach((dot,index)=>{
        dot.addEventListener('click',()=>{
          currentDaySlide = index;
          updateDaySlider();
        });
      });
    }
    
    // Gestion des clics sur les tabs
    if (dayTabs) {
      dayTabs.forEach((tab,index)=>{
        tab.addEventListener('click',()=>{
          currentDaySlide = index;
          updateDaySlider();
          if (window.posthog) {
            var sectionId = (daySliderContainer.closest('section') && daySliderContainer.closest('section').id) || 'valeur';
            var sectionName = sectionId === 'valeur' ? 'Spectacles' : (sectionId === 'stages' ? 'Stages' : 'Programme');
            window.posthog.capture('day_switch', { section: sectionId, section_name: sectionName, day_index: index, day_name: DAY_SWITCH_DAY_NAMES[index] || '' });
          }
        });
      });
    }
    
    // Détection du swipe pour mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwiping = false;
    const swipeThreshold = 50; // Distance minimale en pixels pour déclencher un swipe
    
    if (daySlider) {
      daySlider.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        isSwiping = false;
      }, { passive: true });
      
      daySlider.addEventListener('touchmove', (e) => {
        if (!touchStartX) return;
        
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);
        
        // Si le mouvement est principalement horizontal, on considère que c'est un swipe
        if (deltaX > deltaY && deltaX > 10) {
          isSwiping = true;
          // Empêcher le scroll vertical pendant un swipe horizontal
          e.preventDefault();
        }
      }, { passive: false });
      
      daySlider.addEventListener('touchend', (e) => {
        if (!touchStartX || !isSwiping) {
          touchStartX = 0;
          touchStartY = 0;
          return;
        }
        
        const touch = e.changedTouches[0];
        touchEndX = touch.clientX;
        touchEndY = touch.clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        // Vérifier que c'est un swipe horizontal valide
        if (absDeltaX > swipeThreshold && absDeltaX > absDeltaY) {
          if (deltaX > 0) {
            // Swipe vers la droite = slide précédent
            prevDaySlide();
          } else {
            // Swipe vers la gauche = slide suivant
            nextDaySlide();
          }
        }
        
        // Réinitialiser
        touchStartX = 0;
        touchStartY = 0;
        touchEndX = 0;
        touchEndY = 0;
        isSwiping = false;
      }, { passive: true });
    }
    
    // Auto-play optionnel (désactivé par défaut)
    // setInterval(nextDaySlide, 5000);
    
    // Initialiser avec le premier jour (vendredi) pour synchroniser le programme
    updateDaySlider();
  }

  // Fonction pour mettre en avant le jour sélectionné dans le programme (et stages)
  function updateProgramDayHighlight(dayIndex) {
    const programDayCards = document.querySelectorAll('.program .day.card');
    const programmeDayTabs = document.querySelectorAll('#programmeDayTabs .day-tab');
    const stagesDayTabs = document.querySelectorAll('#stagesDayTabs .day-tab');

    // Mettre à jour les cartes du programme
    programDayCards.forEach((card, index) => {
      if (index === dayIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Mettre à jour les tabs du programme
    if (programmeDayTabs) {
      programmeDayTabs.forEach((tab, index) => {
        tab.classList.toggle('active', index === dayIndex);
      });
    }

    // Mettre à jour les tabs des stages
    if (stagesDayTabs) {
      stagesDayTabs.forEach((tab, index) => {
        tab.classList.toggle('active', index === dayIndex);
      });
    }

    // Mettre en surbrillance les stages du jour
    updateStagesDayHighlight(dayIndex);
  }

  // Fonction pour mettre en surbrillance la colonne stages du jour sélectionné
  function updateStagesDayHighlight(dayIndex) {
    const stagesDayCards = document.querySelectorAll('#stages .stages-day');
    stagesDayCards.forEach((dayCard) => {
      const cardDay = parseInt(dayCard.getAttribute('data-day'), 10);
      dayCard.classList.toggle('active', !Number.isNaN(cardDay) && cardDay === dayIndex);
    });
  }

  // Gestion du switcher du programme (synchronise À l'affiche, Programme, Stages)
  const programmeDayTabs = document.querySelectorAll('#programmeDayTabs .day-tab');
  if (programmeDayTabs) {
    programmeDayTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        setCurrentDay(index);
      });
    });
  }

  // Gestion du switcher des stages (synchronise À l'affiche, Programme, Stages)
  const stagesDayTabs = document.querySelectorAll('#stagesDayTabs .day-tab');
  if (stagesDayTabs) {
    stagesDayTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        setCurrentDay(index);
        if (window.posthog) {
          window.posthog.capture('day_switch', { section: 'stages', section_name: 'Stages', day_index: index, day_name: DAY_SWITCH_DAY_NAMES[index] || '' });
        }
      });
    });
  }

  // Clic sur une colonne de jour dans le programme : si colonne atténuée → surbrillance uniquement ; si déjà en surbrillance → flip/lien sur les slots
  document.querySelectorAll('#programme .day.card').forEach((card) => {
    card.addEventListener('click', (e) => {
      const dayIndex = parseInt(card.getAttribute('data-day'), 10);
      if (Number.isNaN(dayIndex)) return;

      const isActive = card.classList.contains('active');
      if (!isActive) {
        // Colonne atténuée : tout clic met en surbrillance, on n'exécute pas le flip ni le lien du slot (capture pour bloquer avant les slots)
        e.preventDefault();
        e.stopPropagation();
        setCurrentDay(dayIndex);
        if (window.posthog) window.posthog.capture('day_switch', { section: 'programme', section_name: 'Programme', day_index: dayIndex, day_name: DAY_SWITCH_DAY_NAMES[dayIndex] || '' });
        return;
      }
      // Colonne déjà en surbrillance : ne pas consommer le clic sur lien/bouton (laisser flip ou navigation)
      if (e.target.closest('a, button')) return;
      setCurrentDay(dayIndex);
      if (window.posthog) window.posthog.capture('day_switch', { section: 'programme', section_name: 'Programme', day_index: dayIndex, day_name: DAY_SWITCH_DAY_NAMES[dayIndex] || '' });
    }, true);
  });

  // Clic sur l'en-tête d'un stage pour mettre en surbrillance les stages de ce jour (et synchroniser tous les switchers)
  document.querySelectorAll('#stages .atelier-card .header').forEach((header) => {
    header.addEventListener('click', () => {
      const card = header.closest('.atelier-card');
      if (!card) return;
      const dayIndex = parseInt(card.getAttribute('data-day'), 10);
      if (Number.isNaN(dayIndex)) return;
      setCurrentDay(dayIndex);
      if (window.posthog) window.posthog.capture('day_switch', { section: 'stages', section_name: 'Stages', day_index: dayIndex, day_name: DAY_SWITCH_DAY_NAMES[dayIndex] || '' });
    });
  });

  // Section stages : si la colonne n'est pas en surbrillance (jour non sélectionné), tout clic ne fait que sélectionner le jour (pas de flip)
  document.querySelectorAll('#stages .atelier-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      const dayColumn = card.closest('.stages-day');
      if (dayColumn && !dayColumn.classList.contains('active')) {
        e.preventDefault();
        e.stopPropagation();
        const dayIndex = parseInt(card.getAttribute('data-day'), 10);
        if (!Number.isNaN(dayIndex)) {
          setCurrentDay(dayIndex);
          if (window.posthog) window.posthog.capture('day_switch', { section: 'stages', section_name: 'Stages', day_index: dayIndex, day_name: DAY_SWITCH_DAY_NAMES[dayIndex] || '' });
        }
      }
    }, true);
  });

  // Cartes stage : verso déroulé DEDANS (overlay). La carte s'agrandit en hauteur pour tout le contenu (pas de scroll interne).
  /** Re-mesure la hauteur du verso et met à jour la carte (ex. après dépliage de la mini-bio intervenant). */
  function resizeStageVerso(flipContainer, bufferPx) {
    const back = flipContainer && flipContainer.querySelector('.flip-back');
    if (!back) return;
    flipContainer.classList.add('measuring');
    // Annuler le maxHeight inline pour que le contenu puisse s'étendre et être mesuré correctement
    back.style.maxHeight = 'none';
    const extra = typeof bufferPx === 'number' ? bufferPx : 0;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const backContent = back.querySelector('.content');
        const backHeight = (backContent ? backContent.offsetHeight : back.offsetHeight) + extra;
        flipContainer.classList.remove('measuring');
        const sameHeight = backHeight + 'px';
        flipContainer.style.minHeight = sameHeight;
        back.style.maxHeight = sameHeight;
      });
    });
  }

  function openStageVerso(flipContainer) {
    const front = flipContainer.querySelector('.flip-front');
    const back = flipContainer.querySelector('.flip-back');
    if (!front || !back) return;
    flipContainer.classList.add('flipped', 'measuring');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const backContent = back.querySelector('.content');
        const backHeight = backContent ? backContent.offsetHeight : back.offsetHeight;
        flipContainer.classList.remove('measuring');
        const sameHeight = backHeight + 'px';
        flipContainer.style.minHeight = sameHeight;
        back.style.maxHeight = '0';
        requestAnimationFrame(() => {
          back.style.maxHeight = sameHeight;
        });
      });
    });
  }

  function closeStageVerso(flipContainer) {
    const back = flipContainer.querySelector('.flip-back');
    if (back) back.style.maxHeight = '0';
    setTimeout(() => {
      if (back) back.style.maxHeight = '';
      flipContainer.style.minHeight = '';
      flipContainer.classList.remove('flipped');
    }, 420);
  }

  // 1) Clic sur "Détails" (recto stage) → déroule le verso dedans et allonge la carte
  document.querySelectorAll('.stage-details-btn').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const flipContainer = link.closest('.flip-container');
      if (flipContainer) openStageVerso(flipContainer);
      var stageCard = link.closest('.atelier-card');
      if (stageCard && stageCard.id && window.posthog) {
        var stageTitleEl = stageCard.querySelector('h3');
        var intervenantEl = stageCard.querySelector('.instructor-name, .instructor-name-small');
        window.posthog.capture('stage_details_open', {
          stage_id: stageCard.id,
          intervenant: intervenantEl ? intervenantEl.textContent.trim() : '',
          stage_titre: stageTitleEl ? stageTitleEl.textContent.trim() : ''
        });
      }
    });
  });

  // 2) Clic n'importe où sur le recto (hors boutons) → déroule le verso
  document.querySelectorAll('.atelier-card .flip-container .flip-front').forEach(front => {
    front.addEventListener('click', e => {
      if (e.target.closest('.btn-inscription, .btn-waitlist, a')) return;
      if (e.target.closest('.instructor-flip-container')) return;
      const flipContainer = front.closest('.flip-container');
      if (flipContainer) openStageVerso(flipContainer);
      var stageCard = front.closest('.atelier-card');
      if (stageCard && stageCard.id && window.posthog) {
        var stageTitleEl = stageCard.querySelector('h3');
        var intervenantEl = stageCard.querySelector('.instructor-name, .instructor-name-small');
        window.posthog.capture('stage_details_open', {
          stage_id: stageCard.id,
          intervenant: intervenantEl ? intervenantEl.textContent.trim() : '',
          stage_titre: stageTitleEl ? stageTitleEl.textContent.trim() : ''
        });
      }
    });
  });

  // 3) Clic sur le verso pour replier
  document.querySelectorAll('.atelier-card .flip-back').forEach(flipBack => {
    flipBack.addEventListener('click', e => {
      if (e.target.closest('.instructor-flip-container')) return;
      if (e.target.closest('.btn-inscription, .btn-waitlist')) return;
      if (e.target.closest('a')) return; /* laisser les liens (ex. @insta) ouvrir dans un autre onglet */
      const flipContainer = flipBack.closest('.flip-container');
      if (flipContainer && flipContainer.classList.contains('flipped')) {
        closeStageVerso(flipContainer);
      }
    });
  });

  // Clic sur le tag COMPLET → déroule le verso
  document.querySelectorAll('.complet-tag').forEach(tag => {
    tag.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const flipContainer = tag.closest('.flip-container');
      if (flipContainer) openStageVerso(flipContainer);
      var stageCard = tag.closest('.atelier-card');
      if (stageCard && stageCard.id && window.posthog) {
        var stageTitleEl = stageCard.querySelector('h3');
        var intervenantEl = stageCard.querySelector('.instructor-name, .instructor-name-small');
        window.posthog.capture('stage_details_open', {
          stage_id: stageCard.id,
          intervenant: intervenantEl ? intervenantEl.textContent.trim() : '',
          stage_titre: stageTitleEl ? stageTitleEl.textContent.trim() : ''
        });
      }
    });
  });

  // Flip pour afficher la bio de l'intervenant (recto et verso : overlay au lieu de flipper la carte). La carte stage s'agrandit pour afficher toute la bio.
  const instructorFlipHandler = (container) => {
    container.addEventListener('click',e=>{
      if (e.target.closest('a')) return; /* laisser les liens (ex. @insta) ouvrir sans fermer la bio */
      e.preventDefault();
      const isFlipped = container.classList.contains('flipped');
      const back = container.querySelector('.instructor-flip-back');
      
      if(!back) return; // Si pas de back, on ne fait rien
      
      const stageFlipContainer = container.closest('.flip-container');
      const isOnStageVerso = !!container.closest('.flip-back');

      if(!isFlipped){
        // Déplier la bio : la hauteur du bloc suit le contenu (height: auto), pas de minHeight imposé
        container.classList.add('flipped');
        // Agrandir la carte stage après que le layout ait pris en compte la bio (délai + marge pour éviter toute troncature)
        if (isOnStageVerso && stageFlipContainer && stageFlipContainer.classList.contains('flipped')) {
          setTimeout(() => resizeStageVerso(stageFlipContainer, 48), 120);
        }
      } else {
        container.classList.remove('flipped');
        setTimeout(()=>{
          container.style.minHeight = '';
          if (isOnStageVerso && stageFlipContainer && stageFlipContainer.classList.contains('flipped')) {
            resizeStageVerso(stageFlipContainer);
          }
        }, 600);
      }
    });
  };
  document.querySelectorAll('.flip-back .instructor-flip-container').forEach(instructorFlipHandler);
  document.querySelectorAll('.flip-front .instructor-flip-container').forEach(instructorFlipHandler);

  // Flip pour afficher les détails des tarifs
  document.querySelectorAll('.price-flip-container').forEach(container=>{
    container.addEventListener('click',e=>{
      // Empêcher le flip si on clique sur un lien
      if(e.target.tagName === 'A' || e.target.closest('a')) {
        return;
      }
      e.preventDefault();
      var wasFlipped = container.classList.contains('flipped');
      container.classList.toggle('flipped');
      if (!wasFlipped && container.classList.contains('flipped') && window.posthog) {
        var priceEl = container.closest('.price');
        var passId = priceEl && priceEl.id ? priceEl.id : 'unknown';
        window.posthog.capture('pass_details_open', { pass_id: passId });
      }
    });
  });

  // Données des spectacles (slider single-slide et match France)
  const spectaclesData = {
    'spectacle-vendredi-format-long': {
      type: 'format-long',
      time: '19:00',
      label: 'Impro longue',
      title: 'Braquage',
      image: 'assets/img/long/braquage-640w.avif',
      pitch: 'Un braquage en cours, portes closes. Otages et braqueurs s\'affrontent : raisons, choix… et ce qu\'on préfère taire. Le public désigne les rôles ; fiction tendue et cinématographique en temps réel.'
    },
    'spectacle-vendredi-match': {
      type: 'match',
      time: '21:00',
      label: 'Match',
      title: 'La Malice vs Belgique',
      image: 'assets/img/long/equipe-belgique-640w.avif',
      pitch: 'Le match d\'impro est le format phare par lequel l\'impro s\'est diffusée. Venu du Québec, il emprunte aux codes du Hockey sur glace où 2 équipes de comédiens s\'affrontent sur une patinoire dans des séquences brèves et rythmées sous la surveillance d\'un arbitre implacable&nbsp;!'
    },
    'spectacle-samedi-format-long': {
      type: 'format-long',
      time: '19:00',
      label: 'Impro longue',
      title: 'Commis d\'Office',
      image: 'assets/img/long/commis-d-office-640w.avif',
      pitch: 'L\'un·e est accusé·e, l\'autre est avocat·e<br>L\'un·e est coupable, l\'autre devra trouver des circonstances atténuantes.<br>Venez découvrir son histoire, son crime et les raisons de l\'irréparable.'
    },
    'spectacle-samedi-match': {
      type: 'match',
      time: '21:00',
      label: 'Match',
      title: 'La Malice vs France',
      image: 'assets/img/long/edf-colisee.avif',
      pitch: 'Le match d\'impro est le format phare par lequel l\'impro s\'est diffusée. Venu du Québec, il emprunte aux codes du Hockey sur glace où 2 équipes de comédiens s\'affrontent sur une patinoire dans des séquences brèves et rythmées sous la surveillance d\'un arbitre implacable&nbsp;!'
    },
    'spectacle-dimanche-format-long': {
      type: 'format-long',
      time: '18:00',
      label: 'Impro longue',
      title: 'Promo 2006',
      image: 'assets/img/long/promo-2006-640w.avif',
      pitch: 'Vingt ans après, une ancienne promo se retrouve pour une soirée pleine de secrets, de couples improbables et de souvenirs qui dérapent. Un format joyeux et tendre, où le public choisit l\'école, les liens… et ce qui aurait mieux valu rester enterré.'
    },
    'spectacle-dimanche-match': {
      type: 'match',
      time: '20:00',
      label: 'Match',
      title: 'La Malice vs Suisse',
      image: 'assets/img/long/equipe-suisse-640w.avif',
      pitch: '' // à remplir quand reçu
    }
  };
  
  // Boutons programme : scroll vers la bannière spectacle (mobile et desktop)
  document.querySelectorAll('[data-spectacle]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const spectacleId = button.getAttribute('data-spectacle');
      const targetElement = document.getElementById(spectacleId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // PostHog : navigation depuis le programme (slot spectacle cliqué dans #programme ou fullscreen)
      if (button.closest('#programme, #programFullscreenContainer') && window.posthog) {
        window.posthog.capture('nav_click', { target: '#' + spectacleId, source: 'programme' });
      }
    });
  });

  function getBlockImageSrc(blk) {
    const matchImg = blk.querySelector('.match-image');
    const formatLongImg = blk.querySelector('.format-long-image');
    const img = matchImg || formatLongImg;
    if (img) {
      const src = img.currentSrc || img.getAttribute('src');
      return src ? encodeURI(src) : '';
    }
    const bgImage = window.getComputedStyle(blk).backgroundImage;
    if (bgImage && bgImage !== 'none') {
      const match = bgImage.match(/url\(["']?([^"']+)["']?\)/);
      if (match && match[1]) return match[1];
    }
    return '';
  }

  // Slider spectacle pour format long (mobile et desktop)
  document.querySelectorAll('.format-long-block').forEach(block=>{
    block.addEventListener('click',e=>{
      e.preventDefault();
      if (block.classList.contains('slider-active')) {
        closeMatchSlider(block);
        return;
      }
      const blockId = block.id;
      if (blockId && spectaclesData && spectaclesData[blockId]) {
        var data = spectaclesData[blockId];
        if (window.posthog) window.posthog.capture('spectacle_details_open', { spectacle_id: blockId, spectacle_name: data.title });
        if (blockId === 'spectacle-samedi-format-long' && commisDOfficeCast && commisDOfficeCast.length > 0) {
          const originalImageSrc = getBlockImageSrc(block) || data.image;
          const intro = { title: 'Commis d\'Office', pitch: data.pitch || '' };
          initMatchSlider(block, [{ intro: intro, players: commisDOfficeCast }], originalImageSrc);
        } else if (blockId === 'spectacle-vendredi-format-long' && maliceBraquagePlayers && maliceBraquagePlayers.length > 0) {
          const originalImageSrc = getBlockImageSrc(block) || data.image;
          const intro = { title: 'Braquage', pitch: data.pitch || '' };
          initMatchSlider(block, [{ intro: intro, players: maliceBraquagePlayers }], originalImageSrc);
        } else if (blockId === 'spectacle-dimanche-format-long' && malicePromo2006Players && malicePromo2006Players.length > 0) {
          const originalImageSrc = getBlockImageSrc(block) || data.image;
          const intro = { title: 'Promo 2006', pitch: data.pitch || '' };
          initMatchSlider(block, [{ intro: intro, players: malicePromo2006Players }], originalImageSrc);
        } else {
          initSpectacleSingleSlide(block, data);
        }
      }
    });
  });

  // Fonction pour initialiser le slider de bios des joueurs
  function getFirstSentence(htmlOrText) {
    const stripped = (htmlOrText || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const match = stripped.match(/^[^.!?]+[.!?]?/);
    return match ? match[0].trim() : stripped;
  }

  /** Masque le libellé générique Joueur / Joueuse ; les autres rôles (MC, Arbitre, etc.) restent affichés. */
  function shouldShowSpectacleRoleLine(role) {
    if (!role || typeof role !== 'string') return false;
    const norm = role.replace(/\s+/g, ' ').trim();
    return !/^Joueur$/i.test(norm) && !/^Joueuse$/i.test(norm);
  }

  /** Règle générale : prénom (1re ligne) puis nom (2e ligne), au premier espace — tous les joueurs du slider + titre calque bio */
  function appendPlayerDisplayNameLines(container, fullName) {
    container.textContent = '';
    const t = (fullName || '').trim();
    const i = t.indexOf(' ');
    if (i <= 0) {
      const span = document.createElement('span');
      span.className = 'match-slide-name-line';
      span.textContent = t;
      container.appendChild(span);
      return;
    }
    const first = document.createElement('span');
    first.className = 'match-slide-name-line match-slide-name-line--first';
    first.textContent = t.slice(0, i);
    const second = document.createElement('span');
    second.className = 'match-slide-name-line match-slide-name-line--second';
    second.textContent = t.slice(i + 1).trim();
    container.appendChild(first);
    container.appendChild(second);
  }

  function closeMatchPlayerBioLayer(matchBlock) {
    const c = matchBlock.querySelector('.match-slider-container');
    if (!c || !c.classList.contains('match-player-bio-open')) return;
    c.classList.remove('match-player-bio-open');
    const layer = c.querySelector('.match-player-bio-layer');
    if (layer) {
      layer.hidden = true;
      layer.setAttribute('aria-hidden', 'true');
    }
  }

  function openMatchPlayerBioLayer(matchBlock, name, bio) {
    const c = matchBlock.querySelector('.match-slider-container');
    if (!c) return;
    const layer = c.querySelector('.match-player-bio-layer');
    if (!layer) return;
    appendPlayerDisplayNameLines(layer.querySelector('.match-player-bio-layer-name'), name);
    layer.querySelector('.match-player-bio-layer-text').textContent = bio;
    layer.hidden = false;
    layer.setAttribute('aria-hidden', 'false');
    c.classList.add('match-player-bio-open');
    if (matchBlock._sliderInterval) {
      clearInterval(matchBlock._sliderInterval);
      matchBlock._sliderInterval = null;
    }
  }

  function resumeMatchSliderAfterBioClose(matchBlock) {
    if (matchBlock.classList.contains('slider-active')) {
      startSliderAutoPlay(matchBlock);
    }
  }

  if (!window._matchPlayerBioEscapeBound) {
    window._matchPlayerBioEscapeBound = true;
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      const open = document.querySelector('.match-slider-container.match-player-bio-open');
      if (!open) return;
      const block = open.closest('.match-block');
      if (!block) return;
      closeMatchPlayerBioLayer(block);
      resumeMatchSliderAfterBioClose(block);
    });
  }

  // teams: tableau de { intro: { title, pitch }, players: [...] } ; ou (players, originalImageSrc, intro) pour rétrocompat
  function initMatchSlider(matchBlock, teamsOrPlayers, originalImageSrc, introOptional) {
    let teams;
    if (Array.isArray(teamsOrPlayers) && teamsOrPlayers.length > 0 && teamsOrPlayers[0].players !== undefined) {
      teams = teamsOrPlayers;
    } else {
      const players = Array.isArray(teamsOrPlayers) ? teamsOrPlayers : [];
      teams = [{ intro: introOptional || { title: 'L\'Équipe de France', pitch: 'Champions du monde, artistes reconnus et figures majeures de l\'improvisation professionnelle. Une équipe d\'excellence réunissant expérience, créativité et intensité scénique, au service de spectacles uniques et exigeants. Photo : © J.DUFRESNE' }, players }];
    }

    // Vérifier si le slider existe déjà
    let sliderContainer = matchBlock.querySelector('.match-slider-container');
    
    if (!sliderContainer) {
      // Créer la structure du slider
      sliderContainer = document.createElement('div');
      sliderContainer.className = 'match-slider-container';
      
      const sliderTrack = document.createElement('div');
      sliderTrack.className = 'match-slider-track';
      
      teams.forEach(function (team) {
        const intro = team.intro || {};
        const introTitle = intro.title ?? '';
        const introPitch = intro.pitch ?? '';
        const teamPlayers = team.players || [];
        const omitIntro = team.omitIntro === true;
        
        if (!omitIntro) {
          // Slide d'intro : format long = fond noir ; match = fond blanc lisible, sans image bannière
          const introSlide = document.createElement('div');
          const isFormatLongBanner = matchBlock.classList.contains('format-long-block');
          introSlide.className = isFormatLongBanner
            ? 'match-slide match-slide-bg-right match-slide-format-long-intro'
            : 'match-slide match-slide-bg-right match-slide-match-intro';
          if (isFormatLongBanner) {
            introSlide.style.backgroundColor = '#000';
            introSlide.style.backgroundImage = 'none';
          } else {
            introSlide.style.backgroundColor = '#ffffff';
            introSlide.style.backgroundImage = 'none';
          }
          
          const introOverlay = document.createElement('div');
          introOverlay.className = 'match-slide-overlay';
          
          const title = document.createElement('div');
          title.className = 'match-slide-name';
          title.textContent = introTitle;
          
          const pitchShort = document.createElement('div');
          pitchShort.className = 'match-slide-bio match-slide-bio-short';
          pitchShort.textContent = getFirstSentence(introPitch);
          const pitchFull = document.createElement('div');
          pitchFull.className = 'match-slide-bio match-slide-bio-full';
          pitchFull.innerHTML = introPitch;
          
          introOverlay.appendChild(title);
          introOverlay.appendChild(pitchShort);
          introOverlay.appendChild(pitchFull);
          introSlide.appendChild(introOverlay);
          sliderTrack.appendChild(introSlide);
        }
        
        // Slides joueurs : portrait responsive (picture + srcset 320w / 442w / 640w) dans calque inset
        teamPlayers.forEach(function (player) {
          const playerSlide = document.createElement('div');
          playerSlide.className = 'match-slide match-slide-bg-right';
          const bgLayer = document.createElement('div');
          bgLayer.className = 'match-slide-bg-inner';
          const base = player.image.replace(/-640w\.avif$/, '');
          const picture = document.createElement('picture');
          const source = document.createElement('source');
          source.type = 'image/avif';
          source.srcset = base + '-320w.avif 320w, ' + base + '-442w.avif 442w, ' + base + '-640w.avif 640w';
          source.sizes = '(max-width: 768px) calc(100vw - 88px), calc(100vw - 112px)';
          const img = document.createElement('img');
          img.src = player.image;
          img.alt = 'Photo de ' + (player.name || '');
          img.loading = 'lazy';
          picture.appendChild(source);
          picture.appendChild(img);
          bgLayer.appendChild(picture);
          playerSlide.appendChild(bgLayer);
          
          const playerOverlay = document.createElement('div');
          playerOverlay.className = 'match-slide-overlay';
          
          const hasBio = (player.bio || '').trim().length > 0;
          if (hasBio) {
            const playerName = document.createElement('button');
            playerName.type = 'button';
            playerName.className = 'match-slide-name match-slide-name--has-bio';
            appendPlayerDisplayNameLines(playerName, player.name);
            playerName.setAttribute('aria-label', player.name + ' — afficher la biographie');
            playerName.addEventListener('click', function (e) {
              e.stopPropagation();
              openMatchPlayerBioLayer(matchBlock, player.name, player.bio.trim());
            });
            playerOverlay.appendChild(playerName);
          } else {
            const playerName = document.createElement('div');
            playerName.className = 'match-slide-name';
            appendPlayerDisplayNameLines(playerName, player.name);
            playerOverlay.appendChild(playerName);
          }
          
          if (player.role && shouldShowSpectacleRoleLine(player.role)) {
            const playerRole = document.createElement('div');
            playerRole.className = 'match-slide-role';
            playerRole.textContent = player.role;
            playerOverlay.appendChild(playerRole);
          }
          
          if (!hasBio) {
            const playerBioShort = document.createElement('div');
            playerBioShort.className = 'match-slide-bio match-slide-bio-short';
            playerBioShort.textContent = getFirstSentence(player.bio || '');
            const playerBioFull = document.createElement('div');
            playerBioFull.className = 'match-slide-bio match-slide-bio-full';
            playerBioFull.textContent = player.bio || '';
            playerOverlay.appendChild(playerBioShort);
            playerOverlay.appendChild(playerBioFull);
          }
          
          playerSlide.appendChild(playerOverlay);
          sliderTrack.appendChild(playerSlide);
        });
      });
      
      // Bouton de fermeture
      const closeButton = document.createElement('button');
      closeButton.className = 'match-slider-close';
      closeButton.setAttribute('aria-label', 'Fermer le slider');
      closeButton.innerHTML = '×';
      closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMatchSlider(matchBlock);
      });
      
      // Boutons chevron précédent / suivant
      const totalSlides = teams.reduce(function (s, t) {
        const introCount = t.omitIntro === true ? 0 : 1;
        return s + introCount + (t.players || []).length;
      }, 0);
      const prevBtn = document.createElement('button');
      prevBtn.className = 'match-slider-prev';
      prevBtn.setAttribute('aria-label', 'Slide précédent');
      prevBtn.innerHTML = '‹';
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cur = matchBlock._currentSlide !== undefined ? matchBlock._currentSlide : 0;
        if (cur > 0) goToSlide(matchBlock, cur - 1);
      });
      const nextBtn = document.createElement('button');
      nextBtn.className = 'match-slider-next';
      nextBtn.setAttribute('aria-label', 'Slide suivant');
      nextBtn.innerHTML = '›';
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cur = matchBlock._currentSlide !== undefined ? matchBlock._currentSlide : 0;
        if (cur < totalSlides - 1) goToSlide(matchBlock, cur + 1);
      });
      
      // Créer les points de navigation (dots)
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'match-slider-dots';
      
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'match-slider-dot';
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Aller au slide ${i + 1}`);
        dot.setAttribute('data-slide', i);
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          goToSlide(matchBlock, i);
        });
        dotsContainer.appendChild(dot);
      }
      
      const bioLayer = document.createElement('div');
      bioLayer.className = 'match-player-bio-layer';
      bioLayer.hidden = true;
      bioLayer.setAttribute('aria-hidden', 'true');
      bioLayer.setAttribute('role', 'dialog');
      bioLayer.setAttribute('aria-modal', 'true');
      const bioClose = document.createElement('button');
      bioClose.type = 'button';
      bioClose.className = 'match-player-bio-layer-close';
      bioClose.setAttribute('aria-label', 'Fermer la biographie');
      bioClose.innerHTML = '×';
      const bioInner = document.createElement('div');
      bioInner.className = 'match-player-bio-layer-inner';
      const bioNameEl = document.createElement('h2');
      bioNameEl.className = 'match-player-bio-layer-name';
      const bioTextEl = document.createElement('p');
      bioTextEl.className = 'match-player-bio-layer-text';
      bioInner.appendChild(bioNameEl);
      bioInner.appendChild(bioTextEl);
      bioLayer.appendChild(bioClose);
      bioLayer.appendChild(bioInner);
      bioClose.addEventListener('click', function (e) {
        e.stopPropagation();
        closeMatchPlayerBioLayer(matchBlock);
        resumeMatchSliderAfterBioClose(matchBlock);
      });
      bioLayer.addEventListener('click', function (e) {
        if (e.target === bioLayer) {
          closeMatchPlayerBioLayer(matchBlock);
          resumeMatchSliderAfterBioClose(matchBlock);
        }
      });
      
      sliderContainer.appendChild(sliderTrack);
      sliderContainer.appendChild(prevBtn);
      sliderContainer.appendChild(nextBtn);
      sliderContainer.appendChild(closeButton);
      sliderContainer.appendChild(dotsContainer);
      sliderContainer.appendChild(bioLayer);
      matchBlock.appendChild(sliderContainer);
    }
    
    // Activer le slider
    matchBlock.classList.add('slider-active');
    
    // État initial des chevrons et thème (slide intro match = fond clair)
    matchBlock._currentSlide = 0;
    updateMatchSliderChevrons(matchBlock, 0);
    updateMatchSliderLightTheme(matchBlock, 0);
    
    // Initialiser l'auto-défilement
    startSliderAutoPlay(matchBlock);
  }

  // Slider à une slide pour les spectacles (format long ou match autre que France)
  function initSpectacleSingleSlide(block, data) {
    let sliderContainer = block.querySelector('.match-slider-container');
    if (sliderContainer) {
      block.classList.add('slider-active');
      return;
    }
    sliderContainer = document.createElement('div');
    sliderContainer.className = 'match-slider-container spectacle-single-slide';
    const sliderTrack = document.createElement('div');
    sliderTrack.className = 'match-slider-track';
    const slide = document.createElement('div');
    slide.className = 'match-slide';
    slide.style.backgroundColor = '#000';
    const overlay = document.createElement('div');
    overlay.className = 'match-slide-overlay';
    const titleEl = document.createElement('div');
    titleEl.className = 'match-slide-name';
    titleEl.textContent = data.title;
    const pitchShort = document.createElement('div');
    pitchShort.className = 'match-slide-bio match-slide-bio-short';
    pitchShort.textContent = getFirstSentence(data.pitch);
    const pitchFull = document.createElement('div');
    pitchFull.className = 'match-slide-bio match-slide-bio-full';
    pitchFull.innerHTML = data.pitch;
    overlay.appendChild(titleEl);
    overlay.appendChild(pitchShort);
    overlay.appendChild(pitchFull);
    slide.appendChild(overlay);
    sliderTrack.appendChild(slide);
    const closeButton = document.createElement('button');
    closeButton.className = 'match-slider-close';
    closeButton.setAttribute('aria-label', 'Fermer le slider');
    closeButton.innerHTML = '×';
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMatchSlider(block);
    });
    sliderContainer.appendChild(sliderTrack);
    sliderContainer.appendChild(closeButton);
    block.appendChild(sliderContainer);
    block.classList.add('slider-active');
  }
  
  /** Slider match : slide intro sur fond blanc → points et UI adaptés au contraste */
  function updateMatchSliderLightTheme(matchBlock, slideIndex) {
    const sliderContainer = matchBlock.querySelector('.match-slider-container');
    if (!sliderContainer) return;
    const slides = matchBlock.querySelectorAll('.match-slider-track .match-slide');
    const slide = slides[slideIndex];
    const light = slide && slide.classList.contains('match-slide-match-intro');
    sliderContainer.classList.toggle('match-slider-light-slide', Boolean(light));
  }

  // Mettre à jour l'état des chevrons (prev/next) selon le slide actuel
  function updateMatchSliderChevrons(matchBlock, slideIndex) {
    const sliderTrack = matchBlock.querySelector('.match-slider-track');
    if (!sliderTrack) return;
    const slides = sliderTrack.querySelectorAll('.match-slide');
    const totalSlides = slides.length;
    const prevBtn = matchBlock.querySelector('.match-slider-prev');
    const nextBtn = matchBlock.querySelector('.match-slider-next');
    if (prevBtn) {
      prevBtn.disabled = slideIndex <= 0;
      prevBtn.setAttribute('aria-disabled', prevBtn.disabled);
    }
    if (nextBtn) {
      nextBtn.disabled = slideIndex >= totalSlides - 1;
      nextBtn.setAttribute('aria-disabled', nextBtn.disabled);
    }
  }

  // Fonction pour aller à un slide spécifique
  function goToSlide(matchBlock, slideIndex) {
    closeMatchPlayerBioLayer(matchBlock);
    const sliderTrack = matchBlock.querySelector('.match-slider-track');
    if (!sliderTrack) return;
    
    const slides = sliderTrack.querySelectorAll('.match-slide');
    if (slideIndex < 0 || slideIndex >= slides.length) return;
    
    // Mettre à jour la position
    sliderTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
    
    // Mettre à jour les dots actifs
    const dots = matchBlock.querySelectorAll('.match-slider-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === slideIndex);
    });
    
    // Mettre à jour les chevrons
    updateMatchSliderChevrons(matchBlock, slideIndex);
    updateMatchSliderLightTheme(matchBlock, slideIndex);
    
    // Réinitialiser l'auto-défilement à partir de ce slide
    matchBlock._currentSlide = slideIndex;
    
    // Redémarrer l'auto-défilement
    if (matchBlock._sliderInterval) {
      clearInterval(matchBlock._sliderInterval);
    }
    startSliderAutoPlay(matchBlock);
  }
  
  // Fonction pour démarrer l'auto-défilement
  function startSliderAutoPlay(matchBlock) {
    // Nettoyer l'ancien timer s'il existe
    if (matchBlock._sliderInterval) {
      clearInterval(matchBlock._sliderInterval);
      matchBlock._sliderInterval = null;
    }
    
    // Supprimer les anciens event listeners s'ils existent
    if (matchBlock._sliderMouseEnterHandler) {
      matchBlock.removeEventListener('mouseenter', matchBlock._sliderMouseEnterHandler);
      matchBlock.removeEventListener('mouseleave', matchBlock._sliderMouseLeaveHandler);
    }
    
    const sliderTrack = matchBlock.querySelector('.match-slider-track');
    if (!sliderTrack) return;
    
    const slides = sliderTrack.querySelectorAll('.match-slide');
    if (slides.length === 0) return;
    
    // Utiliser le slide actuel ou commencer à 0
    let currentSlide = matchBlock._currentSlide !== undefined ? matchBlock._currentSlide : 0;
    const totalSlides = slides.length;
    
    // Fonction pour passer au slide suivant
    function nextSlide() {
      closeMatchPlayerBioLayer(matchBlock);
      currentSlide = (currentSlide + 1) % totalSlides;
      matchBlock._currentSlide = currentSlide;
      sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Mettre à jour les dots actifs
      const dots = matchBlock.querySelectorAll('.match-slider-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
      
      // Mettre à jour les chevrons
      updateMatchSliderChevrons(matchBlock, currentSlide);
      updateMatchSliderLightTheme(matchBlock, currentSlide);
    }
    
    // Démarrer l'auto-défilement (4 secondes par slide)
    matchBlock._sliderInterval = setInterval(nextSlide, 4000);
    
    // Pause au survol (desktop uniquement)
    if (window.innerWidth >= 768) {
      matchBlock._sliderMouseEnterHandler = () => {
        if (matchBlock._sliderInterval) {
          clearInterval(matchBlock._sliderInterval);
          matchBlock._sliderInterval = null;
        }
      };
      
      matchBlock._sliderMouseLeaveHandler = () => {
        if (!matchBlock._sliderInterval) {
          matchBlock._sliderInterval = setInterval(nextSlide, 4000);
        }
      };
      
      matchBlock.addEventListener('mouseenter', matchBlock._sliderMouseEnterHandler);
      matchBlock.addEventListener('mouseleave', matchBlock._sliderMouseLeaveHandler);
    }
  }
  
  // Fonction pour fermer le slider
  function closeMatchSlider(matchBlock) {
    closeMatchPlayerBioLayer(matchBlock);
    matchBlock.classList.remove('slider-active');
    
    // Nettoyer le timer
    if (matchBlock._sliderInterval) {
      clearInterval(matchBlock._sliderInterval);
      matchBlock._sliderInterval = null;
    }
    
    // Supprimer les event listeners
    if (matchBlock._sliderMouseEnterHandler) {
      matchBlock.removeEventListener('mouseenter', matchBlock._sliderMouseEnterHandler);
      matchBlock.removeEventListener('mouseleave', matchBlock._sliderMouseLeaveHandler);
      matchBlock._sliderMouseEnterHandler = null;
      matchBlock._sliderMouseLeaveHandler = null;
    }
    
    // Réinitialiser la position du slider
    const sliderTrack = matchBlock.querySelector('.match-slider-track');
    if (sliderTrack) {
      sliderTrack.style.transform = 'translateX(0)';
    }
    
    // Réinitialiser le slide actuel
    matchBlock._currentSlide = 0;
    
    // Réinitialiser les dots
    const dots = matchBlock.querySelectorAll('.match-slider-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === 0);
    });
    
    // Réinitialiser les chevrons
    updateMatchSliderChevrons(matchBlock, 0);
    updateMatchSliderLightTheme(matchBlock, 0);
  }

  // Flip pour afficher le pitch du match (desktop) ou modal (mobile)
  document.querySelectorAll('.match-block').forEach(block=>{
    block.addEventListener('click',e=>{
      // Si on clique sur le bouton de fermeture, ne pas gérer ici
      if (e.target.closest('.match-slider-close')) {
        return;
      }
      
      // Si le slider est actif, le fermer
      if (block.classList.contains('slider-active')) {
        closeMatchSlider(block);
        return;
      }
      
      e.preventDefault();
      const blockId = block.id;
      const isFranceMatch = blockId === 'spectacle-samedi-match';
      const isBelgiumMatch = blockId === 'spectacle-vendredi-match';
      const isSuisseMatch = blockId === 'spectacle-dimanche-match';

      if (blockId && window.posthog) {
        var spectacleName = spectaclesData && spectaclesData[blockId] ? spectaclesData[blockId].title : '';
        window.posthog.capture('spectacle_details_open', { spectacle_id: blockId, spectacle_name: spectacleName });
      }
      if (isFranceMatch && edfPlayers && maliceSamediPlayers) {
        const originalImageSrc = getBlockImageSrc(block);
        // Pas de slides d’intro équipe (Équipe de France / La Malice) : uniquement les portraits
        initMatchSlider(block, [
          { omitIntro: true, players: edfPlayers },
          { omitIntro: true, players: maliceSamediPlayers }
        ], originalImageSrc);
      } else if (isBelgiumMatch && belgPlayers && belgPlayers.length > 0 && maliceVsBelgiquePlayers && maliceVsBelgiquePlayers.length > 0) {
        const originalImageSrc = getBlockImageSrc(block);
        initMatchSlider(block, [
          { omitIntro: true, players: belgPlayers },
          { omitIntro: true, players: maliceVsBelgiquePlayers }
        ], originalImageSrc);
      } else if (isSuisseMatch && suissePlayers && suissePlayers.length > 0 && maliceVsSuissePlayers && maliceVsSuissePlayers.length > 0) {
        const originalImageSrc = getBlockImageSrc(block);
        initMatchSlider(block, [
          { omitIntro: true, players: suissePlayers },
          { omitIntro: true, players: maliceVsSuissePlayers }
        ], originalImageSrc);
      } else if (blockId && spectaclesData && spectaclesData[blockId]) {
        initSpectacleSingleSlide(block, spectaclesData[blockId]);
      }
    });
  });

  // Images de fond pour bannières « compactes » (mobile + desktop #valeur en 2 colonnes)
  function applySpectacleBannerBackgrounds() {
    document.querySelectorAll('#valeur .match-block').forEach(block => {
      let src;
      if (block.id === 'spectacle-samedi-match') {
        src = 'assets/img/long/edf-colisee-mobile.avif';
      } else {
        const img = block.querySelector('.match-image');
        src = img ? (img.currentSrc || img.getAttribute('src')) : null;
      }
      if (src) {
        const encodedSrc = encodeURI(src);
        block.style.backgroundImage = `url("${encodedSrc}")`;
        block.style.backgroundSize = 'cover';
        block.style.backgroundPosition = 'center';
        block.style.backgroundRepeat = 'no-repeat';
      }
    });
    document.querySelectorAll('#valeur .format-long-block').forEach(block => {
      const img = block.querySelector('.format-long-image');
      const src = img ? (img.currentSrc || img.getAttribute('src')) : null;
      if (src) {
        const encodedSrc = encodeURI(src);
        block.style.backgroundImage = `url("${encodedSrc}")`;
        block.style.backgroundSize = 'cover';
        block.style.backgroundPosition = 'center';
        block.style.backgroundRepeat = 'no-repeat';
      }
    });
  }

  applySpectacleBannerBackgrounds();
  window.addEventListener('load', applySpectacleBannerBackgrounds);
  window.matchMedia('(max-width: 768px)').addEventListener('change', applySpectacleBannerBackgrounds);

  // Popins explicatifs "format long" et "match" – même UX que Malix : centrée, overlay, fermeture au clic
  const tooltipTexts = {
    'format-long': 'Le format long est du théâtre d\'improvisation où rien n\'est écrit : une histoire unique se crée sous vos yeux à partir d\'un simple cadre, souvent inspiré par le public. On y suit des personnages touchants, des moments suspendus et cette tension délicieuse du jeu en équilibre permanent.',
    'match': 'Le match d\'impro est le format phare par lequel l\'impro s\'est diffusée. Venu du Québec, il emprunte aux codes du Hockey sur glace où 2 équipes de comédiens s\'affrontent sur une patinoire dans des séquences brèves et rythmées sous la surveillance d\'un arbitre implacable !'
  };

  let activeTooltip = null;
  let tooltipOverlay = null;
  let tooltipOnDocumentClick = null;
  let tooltipOnEscape = null;

  function createTooltipOverlay() {
    if (!tooltipOverlay) {
      tooltipOverlay = document.createElement('div');
      tooltipOverlay.className = 'tooltip-overlay';
      document.body.appendChild(tooltipOverlay);
    }
    return tooltipOverlay;
  }

  function getOrCreateTooltipPopup(tooltipId) {
    let popup = document.getElementById(`tooltip-${tooltipId}`);
    if (!popup) {
      popup = document.createElement('div');
      popup.id = `tooltip-${tooltipId}`;
      popup.className = 'tooltip-popup tooltip-popup-charte';
      popup.setAttribute('role', 'dialog');
      popup.setAttribute('aria-hidden', 'true');
      document.body.appendChild(popup);
    }
    return popup;
  }

  function showTooltip(trigger, tooltipId) {
    if (activeTooltip && activeTooltip !== trigger) {
      hideTooltip(activeTooltip);
    }

    const text = tooltipTexts[tooltipId];
    if (!text) return;

    const overlay = createTooltipOverlay();
    const popup = getOrCreateTooltipPopup(tooltipId);
    popup.textContent = text;
    popup.setAttribute('aria-hidden', 'false');

    overlay.classList.add('show');
    popup.style.position = 'fixed';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%) scale(0.95)';
    popup.style.maxWidth = 'calc(100vw - 32px)';
    popup.style.width = 'min(400px, calc(100vw - 32px))';

    requestAnimationFrame(() => {
      popup.classList.add('show');
      popup.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    function close() {
      hideTooltip(activeTooltip);
    }

    overlay._tooltipOnOverlayClick = close;
    overlay.addEventListener('click', overlay._tooltipOnOverlayClick);

    popup._tooltipOnClick = function (e) {
      e.stopPropagation();
      close();
    };
    popup.addEventListener('click', popup._tooltipOnClick);

    tooltipOnDocumentClick = function (e) {
      if (activeTooltip && e.target !== overlay && !popup.contains(e.target) && !activeTooltip.contains(e.target)) {
        close();
      }
    };
    tooltipOnEscape = function (e) {
      if (e.key === 'Escape') close();
    };
    setTimeout(() => {
      document.addEventListener('click', tooltipOnDocumentClick);
    }, 0);
    document.addEventListener('keydown', tooltipOnEscape);

    overlay._tooltipOnDocumentClick = tooltipOnDocumentClick;
    overlay._tooltipOnEscape = tooltipOnEscape;

    activeTooltip = trigger;
  }

  function hideTooltip(trigger) {
    if (!activeTooltip && !trigger) return;
    const tooltipId = trigger ? trigger.getAttribute('data-tooltip') : activeTooltip.getAttribute('data-tooltip');
    if (!tooltipId) return;

    const popup = getOrCreateTooltipPopup(tooltipId);
    popup.classList.remove('show');
    popup.setAttribute('aria-hidden', 'true');

    if (tooltipOverlay) {
      tooltipOverlay.classList.remove('show');
      if (tooltipOverlay._tooltipOnOverlayClick) {
        tooltipOverlay.removeEventListener('click', tooltipOverlay._tooltipOnOverlayClick);
        tooltipOverlay._tooltipOnOverlayClick = null;
      }
      if (tooltipOverlay._tooltipOnDocumentClick) {
        document.removeEventListener('click', tooltipOverlay._tooltipOnDocumentClick);
        tooltipOverlay._tooltipOnDocumentClick = null;
      }
      if (tooltipOverlay._tooltipOnEscape) {
        document.removeEventListener('keydown', tooltipOverlay._tooltipOnEscape);
        tooltipOverlay._tooltipOnEscape = null;
      }
    }
    if (popup._tooltipOnClick) {
      popup.removeEventListener('click', popup._tooltipOnClick);
      popup._tooltipOnClick = null;
    }

    activeTooltip = null;
  }

  document.querySelectorAll('.tooltip[data-tooltip]').forEach(trigger => {
    const tooltipId = trigger.getAttribute('data-tooltip');
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (activeTooltip === trigger) {
        hideTooltip(trigger);
      } else {
        showTooltip(trigger, tooltipId);
      }
    });
  });

  window.addEventListener('resize', () => {
    if (activeTooltip) hideTooltip(activeTooltip);
  });

  // Popin Malix au clic sur un doodle flottant (même style que tooltips format long / match)
  let malixDoodleOverlay = null;
  let malixDoodlePopup = null;

  function getOrCreateMalixDoodlePopin() {
    if (malixDoodlePopup) return { overlay: malixDoodleOverlay, popup: malixDoodlePopup };
    malixDoodleOverlay = document.createElement('div');
    malixDoodleOverlay.className = 'tooltip-overlay';
    malixDoodleOverlay.setAttribute('aria-hidden', 'true');
    malixDoodlePopup = document.createElement('div');
    malixDoodlePopup.id = 'malix-doodle-popin';
    malixDoodlePopup.className = 'tooltip-popup tooltip-popup-charte';
    malixDoodlePopup.setAttribute('role', 'dialog');
    malixDoodlePopup.setAttribute('aria-label', 'Malix attrapé');
    malixDoodlePopup.setAttribute('aria-hidden', 'true');
    malixDoodlePopup.innerHTML = '<p><strong>✨ Vous venez d\'attraper un <a href="/malix/">malix</a>!</strong><br><br>Chacun malix évoque le souvenir d\'une impro jouée par les comédien.nes de La Malice. Ils apparaissent sans prévenir, se baladent, rebondissent, puis disparaissent.<br><br>Comme nos impros, on ne sait jamais d\'où ils viennent, ils sont parfois un peu lourdingues… mais toujours attachants. 🧡</p>';
    malixDoodlePopup.addEventListener('click', function (e) {
      e.stopPropagation();
      hideMalixDoodlePopin();
      const link = e.target.closest('a[href*="/malix/"]');
      if (link) {
        if (window.posthog) window.posthog.capture('malix_link_click', { source: 'doodle_popin' });
      }
    });
    document.body.appendChild(malixDoodleOverlay);
    document.body.appendChild(malixDoodlePopup);
    return { overlay: malixDoodleOverlay, popup: malixDoodlePopup };
  }

  function showMalixDoodlePopin() {
    const { overlay, popup } = getOrCreateMalixDoodlePopin();
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    popup.setAttribute('aria-hidden', 'false');
    popup.style.position = 'fixed';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%) scale(0.95)';
    popup.style.maxWidth = 'calc(100vw - 32px)';
    popup.style.width = 'min(400px, calc(100vw - 32px))';
    popup.className = 'tooltip-popup tooltip-popup-charte';
    requestAnimationFrame(function () {
      popup.classList.add('show');
      popup.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    function onOverlayClick(e) {
      if (e.target === overlay) hideMalixDoodlePopin();
    }
    function onDocumentClick(e) {
      if (malixDoodlePopup && malixDoodlePopup.classList.contains('show') && !malixDoodlePopup.contains(e.target)) {
        hideMalixDoodlePopin();
      }
    }
    function onEscape(e) {
      if (e.key === 'Escape') hideMalixDoodlePopin();
    }
    overlay.addEventListener('click', onOverlayClick);
    overlay._malixOnOverlayClick = onOverlayClick;
    overlay._malixOnDocumentClick = onDocumentClick;
    overlay._malixOnEscape = onEscape;
    document.addEventListener('keydown', onEscape);
    // Clic en dehors du popup : fermer (délai pour ne pas fermer sur le clic qui a ouvert)
    setTimeout(function () {
      document.addEventListener('click', onDocumentClick);
    }, 0);
  }

  function hideMalixDoodlePopin() {
    if (malixDoodleOverlay) {
      malixDoodleOverlay.classList.remove('show');
      malixDoodleOverlay.setAttribute('aria-hidden', 'true');
      if (malixDoodleOverlay._malixOnOverlayClick) {
        malixDoodleOverlay.removeEventListener('click', malixDoodleOverlay._malixOnOverlayClick);
        malixDoodleOverlay._malixOnOverlayClick = null;
      }
      if (malixDoodleOverlay._malixOnDocumentClick) {
        document.removeEventListener('click', malixDoodleOverlay._malixOnDocumentClick);
        malixDoodleOverlay._malixOnDocumentClick = null;
      }
      if (malixDoodleOverlay._malixOnEscape) {
        document.removeEventListener('keydown', malixDoodleOverlay._malixOnEscape);
        malixDoodleOverlay._malixOnEscape = null;
      }
    }
    if (malixDoodlePopup) {
      malixDoodlePopup.classList.remove('show');
      malixDoodlePopup.setAttribute('aria-hidden', 'true');
    }
  }

  // ============================================
  // MODE PLEIN ÉCRAN POUR LE PROGRAMME
  // ============================================
  const programFullscreenBtn = document.getElementById('programFullscreenBtn');
  const programFullscreenContainer = document.getElementById('programFullscreenContainer');
  const programFullscreenClose = document.getElementById('programFullscreenClose');
  const programFullscreenGrid = document.getElementById('programFullscreenGrid');
  const programFullscreenFloatingDoodles = document.getElementById('programFullscreenFloatingDoodles');
  const programFullscreenDayTabs = document.getElementById('programFullscreenDayTabs');
  const originalProgramGrid = document.querySelector('#programme .grid.grid-3');

  const fullscreenDoodleState = { active: null, autoSmashTimeoutId: null };
  let fullscreenDoodleIntervalId = null;
  const FULLSCREEN_DOODLE_INTERVAL_MS = 32000;
  const FULLSCREEN_DOODLE_SPAWN_PROB = 0.2;
  const FULLSCREEN_DOODLE_AUTOSMASH_MS = 16000;
  // Mode dev : localhost ou ?dev=1 ou #dev → premier doodle dans les 10 s max
  const fullscreenDoodleDevMode = window.location.hostname === 'localhost' ||
    window.location.search.includes('dev=1') ||
    window.location.hash === '#dev';
  const fullscreenDoodleIntervalMs = fullscreenDoodleDevMode ? 10000 : FULLSCREEN_DOODLE_INTERVAL_MS;
  const fullscreenDoodleSpawnProb = fullscreenDoodleDevMode ? 1 : FULLSCREEN_DOODLE_SPAWN_PROB;

  // Fonction pour obtenir l'élément en plein écran (avec préfixes navigateurs)
  function getFullscreenElement() {
    return document.fullscreenElement || 
           document.webkitFullscreenElement || 
           document.mozFullScreenElement || 
           document.msFullscreenElement || 
           null;
  }

  // Fonction pour entrer en mode plein écran
  function requestFullscreen(element) {
    if (element.requestFullscreen) {
      return element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      return element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      return element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      return element.msRequestFullscreen();
    }
    return Promise.reject(new Error('Fullscreen API not supported'));
  }

  // Fonction pour sortir du mode plein écran
  function exitFullscreen() {
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      return document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      return document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      return document.msExitFullscreen();
    }
    return Promise.reject(new Error('Fullscreen API not supported'));
  }

  // Fonction pour copier le contenu de la grille originale dans le conteneur plein écran
  function copyProgramToFullscreen() {
    if (!originalProgramGrid || !programFullscreenGrid) return;
    
    // Copier le contenu HTML de la grille originale
    programFullscreenGrid.innerHTML = originalProgramGrid.innerHTML;
    
    // Préserver l'état actif du jour sélectionné
    const activeDayIndex = Array.from(document.querySelectorAll('#programmeDayTabs .day-tab')).findIndex(
      tab => tab.classList.contains('active')
    );
    
    if (activeDayIndex >= 0) {
      const fullscreenDayCards = programFullscreenGrid.querySelectorAll('.day.card');
      fullscreenDayCards.forEach((card, index) => {
        if (index === activeDayIndex) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    }
  }

  // Fonction pour ouvrir le mode plein écran
  function openProgramFullscreen() {
    if (!programFullscreenContainer || !originalProgramGrid) return;
    
    // Copier le contenu avant d'afficher
    copyProgramToFullscreen();
    
    // Afficher le conteneur
    programFullscreenContainer.style.display = 'flex';
    
    programFullscreenContainer.classList.add('program-fullscreen--single-day');
    const activeDayIndex = Array.from(document.querySelectorAll('#programmeDayTabs .day-tab')).findIndex(
      tab => tab.classList.contains('active')
    );
    if (activeDayIndex >= 0) {
      updateFullscreenActiveDay(activeDayIndex);
    }
    
    // Doodles flottants en fullscreen (pas trop souvent, disparaissent seuls après une apparition)
    if (spawnFloatingDoodleIn && programFullscreenFloatingDoodles && !reduceMotion) {
      fullscreenDoodleState.active = null;
      fullscreenDoodleState.autoSmashTimeoutId = null;
      fullscreenDoodleIntervalId = setInterval(function () {
        if (programFullscreenContainer.style.display !== 'flex') return;
        if (fullscreenDoodleState.active) return;
        if (Math.random() > fullscreenDoodleSpawnProb) return;
        spawnFloatingDoodleIn(programFullscreenFloatingDoodles, fullscreenDoodleState, { autoSmashMs: FULLSCREEN_DOODLE_AUTOSMASH_MS });
      }, fullscreenDoodleIntervalMs);
    }
    
    // Entrer en mode plein écran du navigateur
    requestFullscreen(document.documentElement).catch(err => {
      console.warn('Erreur lors de l\'entrée en mode plein écran:', err);
      // Si le plein écran échoue, on affiche quand même le conteneur en overlay
    });
    
    // Bloquer le scroll du body
    document.body.style.overflow = 'hidden';
  }

  // Fonction pour fermer le mode plein écran
  function closeProgramFullscreen() {
    if (!programFullscreenContainer) return;
    
    programFullscreenContainer.classList.remove('program-fullscreen--single-day');
    
    // Sortir du mode plein écran du navigateur
    if (getFullscreenElement()) {
      exitFullscreen().catch(err => {
        console.warn('Erreur lors de la sortie du mode plein écran:', err);
      });
    }
    
    // Arrêter les doodles fullscreen et supprimer l’éventuel doodle actif
    if (fullscreenDoodleIntervalId) {
      clearInterval(fullscreenDoodleIntervalId);
      fullscreenDoodleIntervalId = null;
    }
    if (fullscreenDoodleState.autoSmashTimeoutId) {
      clearTimeout(fullscreenDoodleState.autoSmashTimeoutId);
      fullscreenDoodleState.autoSmashTimeoutId = null;
    }
    if (fullscreenDoodleState.active && fullscreenDoodleState.active.parentNode) {
      fullscreenDoodleState.active.parentNode.removeChild(fullscreenDoodleState.active);
      fullscreenDoodleState.active = null;
    }
    
    // Masquer le conteneur
    programFullscreenContainer.style.display = 'none';
    
    // Restaurer le scroll du body
    document.body.style.overflow = '';
  }

  // Gérer les événements de changement de plein écran
  function handleFullscreenChange() {
    const isFullscreen = !!getFullscreenElement();
    
    if (!isFullscreen && programFullscreenContainer.style.display === 'flex') {
      // Si on sort du plein écran mais que le conteneur est encore affiché, le fermer
      closeProgramFullscreen();
    }
  }

  // Écouter les événements de changement de plein écran (avec préfixes)
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);

  // Gérer le clic sur le bouton plein écran
  if (programFullscreenBtn) {
    programFullscreenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.posthog) {
        const resolution = `${window.screen.width}x${window.screen.height}`;
        window.posthog.capture('programme_fullscreen_click', {
          resolution: resolution,
          screen_width: window.screen.width,
          screen_height: window.screen.height
        });
      }
      openProgramFullscreen();
    });
  }

  // Gérer le clic sur le bouton de fermeture
  if (programFullscreenClose) {
    programFullscreenClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeProgramFullscreen();
    });
  }

  // Gérer la touche Escape pour fermer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && programFullscreenContainer && programFullscreenContainer.style.display === 'flex') {
      closeProgramFullscreen();
    }
  });

  // Fonction pour mettre à jour le jour actif en plein écran
  function updateFullscreenActiveDay(dayIndex) {
    if (!programFullscreenGrid) return;
    
    const fullscreenDayCards = programFullscreenGrid.querySelectorAll('.day.card');
    fullscreenDayCards.forEach((card, index) => {
      if (index === dayIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
    
    if (programFullscreenDayTabs) {
      const fullscreenTabs = programFullscreenDayTabs.querySelectorAll('.day-tab');
      fullscreenTabs.forEach((tab, index) => {
        tab.classList.toggle('active', index === dayIndex);
      });
    }
    
    // Synchroniser aussi avec les tabs de la vue normale
    const programmeDayTabs = document.querySelectorAll('#programmeDayTabs .day-tab');
    programmeDayTabs.forEach((tab, index) => {
      tab.classList.toggle('active', index === dayIndex);
    });
    
    // Synchroniser avec les cartes de la vue normale
    const normalDayCards = document.querySelectorAll('#programme .day.card');
    normalDayCards.forEach((card, index) => {
      if (index === dayIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  // URL du jeu Braquage (ouverture au clic en fullscreen puis sortie du plein écran)
  const BRAQUAGE_URL = 'https://plamarque.github.io/braquage/';

  // Gérer les clics sur les cartes jour en plein écran pour changer de jour actif
  if (programFullscreenContainer) {
    programFullscreenContainer.addEventListener('click', (e) => {
      if (programFullscreenContainer.style.display !== 'flex') return;

      // Clic sur le slot Braquage : quitter le fullscreen et ouvrir le jeu dans un nouvel onglet
      const slot = e.target.closest('button.slot-format-long');
      if (slot) {
        const titleEl = slot.querySelector('.slot-content h3');
        if (titleEl && titleEl.textContent.trim() === 'Braquage') {
          e.preventDefault();
          e.stopPropagation();
          closeProgramFullscreen();
          window.open(BRAQUAGE_URL, '_blank', 'noopener,noreferrer');
          return;
        }
      }

      // Vérifier si on clique sur une carte jour (mais pas sur les éléments interactifs à l'intérieur)
      const dayCard = e.target.closest('.day.card');
      if (dayCard) {
        // Ne pas changer de jour si on clique sur un bouton, lien ou élément interactif
        if (e.target.closest('button, a, [data-spectacle]')) {
          return;
        }

        const dayCards = programFullscreenGrid.querySelectorAll('.day.card');
        const dayIndex = Array.from(dayCards).indexOf(dayCard);

        if (dayIndex >= 0) {
          updateFullscreenActiveDay(dayIndex);
        }
      }
    });
  }

  if (programFullscreenDayTabs) {
    programFullscreenDayTabs.querySelectorAll('.day-tab').forEach((tab, index) => {
      tab.addEventListener('click', () => {
        setCurrentDay(index);
        updateFullscreenActiveDay(index);
      });
    });
  }

  // Témoignages carousel (chargé depuis JSON)
  const testimonialsSection = document.getElementById('temoignages');
  if (testimonialsSection) {
    const track = testimonialsSection.querySelector('.testimonials-track');
    const prevBtn = testimonialsSection.querySelector('.testimonials-prev');
    const nextBtn = testimonialsSection.querySelector('.testimonials-next');
    const dotsContainer = testimonialsSection.querySelector('.testimonials-dots');

    function buildTestimonialCard(item) {
      const article = document.createElement('article');
      article.className = 'testimonial-card';
      const inner = document.createElement('div');
      inner.className = 'testimonial-card-inner';

      const photo = document.createElement('div');
      photo.className = 'testimonial-photo';
      if (item.imageAvif128 && item.imageAvif256) {
        const picture = document.createElement('picture');
        const source = document.createElement('source');
        source.type = 'image/avif';
        source.srcset = item.imageAvif128 + ' 128w, ' + item.imageAvif256 + ' 256w';
        source.sizes = '(max-width: 480px) 32vw, 220px';
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = 'Photo de ' + (item.name || '');
        img.width = 128;
        img.height = 128;
        img.loading = 'lazy';
        picture.appendChild(source);
        picture.appendChild(img);
        photo.appendChild(picture);
      } else {
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = 'Photo de ' + (item.name || '');
        img.width = 128;
        img.height = 128;
        img.loading = 'lazy';
        photo.appendChild(img);
      }
      inner.appendChild(photo);

      const body = document.createElement('div');
      body.className = 'testimonial-body';
      if (!item.omitHeader) {
        const nameEl = document.createElement('p');
        nameEl.className = 'testimonial-name';
        const starIcon = document.createElement('span');
        starIcon.className = 'stage-star-icon testimonial-star-icon';
        starIcon.setAttribute('aria-hidden', 'true');
        starIcon.innerHTML =
          '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>';
        nameEl.appendChild(starIcon);
        nameEl.appendChild(document.createTextNode(' ' + (item.name || '')));
        body.appendChild(nameEl);
        const roleEl = document.createElement('p');
        roleEl.className = 'testimonial-role';
        roleEl.textContent = item.role || '';
        body.appendChild(roleEl);
      }
      const quote = document.createElement('blockquote');
      quote.className = 'testimonial-quote';
      const quoteP = document.createElement('p');
      quoteP.textContent = item.quote || '';
      quote.appendChild(quoteP);
      body.appendChild(quote);
      if (item.signature) {
        const sig = document.createElement('p');
        sig.className = 'testimonial-signature';
        sig.textContent = item.signature;
        body.appendChild(sig);
      }
      inner.appendChild(body);
      article.appendChild(inner);
      return article;
    }

    function initCarousel() {
      const cards = testimonialsSection.querySelectorAll('.testimonial-card');
      const dots = testimonialsSection.querySelectorAll('.testimonials-dot');
      if (cards.length === 0 || !track) return;

      function getCardWidth() {
        const card = cards[0];
        const gap = parseFloat(getComputedStyle(track).gap) || 20;
        return card.offsetWidth + gap;
      }

      function updateButtons() {
        if (!prevBtn || !nextBtn) return;
        const maxScroll = track.scrollWidth - track.clientWidth;
        prevBtn.disabled = track.scrollLeft <= 0;
        nextBtn.disabled = maxScroll <= 0 || track.scrollLeft >= maxScroll - 1;
        prevBtn.setAttribute('aria-disabled', prevBtn.disabled);
        nextBtn.setAttribute('aria-disabled', nextBtn.disabled);
      }

      function updateActiveDot() {
        if (dots.length === 0) return;
        const gap = parseFloat(getComputedStyle(track).gap) || 20;
        const scrollLeft = track.scrollLeft;
        let index = 0;
        let acc = 0;
        for (let i = 0; i < cards.length; i++) {
          acc += cards[i].offsetWidth + gap;
          if (scrollLeft < acc - cards[i].offsetWidth / 2) {
            index = i;
            break;
          }
          index = i;
        }
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
          dot.setAttribute('aria-selected', i === index);
        });
      }

      if (prevBtn && track) {
        prevBtn.addEventListener('click', () => {
          track.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
        });
      }
      if (nextBtn && track) {
        nextBtn.addEventListener('click', () => {
          track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
        });
      }
      if (track) {
        track.addEventListener('scroll', () => {
          updateButtons();
          updateActiveDot();
        }, { passive: true });
      }
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          const card = cards[index];
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        });
      });
      updateButtons();
      updateActiveDot();
    }

    if (track) {
      // Incrémenter après changement des données pour forcer une nouvelle URL (cache navigateur / CDN).
      const TEMOIGNAGES_JSON_QUERY_BUST = '2';
      const temoignagesUrl = new URL('assets/data/temoignages.json', document.documentElement.baseURI || window.location.href);
      temoignagesUrl.searchParams.set('v', TEMOIGNAGES_JSON_QUERY_BUST);
      // no-cache : revalidation ; le ?v= évite une réponse servie depuis une entrée cache trop longue
      fetch(temoignagesUrl.href, { cache: 'no-cache' })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          const list = Array.isArray(data) ? data : [];
          if (list.length === 0) {
            testimonialsSection.style.display = 'none';
            return;
          }
          list.forEach(item => {
            const valid =
              item &&
              item.quote &&
              item.image &&
              item.name &&
              (item.omitHeader || item.role);
            if (valid) {
              track.appendChild(buildTestimonialCard(item));
            }
          });
          const count = track.children.length;
          if (count === 0) {
            testimonialsSection.style.display = 'none';
            return;
          }
          if (count === 1) {
            testimonialsSection.classList.add('testimonials-single');
          } else if (dotsContainer) {
            for (let i = 0; i < count; i++) {
              const dot = document.createElement('button');
              dot.type = 'button';
              dot.className = 'testimonials-dot' + (i === 0 ? ' active' : '');
              dot.setAttribute('role', 'tab');
              dot.setAttribute('aria-label', 'Témoignage ' + (i + 1));
              dot.setAttribute('aria-selected', i === 0);
              dot.setAttribute('data-index', String(i));
              dotsContainer.appendChild(dot);
            }
          }
          testimonialsSection.style.display = 'block';
          testimonialsSection.classList.add('is-visible');
          initCarousel();
        })
        .catch(() => {
          testimonialsSection.style.display = 'none';
        });
    }
  }
