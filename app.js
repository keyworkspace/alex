/* ============================================================
   ALEX WORKSPACE — Datos y lógica del sitio
   ============================================================ */

/* ---------- DATOS ---------- */

const TIMELINE = [
  { year: '2008', title: 'Nacimiento', lugar: 'El Salvador' },
  { year: '2024', title: 'Educación básica', lugar: 'Liceo Cristiano Reverendo Juan Bueno' },
  { year: '2024–2026', title: 'Bachillerato Técnico Vocacional Administrativo Contable', lugar: 'Instituto Nacional de Yamabal' },
  { year: '2025–2026', title: 'Programa Oportunidades', lugar: 'Fundación Gloria Kriete' },
  { year: '2026 →', title: 'Próxima etapa: ingresar a la Licenciatura en Psicología', lugar: 'UGB — San Miguel' }
];

const PROYECTOS = [
  { title: 'Key', subtitle: 'Fundación Hernández', year: '2024–2026', role: 'Fundador', status: 'activo',
    desc: 'Proyecto social orientado al desarrollo educativo, empleabilidad y bienestar psicológico de jóvenes. +30 jóvenes alcanzados.' },
  { title: 'Heliot Media', subtitle: 'Producción audiovisual y comunicación', year: '2025–', role: 'Cofundador', status: 'activo',
    desc: 'Producción audiovisual, comunicación y desarrollo de proyectos.' },
  { title: 'Windsor One', subtitle: 'Estrategia y consultoría digital', year: '2025–', role: 'Fundador', status: 'activo',
    desc: 'Evaluación de proyectos, arquitectura de marca, auditorías digitales y desarrollo web/app.' }
];

const FORMACION = [
  { label: 'En curso', items: [
    { title: 'Bachillerato Técnico Vocacional Administrativo Contable', institucion: 'Instituto Nacional de Yamabal', year: '2026' },
    { title: 'Programa Oportunidades', institucion: 'Fundación Gloria Kriete', year: '2025–2026' }
  ]},
  { label: 'Planificado', items: [
    { title: 'Licenciatura en Psicología', institucion: 'UGB — San Miguel', year: '2026 →' },
    { title: 'Especialización / MSc — Psicología clínica y salud mental', institucion: 'Reino Unido (proyecto futuro)', year: '—' }
  ]}
];

const IDEAS = [
  { title: 'Por qué construí esta página', date: '2026-09-15', tags: ['meta', 'proyectos'],
    summary: 'Un espacio para documentar mi trayectoria en lugar de solo mostrarla.',
    body: 'Esta página no es un CV. Es un archivo vivo de quién estoy siendo.\n\nQuiero que dentro de cinco años pueda volver aquí y ver cómo cambió todo: lo que pensaba, lo que construí, lo que aprendí.\n\nNo es un sitio terminado. Es un sitio que crece conmigo.' }
];

const MUSICA = [
  { title: 'Soundtrack — Septiembre 2026', desc: 'Lo que suena estos días.' }
];

const MOMENTOS = [
  { title: 'Inicio del programa Oportunidades', lugar: '2025' },
  { title: 'Primer proyecto digital publicado', lugar: '2026' }
];

const CATEGORIAS = {
  academico:   { nombre: 'Académico',   color: '#7897AD' },
  personal:    { nombre: 'Personal',    color: '#F0EEDC' },
  lanzamiento: { nombre: 'Lanzamiento', color: '#C94B43' },
  redes:       { nombre: 'Redes',       color: '#6789A2' },
  viaje:       { nombre: 'Viaje',       color: '#8FB0A0' }
};

const EVENTOS = [
  { title: 'Primera entrada del blog', date: '2026-09-20', category: 'lanzamiento', description: 'Publico el primer post de Ideas.' },
  { title: 'Entrega de proyecto final', date: '2026-10-05', category: 'academico', description: 'Presentación del proyecto de contabilidad.' },
  { title: 'Inicio de clases — Psicología UGB', date: '2027-01-15', category: 'academico', description: 'Comienzo de la licenciatura.' },
  { title: 'Cumpleaños', date: '2027-02-03', category: 'personal', description: 'Un año más.' }
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

  /* --- Trayectoria --- */
  const timelineEl = document.getElementById('timeline');
  if (timelineEl) {
    timelineEl.innerHTML = TIMELINE.map((it, i) => {
      const isLast = i === TIMELINE.length - 1;
      return `
        <li class="relative pl-10 ${isLast ? '' : 'pb-12'} fade-in">
          <span class="absolute left-0 top-2 w-3 h-3 rounded-full border-2 border-vintage bg-sky"></span>
          ${isLast ? '' : '<span class="absolute left-[5px] top-5 bottom-0 w-px bg-ivory/20"></span>'}
          <p class="font-sans text-[10px] uppercase tracking-[0.25em] text-ivory/50 mb-2">${it.year}</p>
          <h3 class="font-display text-3xl md:text-4xl text-ivory mb-1">${it.title}</h3>
          ${it.lugar ? `<p class="text-ivory/60 text-sm">${it.lugar}</p>` : ''}
        </li>`;
    }).join('');
  }

  /* --- Proyectos --- */
  const proyectosEl = document.getElementById('proyectos-grid');
  if (proyectosEl) {
    proyectosEl.innerHTML = PROYECTOS.map((p) => `
      <article class="grain-card rounded-2xl border border-ivory/15 bg-ivory/5 p-7 hover:border-ivory/40 fade-in">
        <div class="flex justify-between items-center mb-4 font-sans">
          <p class="text-[10px] uppercase tracking-[0.25em] text-ivory/50">${p.year}</p>
          <p class="text-[10px] uppercase tracking-[0.25em] text-vintage">${p.status}</p>
        </div>
        <h3 class="font-display text-4xl text-ivory mb-1">${p.title}</h3>
        ${p.subtitle ? `<p class="text-ivory/60 text-sm mb-2">${p.subtitle}</p>` : ''}
        ${p.role ? `<p class="font-sans text-[10px] uppercase tracking-[0.2em] text-ivory/40 mb-5">${p.role}</p>` : ''}
        <p class="text-sm text-ivory/80 leading-relaxed">${p.desc}</p>
      </article>
    `).join('');
  }

  /* --- Formación --- */
  const formacionEl = document.getElementById('formacion-lista');
  if (formacionEl) {
    formacionEl.innerHTML = FORMACION.map((g) => `
      <div class="fade-in">
        <p class="font-sans text-[10px] uppercase tracking-[0.25em] text-ivory/40 mb-5">${g.label}</p>
        <div class="space-y-4">
          ${g.items.map((it) => `
            <div class="grain-card rounded-2xl border border-ivory/15 bg-ivory/5 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p class="font-display text-2xl text-ivory">${it.title}</p>
                <p class="text-ivory/60 text-sm mt-1">${it.institucion}</p>
              </div>
              <p class="font-sans text-[10px] uppercase tracking-[0.2em] text-ivory/50">${it.year}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  /* --- Ideas --- */
  const ideasEl = document.getElementById('ideas-lista');
  if (ideasEl) {
    ideasEl.innerHTML = IDEAS.map((i) => {
      const fecha = new Date(i.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
      const parrafos = i.body.split('\n\n').map((p) => `<p>${p}</p>`).join('');
      const tags = i.tags.map((t) => `<span class="font-sans text-[10px] uppercase tracking-[0.2em] text-ivory/60 border border-ivory/20 rounded-full px-3 py-1">#${t}</span>`).join('');
      return `
        <li class="fade-in border-b border-ivory/10 pb-12">
          <p class="font-sans text-[10px] uppercase tracking-[0.25em] text-ivory/50 mb-3">${fecha}</p>
          <h3 class="font-display text-4xl md:text-5xl text-ivory mb-3">${i.title}</h3>
          ${i.summary ? `<p class="font-display text-xl text-ivory/70 mb-6">${i.summary}</p>` : ''}
          <div class="text-ivory/85 leading-relaxed space-y-4">${parrafos}</div>
          <div class="mt-5 flex gap-2 flex-wrap">${tags}</div>
        </li>`;
    }).join('');
  }

  /* --- Archivo --- */
  const musicaEl = document.getElementById('archivo-musica');
  if (musicaEl) {
    musicaEl.innerHTML = MUSICA.map((m) => `
      <li class="grain-card rounded-2xl border border-ivory/15 bg-ivory/5 p-6">
        <p class="font-display text-2xl text-ivory mb-1">${m.title}</p>
        <p class="text-ivory/60 text-sm">${m.desc}</p>
      </li>
    `).join('');
  }

  const momentosEl = document.getElementById('archivo-momentos');
  if (momentosEl) {
    momentosEl.innerHTML = MOMENTOS.map((m) => `
      <li class="py-5 flex justify-between items-center">
        <span class="text-ivory/90">${m.title}</span>
        <span class="font-sans text-[10px] uppercase tracking-[0.2em] text-ivory/50">${m.lugar}</span>
      </li>
    `).join('');
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
          <button data-cat="${key}" class="filtro-btn font-sans text-[10px] uppercase tracking-[0.2em] border border-ivory/20 text-ivory/80 rounded-full px-4 py-1.5 hover:bg-ivory/5 transition flex items-center">
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
        : '<li class="py-4 text-ivory/50">No hay eventos próximos.</li>';
    }
  }
})();
