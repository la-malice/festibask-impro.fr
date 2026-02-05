  const BILETTERIE_URL = 'https://www.helloasso.com/associations/arteateou/evenements/festibask-impro';

  // Données des joueurs de l'Équipe de France (ordre alphabétique du prénom pour les slides)
  const edfPlayers = [
    {
      name: 'Aurélie Desert',
      image: 'assets/img/edf-aurelie.jpeg',
      bio: 'Comédienne, chanteuse et auteure, formée au théâtre et à l\'improvisation à Bordeaux. Membre de l\'Équipe de France depuis 2018, elle évolue entre scène, rue et formats improvisés. Représente Bordeaux.'
    },
    {
      name: 'Cécile Giroud',
      role: 'Capitaine',
      image: 'assets/img/edf-cecile.jpeg',
      bio: 'Comédienne, humoriste et musicienne. Figure majeure de l\'impro française, multiple championne du monde. Capitaine de l\'Équipe de France, reconnue pour sa polyvalence, son énergie collective et son sens du jeu. Représente Lyon.'
    },
    {
      name: 'Félix Philippart',
      image: 'assets/img/edf-felix.JPEG',
      bio: 'Formé à Caen puis à Paris, improvisateur professionnel et pilier de l\'Équipe de France depuis 2021. Il joue dans de nombreux spectacles et enseigne le théâtre à la Manufacture de l\'Acteur. Représente Caen.'
    },
    {
      name: 'Igor Potoczny',
      image: 'assets/img/edf-igor.jpeg',
      bio: 'Improvisateur parmi les plus titrés de France, membre de l\'Équipe de France depuis 1997. Triple champion du monde, habitué des scènes internationales, notamment au festival Juste pour Rire à Montréal. Représente Niort.'
    },
    {
      name: 'Olivier Descargues',
      role: 'Coach',
      image: 'assets/img/edf-olivier.png',
      bio: 'Improvisateur depuis 1987, membre historique de l\'Équipe de France, triple champion du monde. Coach de l\'équipe depuis 2015. Cofondateur de la Ligue Majeure, créateur et interprète de nombreux spectacles de référence.'
    }
  ];

  // Données des joueurs de l'Équipe de Belgique (ordre alphabétique du prénom pour les slides)
  const belgPlayers = [
    { name: 'Adrien De Goes', image: 'assets/img/belg-adrien.avif', bio: '42 ans, dont 20 à improviser. L\'un des jouteurs les plus complets de sa génération : il construit les histoires, sublime celles des autres, transforme chaque scène en terrain de jeu. Humour tenace, imagination débordante, charisme fou. Bête de scène et partenaire en or ; avec lui, l\'impro est un voyage dont on ne revient pas pareil.' },
    { name: 'François Ghislain', image: 'assets/img/belg-francois.avif', bio: 'Meneur au sourire facile et à l\'imagination turbo : lancer une impro, rattraper un partenaire en chute libre et écouter profondément, tout ça dans la même minute. Perfectionniste, à l\'écoute, chaleureux ; il fédère, fait briller les autres et transforme le grain de folie en moment magique. Avec lui ça part en vrille, toujours avec bienveillance, humour et l\'envie de partager.' },
    { name: 'Julie De Greef', image: 'assets/img/belg-julie.avif', bio: '' },
    { name: 'Marielle Chuffart', image: 'assets/img/belg-marielle.avif', bio: 'Pile électrique au cœur XXL, humour délicieusement douteux. Énergique, elle plonge dans les personnages les plus improbables et transforme les catégories en terrain de jeu déjanté. Spontanéité contagieuse, générosité sur scène. Avec Marielle : énergie brute, vannes assumées et une présence chaleureuse qui embarque tout le monde.' },
    { name: 'Sophie Normand', image: 'assets/img/belg-sophie-normand.avif', bio: 'Depuis plus de dix ans, Sophie navigue dans l\'impro comme une tour de contrôle : calme, précise, elle transforme le moindre détail en récit cohérent. Elle écoute, relie et équilibre pour faire décoller les histoires. Sous sa rigueur, une Sophie délicieusement déjantée : voix improbables, personnages barrés. Carrée et folle, toujours au service du jeu.' }
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

    Promise.all(Array.from({ length: 26 }, (_, i) => {
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
          do { pick = Math.floor(Math.random() * 26); } while (used.has(pick));
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
      return Promise.all(Array.from({ length: 26 }, (_, i) => {
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
        const svgIndex = Math.floor(Math.random() * 26);
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

  // Vidéo hero : mode YouTube (iframe au clic) ou vidéo auto-hébergée (MP4 au clic) selon data-hero-video
  const heroVideoContainer = document.getElementById('heroVideoContainer');
  const heroVideo = document.getElementById('heroVideo');
  const heroVideoPlayOverlay = document.getElementById('heroVideoPlayOverlay');

  if (heroVideoContainer && heroVideo && heroVideoPlayOverlay) {
    const heroVideoMode = heroVideoContainer.dataset.heroVideo;
    const heroYoutubeId = heroVideoContainer.dataset.heroYoutubeId;
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

    if (isYoutubeMode) {
      resolveEffectiveYoutubeId(function (effectiveYoutubeId) {
        heroVideo.classList.add('hidden');
        const posterUrl = heroVideo.getAttribute('poster') || 'assets/img/hero-video-poster-336w.avif';
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
            events: { onStateChange: onPlayerStateChange }
          });
          hidePlayOverlay();
        }

        heroVideoPlayOverlay.addEventListener('click', function () {
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
      });
    } else {
      function startVideo() {
        if (!heroVideo.src && heroVideo.dataset.src) {
          heroVideo.muted = true;
          heroVideo.src = heroVideo.dataset.src;
          heroVideo.load();
          heroVideo.addEventListener('loadeddata', () => {
            heroVideo.play().catch(() => {});
            hidePlayOverlay();
          }, { once: true });
        } else if (heroVideo.src) {
          heroVideo.muted = true;
          heroVideo.play().catch(() => {});
          hidePlayOverlay();
        }
      }

      heroVideoPlayOverlay.addEventListener('click', startVideo);

      heroVideo.addEventListener('ended', () => {
        showPlayOverlay();
      });
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

  // Modal open/close
  const dlg=document.getElementById('notify');
  document.querySelectorAll('[data-open="notify"]').forEach(b=>b.addEventListener('click',()=>{
    ensureSibStylesLoaded();
    ensureSibScriptLoaded().then(() => {
    dlgWaitlist.close();
    dlg.showModal();
  });
  }));
  dlg.addEventListener('click',e=>{
    const r=dlg.querySelector('.modal-card').getBoundingClientRect();
    const inside=r.top<=e.clientY && e.clientY<=r.bottom && r.left<=e.clientX && e.clientX<=r.right;
    if(!inside) dlg.close();
  });

  // Modal waitlist open/close
  const dlgWaitlist = document.getElementById('waitlist');
  document.querySelectorAll('[data-open="waitlist"]').forEach(b => b.addEventListener('click', () => {
    ensureSibStylesLoaded();
    ensureSibScriptLoaded().then(() => {
    dlg.close();
    dlgWaitlist.showModal();
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
  });

  // Brevo gère automatiquement le masquage du formulaire avec AUTOHIDE = Boolean(1)
  // Le bouton "Fermer" dans le message de succès permet de fermer la popup explicitement

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

  // Fonction pour mettre en surbrillance les stages du jour sélectionné
  function updateStagesDayHighlight(dayIndex) {
    const atelierCards = document.querySelectorAll('#stages .atelier-card');
    atelierCards.forEach((card) => {
      const cardDay = parseInt(card.getAttribute('data-day'), 10);
      card.classList.toggle('active', !Number.isNaN(cardDay) && cardDay === dayIndex);
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
        return;
      }
      // Colonne déjà en surbrillance : ne pas consommer le clic sur lien/bouton (laisser flip ou navigation)
      if (e.target.closest('a, button')) return;
      setCurrentDay(dayIndex);
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
    });
  });

  // Section stages : si la carte n'est pas en surbrillance (jour non sélectionné), tout clic ne fait que sélectionner le jour (pas de flip)
  document.querySelectorAll('#stages .atelier-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (!card.classList.contains('active')) {
        e.preventDefault();
        e.stopPropagation();
        const dayIndex = parseInt(card.getAttribute('data-day'), 10);
        if (!Number.isNaN(dayIndex)) setCurrentDay(dayIndex);
      }
    }, true);
  });

  // Cartes stage : verso déroulé DEDANS (overlay). Seul le .flip-container a une min-height
  // (pas l’article .atelier-card, pour éviter les conflits). Recto mesuré avant .measuring.
  const STAGE_VERSO_MAX_TOTAL = Math.min(960, Math.round(0.88 * window.innerHeight));

  function openStageVerso(flipContainer) {
    const front = flipContainer.querySelector('.flip-front');
    const back = flipContainer.querySelector('.flip-back');
    if (!front || !back) return;
    const frontHeight = front.offsetHeight;
    flipContainer.classList.add('flipped', 'measuring');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const backContent = back.querySelector('.content');
        const backHeight = backContent ? backContent.offsetHeight : back.offsetHeight;
        flipContainer.classList.remove('measuring');
        const backMax = Math.min(backHeight, STAGE_VERSO_MAX_TOTAL - frontHeight);
        const sameHeight = backMax + 'px';
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
    });
  });

  // 2) Clic n'importe où sur le recto (hors boutons) → déroule le verso
  document.querySelectorAll('.atelier-card .flip-container .flip-front').forEach(front => {
    front.addEventListener('click', e => {
      if (e.target.closest('.btn-inscription, .btn-waitlist, a')) return;
      if (e.target.closest('.instructor-flip-container')) return;
      const flipContainer = front.closest('.flip-container');
      if (flipContainer) openStageVerso(flipContainer);
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
    });
  });

  // Flip pour afficher la bio de l'intervenant (recto et verso : overlay au lieu de flipper la carte)
  const instructorFlipHandler = (container) => {
    container.addEventListener('click',e=>{
      if (e.target.closest('a')) return; /* laisser les liens (ex. @insta) ouvrir sans fermer la bio */
      e.preventDefault();
      const isFlipped = container.classList.contains('flipped');
      const back = container.querySelector('.instructor-flip-back');
      
      if(!back) return; // Si pas de back, on ne fait rien
      
      if(!isFlipped){
        // On va flip, on calcule la hauteur nécessaire pour la bio
        // On fait une copie temporaire pour mesurer
        const tempBack = back.cloneNode(true);
        tempBack.style.position = 'absolute';
        tempBack.style.visibility = 'hidden';
        tempBack.style.transform = 'none';
        tempBack.style.width = back.offsetWidth + 'px';
        document.body.appendChild(tempBack);
        const measuredHeight = tempBack.scrollHeight + 28; // + padding
        document.body.removeChild(tempBack);
        // Plafonner la hauteur pour ne pas déformer la ligne de stages (bio scrollable si besoin)
        const maxInstructorFlipHeight = 280;
        const backHeight = Math.min(measuredHeight, maxInstructorFlipHeight);

        // On applique la hauteur au container
        container.style.minHeight = backHeight + 'px';
        // Petit délai pour que la hauteur soit appliquée avant le flip
        setTimeout(()=>{
          container.classList.add('flipped');
        }, 10);
      } else {
        // On revient en arrière, on remet la hauteur minimale
        container.classList.remove('flipped');
        setTimeout(()=>{
          container.style.minHeight = '60px';
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
      container.classList.toggle('flipped');
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
      pitch: 'Un braquage est en cours, portes closes. Otages et braqueurs se font face, chacun avec ses raisons, ses choix… et ce qu\'il préfère taire. Un format tendu et cinématographique, où le public désigne les positions de chacun avant de plonger dans une fiction en temps réel.'
    },
    'spectacle-vendredi-match': {
      type: 'match',
      time: '21:00',
      label: 'Match',
      title: 'La Malice vs Belgique',
      image: 'assets/img/equipe-belgique-640w.avif',
      pitch: 'Le match d\'impro est le format phare par lequel l\'impro s\'est diffusée. Venu du Québec, il emprunte aux codes du Hockey sur glace où 2 équipes de comédiens s\'affrontent sur une patinoire dans des séquences brèves et rythmées sous la surveillance d\'un arbitre implacable&nbsp;!'
    },
    'spectacle-samedi-format-long': {
      type: 'format-long',
      time: '19:00',
      label: 'Impro longue',
      title: 'Commis d\'Office',
      image: 'assets/img/long/commis-d-office-640w.avif',
      pitch: 'L\'un·e est accusé·e<br>L\'autre est avocat·e<br>L\'un·e est coupable<br>L\'autre devra trouver des circonstances atténuante.<br>Venez découvrir son histoire, son passé son crime et les raisons qui l\'ont poussées à commettre l\'irréparable'
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
      time: '19:00',
      label: 'Impro longue',
      title: 'Promo 2006',
      image: 'assets/img/long/promo-2006-640w.avif',
      pitch: 'Vingt ans après, une ancienne promo se retrouve pour une soirée pleine de secrets, de couples improbables et de souvenirs qui dérapent. Un format joyeux et tendre, où le public choisit l\'école, les liens… et ce qui aurait mieux valu rester enterré.'
    },
    'spectacle-dimanche-match': {
      type: 'match',
      time: '21:00',
      label: 'Match',
      title: 'La Malice vs Suisse',
      image: 'assets/img/equipe-suisse-640w.avif',
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
    });
  });

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
        initSpectacleSingleSlide(block, spectaclesData[blockId]);
      }
    });
  });

  // Fonction pour initialiser le slider de bios des joueurs
  function getFirstSentence(htmlOrText) {
    const stripped = (htmlOrText || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const match = stripped.match(/^[^.!?]+[.!?]?/);
    return match ? match[0].trim() : stripped;
  }

  function initMatchSlider(matchBlock, players, originalImageSrc, intro) {
    // intro optionnel : { title, pitch } pour la slide 1 ; sinon défaut France
    const introTitle = intro?.title ?? 'L\'Équipe de France';
    const introPitch = intro?.pitch ?? 'Champions du monde, artistes reconnus et figures majeures de l\'improvisation professionnelle. Une équipe d\'excellence réunissant expérience, créativité et intensité scénique, au service de spectacles uniques et exigeants. Photo : © J.DUFRESNE';

    // Vérifier si le slider existe déjà
    let sliderContainer = matchBlock.querySelector('.match-slider-container');
    
    if (!sliderContainer) {
      // Créer la structure du slider
      sliderContainer = document.createElement('div');
      sliderContainer.className = 'match-slider-container';
      
      const sliderTrack = document.createElement('div');
      sliderTrack.className = 'match-slider-track';
      
      // Slide 1 : Image en background calée à droite (comme la bannière)
      const originalSlide = document.createElement('div');
      originalSlide.className = 'match-slide match-slide-bg-right';
      originalSlide.style.backgroundImage = `url("${originalImageSrc}")`;
      
      const originalOverlay = document.createElement('div');
      originalOverlay.className = 'match-slide-overlay';
      
      const title = document.createElement('div');
      title.className = 'match-slide-name';
      title.textContent = introTitle;
      
      const pitchShort = document.createElement('div');
      pitchShort.className = 'match-slide-bio match-slide-bio-short';
      pitchShort.textContent = getFirstSentence(introPitch);
      const pitchFull = document.createElement('div');
      pitchFull.className = 'match-slide-bio match-slide-bio-full';
      pitchFull.textContent = introPitch;
      
      originalOverlay.appendChild(title);
      originalOverlay.appendChild(pitchShort);
      originalOverlay.appendChild(pitchFull);
      originalSlide.appendChild(originalOverlay);
      sliderTrack.appendChild(originalSlide);
      
      // Slides suivants : Joueurs (image en background calée à droite)
      players.forEach(player => {
        const playerSlide = document.createElement('div');
        playerSlide.className = 'match-slide match-slide-bg-right';
        playerSlide.style.backgroundImage = `url("${encodeURI(player.image)}")`;
        
        const playerOverlay = document.createElement('div');
        playerOverlay.className = 'match-slide-overlay';
        
        const playerName = document.createElement('div');
        playerName.className = 'match-slide-name';
        playerName.textContent = player.name;
        
        playerOverlay.appendChild(playerName);
        
        if (player.role) {
          const playerRole = document.createElement('div');
          playerRole.className = 'match-slide-role';
          playerRole.textContent = player.role;
          playerOverlay.appendChild(playerRole);
        }
        
        const playerBioShort = document.createElement('div');
        playerBioShort.className = 'match-slide-bio match-slide-bio-short';
        playerBioShort.textContent = getFirstSentence(player.bio);
        const playerBioFull = document.createElement('div');
        playerBioFull.className = 'match-slide-bio match-slide-bio-full';
        playerBioFull.textContent = player.bio;
        playerOverlay.appendChild(playerBioShort);
        playerOverlay.appendChild(playerBioFull);
        
        playerSlide.appendChild(playerOverlay);
        sliderTrack.appendChild(playerSlide);
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
      
      // Créer les points de navigation (dots)
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'match-slider-dots';
      const totalSlides = 1 + players.length; // 1 slide original + slides joueurs
      
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
      
      sliderContainer.appendChild(sliderTrack);
      sliderContainer.appendChild(closeButton);
      sliderContainer.appendChild(dotsContainer);
      matchBlock.appendChild(sliderContainer);
    }
    
    // Activer le slider
    matchBlock.classList.add('slider-active');
    
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
    slide.style.backgroundImage = `url("${encodeURI(data.image)}")`;
    const overlay = document.createElement('div');
    overlay.className = 'match-slide-overlay';
    const meta = document.createElement('div');
    meta.className = 'match-slide-role';
    meta.textContent = data.time + ' — ' + data.label;
    const titleEl = document.createElement('div');
    titleEl.className = 'match-slide-name';
    titleEl.textContent = data.title;
    const pitchShort = document.createElement('div');
    pitchShort.className = 'match-slide-bio match-slide-bio-short';
    pitchShort.textContent = getFirstSentence(data.pitch);
    const pitchFull = document.createElement('div');
    pitchFull.className = 'match-slide-bio match-slide-bio-full';
    pitchFull.innerHTML = data.pitch;
    overlay.appendChild(meta);
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
  
  // Fonction pour aller à un slide spécifique
  function goToSlide(matchBlock, slideIndex) {
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
      currentSlide = (currentSlide + 1) % totalSlides;
      matchBlock._currentSlide = currentSlide;
      sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Mettre à jour les dots actifs
      const dots = matchBlock.querySelectorAll('.match-slider-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
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

      function getOriginalImageSrc(blk) {
        const originalImage = blk.querySelector('.match-image');
        if (originalImage) {
          const src = originalImage.currentSrc || originalImage.getAttribute('src');
          return src ? encodeURI(src) : '';
        }
        const bgImage = window.getComputedStyle(blk).backgroundImage;
        if (bgImage && bgImage !== 'none') {
          const match = bgImage.match(/url\(["']?([^"']+)["']?\)/);
          if (match && match[1]) return match[1];
        }
        return '';
      }

      if (isFranceMatch && edfPlayers && edfPlayers.length > 0) {
        const originalImageSrc = getOriginalImageSrc(block);
        const edfIntro = {
          title: 'L\'Équipe de France',
          pitch: 'Champions du monde, artistes reconnus et figures majeures de l\'improvisation professionnelle. Une équipe d\'excellence réunissant expérience, créativité et intensité scénique, au service de spectacles uniques et exigeants. Photo : © J.DUFRESNE'
        };
        initMatchSlider(block, edfPlayers, originalImageSrc, edfIntro);
      } else if (isBelgiumMatch && belgPlayers && belgPlayers.length > 0) {
        const originalImageSrc = getOriginalImageSrc(block);
        const belgIntro = {
          title: 'L\'Équipe de Belgique',
          pitch: 'Depuis la Belgique, Les Zatilas ont traversé frontières et bière pour chatouiller vos zygomatiques. Troupe passionnée, délicieusement zinzin : un mot devient épopée, un regard comédie. Anglet, prépare-toi : impro totale, avec un goût de Belgique qui colle aux doigts.'
        };
        initMatchSlider(block, belgPlayers, originalImageSrc, belgIntro);
      } else if (blockId && spectaclesData && spectaclesData[blockId]) {
        initSpectacleSingleSlide(block, spectaclesData[blockId]);
      }
    });
  });

  // Appliquer l'image en background sur mobile (matchs + format long)
  function applyMatchBackgroundOnMobile() {
    if (window.matchMedia('(max-width: 768px)').matches) {
      document.querySelectorAll('.match-block').forEach(block => {
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
      document.querySelectorAll('.format-long-block').forEach(block => {
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
    } else {
      document.querySelectorAll('.match-block').forEach(block => {
        block.style.backgroundImage = '';
        block.style.backgroundSize = '';
        block.style.backgroundPosition = '';
        block.style.backgroundRepeat = '';
      });
      document.querySelectorAll('.format-long-block').forEach(block => {
        block.style.backgroundImage = '';
        block.style.backgroundSize = '';
        block.style.backgroundPosition = '';
        block.style.backgroundRepeat = '';
      });
    }
  }

  // Appliquer au chargement et au franchissement du breakpoint
  applyMatchBackgroundOnMobile();
  window.matchMedia('(max-width: 768px)').addEventListener('change', applyMatchBackgroundOnMobile);

  // Tooltips explicatifs pour "format long" et "match"
  const tooltipTexts = {
    'format-long': 'Le format long est du théâtre d\'improvisation où rien n\'est écrit : une histoire unique se crée sous vos yeux à partir d\'un simple cadre, souvent inspiré par le public. On y suit des personnages touchants, des moments suspendus et cette tension délicieuse du jeu en équilibre permanent.',
    'match': 'Le match d\'impro est le format phare par lequel l\'impro s\'est diffusée. Venu du Québec, il emprunte aux codes du Hockey sur glace où 2 équipes de comédiens s\'affrontent sur une patinoire dans des séquences brèves et rythmées sous la surveillance d\'un arbitre implacable !'
  };

  let activeTooltip = null;
  let tooltipOverlay = null;

  // Créer l'overlay pour mobile
  function createTooltipOverlay() {
    if (!tooltipOverlay) {
      tooltipOverlay = document.createElement('div');
      tooltipOverlay.className = 'tooltip-overlay';
      document.body.appendChild(tooltipOverlay);
    }
    return tooltipOverlay;
  }

  // Créer ou récupérer le popup de tooltip
  function getOrCreateTooltipPopup(tooltipId) {
    let popup = document.getElementById(`tooltip-${tooltipId}`);
    if (!popup) {
      popup = document.createElement('div');
      popup.id = `tooltip-${tooltipId}`;
      popup.className = 'tooltip-popup';
      popup.setAttribute('role', 'tooltip');
      popup.setAttribute('aria-hidden', 'true');
      document.body.appendChild(popup);
    }
    return popup;
  }

  // Calculer la position optimale du tooltip
  function calculateTooltipPosition(trigger, popup) {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      return 'fixed'; // Sur mobile, on utilise position fixed centré
    }

    const triggerRect = trigger.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Position par défaut : en dessous
    let position = 'bottom';
    let top = triggerRect.bottom + scrollY + 12;
    let left = triggerRect.left + scrollX + (triggerRect.width / 2);

    // Vérifier si on dépasse en bas
    if (triggerRect.bottom + popupRect.height + 12 > viewportHeight) {
      // Essayer en haut
      if (triggerRect.top - popupRect.height - 12 >= 0) {
        position = 'top';
        top = triggerRect.top + scrollY - popupRect.height - 12;
      } else {
        // Si pas assez de place en haut, garder en bas mais ajuster
        top = viewportHeight + scrollY - popupRect.height - 20;
      }
    }

    // Vérifier si on dépasse à droite
    if (left + popupRect.width / 2 > viewportWidth + scrollX) {
      left = viewportWidth + scrollX - popupRect.width / 2 - 16;
    }
    // Vérifier si on dépasse à gauche
    if (left - popupRect.width / 2 < scrollX) {
      left = scrollX + popupRect.width / 2 + 16;
    }

    return { position, top, left };
  }

  // Afficher le tooltip
  function showTooltip(trigger, tooltipId) {
    // Fermer le tooltip actif s'il y en a un
    if (activeTooltip && activeTooltip !== trigger) {
      hideTooltip(activeTooltip);
    }

    const text = tooltipTexts[tooltipId];
    if (!text) return;

    const popup = getOrCreateTooltipPopup(tooltipId);
    popup.textContent = text;
    popup.setAttribute('aria-hidden', 'false');

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Mobile : position fixed centré avec overlay
      const overlay = createTooltipOverlay();
      overlay.classList.add('show');
      popup.style.position = 'fixed';
      popup.style.left = '50%';
      popup.style.top = '50%';
      popup.style.transform = 'translate(-50%, -50%) scale(0.95)';
      popup.style.maxWidth = 'calc(100vw - 32px)';
      popup.style.width = 'calc(100vw - 32px)';
      popup.className = 'tooltip-popup';
      
      // Afficher avec animation
      requestAnimationFrame(() => {
        popup.classList.add('show');
        popup.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    } else {
      // Desktop : d'abord rendre le popup (même invisible) pour obtenir ses dimensions
      popup.style.visibility = 'hidden';
      popup.style.display = 'block';
      popup.style.position = 'absolute';
      popup.style.top = '0';
      popup.style.left = '0';
      popup.className = 'tooltip-popup';
      
      // Calculer la position après que le popup soit rendu
      requestAnimationFrame(() => {
        const pos = calculateTooltipPosition(trigger, popup);
        popup.style.top = `${pos.top}px`;
        popup.style.left = `${pos.left}px`;
        popup.style.transform = 'translateX(-50%) translateY(-8px)';
        popup.style.visibility = 'visible';
        popup.className = `tooltip-popup tooltip-${pos.position}`;
        
        // Afficher avec animation
        requestAnimationFrame(() => {
          popup.classList.add('show');
          popup.style.transform = pos.position === 'top' 
            ? 'translateX(-50%) translateY(0)' 
            : 'translateX(-50%) translateY(0)';
        });
      });
    }

    activeTooltip = trigger;
  }

  // Masquer le tooltip
  function hideTooltip(trigger) {
    if (!activeTooltip && !trigger) return;

    const tooltipId = trigger ? trigger.getAttribute('data-tooltip') : (activeTooltip ? activeTooltip.getAttribute('data-tooltip') : null);
    if (!tooltipId) return;

    const popup = getOrCreateTooltipPopup(tooltipId);
    popup.classList.remove('show');
    popup.setAttribute('aria-hidden', 'true');

    if (tooltipOverlay) {
      tooltipOverlay.classList.remove('show');
    }

    activeTooltip = null;
  }

  // Initialiser les tooltips
  document.querySelectorAll('.tooltip[data-tooltip]').forEach(trigger => {
    const tooltipId = trigger.getAttribute('data-tooltip');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
      // Mobile : clic pour ouvrir/fermer
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (activeTooltip === trigger) {
          hideTooltip(trigger);
        } else {
          showTooltip(trigger, tooltipId);
        }
      });
    } else {
      // Desktop : hover pour afficher
      trigger.addEventListener('mouseenter', () => {
        showTooltip(trigger, tooltipId);
      });

      trigger.addEventListener('mouseleave', () => {
        hideTooltip(trigger);
      });

      // Support clavier (focus)
      trigger.addEventListener('focus', () => {
        showTooltip(trigger, tooltipId);
      });

      trigger.addEventListener('blur', () => {
        hideTooltip(trigger);
      });
    }
  });

  // Fermer au clic extérieur (mobile)
  document.addEventListener('click', (e) => {
    if (activeTooltip && window.matchMedia('(max-width: 768px)').matches) {
      const popup = document.querySelector('.tooltip-popup.show');
      const overlay = document.querySelector('.tooltip-overlay.show');
      if (popup && !popup.contains(e.target) && !activeTooltip.contains(e.target)) {
        hideTooltip(activeTooltip);
      }
      if (overlay && overlay === e.target) {
        hideTooltip(activeTooltip);
      }
    }
  });

  // Fermer avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeTooltip) {
      hideTooltip(activeTooltip);
    }
  });

  // Réinitialiser les tooltips au redimensionnement
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (activeTooltip) {
        const tooltipId = activeTooltip.getAttribute('data-tooltip');
        hideTooltip(activeTooltip);
        // Réafficher si on était sur desktop et qu'on reste sur desktop
        if (window.innerWidth >= 768 && document.activeElement === activeTooltip) {
          showTooltip(activeTooltip, tooltipId);
        }
      }
    }, 250);
  });

  // ============================================
  // MODE PLEIN ÉCRAN POUR LE PROGRAMME
  // ============================================
  const programFullscreenBtn = document.getElementById('programFullscreenBtn');
  const programFullscreenContainer = document.getElementById('programFullscreenContainer');
  const programFullscreenClose = document.getElementById('programFullscreenClose');
  const programFullscreenGrid = document.getElementById('programFullscreenGrid');
  const programFullscreenFloatingDoodles = document.getElementById('programFullscreenFloatingDoodles');
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
        source.sizes = '64px';
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
      const nameEl = document.createElement('p');
      nameEl.className = 'testimonial-name';
      nameEl.textContent = item.name || '';
      body.appendChild(nameEl);
      const roleEl = document.createElement('p');
      roleEl.className = 'testimonial-role';
      roleEl.textContent = item.role || '';
      body.appendChild(roleEl);
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
      track.addEventListener('scroll', () => {
        updateButtons();
        updateActiveDot();
      });
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          const card = cards[index];
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        });
      });
      updateButtons();
      updateActiveDot();
    }

    const temoignagesUrl = new URL('assets/data/temoignages.json', document.documentElement.baseURI || window.location.href).href;
    fetch(temoignagesUrl)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        if (list.length === 0) {
          testimonialsSection.style.display = 'none';
          return;
        }
        list.forEach(item => {
          if (item.name && item.role && item.quote && item.image) {
            track.appendChild(buildTestimonialCard(item));
          }
        });
        const count = track.children.length;
        if (count === 0) {
          testimonialsSection.style.display = 'none';
          return;
        }
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
        testimonialsSection.classList.add('is-visible');
        initCarousel();
      })
      .catch(() => {
        testimonialsSection.style.display = 'none';
      });
  }
