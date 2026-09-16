/* ============================================================
   ALEX WORKSPACE — Render de Trayectoria
   ============================================================ */

(function () {
  'use strict';

  const container = document.getElementById('timeline');
  if (!container || !window.TIMELINE) return;

  const items = window.TIMELINE;

  container.innerHTML = items
    .map(function (it, i) {
      const isLast = i === items.length - 1;
      return (
        '<li class="relative pl-10 ' + (isLast ? '' : 'pb-12') + ' fade-in">' +
          '<span class="absolute left-0 top-2 w-3 h-3 rounded-full border-2 border-vintage bg-sky"></span>' +
          (isLast
            ? ''
            : '<span class="absolute left-[5px] top-5 bottom-0 w-px bg-ivory/20"></span>') +
          '<p class="font-sans text-[10px] uppercase tracking-[0.25em] text-ivory/50 mb-2">' +
            it.year +
          '</p>' +
          '<h3 class="font-display text-3xl md:text-4xl text-ivory mb-1">' + it.title + '</h3>' +
          (it.lugar
            ? '<p class="text-ivory/60 text-sm">' + it.lugar + '</p>'
            : '') +
        '</li>'
      );
    })
    .join('');
})();
