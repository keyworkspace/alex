/* ============================================================
   ALEX WORKSPACE — Render de Proyectos
   ============================================================ */

(function () {
  'use strict';

  const container = document.getElementById('proyectos-grid');
  if (!container || !window.PROYECTOS) return;

  container.innerHTML = window.PROYECTOS
    .map(function (p) {
      return (
        '<article class="grain-card rounded-2xl border border-ivory/15 bg-ivory/5 p-7 hover:border-ivory/40 transition-all duration-300 fade-in">' +
          '<div class="flex justify-between items-center mb-4 font-sans">' +
            '<p class="text-[10px] uppercase tracking-[0.25em] text-ivory/50">' + p.year + '</p>' +
            '<p class="text-[10px] uppercase tracking-[0.25em] text-vintage">' + p.status + '</p>' +
          '</div>' +
          '<h3 class="font-display text-4xl text-ivory mb-1">' + p.title + '</h3>' +
          (p.subtitle
            ? '<p class="text-ivory/60 text-sm mb-2">' + p.subtitle + '</p>'
            : '') +
          (p.role
            ? '<p class="font-sans text-[10px] uppercase tracking-[0.2em] text-ivory/40 mb-5">' + p.role + '</p>'
            : '') +
          '<p class="text-sm text-ivory/80 leading-relaxed">' + p.desc + '</p>' +
        '</article>'
      );
    })
    .join('');
})();
