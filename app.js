/* ============================================================
   ALEX WORKSPACE — Datos y lógica del sitio
   ============================================================ */

/* ---------- DATOS ---------- */

const CATEGORIAS = {
  academico:     { nombre: 'Académico',     color: '#7897AD' },
  internacional: { nombre: 'Internacional', color: '#4A6B84' },
  nacional:      { nombre: 'Nacional',      color: '#8FB0A0' },
  personal:      { nombre: 'Personal',      color: '#F0EEDC' }
};

/*
   EVENTOS — agrega aquí tus fechas importantes
   Categorías válidas: academico · internacional · nacional · personal
   Formato: { title, date (YYYY-MM-DD), category, description (opcional) }
*/
const EVENTOS = [
  { title: 'Día de la Independencia', date: '2026-09-15', category: 'nacional' },
  { title: 'Día Mundial del Psicólogo', date: '2026-10-13', category: 'internacional' }
];

/* ---------- LÓGICA ---------- */

(function () {
  'use strict';

  /* ---------- Año del footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menú móvil ---------- */
  const menuBtn = document.getElementById('menu-btn');
  const menuMobile = document.getElementById('menu-mobile');
  if (menuBtn && menuMobile) {
    menuBtn.addEventListener('click', () => menuMobile.classList.toggle('hidden'));
  }

  /* ---------- Fade-in con IntersectionObserver ---------- */
  const fadeElements = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && fadeElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    fadeElements.forEach((el) => observer.observe(el));
  } else {
    fadeElements.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Barra de progreso de scroll ---------- */
  const progress = document.getElementById('scroll-progress');
  if (progress) {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- Header con blur al hacer scroll ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Cursor personalizado (una sola pelotilla) ---------- */
  (function initCursor() {
    const isDesktop = window.matchMedia('(hover: hover) and (min-width: 901px)').matches;
    if (!isDesktop) return;

    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

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
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(loop);
    }
    loop();

    const interactive = 'a, button, .grain-card, .btn-primary, .btn-secondary, .social-icon, .filtro-btn, input, textarea';
    document.querySelectorAll(interactive).forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    document.addEventListener('mouseleave', () => {
      cursor.classList.remove('visible');
    });
    document.addEventListener('mouseenter', () => {
      cursor.classList.add('visible');
    });
  })();

  /* ---------- Aves cruzando la pantalla ---------- */
  (function initBirds() {
    const hero = document.querySelector('[data-birds]');
    if (!hero) return;

    const track = document.createElement('div');
    track.className = 'birds-track';
    track.setAttribute('aria-hidden', 'true');

    for (let i = 1; i <= 4; i++) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 200 60');
      svg.setAttribute('stroke-width', '1.4');
      svg.setAttribute('stroke-linecap', 'round');
      svg.classList.add('bird', 'bird-' + i);
      svg.innerHTML = '<path d="M10 30 Q25 15 40 30 Q55 15 70 30" />';
      track.appendChild(svg);
    }

    hero.appendChild(track);
  })();

  /* ---------- Animación letra por letra del hero ---------- */
  (function initHeroLetters() {
    const titles = document.querySelectorAll('.hero-title');
    if (!titles.length) return;

    titles.forEach((title) => {
      const lines = title.querySelectorAll('.line');
      let index = 0;

      lines.forEach((line) => {
        const text = line.textContent;
        line.textContent = '';

        [...text].forEach((char) => {
          const span = document.createElement('span');
          span.className = 'hero-letter';
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.style.animationDelay = (index * 0.055) + 's';
          line.appendChild(span);
          index++;
        });
      });
    });
  })();

  /* ---------- Calendario ---------- */
  const calendarMount = document.getElementById('calendario-mount');
  const filtrosEl = document.getElementById('filtros');
  const proximosEl = document.getElementById('proximos');

  if (calendarMount && typeof FullCalendar !== 'undefined') {
    if (filtrosEl) {
      filtrosEl.innerHTML = Object.keys(CATEGORIAS).map((key) => {
        const cat = CATEGORIAS[key];
        return `
          <button data-cat="${key}" class="filtro-btn font-sans text-[10px] uppercase tracking-[0.2em] border border-ivory/20 text-ivory/80 rounded-full px-4 py-1.5 hover:bg-ivory/5 flex items-center">
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
        color: CATEGORIAS[e.category] ? CATEGORIAS[e.category].color : '#7897AD',
        textColor: e.category === 'personal' ? '#171717' : '#F0EEDC',
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
            <li class="py-4 flex items-center justify-between">
              <span class="flex items-center gap-3 text-ivory/90">
                <span class="w-2 h-2 rounded-full" style="background:${CATEGORIAS[e.category].color}"></span>${e.title}
              </span>
              <span class="font-sans text-xs text-ivory/50">${e.date}</span>
            </li>`).join('')
        : '<li class="py-4 text-ivory/50 font-sans text-sm">Aún no hay fechas registradas.</li>';
    }
  }
})();
