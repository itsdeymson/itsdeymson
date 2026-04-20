// script.js - Complete functionality
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio initialized');
  
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
  
  // ========== VIDEO PLAYER ==========
  function initVideoPlayer() {
    const video = document.getElementById('introVideo');
    if (!video) return;
    
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.querySelector('.video-progress-bar');
    const progressFill = document.querySelector('.video-progress-fill');
    const currentTimeSpan = document.querySelector('.current-time');
    const totalTimeSpan = document.querySelector('.total-time');
    const volumeBtn = document.querySelector('.volume-btn');
    const volumeInput = document.querySelector('.volume-input');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const videoFrame = document.querySelector('.video-frame');
    const videoInfoOverlay = document.getElementById('videoInfoOverlay');
    
    const resolutionBtn = document.getElementById('resolutionBtn');
    const resolutionContainer = document.querySelector('.resolution-container');
    const resolutionMenu = document.getElementById('resolutionMenu');
    const resolutionOptions = document.querySelectorAll('.resolution-option');
    const currentResolutionSpan = document.getElementById('currentResolution');
    
    let currentResolution = 'auto';
    let sources = {};
    let isMenuOpen = false;
    let isLandscape = false;
    
    const sourceElements = video.querySelectorAll('source');
    sourceElements.forEach(source => {
      const res = source.getAttribute('data-res');
      if (res) {
        sources[res] = source.getAttribute('src');
      }
    });
    
    if (resolutionBtn && resolutionMenu) {
      resolutionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMenuOpen) {
          resolutionMenu.classList.remove('open');
          isMenuOpen = false;
        } else {
          resolutionMenu.classList.add('open');
          isMenuOpen = true;
        }
      });
      
      document.addEventListener('click', (e) => {
        if (!resolutionContainer.contains(e.target)) {
          resolutionMenu.classList.remove('open');
          isMenuOpen = false;
        }
      });
      
      resolutionMenu.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
    
    resolutionOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const res = option.getAttribute('data-res');
        currentResolution = res;
        
        resolutionOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        if (res === 'auto') {
          currentResolutionSpan.textContent = 'Auto';
          adaptiveResolution();
        } else {
          switchResolution(res);
        }
        
        resolutionMenu.classList.remove('open');
        isMenuOpen = false;
      });
    });
    
    async function measureNetworkSpeed() {
      const startTime = performance.now();
      try {
        const response = await fetch(sources['480p'], { method: 'HEAD' });
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        const fileSize = 500000;
        const speedMbps = (fileSize * 8) / (duration * 1000000);
        return Math.min(speedMbps, 100);
      } catch (error) {
        return 5;
      }
    }
    
    async function adaptiveResolution() {
      if (currentResolution !== 'auto') return;
      
      const speed = await measureNetworkSpeed();
      let bestRes = '480p';
      
      if (speed >= 8) {
        bestRes = '1080p';
      } else if (speed >= 4) {
        bestRes = '720p';
      } else {
        bestRes = '480p';
      }
      
      currentResolutionSpan.textContent = bestRes.toUpperCase();
      switchResolution(bestRes, false);
    }
    
    function switchResolution(resolution, updateMenu = true) {
      if (resolution === 'auto') {
        adaptiveResolution();
        return;
      }
      
      if (sources[resolution]) {
        const currentTime = video.currentTime;
        const wasPlaying = !video.paused;
        
        video.pause();
        
        const newSource = document.createElement('source');
        newSource.src = sources[resolution];
        newSource.type = 'video/mp4';
        
        while (video.firstChild) {
          video.removeChild(video.firstChild);
        }
        video.appendChild(newSource);
        
        video.load();
        video.currentTime = currentTime;
        
        if (wasPlaying) {
          video.play().catch(e => console.log('Playback prevented'));
        }
        
        currentResolutionSpan.textContent = resolution.toUpperCase();
        
        if (updateMenu) {
          resolutionOptions.forEach(opt => {
            opt.classList.remove('active');
            if (opt.getAttribute('data-res') === resolution) {
              opt.classList.add('active');
            }
          });
        }
      }
    }
    
    function enterLandscapeMode() {
      if (isLandscape) return;
      isLandscape = true;
      
      videoFrame.classList.add('landscape-mode');
      document.body.classList.add('landscape-active');
      
      if (!document.querySelector('.exit-landscape-btn')) {
        const exitBtn = document.createElement('button');
        exitBtn.className = 'exit-landscape-btn';
        exitBtn.innerHTML = '<i class="fas fa-times"></i>';
        exitBtn.addEventListener('click', exitLandscapeMode);
        document.body.appendChild(exitBtn);
        setTimeout(() => exitBtn.classList.add('show'), 10);
      } else {
        document.querySelector('.exit-landscape-btn').classList.add('show');
      }
      
      if (videoFrame.requestFullscreen) {
        videoFrame.requestFullscreen().catch(e => console.log('Fullscreen not supported'));
      }
    }
    
    function exitLandscapeMode() {
      if (!isLandscape) return;
      isLandscape = false;
      
      videoFrame.classList.remove('landscape-mode');
      document.body.classList.remove('landscape-active');
      
      const exitBtn = document.querySelector('.exit-landscape-btn');
      if (exitBtn) {
        exitBtn.classList.remove('show');
        setTimeout(() => exitBtn.remove(), 300);
      }
      
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
    
    function checkAndEnterLandscape() {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile && window.innerWidth < 768 && !isLandscape) {
        enterLandscapeMode();
      }
    }
    
    window.addEventListener('orientationchange', () => {
      if (isLandscape && (window.orientation === 0 || window.orientation === 180)) {
        exitLandscapeMode();
      } else if (!isLandscape && video.currentTime > 0 && !video.paused) {
        checkAndEnterLandscape();
      }
    });
    
    function formatTime(seconds) {
      if (isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    function updateProgress() {
      if (video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (currentTimeSpan) currentTimeSpan.textContent = formatTime(video.currentTime);
      }
    }
    
    function handlePlay() {
      if (videoInfoOverlay) videoInfoOverlay.classList.add('hide');
      if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      checkAndEnterLandscape();
    }
    
    function handlePause() {
      if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    function handleEnded() {
      if (videoInfoOverlay) videoInfoOverlay.classList.remove('hide');
      if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      if (isLandscape) exitLandscapeMode();
    }
    
    video.addEventListener('mouseenter', () => {
      if (video.paused && videoInfoOverlay) videoInfoOverlay.classList.remove('hide');
    });
    
    video.addEventListener('mouseleave', () => {
      if (!video.paused && videoInfoOverlay) videoInfoOverlay.classList.add('hide');
    });
    
    video.addEventListener('loadedmetadata', () => {
      if (totalTimeSpan) totalTimeSpan.textContent = formatTime(video.duration);
    });
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    
    function togglePlay() {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
    
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
    if (video) video.addEventListener('click', togglePlay);
    
    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
      });
    }
    
    if (volumeInput) {
      volumeInput.addEventListener('input', (e) => {
        video.volume = e.target.value / 100;
        updateVolumeIcon(video.volume);
      });
    }
    
    function updateVolumeIcon(value) {
      if (!volumeBtn) return;
      if (value === 0) volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
      else if (value < 0.5) volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
      else volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
    
    if (volumeBtn) {
      volumeBtn.addEventListener('click', () => {
        if (video.volume > 0) {
          video.dataset.prevVolume = video.volume;
          video.volume = 0;
          if (volumeInput) volumeInput.value = 0;
          volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
          const prevVolume = video.dataset.prevVolume || 0.8;
          video.volume = prevVolume;
          if (volumeInput) volumeInput.value = prevVolume * 100;
          updateVolumeIcon(prevVolume);
        }
      });
    }
    
    if (fullscreenBtn && videoFrame) {
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          if (videoFrame.requestFullscreen) {
            videoFrame.requestFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
          }
        } else {
          document.exitFullscreen();
          fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
      });
      document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
          fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
          fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
          if (isLandscape) exitLandscapeMode();
        }
      });
    }
    
    setTimeout(adaptiveResolution, 1000);
    console.log('✅ Video player initialized');
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
  initVideoPlayer();
  initProfileAnimation();
  initNav();
  initProfileFallback();
  
  console.log('✅ All features ready!');
}

);

window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hide'), 500);
  }
});
