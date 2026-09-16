/* ============================================================
   ALEX WORKSPACE
   ============================================================ */

const CATEGORIAS = {
  academico:     { nombre: 'Académico',     color: '#4B2E83' },
  internacional: { nombre: 'Internacional', color: '#2D1147' },
  nacional:      { nombre: 'Nacional',      color: '#FF9142' },
  personal:      { nombre: 'Personal',      color: '#EF3F3F' }
};

const EVENTOS = [
  { title: 'Día de la Independencia', date: '2026-09-15', category: 'nacional' },
  { title: 'Día Mundial del Psicólogo', date: '2026-10-13', category: 'internacional' }
];

(function () {
  'use strict';

  const loader = document.getElementById('loader');
  if (loader) {
    const hide = () => setTimeout(() => loader.classList.add('done'), 400);
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const menuBtn = document.getElementById('menu-btn');
  const menuMobile = document.getElementById('menu-mobile');
  if (menuBtn && menuMobile) {
    menuBtn.addEventListener('click', () => menuMobile.classList.toggle('hidden'));
  }

  const fadeElements = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && fadeElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    fadeElements.forEach((el) => observer.observe(el));
  } else {
    fadeElements.forEach((el) => el.classList.add('visible'));
  }

  const progress = document.getElementById('scroll-progress');
  if (progress) {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

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

    const interactive = 'a, button, .btn-circle, .card-uees, .faq-question, .btn-primary, .btn-secondary, .btn-nav, .social-icon, .filtro-btn, input, textarea';
    document.querySelectorAll(interactive).forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    document.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
    document.addEventListener('mouseenter', () => cursor.classList.add('visible'));
  })();

  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((i) => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  const calendarMount = document.getElementById('calendario-mount');
  const filtrosEl = document.getElementById('filtros');
  const proximosEl = document.getElementById('proximos');

  if (calendarMount && typeof FullCalendar !== 'undefined') {
    if (filtrosEl) {
      filtrosEl.innerHTML = Object.keys(CATEGORIAS).map((key) => {
        const cat = CATEGORIAS[key];
        return `
          <button data-cat="${key}" class="filtro-btn border border-ink/15 text-ink/80 rounded-full hover:bg-ink/5 flex items-center">
            <span class="inline-block w-2 h-2 rounded-full mr-2" style="background:${cat.color}"></span>${cat.nombre}
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
        color: CATEGORIAS[e.category] ? CATEGORIAS[e.category].color : '#4B2E83',
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
            <li class="py-4 flex items-center justify-between border-b border-white/10">
              <span class="flex items-center gap-3 text-white font-medium text-sm">
                <span class="w-2 h-2 rounded-full" style="background:${CATEGORIAS[e.category].color}"></span>${e.title}
              </span>
              <span class="mono text-white/50">${e.date}</span>
            </li>`).join('')
        : '<li class="py-4 text-white/50 text-sm">Aún no hay fechas registradas.</li>';
    }
  }
})();
