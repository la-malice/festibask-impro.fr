  // Révéler le header quand le hero sort du viewport
  const hero = document.getElementById('hero');
  const header = document.getElementById('siteHeader');
  const io = new IntersectionObserver(es=>es.forEach(e=> header.classList.toggle('show', !e.isIntersecting)), {threshold:0.01});
  io.observe(hero);

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

  // Brevo gère automatiquement le masquage du formulaire avec AUTOHIDE = Boolean(1)
  // Le bouton "Fermer" dans le message de succès permet de fermer la popup explicitement

  // Slider jour par jour
  const daySliderContainer = document.getElementById('daySlider');
  if (daySliderContainer) {
    const daySlides = daySliderContainer.querySelectorAll('.day-slide');
    const dayDots = daySliderContainer.closest('.day-slider')?.querySelectorAll('.carousel-dot');
    let currentDaySlide = 0;
    
    function updateDaySlider(){
      daySliderContainer.style.transform = `translateX(-${currentDaySlide * 33.333333}%)`;
      if (dayDots) {
        dayDots.forEach((dot,index)=>{
          dot.classList.toggle('active', index === currentDaySlide);
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
    
    if (dayDots) {
      dayDots.forEach((dot,index)=>{
        dot.addEventListener('click',()=>{
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
    
    const daySlider = daySliderContainer.closest('.day-slider');
    
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

  // Toggle "En savoir plus" pour flip les cartes d'ateliers (même système que les cartes tarifs)
  document.querySelectorAll('.en-savoir-plus-link').forEach(link=>{
    link.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      const flipContainer = link.closest('.flip-container');
      if (flipContainer) {
        flipContainer.classList.add('flipped');
      }
    });
  });

  // Clic sur le verso pour revenir au recto
  document.querySelectorAll('.atelier-card .flip-back').forEach(flipBack=>{
    flipBack.addEventListener('click',e=>{
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

  // Flip pour afficher la bio de l'intervenant (seulement dans le flip-back)
  document.querySelectorAll('.flip-back .instructor-flip-container').forEach(container=>{
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
      title: 'La Malice vs Suisse',
      image: 'assets/img/equipe-suisse.jpg',
      pitch: 'Le match d\'impro est le format phare par lequel l\'impro s\'est diffusée. Venu du Québec, il emprunte aux codes du Hockey sur glace où 2 équipes de comédiens s\'affrontent sur une patinoire dans des séquences brèves et rythmées sous la surveillance d\'un arbitre implacable&nbsp;!'
    },
    'spectacle-samedi-format-long': {
      type: 'format-long',
      time: '19:00',
      label: 'Impro longue',
      title: 'Commis d\'Office',
      image: 'assets/img/commis-d-office.jpg',
      pitch: 'Un jeune avocat commis d\'office reçoit un accusé malheureux qui va se confier et expliquer le long chemin qui l\'a mené jusqu\'à commettre l\'impensable. Pendant 1h nous verrons son parcours, ses errances, ses rencontres jusqu\'à comprendre sa destinée. Saurons-nous s\'il est déclaré coupable ou non ?'
    },
    'spectacle-samedi-match': {
      type: 'match',
      time: '21:00',
      label: 'Match',
      title: 'La Malice vs France',
      image: 'assets/img/241125-MATCH-FRANCE-BELGIQUE-©J-55_BD-1200x470.jpg',
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
      title: 'La Malice vs Belgique',
      image: 'assets/img/equipe-belgique.jpg',
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
        </div>
      </div>
    `;
    
    // Bloquer le scroll du body
    document.body.style.overflow = 'hidden';
    spectacleDetailsModal.showModal();
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

  // Flip pour afficher le pitch du match (desktop) ou modal (mobile)
  document.querySelectorAll('.match-block').forEach(block=>{
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
