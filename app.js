(function () {
  'use strict';

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  if (loader) {
    const hide = () => setTimeout(() => loader.setAttribute('data-hidden', 'true'), 500);
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
    setTimeout(() => loader.setAttribute('data-hidden', 'true'), 2400);
  }

  /* ---------- AÑO ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- NAV SCROLL ---------- */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.setAttribute('data-scrolled', window.scrollY > 30 ? 'true' : 'false');
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- MOBILE MENU ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');
  const navOverlay = document.getElementById('navOverlay');

  function openMobile() {
    if (!mobileNav) return;
    mobileNav.setAttribute('data-open', 'true');
    navOverlay?.setAttribute('data-open', 'true');
    menuToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobile() {
    if (!mobileNav) return;
    mobileNav.setAttribute('data-open', 'false');
    navOverlay?.setAttribute('data-open', 'false');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (menuToggle) menuToggle.addEventListener('click', openMobile);
  if (mobileClose) mobileClose.addEventListener('click', closeMobile);
  if (navOverlay) navOverlay.addEventListener('click', closeMobile);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobile(); });

  /* ---------- CURSOR ---------- */
  (function initCursor() {
    const isDesktop = window.matchMedia('(hover: hover) and (min-width: 901px)').matches;
    if (!isDesktop) return;

    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    const OFFSET_X = 30;
    const OFFSET_Y = 30;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx, cy = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.classList.add('visible');
    });

    function loop() {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      cursor.style.left = (cx + OFFSET_X) + 'px';
      cursor.style.top = (cy + OFFSET_Y) + 'px';
      requestAnimationFrame(loop);
    }
    loop();

    const interactive = 'a, button, .cta-circle, .dif-card, .contact-card, .btn-big, .nav__official, .dif-cta, .footer__social, input, select, textarea';
    document.querySelectorAll(interactive).forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    document.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
    document.addEventListener('mouseenter', () => cursor.classList.add('visible'));
  })();

  /* ---------- REVEAL ---------- */
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- AUTO-INYECCIÓN DEL ASISTENTE ---------- */
  (function loadAssistant() {
    if (window.__AW_ASSISTANT_LOADED__) return;
    window.__AW_ASSISTANT_LOADED__ = true;

    var cssId = 'assistant-css';
    if (!document.getElementById(cssId)) {
      var link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'assistant.css';
      document.head.appendChild(link);
    }

    var jsId = 'assistant-js';
    if (!document.getElementById(jsId)) {
      var script = document.createElement('script');
      script.id = jsId;
      script.src = 'assistant.js';
      script.defer = true;
      document.body.appendChild(script);
    }
  })();

})();
