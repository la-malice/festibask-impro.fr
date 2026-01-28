  // Données des joueurs de l'Équipe de France
  const edfPlayers = [
    {
      name: 'Olivier Descargues',
      role: 'Coach',
      image: 'assets/img/edf-olivier.png',
      bio: 'Improvisateur depuis 1987, membre historique de l\'Équipe de France, triple champion du monde. Coach de l\'équipe depuis 2015. Cofondateur de la Ligue Majeure, créateur et interprète de nombreux spectacles de référence.'
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
      name: 'Cécile Giroud',
      role: 'Capitaine',
      image: 'assets/img/edf-cecile.jpeg',
      bio: 'Comédienne, humoriste et musicienne. Figure majeure de l\'impro française, multiple championne du monde. Capitaine de l\'Équipe de France, reconnue pour sa polyvalence, son énergie collective et son sens du jeu. Représente Lyon.'
    },
    {
      name: 'Aurélie Desert',
      image: 'assets/img/edf-aurelie.jpeg',
      bio: 'Comédienne, chanteuse et auteure, formée au théâtre et à l\'improvisation à Bordeaux. Membre de l\'Équipe de France depuis 2018, elle évolue entre scène, rue et formats improvisés. Représente Bordeaux.'
    }
  ];

  // Révéler le header quand le hero sort du viewport
  const hero = document.getElementById('hero');
  const header = document.getElementById('siteHeader');
  const io = new IntersectionObserver(es=>es.forEach(e=> header.classList.toggle('show', !e.isIntersecting)), {threshold:0.01});
  io.observe(hero);

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

  // Autoplay vidéo YouTube au scroll
  const heroVideoContainer = document.getElementById('heroVideoContainer');
  const heroVideo = document.getElementById('heroVideo');
  let videoHasPlayed = false;

  if (heroVideoContainer && heroVideo) {
    // IntersectionObserver pour détecter quand la vidéo entre dans le viewport
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !videoHasPlayed) {
          // La vidéo est visible à au moins 50% - ajouter autoplay à l'URL
          const currentSrc = heroVideo.src;
          if (!currentSrc.includes('autoplay=1')) {
            const separator = currentSrc.includes('?') ? '&' : '?';
            heroVideo.src = currentSrc + separator + 'autoplay=1';
            videoHasPlayed = true;
          }
        }
      });
    }, {
      threshold: [0, 0.5, 1.0],
      rootMargin: '0px'
    });

    videoObserver.observe(heroVideoContainer);
  }

  // Burger / drawer mobile
  const burger=document.getElementById('burger'), drawer=document.getElementById('drawer'), drawerClose=document.getElementById('drawerClose');
  burger.addEventListener('click',()=>drawer.classList.toggle('open'));
  if(drawerClose) drawerClose.addEventListener('click',()=>drawer.classList.remove('open'));
  drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>drawer.classList.remove('open')));

  // Modal open/close
  const dlg=document.getElementById('notify');
  document.querySelectorAll('[data-open="notify"]').forEach(b=>b.addEventListener('click',()=>dlg.showModal()));
  dlg.addEventListener('click',e=>{
    const r=dlg.querySelector('.modal-card').getBoundingClientRect();
    const inside=r.top<=e.clientY && e.clientY<=r.bottom && r.left<=e.clientX && e.clientX<=r.right;
    if(!inside) dlg.close();
  });

  // Modal waitlist open/close
  const dlgWaitlist = document.getElementById('waitlist');
  document.querySelectorAll('[data-open="waitlist"]').forEach(b => b.addEventListener('click', () => dlgWaitlist.showModal()));
  dlgWaitlist.addEventListener('click', e => {
    const r = dlgWaitlist.querySelector('.modal-card').getBoundingClientRect();
    const inside = r.top <= e.clientY && e.clientY <= r.bottom && r.left <= e.clientX && e.clientX <= r.right;
    if (!inside) dlgWaitlist.close();
  });

  // Brevo gère automatiquement le masquage du formulaire avec AUTOHIDE = Boolean(1)
  // Le bouton "Fermer" dans le message de succès permet de fermer la popup explicitement

  // Slider jour par jour
  const daySliderContainer = document.getElementById('daySlider');
  if (daySliderContainer) {
    const daySlides = daySliderContainer.querySelectorAll('.day-slide');
    const daySlider = daySliderContainer.closest('.day-slider');
    const dayDots = daySlider?.querySelectorAll('.carousel-dot');
    const dayTabs = daySlider?.querySelectorAll('.day-tab');
    let currentDaySlide = 0;
    
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
  }

  // Flip des cartes d'ateliers
  // 1) Clic sur "En savoir plus" → montre le verso
  document.querySelectorAll('.en-savoir-plus-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const flipContainer = link.closest('.flip-container');
      if (flipContainer) {
        flipContainer.classList.add('flipped');
      }
    });
  });

  // 2) Clic n'importe où sur le recto (hors boutons) → montre le verso
  document.querySelectorAll('.atelier-card .flip-container .flip-front').forEach(front => {
    front.addEventListener('click', e => {
      // Ne pas interférer avec les boutons d'inscription / liste d'attente ou les liens
      if (e.target.closest('.btn-inscription, .btn-waitlist, a')) {
        return;
      }
      const flipContainer = front.closest('.flip-container');
      if (flipContainer) {
        flipContainer.classList.add('flipped');
      }
    });
  });

  // 3) Clic sur le verso pour revenir au recto
  document.querySelectorAll('.atelier-card .flip-back').forEach(flipBack => {
    flipBack.addEventListener('click', e => {
      // Ne pas flip si on clique sur l'intervenant (qui a son propre flip)
      if (e.target.closest('.instructor-flip-container')) {
        return;
      }
      // Ne pas flip si on clique sur le bouton d'inscription
      if (e.target.closest('.btn-inscription, .btn-waitlist')) {
        return;
      }
      const flipContainer = flipBack.closest('.flip-container');
      if (flipContainer && flipContainer.classList.contains('flipped')) {
        flipContainer.classList.remove('flipped');
      }
    });
  });

  // Clic sur le tag COMPLET pour flip la carte et afficher le verso
  document.querySelectorAll('.complet-tag').forEach(tag => {
    tag.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const flipContainer = tag.closest('.flip-container');
      if (flipContainer) {
        flipContainer.classList.add('flipped');
      }
    });
  });

  // Flip pour afficher la bio de l'intervenant (seulement pour Laëtitia - instructor-4)
  document.querySelectorAll('.flip-back .instructor-flip-container[data-flip="instructor-4"]').forEach(container=>{
    container.addEventListener('click',e=>{
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
        const backHeight = tempBack.scrollHeight + 28; // + padding
        document.body.removeChild(tempBack);
        
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
  });

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

  // Popup détails spectacle
  const spectacleDetailsModal = document.getElementById('spectacle-details');
  const spectacleDetailsContent = document.getElementById('spectacle-details-content');
  
  // Données des spectacles (extrait des blocs existants)
  const spectaclesData = {
    'spectacle-vendredi-format-long': {
      type: 'format-long',
      time: '19:00',
      label: 'Impro longue',
      title: 'Braquage',
      image: 'assets/img/braquage.jpg',
      pitch: 'Les portes se ferment, le braquage dérape, et soudain tout le monde devient suspect : braqueurs approximatifs, otages imprévisibles, alliances qui se font et se défont. Entre tension, humour qui surgit malgré tout et portraits touchants, on se surprend à s\'attacher à chacun… jusqu\'à ce que tout explose.'
    },
    'spectacle-vendredi-match': {
      type: 'match',
      time: '21:00',
      label: 'Match',
      title: 'La Malice vs Belgique',
      image: 'assets/img/equipe-belgique.jpg',
      pitch: 'Le match d\'impro est le format phare par lequel l\'impro s\'est diffusée. Venu du Québec, il emprunte aux codes du Hockey sur glace où 2 équipes de comédiens s\'affrontent sur une patinoire dans des séquences brèves et rythmées sous la surveillance d\'un arbitre implacable&nbsp;!'
    },
    'spectacle-samedi-format-long': {
      type: 'format-long',
      time: '19:00',
      label: 'Impro longue',
      title: 'Commis d\'Office',
      image: 'assets/img/commis-d-office.jpg',
      pitch: 'L\'un·e est accusé·e<br>L\'autre est avocat·e<br>L\'un·e est coupable<br>L\'autre devra trouver des circonstances atténuante.<br>Venez découvrir son histoire, son passé son crime et les raisons qui l\'ont poussées à commettre l\'irréparable'
    },
    'spectacle-samedi-match': {
      type: 'match',
      time: '21:00',
      label: 'Match',
      title: 'La Malice vs France',
      image: 'assets/img/231202 MATCH COLISEE ©J.DUFRESNE (86).jpeg',
      pitch: 'Le match d\'impro est le format phare par lequel l\'impro s\'est diffusée. Venu du Québec, il emprunte aux codes du Hockey sur glace où 2 équipes de comédiens s\'affrontent sur une patinoire dans des séquences brèves et rythmées sous la surveillance d\'un arbitre implacable&nbsp;!'
    },
    'spectacle-dimanche-format-long': {
      type: 'format-long',
      time: '19:00',
      label: 'Impro longue',
      title: 'Promo 2006',
      image: 'assets/img/promo-2006.avif',
      pitch: 'Vingt ans après, une ancienne promo se retrouve pour une soirée pleine de secrets, de couples improbables et de souvenirs qui dérapent. Un format joyeux et tendre, où le public choisit l\'école, les liens… et ce qui aurait mieux valu rester enterré.'
    },
    'spectacle-dimanche-match': {
      type: 'match',
      time: '21:00',
      label: 'Match',
      title: 'La Malice vs Suisse',
      image: 'assets/img/equipe-suisse.jpg',
      pitch: 'Le match d\'impro est le format phare par lequel l\'impro s\'est diffusée. Venu du Québec, il emprunte aux codes du Hockey sur glace où 2 équipes de comédiens s\'affrontent sur une patinoire dans des séquences brèves et rythmées sous la surveillance d\'un arbitre implacable&nbsp;!'
    }
  };
  
  function openSpectacleDetails(spectacleId) {
    const data = spectaclesData[spectacleId];
    if (!data) return;
    
    spectacleDetailsContent.innerHTML = `
      <div class="spectacle-modal-content">
        <div class="spectacle-modal-image" style="background-image: url('${data.image}');"></div>
        <div class="spectacle-modal-info">
          <div class="spectacle-modal-time">${data.time}</div>
          <div class="spectacle-modal-label">${data.label}</div>
          <h3 class="spectacle-modal-title">${data.title}</h3>
          <div class="spectacle-modal-pitch">
            <p>${data.pitch}</p>
          </div>
          <div class="spectacle-modal-scroll-indicator" style="display: none;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
            <span>Faites défiler pour voir la suite</span>
          </div>
        </div>
      </div>
    `;
    
    // Bloquer le scroll du body
    document.body.style.overflow = 'hidden';
    spectacleDetailsModal.showModal();
    
    // Vérifier si le contenu dépasse et afficher l'indicateur seulement si nécessaire
    setTimeout(() => {
      const modalInfo = spectacleDetailsContent.querySelector('.spectacle-modal-info');
      const scrollIndicator = spectacleDetailsContent.querySelector('.spectacle-modal-scroll-indicator');
      
      if (modalInfo && scrollIndicator) {
        // Vérifier si le contenu est scrollable (dépasse la hauteur visible)
        const isScrollable = modalInfo.scrollHeight > modalInfo.clientHeight;
        
        if (isScrollable) {
          // Ajouter une classe pour forcer la scrollbar et l'indicateur
          modalInfo.classList.add('has-scroll');
          scrollIndicator.style.display = 'flex';
          
          // Forcer la scrollbar à être visible en ajoutant un style inline
          modalInfo.style.overflowY = 'scroll';
          
          // Masquer l'indicateur quand on arrive en bas
          const handleScroll = () => {
            const isAtBottom = modalInfo.scrollHeight - modalInfo.scrollTop <= modalInfo.clientHeight + 10;
            if (isAtBottom) {
              scrollIndicator.style.display = 'none';
            } else {
              scrollIndicator.style.display = 'flex';
            }
          };
          
          modalInfo.addEventListener('scroll', handleScroll);
          
          // Vérifier aussi au redimensionnement
          window.addEventListener('resize', () => {
            const stillScrollable = modalInfo.scrollHeight > modalInfo.clientHeight;
            if (stillScrollable) {
              modalInfo.classList.add('has-scroll');
              scrollIndicator.style.display = 'flex';
            } else {
              modalInfo.classList.remove('has-scroll');
              scrollIndicator.style.display = 'none';
            }
          });
        } else {
          modalInfo.classList.remove('has-scroll');
          scrollIndicator.style.display = 'none';
          modalInfo.style.overflowY = 'hidden';
        }
      }
    }, 100);
  }
  
  // Gérer les clics sur les boutons de spectacle
  document.querySelectorAll('[data-spectacle]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const spectacleId = button.getAttribute('data-spectacle');
      
      // Sur desktop : scroll vers l'ancre, sur mobile : ouvrir la modal
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        // Mobile : ouvrir la modal
        openSpectacleDetails(spectacleId);
      } else {
        // Desktop : scroll vers l'élément correspondant dans la section "valeur"
        const targetElement = document.getElementById(spectacleId);
        if (targetElement) {
          // Scroll en douceur vers l'élément
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  });
  
  // Fermer le modal en cliquant à l'extérieur
  if (spectacleDetailsModal) {
    spectacleDetailsModal.addEventListener('click', (e) => {
      const modalCard = spectacleDetailsModal.querySelector('.modal-card');
      const rect = modalCard.getBoundingClientRect();
      const inside = rect.top <= e.clientY && e.clientY <= rect.bottom && rect.left <= e.clientX && e.clientX <= rect.right;
      if (!inside) {
        spectacleDetailsModal.close();
        document.body.style.overflow = ''; // Restaurer le scroll
      }
    });
    
    // Restaurer le scroll quand le modal se ferme
    spectacleDetailsModal.addEventListener('close', () => {
      document.body.style.overflow = '';
    });
  }
  
  // Gérer la fermeture via le bouton
  const spectacleCloseBtn = spectacleDetailsModal?.querySelector('.modal-close');
  if (spectacleCloseBtn) {
    spectacleCloseBtn.addEventListener('click', () => {
      document.body.style.overflow = '';
    });
  }

  // Flip pour afficher le pitch du format long (desktop) ou modal (mobile)
  document.querySelectorAll('.format-long-block').forEach(block=>{
    block.addEventListener('click',e=>{
      e.preventDefault();
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        // Mobile : ouvrir la modal
        const blockId = block.id;
        if (blockId && spectaclesData && spectaclesData[blockId]) {
          openSpectacleDetails(blockId);
        }
      } else {
        // Desktop : flip pour afficher le pitch
        block.classList.toggle('flipped');
      }
    });
  });

  // Fonction pour initialiser le slider de bios des joueurs
  function initMatchSlider(matchBlock, players, originalImageSrc) {
    // Vérifier si le slider existe déjà
    let sliderContainer = matchBlock.querySelector('.match-slider-container');
    
    if (!sliderContainer) {
      // Créer la structure du slider
      sliderContainer = document.createElement('div');
      sliderContainer.className = 'match-slider-container';
      
      const sliderTrack = document.createElement('div');
      sliderTrack.className = 'match-slider-track';
      
      // Slide 1 : Image originale avec titre, description et crédit photo
      const originalSlide = document.createElement('div');
      originalSlide.className = 'match-slide';
      
      const originalImage = document.createElement('img');
      originalImage.className = 'match-slide-image';
      originalImage.src = originalImageSrc;
      originalImage.alt = 'Match d\'improvisation';
      
      const originalOverlay = document.createElement('div');
      originalOverlay.className = 'match-slide-overlay';
      
      // Titre
      const title = document.createElement('div');
      title.className = 'match-slide-name';
      title.textContent = 'L\'Équipe de France';
      
      // Description avec crédit photo intégré
      const pitch = document.createElement('div');
      pitch.className = 'match-slide-bio';
      pitch.textContent = 'Champions du monde, artistes reconnus et figures majeures de l\'improvisation professionnelle. Une équipe d\'excellence réunissant expérience, créativité et intensité scénique, au service de spectacles uniques et exigeants. Photo : © J.DUFRESNE';
      
      originalOverlay.appendChild(title);
      originalOverlay.appendChild(pitch);
      originalSlide.appendChild(originalImage);
      originalSlide.appendChild(originalOverlay);
      sliderTrack.appendChild(originalSlide);
      
      // Slides suivants : Joueurs
      players.forEach(player => {
        const playerSlide = document.createElement('div');
        playerSlide.className = 'match-slide';
        
        const playerImage = document.createElement('img');
        playerImage.className = 'match-slide-image';
        playerImage.src = player.image;
        playerImage.alt = player.name;
        
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
        
        const playerBio = document.createElement('div');
        playerBio.className = 'match-slide-bio';
        playerBio.textContent = player.bio;
        playerOverlay.appendChild(playerBio);
        
        playerSlide.appendChild(playerImage);
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
      const isMobile = window.innerWidth < 768;
      
      // Vérifier si c'est le match France vs La Malice
      const blockId = block.id;
      const isFranceMatch = blockId === 'spectacle-samedi-match';
      
      if (isFranceMatch && edfPlayers && edfPlayers.length > 0) {
        // Récupérer l'image originale et le crédit photo
        const originalImage = block.querySelector('.match-image');
        const photoCreditEl = block.querySelector('.match-photo-credit');
        // Utiliser getAttribute pour obtenir le src original, puis encoder l'URL
        let originalImageSrc = '';
        if (originalImage) {
          const src = originalImage.getAttribute('src');
          originalImageSrc = src ? encodeURI(src) : '';
        } else {
          // Sur mobile, l'image peut être en background, récupérer depuis le style
          const bgImage = window.getComputedStyle(block).backgroundImage;
          if (bgImage && bgImage !== 'none') {
            // Extraire l'URL de la background-image
            const match = bgImage.match(/url\(["']?([^"']+)["']?\)/);
            if (match && match[1]) {
              originalImageSrc = match[1];
            }
          }
        }
        // Initialiser le slider
        initMatchSlider(block, edfPlayers, originalImageSrc);
      } else if (isMobile) {
        // Mobile : ouvrir la modal pour les autres matchs
        if (blockId && spectaclesData && spectaclesData[blockId]) {
          openSpectacleDetails(blockId);
        }
      } else {
        // Desktop : flip pour afficher le pitch
        block.classList.toggle('flipped');
      }
    });
  });

  // Appliquer l'image en background sur mobile pour les matchs
  function applyMatchBackgroundOnMobile() {
    if (window.innerWidth <= 768) {
      document.querySelectorAll('.match-block').forEach(block => {
        const img = block.querySelector('.match-image');
        if (img) {
          // Utiliser getAttribute pour obtenir le src original, puis encoder l'URL
          const src = img.getAttribute('src');
          if (src) {
            // Encoder l'URL pour gérer les caractères spéciaux
            const encodedSrc = encodeURI(src);
            block.style.backgroundImage = `url("${encodedSrc}")`;
            block.style.backgroundSize = 'cover';
            block.style.backgroundPosition = 'center';
            block.style.backgroundRepeat = 'no-repeat';
          }
        }
      });
    } else {
      // Retirer le background sur desktop
      document.querySelectorAll('.match-block').forEach(block => {
        block.style.backgroundImage = '';
        block.style.backgroundSize = '';
        block.style.backgroundPosition = '';
        block.style.backgroundRepeat = '';
      });
    }
  }

  // Appliquer au chargement et au redimensionnement
  applyMatchBackgroundOnMobile();
  window.addEventListener('resize', applyMatchBackgroundOnMobile);

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
    const isMobile = window.innerWidth < 768;

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
    if (activeTooltip && window.innerWidth < 768) {
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
