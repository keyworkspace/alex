(function () {
  'use strict';

  /* ---------- DATOS ---------- */
  const CATEGORIAS = {
    academico:     { nombre: 'Académico',     color: '#6B2D8E' },
    internacional: { nombre: 'Internacional', color: '#2B1461' },
    nacional:      { nombre: 'Nacional',      color: '#FFA752' },
    personal:      { nombre: 'Personal',      color: '#E63946' }
  };

  const EVENTOS = [
    { title: 'Día de la Independencia', date: '2026-09-15', category: 'nacional' },
    { title: 'Día Mundial del Psicólogo', date: '2026-10-13', category: 'internacional' }
  ];

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

    const interactive = 'a, button, .cta-circle, .dif-card, .contact-card, .faq-trigger, .btn-big, .nav__official, .dif-cta, .footer__social, .filtro-btn, input, select, textarea';
    document.querySelectorAll(interactive).forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    document.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
    document.addEventListener('mouseenter', () => cursor.classList.add('visible'));
  })();

  /* ---------- FAQ ---------- */
  document.querySelectorAll('.faq-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

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

  /* ---------- CALENDARIO ---------- */
  const calendarMount = document.getElementById('calendario-mount');
  const filtrosEl = document.getElementById('filtros');
  const proximosEl = document.getElementById('proximos');

  if (calendarMount && typeof FullCalendar !== 'undefined') {
    if (filtrosEl) {
      filtrosEl.innerHTML = Object.keys(CATEGORIAS).map((key) => {
        const cat = CATEGORIAS[key];
        return `
          <button data-cat="${key}" class="filtro-btn">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${cat.color};margin-right:8px;"></span>${cat.nombre}
          </button>`;
      }).join('');
    }

    const esMovil = window.matchMedia('(max-width: 640px)').matches;
    const calendar = new FullCalendar.Calendar(calendarMount, {
      initialView: esMovil ? 'listMonth' : 'dayGridMonth',
      locale: 'es',
      firstDay: 1,
      buttonText: { today: 'Hoy', month: 'Mes', list: 'Lista' },
      events: EVENTOS.map((e) => ({
        title: e.title,
        start: e.date,
        color: CATEGORIAS[e.category] ? CATEGORIAS[e.category].color : '#6B2D8E',
        textColor: '#ffffff',
        extendedProps: { category: e.category, description: e.description }
      })),
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: esMovil ? 'listMonth,dayGridMonth' : 'dayGridMonth,listMonth'
      },
      eventClick: (info) => {
        const d = info.event.extendedProps.description;
        if (d) alert(info.event.title + '\n\n' + d);
      }
    });
    calendar.render();

    document.querySelectorAll('.filtro-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat;
        const activo = btn.classList.toggle('activo');
        calendar.getEvents().forEach((ev) => {
          if (ev.extendedProps.category === cat) {
            ev.setProp('display', activo ? 'auto' : 'none');
          }
        });
      });
    });

    if (proximosEl) {
      const hoy = new Date().toISOString().slice(0, 10);
      const proximos = EVENTOS.filter((e) => e.date >= hoy).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
      proximosEl.innerHTML = proximos.length
        ? proximos.map((e) => `
            <li style="padding:1rem 0;display:flex;justify-content:space-between;border-bottom:1px solid rgba(250,247,240,0.1);color:rgba(250,247,240,0.9);font-size:0.9rem;">
              <span style="display:flex;align-items:center;gap:0.75rem;">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${CATEGORIAS[e.category].color};"></span>${e.title}
              </span>
              <span style="font-family:var(--mono);font-size:0.7rem;opacity:0.5;">${e.date}</span>
            </li>`).join('')
        : '<li style="padding:1rem 0;color:rgba(250,247,240,0.5);font-size:0.9rem;">Aún no hay fechas registradas.</li>';
    }
  }
})();
