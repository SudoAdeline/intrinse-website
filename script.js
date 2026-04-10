/* ========================================
   INTRINSE — Conscious Nutrition
   Script: Animations, Scroll, Carousel
   ======================================== */

// ── Wait for DOM ──
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initThemeSwitcher();
  initCarousel();
  initCart();
  initRevealAnimations();

  // Delay GSAP-based animations until after load
  window.addEventListener('load', () => {
    initHeroAnimation();
    initStatesScroll();
    initNavigation();
    initSweepRevealAnimations();
  });
});

/* ========== LOADER ========== */
function initLoader() {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderBar');
  const percent = document.getElementById('loaderPercent');

  document.body.style.overflow = 'hidden';

  // Fade in logo, bar, percent
  const tl = gsap.timeline();
  tl.to('.loader-logo', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    .to('.loader-progress', { opacity: 1, duration: 0.4 }, '-=0.3')
    .to('.loader-percent', { opacity: 1, duration: 0.4 }, '-=0.3');

  // Animate progress from 0 to 100
  const counter = { val: 0 };
  gsap.to(counter, {
    val: 100,
    duration: 2.2,
    ease: 'power2.inOut',
    delay: 0.5,
    onUpdate: () => {
      const v = Math.round(counter.val);
      bar.style.width = v + '%';
      percent.textContent = v;
    },
    onComplete: () => {
      // Hold briefly, then fade out
      gsap.to(loader, {
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          loader.style.display = 'none';
          document.body.style.overflow = '';
          window.dispatchEvent(new Event('loaderDone'));
        }
      });
    }
  });
}

/* ========== HERO ANIMATION — Oura-style: video scales in, text staggers ========== */
function initHeroAnimation() {
  const runHero = () => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Video scales in and fades
    tl.to('.hero-visual', {
      opacity: 1,
      scale: 1,
      duration: 1.6,
      ease: 'power2.out'
    })
    // Nav slides down simultaneously
    .to('#nav', {
      opacity: 1,
      y: 0,
      duration: 0.6,
    }, 0.2)
    // Label fades in
    .to('.hero-label', {
      opacity: 1,
      y: 0,
      duration: 0.7,
    }, 0.4)
    // Title lines stagger in — big dramatic entry
    .to('.hero-title-line', {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
    }, 0.6)
    // Subtitle
    .to('.hero-sub', {
      opacity: 1,
      y: 0,
      duration: 0.7,
    }, '-=0.5')
    // States bar
    .to('.hero-states', {
      opacity: 1,
      y: 0,
      duration: 0.6,
    }, '-=0.4')
    // CTA button
    .to('.hero-btn', {
      opacity: 1,
      y: 0,
      duration: 0.6,
    }, '-=0.3')
    // Scroll indicator
    .to('.scroll-indicator', {
      opacity: 1,
      duration: 0.5
    }, '-=0.2');
  };

  // If loader is already gone, run immediately
  const loader = document.getElementById('loader');
  if (loader.style.display === 'none') {
    runHero();
  } else {
    window.addEventListener('loaderDone', runHero, { once: true });
  }
}

/* ========== NAVIGATION ========== */
function initNavigation() {
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 100) {
      nav.style.borderBottomColor = '';
    }
    lastScroll = current;
  }, { passive: true });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ========== THREE STATES — Scroll-driven panels ========== */
function initStatesScroll() {
  const statesSection = document.getElementById('states');
  const panels = document.querySelectorAll('.state-panel');
  const statesBg = document.getElementById('statesBg');

  if (!statesSection || panels.length === 0) return;

  // Set first panel active
  panels[0].classList.add('active');

  const bgColors = {
    energy: 'radial-gradient(ellipse at 30% 50%, rgba(196,122,58,0.06) 0%, transparent 60%)',
    focus: 'radial-gradient(ellipse at 30% 50%, rgba(154,163,171,0.06) 0%, transparent 60%)',
    balance: 'radial-gradient(ellipse at 30% 50%, rgba(194,184,168,0.06) 0%, transparent 60%)'
  };

  ScrollTrigger.create({
    trigger: statesSection,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const progress = self.progress;
      const panelCount = panels.length;
      const activeIndex = Math.min(Math.floor(progress * panelCount), panelCount - 1);

      panels.forEach((panel, i) => {
        panel.classList.toggle('active', i === activeIndex);
      });

      const state = panels[activeIndex]?.dataset.state;
      if (state && bgColors[state]) {
        statesBg.style.background = bgColors[state];
      }
    }
  });
}

/* ========== PRODUCT VIDEOS — Play on scroll, reset when leaving ========== */
function initCarousel() {
  const videos = document.querySelectorAll('.product-card-video');
  if (!videos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, {
    threshold: 0.3
  });

  videos.forEach(video => observer.observe(video));
}

/* ========== SWEEP & REVEAL — Premium text animations ========== */
function initSweepRevealAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // ── Philosophy section ──
  const philosophy = document.querySelector('.philosophy');
  if (philosophy) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: philosophy,
        start: 'top 75%',
        end: 'bottom bottom',
        once: true
      }
    });

    // Label fades up
    tl.to(philosophy.querySelector('.sweep-label'), {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
    // Heading lines sweep up (curtain reveal)
    .to(philosophy.querySelectorAll('.sweep-line-inner'), {
      y: '0%',
      duration: 1.2,
      stagger: 0.12,
      ease: 'power4.out'
    }, '-=0.3')
    // Divider line expands
    .to(philosophy.querySelector('.philosophy-divider'), {
      width: '80px',
      opacity: 0.3,
      duration: 0.8,
      ease: 'power2.inOut'
    }, '-=0.5')
    // Body text lines reveal with fade
    .to(philosophy.querySelectorAll('.reveal-line-inner'), {
      y: '0%',
      opacity: 1,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.4');
  }

  // ── States Introduction section ──
  const statesIntro = document.querySelector('.states-intro');
  if (statesIntro) {
    const stl = gsap.timeline({
      scrollTrigger: {
        trigger: statesIntro,
        start: 'top 70%',
        once: true
      }
    });

    // Label
    stl.to(statesIntro.querySelector('.sweep-label'), {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
    })
    // Heading sweep
    .to(statesIntro.querySelectorAll('.sweep-line-inner'), {
      y: '0%', duration: 1.2, stagger: 0.12, ease: 'power4.out'
    }, '-=0.3')
    // Divider
    .to(statesIntro.querySelector('.states-intro-divider'), {
      width: '60px', opacity: 0.25, duration: 0.7, ease: 'power2.inOut'
    }, '-=0.5')
    // Body text
    .to(statesIntro.querySelectorAll('.reveal-line-inner'), {
      y: '0%', opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out'
    }, '-=0.4')
    // Product image floats up
    .to(statesIntro.querySelector('.states-intro-img'), {
      opacity: 1, translate: '0 0', duration: 1.2, ease: 'power3.out'
    }, '-=1.0')
    // Three items stagger in
    .to(statesIntro.querySelectorAll('.states-intro-item'), {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out'
    }, '-=0.6');
  }

  // ── Apply sweep-line animation to any section with .sweep-line ──
  document.querySelectorAll('section:not(.philosophy):not(.states-intro)').forEach(section => {
    const sweepLines = section.querySelectorAll('.sweep-line-inner');
    const revealLines = section.querySelectorAll('.reveal-line-inner');

    if (sweepLines.length > 0) {
      gsap.to(sweepLines, {
        y: '0%',
        duration: 1.2,
        stagger: 0.12,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          once: true
        }
      });
    }

    if (revealLines.length > 0) {
      gsap.to(revealLines, {
        y: '0%',
        opacity: 1,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          once: true
        }
      });
    }
  });
}

/* ========== REVEAL ON SCROLL ========== */
function initRevealAnimations() {
  // Add reveal class to elements
  const selectors = [
    '.section-label',
    '.philosophy-heading',
    '.philosophy-text',
    '.products-heading',
    '.products-sub',
    '.product-card',
    '.ritual-heading',
    '.ritual-text',
    '.ritual-bundle',
    '.ingredients-heading',
    '.ingredients-sub',
    '.ingredient-card',
    '.evolution-step',
    '.closing-heading',
    '.closing-sub',
    '.closing .btn'
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('reveal');
    });
  });

  // Intersection Observer for reveals
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children if multiple
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    // Add stagger delay for grid items
    if (el.classList.contains('ingredient-card') || el.classList.contains('evolution-step')) {
      el.dataset.delay = (i % 4) * 100;
    }
    observer.observe(el);
  });
}

/* ========== THEME SWITCHER ========== */
function initThemeSwitcher() {
  const toggle = document.getElementById('themeToggle');
  const options = document.getElementById('themeOptions');
  const buttons = options.querySelectorAll('button');

  toggle.addEventListener('click', () => {
    options.classList.toggle('open');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.theme-switcher')) {
      options.classList.remove('open');
    }
  });

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      document.body.setAttribute('data-theme', theme);

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Small haptic-like visual feedback
      gsap.fromTo(document.body,
        { opacity: 0.95 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    });
  });
}

/* ========== PARALLAX on Hero (subtle) ========== */
window.addEventListener('scroll', () => {
  const scroll = window.scrollY;
  const heroText = document.querySelector('.hero-text');
  if (heroText && scroll < window.innerHeight) {
    const progress = scroll / window.innerHeight;
    heroText.style.transform = `translateY(${progress * -30}px)`;
    heroText.style.opacity = 1 - progress * 0.6;
  }
}, { passive: true });

/* ========== CART & CHECKOUT ========== */
function initCart() {
  const products = {
    energy:  { name: 'ENERGY',  variant: 'Ashwagandha Protein Blend', price: 39, video: 'assets/images/energy.mp4' },
    focus:   { name: 'FOCUS',   variant: 'Coffee Extract Protein Blend', price: 39, video: 'assets/images/focus.mp4' },
    balance: { name: 'BALANCE', variant: 'Guarana Protein Blend', price: 39, video: 'assets/images/balance.mp4' },
    bundle:  { name: 'THE COMPLETE COLLECTION', variant: 'All three states', price: 99, video: 'assets/images/focus.mp4' }
  };

  let cart = []; // { id, qty }

  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const cartBody = document.getElementById('cartBody');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartItemsEl = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  const cartCountEl = document.getElementById('cartCount');
  const cartTotalEl = document.getElementById('cartTotal');
  const checkoutOverlay = document.getElementById('checkoutOverlay');
  const checkoutItemsEl = document.getElementById('checkoutItems');
  const checkoutTotalEl = document.getElementById('checkoutTotal');

  function openCart() {
    drawer.classList.add('open');
    overlay.classList.add('open');
  }

  function closeCart() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
  }

  function openCheckout() {
    closeCart();
    renderCheckoutSummary();
    checkoutOverlay.classList.add('open');
  }

  function closeCheckout() {
    checkoutOverlay.classList.remove('open');
  }

  function addToCart(productId) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ id: productId, qty: 1 });
    }
    renderCart();
    openCart();
  }

  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
  }

  function updateQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(productId);
      return;
    }
    renderCart();
  }

  function getTotal() {
    return cart.reduce((sum, item) => {
      const product = products[item.id];
      return sum + (product ? product.price * item.qty : 0);
    }, 0);
  }

  function getTotalItems() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function renderCart() {
    const totalItems = getTotalItems();
    const total = getTotal();

    // Update count badge
    cartCountEl.textContent = totalItems;
    cartCountEl.classList.toggle('visible', totalItems > 0);

    // Show/hide empty vs items
    if (cart.length === 0) {
      cartEmpty.style.display = '';
      cartItemsEl.innerHTML = '';
      cartFooter.style.display = 'none';
    } else {
      cartEmpty.style.display = 'none';
      cartFooter.style.display = '';
      cartTotalEl.textContent = '\u20AC' + total.toFixed(2);

      cartItemsEl.innerHTML = cart.map(item => {
        const p = products[item.id];
        if (!p) return '';
        return `
          <div class="cart-item">
            <div class="cart-item-img">
              <video muted playsinline preload="auto" src="${p.video}"></video>
            </div>
            <div class="cart-item-details">
              <div class="cart-item-name">${p.name}</div>
              <div class="cart-item-variant">${p.variant}</div>
              <div class="cart-item-bottom">
                <div class="cart-item-qty">
                  <button data-id="${item.id}" data-delta="-1">&minus;</button>
                  <span>${item.qty}</span>
                  <button data-id="${item.id}" data-delta="1">+</button>
                </div>
                <div class="cart-item-price">\u20AC${(p.price * item.qty).toFixed(2)}</div>
              </div>
              <button class="cart-item-remove" data-remove="${item.id}">Remove</button>
            </div>
          </div>
        `;
      }).join('');

      // Qty buttons
      cartItemsEl.querySelectorAll('.cart-item-qty button').forEach(btn => {
        btn.addEventListener('click', () => {
          updateQty(btn.dataset.id, parseInt(btn.dataset.delta));
        });
      });

      // Remove buttons
      cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          removeFromCart(btn.dataset.remove);
        });
      });
    }
  }

  function renderCheckoutSummary() {
    const total = getTotal();
    checkoutTotalEl.textContent = '\u20AC' + total.toFixed(2);

    checkoutItemsEl.innerHTML = cart.map(item => {
      const p = products[item.id];
      if (!p) return '';
      return `
        <div class="checkout-summary-item">
          <div class="checkout-summary-item-name">${p.name} <span>&times;${item.qty}</span></div>
          <div class="checkout-summary-item-price">\u20AC${(p.price * item.qty).toFixed(2)}</div>
        </div>
      `;
    }).join('');
  }

  // ── Event listeners ──
  document.getElementById('cartToggle').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  document.getElementById('cartShopLink').addEventListener('click', closeCart);
  document.getElementById('checkoutBtn').addEventListener('click', openCheckout);
  document.getElementById('checkoutClose').addEventListener('click', closeCheckout);

  // Checkout form
  document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('This is a demo — order placed successfully!');
    cart = [];
    renderCart();
    closeCheckout();
  });

  // ── "Add to Cart" buttons throughout the page ──
  document.querySelectorAll('.product-card .btn-sm').forEach(btn => {
    const card = btn.closest('.product-card');
    const productId = card?.dataset.product;
    if (productId) {
      btn.addEventListener('click', () => addToCart(productId));
    }
  });

  // Bundle "Complete Your Ritual" button
  const bundleBtn = document.querySelector('.ritual .btn-primary');
  if (bundleBtn) {
    bundleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addToCart('bundle');
    });
  }

  // Initial render
  renderCart();
}
