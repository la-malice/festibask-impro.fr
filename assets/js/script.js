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
    
    // Auto-play optionnel (désactivé par défaut)
    // setInterval(nextDaySlide, 5000);
  }

  // Flip pour afficher le pitch du format long
  document.querySelectorAll('.format-long-block').forEach(block=>{
    block.addEventListener('click',e=>{
      e.preventDefault();
      block.classList.toggle('flipped');
    });
  });

  // Flip pour afficher le pitch du match
  document.querySelectorAll('.match-block').forEach(block=>{
    block.addEventListener('click',e=>{
      e.preventDefault();
      block.classList.toggle('flipped');
    });
  });

  // Toggle "Voir plus" / "Voir moins" pour les descriptions d'ateliers
  document.querySelectorAll('.description-toggle').forEach(toggle=>{
    toggle.addEventListener('click',e=>{
      e.preventDefault();
      const card = toggle.closest('.atelier-card');
      const description = card.querySelector('.description');
      const isExpanded = !description.classList.contains('truncated');
      
      if(isExpanded){
        description.classList.add('truncated');
        toggle.textContent = 'Voir plus';
      } else {
        description.classList.remove('truncated');
        toggle.textContent = 'Voir moins';
      }
    });
  });

  // Flip pour afficher la bio de l'intervenant
  document.querySelectorAll('.instructor-flip-container').forEach(container=>{
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
