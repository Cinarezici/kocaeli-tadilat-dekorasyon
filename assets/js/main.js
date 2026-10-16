/**
 * Kocaeli Tadilat ve Dekorasyon
 * Interactive JavaScript for Modern Landing Page
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Header Scrolled State
  // --------------------------------------------------------------------------
  const header = document.querySelector('.main-header');
  
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --------------------------------------------------------------------------
  // 2. Mobile Navigation Menu
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      if (isOpen) {
        mobileNav.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        mobileNav.classList.add('open');
        hamburgerBtn.classList.add('active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Dynamic Business Hours Indicator (08:00 - 22:00)
  // --------------------------------------------------------------------------
  const updateBusinessStatus = () => {
    const statusBadges = document.querySelectorAll('.dynamic-status');
    const now = new Date();
    // Get Turkish time
    const trHour = now.getHours();
    const isOpen = trHour >= 8 && trHour < 22;

    statusBadges.forEach(badge => {
      if (isOpen) {
        badge.innerHTML = `<span class="badge-open">Şu An Açık · 22:00'a Kadar</span>`;
      } else {
        badge.innerHTML = `<span class="badge-open" style="background:rgba(239,68,68,0.15);color:#EF4444;border-color:rgba(239,68,68,0.3)">Kapalı · Açılış 08:00</span>`;
      }
    });
  };
  updateBusinessStatus();

  // --------------------------------------------------------------------------
  // 3.5 Interactive Hero Project Showcase Switcher
  // --------------------------------------------------------------------------
  const heroPills = document.querySelectorAll('.hero-pill');
  const heroDisplayImg = document.getElementById('hero-display-img');
  const heroDisplayCaption = document.getElementById('hero-display-caption');
  const heroDisplaySub = document.getElementById('hero-display-sub');

  if (heroPills.length > 0 && heroDisplayImg) {
    let currentPillIndex = 0;
    let autoRotateInterval;

    const switchHeroProject = (index, isManual = false) => {
      currentPillIndex = index;
      heroPills.forEach((pill, idx) => {
        if (idx === index) {
          pill.classList.add('active');
          pill.setAttribute('aria-selected', 'true');
        } else {
          pill.classList.remove('active');
          pill.setAttribute('aria-selected', 'false');
        }
      });

      const activePill = heroPills[index];
      const newImg = activePill.getAttribute('data-img');
      const newCaption = activePill.getAttribute('data-caption');
      const newSub = activePill.getAttribute('data-sub');

      heroDisplayImg.style.opacity = '0.35';
      heroDisplayImg.style.transform = 'scale(0.98)';

      setTimeout(() => {
        heroDisplayImg.src = newImg;
        if (heroDisplayCaption) heroDisplayCaption.textContent = newCaption;
        if (heroDisplaySub) heroDisplaySub.textContent = newSub;
        heroDisplayImg.style.opacity = '1';
        heroDisplayImg.style.transform = 'scale(1)';
      }, 180);

      if (isManual) {
        clearInterval(autoRotateInterval);
        // Resume auto-rotation after 10s of inactivity
        setTimeout(startAutoRotate, 10000);
      }
    };

    heroPills.forEach((pill, idx) => {
      pill.addEventListener('click', () => switchHeroProject(idx, true));
    });

    const startAutoRotate = () => {
      clearInterval(autoRotateInterval);
      autoRotateInterval = setInterval(() => {
        const nextIndex = (currentPillIndex + 1) % heroPills.length;
        switchHeroProject(nextIndex, false);
      }, 5500);
    };

    startAutoRotate();
  }

  // --------------------------------------------------------------------------
  // 4. Project Gallery Filter & Lightbox
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(15px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // Lightbox Implementation
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close-btn');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  
  let currentActiveIndex = 0;
  let activeGalleryData = [];

  const updateActiveGalleryData = () => {
    const visible = Array.from(galleryItems).filter(item => item.style.display !== 'none');
    const targetItems = visible.length > 0 ? visible : Array.from(galleryItems);
    activeGalleryData = targetItems.map(item => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-item-title')?.textContent || '';
      return { src: img.getAttribute('src'), title };
    });
  };

  galleryItems.forEach(item => {
    const imgWrapper = item.querySelector('.gallery-image-wrapper');
    const img = item.querySelector('img');
    if (imgWrapper && img) {
      imgWrapper.addEventListener('click', () => {
        updateActiveGalleryData();
        const clickedSrc = img.getAttribute('src');
        const foundIndex = activeGalleryData.findIndex(d => d.src === clickedSrc);
        currentActiveIndex = foundIndex >= 0 ? foundIndex : 0;
        updateLightboxContent();
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }
  });

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  const updateLightboxContent = () => {
    const current = activeGalleryData[currentActiveIndex];
    if (current) {
      lightboxImg.src = current.src;
      lightboxCaption.textContent = current.title;
    }
  };

  const showNextImage = () => {
    if (activeGalleryData.length === 0) return;
    currentActiveIndex = (currentActiveIndex + 1) % activeGalleryData.length;
    updateLightboxContent();
  };

  const showPrevImage = () => {
    if (activeGalleryData.length === 0) return;
    currentActiveIndex = (currentActiveIndex - 1 + activeGalleryData.length) % activeGalleryData.length;
    updateLightboxContent();
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // --------------------------------------------------------------------------
  // 5. FAQ Accordion
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close other items for single accordion mode
        faqItems.forEach(otherItem => {
          if (otherItem !== item) otherItem.classList.remove('active');
        });
        item.classList.toggle('active', !isActive);
      });
    }
  });

  // --------------------------------------------------------------------------
  // 6. Interactive WhatsApp Quote Generator & Form Handler
  // --------------------------------------------------------------------------
  const quoteForm = document.getElementById('quoteForm');
  const serviceSelect = document.getElementById('serviceType');
  const districtSelect = document.getElementById('district');
  const customerName = document.getElementById('fullName');
  const customerPhone = document.getElementById('phoneNumber');
  const customerNote = document.getElementById('projectDetails');
  const whatsappSubmitBtn = document.getElementById('sendWhatsAppBtn');

  // Handle direct WhatsApp submit
  if (whatsappSubmitBtn) {
    whatsappSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const name = customerName?.value.trim() || 'Müşteri';
      const phone = customerPhone?.value.trim() || 'Belirtilmedi';
      const service = serviceSelect?.options[serviceSelect.selectedIndex]?.text || 'Genel Tadilat';
      const district = districtSelect?.options[districtSelect.selectedIndex]?.text || 'Kocaeli';
      const note = customerNote?.value.trim() || '';

      let message = `Merhaba Kocaeli Tadilat ve Dekorasyon,\n\n`;
      message += `Web siteniz üzerinden ücretsiz keşif ve teklif talebinde bulunmak istiyorum:\n`;
      message += `👤 İsim: ${name}\n`;
      message += `📞 Telefon: ${phone}\n`;
      message += `📍 Bölge / İlçe: ${district}\n`;
      message += `🛠️ Talep Edilen Hizmet: ${service}\n`;
      if (note) {
        message += `📝 Notlar: ${note}\n`;
      }
      message += `\nEn kısa sürede dönüşünüzü rica ederim.`;

      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/905347900830?text=${encodedMsg}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // Handle default form submit
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Trigger the WhatsApp action directly as high conversion
      if (whatsappSubmitBtn) {
        whatsappSubmitBtn.click();
      }

      // Show confirmation alert
      alert('Talebiniz hazırlandı! WhatsApp üzerinden anında iletebilir veya bizi 0534 790 08 30 numarasından hemen arayabilirsiniz.');
    });
  }

  // "Bu Hizmet İçin Teklif Al" button helper
  const serviceQuoteBtns = document.querySelectorAll('.service-quote-trigger');
  serviceQuoteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-service');
      if (serviceSelect && serviceName) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value === serviceName) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 7. Scroll Reveal Animation using IntersectionObserver
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }
});
