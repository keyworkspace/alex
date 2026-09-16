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
  { title: 'Dia de la Independencia', date: '2026-09-15', category: 'academico' },
   { title: 'Dia Mundial del Psicólogo', date: '2026-10-13', category: 'internacional' },
];

/* ---------- LÓGICA ---------- */

(function () {
  'use strict';

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
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
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
      if (window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Calendario --- */
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
