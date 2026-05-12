// script.js - Complete functionality (VIDEO SECTION REMOVED)
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio initialized - Video section removed');
  
  // ========== SLIDESHOW SYSTEM ==========
  function initSlideshows() {
    const slideshows = document.querySelectorAll('.slideshow-container');
    
    slideshows.forEach((container) => {
      const track = container.querySelector('.slideshow-track');
      const slides = track ? track.querySelectorAll('.slide-img, .empty-slide') : [];
      
      if (slides.length === 0) return;
      
      const prevBtn = container.querySelector('.slideshow-prev');
      const nextBtn = container.querySelector('.slideshow-next');
      const dotsContainer = container.querySelector('.slideshow-dots');
      
      let currentIndex = 0;
      let autoInterval = null;
      let isPaused = false;
      const totalSlides = slides.length;
      
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
          const dot = document.createElement('div');
          dot.classList.add('dot');
          if (i === currentIndex) dot.classList.add('active');
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(i);
            resetAutoTimer();
          });
          dotsContainer.appendChild(dot);
        }
      }
      
      function updateDots() {
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
        dots.forEach((dot, i) => {
          if (i === currentIndex) dot.classList.add('active');
          else dot.classList.remove('active');
        });
      }
      
      function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
      }
      
      function nextSlide() { goToSlide(currentIndex + 1); }
      function prevSlide() { goToSlide(currentIndex - 1); }
      
      function startAutoSlide() {
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = setInterval(() => {
          if (!isPaused) nextSlide();
        }, 4000);
      }
      
      function resetAutoTimer() {
        if (autoInterval) {
          clearInterval(autoInterval);
          startAutoSlide();
        }
      }
      
      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          prevSlide();
          resetAutoTimer();
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          nextSlide();
          resetAutoTimer();
        });
      }
      
      const card = container.closest('.project-card');
      if (card) {
        card.addEventListener('mouseenter', () => { isPaused = true; });
        card.addEventListener('mouseleave', () => { isPaused = false; });
      }
      
      track.style.transition = 'transform 0.4s ease-in-out';
      goToSlide(0);
      startAutoSlide();
    });
  }
  
  // ========== CLICKABLE CARDS ==========
  function initClickableCards() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.slideshow-btn') || e.target.closest('.dot')) {
          return;
        }
        const panelId = card.getAttribute('data-panel');
        if (panelId) openPanel(panelId);
      });
    });
  }
  
  // ========== PANEL SYSTEM ==========
  function openPanel(panelId) {
    document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
    const targetPanel = document.getElementById(panelId);
    if (targetPanel) {
      targetPanel.classList.add('active');
      document.body.style.overflow = 'hidden';
      const gallery = targetPanel.querySelector('.panel-gallery-container');
      if (gallery && !gallery.hasAttribute('data-init')) {
        initPanelGallery(gallery);
        gallery.setAttribute('data-init', 'true');
      }
    }
  }
  
  function closeAllPanels() {
    document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
    document.body.style.overflow = '';
  }
  
  function initPanelGallery(container) {
    const mainImg = container.querySelector('.gallery-main-img');
    const thumbs = container.querySelectorAll('.thumb');
    const prevBtn = container.querySelector('.gallery-nav.prev');
    const nextBtn = container.querySelector('.gallery-nav.next');
    
    if (!mainImg || thumbs.length === 0) return;
    
    let currentIndex = 0;
    const images = [];
    thumbs.forEach((thumb, idx) => {
      const fullUrl = thumb.getAttribute('data-full');
      images.push(fullUrl || thumb.src);
      thumb.addEventListener('click', () => {
        currentIndex = idx;
        mainImg.src = images[currentIndex];
        updateActiveThumb();
      });
    });
    
    function updateActiveThumb() {
      thumbs.forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === currentIndex);
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        mainImg.src = images[currentIndex];
        updateActiveThumb();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        mainImg.src = images[currentIndex];
        updateActiveThumb();
      });
    }
  }
  
  // ========== PANEL TRIGGERS ==========
  function initPanelTriggers() {
    document.querySelectorAll('.panel-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const panelId = trigger.getAttribute('data-panel');
        if (panelId) openPanel(panelId);
      });
    });
  }
  
  // ========== CLOSE BUTTONS ==========
  function initCloseButtons() {
    document.querySelectorAll('.panel-close').forEach(btn => {
      btn.addEventListener('click', closeAllPanels);
    });
    document.querySelectorAll('.panel').forEach(panel => {
      panel.addEventListener('click', (e) => { if (e.target === panel) closeAllPanels(); });
    });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllPanels(); });
  }
  
  // ========== MASTER GALLERY ==========
  function initMasterGallery() {
    const gallery = document.getElementById('masterGalleryGrid');
    if (!gallery) return;
    
    const allImages = [];
    document.querySelectorAll('.project-card').forEach((card, idx) => {
      const title = card.querySelector('.card-content h3')?.innerText || `Project ${idx + 1}`;
      card.querySelectorAll('.slide-img').forEach(img => {
        if (img.src && !img.src.includes('empty')) {
          allImages.push({ src: img.src, title: title });
        }
      });
    });
    
    gallery.innerHTML = '';
    if (allImages.length === 0) {
      gallery.innerHTML = '<p style="text-align:center; color:#8891b5; grid-column:1/-1;">No images yet. Add your work to see them here!</p>';
      return;
    }
    
    allImages.forEach(img => {
      const item = document.createElement('div');
      item.className = 'master-gallery-item';
      item.style.cssText = 'cursor:pointer; border-radius:16px; overflow:hidden; background:#1a1c24; transition:transform 0.2s;';
      item.innerHTML = `<img src="${img.src}" style="width:100%; height:150px; object-fit:cover;"><div style="padding:8px; font-size:12px; text-align:center; color:#b1b9d4;">${img.title}</div>`;
      item.addEventListener('mouseenter', () => item.style.transform = 'scale(1.02)');
      item.addEventListener('mouseleave', () => item.style.transform = 'scale(1)');
      item.addEventListener('click', () => window.open(img.src, '_blank'));
      gallery.appendChild(item);
    });
  }
  
  // ========== PROFILE MOUSE FOLLOW ==========
  function initProfileAnimation() {
    const profileFrame = document.querySelector('.image-frame');
    const profilePic = document.querySelector('.profile-pic');
    if (profileFrame && profilePic) {
      window.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 700) return;
        const rect = profileFrame.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / 30;
        const deltaY = (e.clientY - centerY) / 30;
        const moveX = Math.min(Math.max(deltaX, -8), 8);
        const moveY = Math.min(Math.max(deltaY, -8), 8);
        profilePic.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
      });
      profileFrame.addEventListener('mouseleave', () => {
        profilePic.style.transform = 'scale(1)';
      });
    }
  }
  
  // ========== NAVIGATION ==========
  function initNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
      let current = '';
      const scrollPos = window.scrollY + 200;
      sections.forEach(section => {
        if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
          current = section.getAttribute('id');
        }
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
      });
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
  
  // ========== PROFILE FALLBACK ==========
  function initProfileFallback() {
    const profilePic = document.getElementById('profileImage');
    if (profilePic) {
      profilePic.addEventListener('error', () => {
        profilePic.src = 'https://via.placeholder.com/400x500?text=EP';
      });
    }
  }
  
  // ========== RESPONSIVE CHECK ==========
  function checkResponsive() {
    const grid = document.querySelector('.portfolio-grid-cards');
    if (grid) {
      const width = window.innerWidth;
      if (width < 768) {
        grid.style.gridTemplateColumns = '1fr';
      }
    }
  }
  
  window.addEventListener('resize', checkResponsive);
  checkResponsive();
  
  // ========== INITIALIZE EVERYTHING ==========
  initSlideshows();
  initClickableCards();
  initPanelTriggers();
  initCloseButtons();
  initMasterGallery();
  initProfileAnimation();
  initNav();
  initProfileFallback();
  
  console.log('✅ All features ready! Video section has been removed.');
});

window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hide'), 500);
  }
});