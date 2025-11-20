  // Révéler le header quand le hero sort du viewport
  const hero = document.getElementById('hero');
  const header = document.getElementById('siteHeader');
  const io = new IntersectionObserver(es=>es.forEach(e=> header.classList.toggle('show', !e.isIntersecting)), {threshold:0.01});
  io.observe(hero);

  // Burger / drawer mobile
  const burger=document.getElementById('burger'), drawer=document.getElementById('drawer');
  burger.addEventListener('click',()=>drawer.classList.toggle('open'));
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

  // Carrousel des matches
  const carouselContainer = document.getElementById('matchesCarousel');
  const slides = carouselContainer.querySelectorAll('.match-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.querySelector('.carousel-arrow.prev');
  const nextBtn = document.querySelector('.carousel-arrow.next');
  let currentSlide = 0;
  
  function updateCarousel(){
    carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot,index)=>{
      dot.classList.toggle('active', index === currentSlide);
    });
  }
  
  function nextSlide(){
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
  }
  
  function prevSlide(){
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
  }
  
  nextBtn.addEventListener('click',nextSlide);
  prevBtn.addEventListener('click',prevSlide);
  
  dots.forEach((dot,index)=>{
    dot.addEventListener('click',()=>{
      currentSlide = index;
      updateCarousel();
    });
  });
  
  // Auto-play optionnel (désactivé par défaut)
  // setInterval(nextSlide, 5000);

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
      const header = container.closest('.header');
      const isFlipped = container.classList.contains('flipped');
      const back = container.querySelector('.instructor-flip-back');
      
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
        
        // On applique la hauteur au header et au container
        header.style.minHeight = backHeight + 'px';
        container.style.minHeight = backHeight + 'px';
        // Petit délai pour que la hauteur soit appliquée avant le flip
        setTimeout(()=>{
          container.classList.add('flipped');
        }, 10);
      } else {
        // On revient en arrière, on remet la hauteur minimale
        container.classList.remove('flipped');
        setTimeout(()=>{
          header.style.minHeight = '76px';
          container.style.minHeight = '76px';
        }, 600);
      }
    });
  });
