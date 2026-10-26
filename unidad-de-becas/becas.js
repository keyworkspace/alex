/* ==========================================================================
   BECAS · lógica compartida
   Detecta todos los .beca-countdown de la página y los activa.
   data-beca-target = fecha de CIERRE de la convocatoria.
   Formato de fecha: dd/mm/aaaa · Hora: 24h
   ========================================================================== */
(function () {
  'use strict';

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function formatearFecha(date) {
    var d  = pad(date.getDate());
    var m  = pad(date.getMonth() + 1);
    var y  = date.getFullYear();
    var hh = pad(date.getHours());
    var mi = pad(date.getMinutes());

    // Si la hora es medianoche, solo devolvemos la fecha
    if (hh === '00' && mi === '00') {
      return d + '/' + m + '/' + y;
    }

    // Si hay hora específica, la añadimos en formato 24h
    return d + '/' + m + '/' + y + ' · ' + hh + ':' + mi + ' h';
  }

  function pluralizar(n, singular, plural) {
    return n + ' ' + (n === 1 ? singular : plural);
  }

  function construirEstructura(el) {
    if (el.querySelector('[data-beca-unit="days"]')) return;

    el.innerHTML =
      '<span class="beca-countdown__label" data-beca-label></span>' +
      '<div class="beca-countdown__grid">' +
        '<div class="beca-countdown__cell">' +
          '<span class="beca-countdown__num" data-beca-unit="days">—</span>' +
          '<span class="beca-countdown__unit">Días</span>' +
        '</div>' +
        '<div class="beca-countdown__cell">' +
          '<span class="beca-countdown__num" data-beca-unit="hours">—</span>' +
          '<span class="beca-countdown__unit">Horas</span>' +
        '</div>' +
        '<div class="beca-countdown__cell">' +
          '<span class="beca-countdown__num" data-beca-unit="minutes">—</span>' +
          '<span class="beca-countdown__unit">Min</span>' +
        '</div>' +
        '<div class="beca-countdown__cell">' +
          '<span class="beca-countdown__num" data-beca-unit="seconds">—</span>' +
          '<span class="beca-countdown__unit">Seg</span>' +
        '</div>' +
      '</div>' +
      '<p class="beca-countdown__foot" data-beca-foot></p>';
  }

  function initCountdown(el) {
    var target = el.getAttribute('data-beca-target');
    if (!target) return;

    var targetDate = new Date(target);
    if (isNaN(targetDate.getTime())) return;

    construirEstructura(el);

    var labelEl = el.querySelector('[data-beca-label]');
    var footEl  = el.querySelector('[data-beca-foot]');
    var units = {
      days:    el.querySelector('[data-beca-unit="days"]'),
      hours:   el.querySelector('[data-beca-unit="hours"]'),
      minutes: el.querySelector('[data-beca-unit="minutes"]'),
      seconds: el.querySelector('[data-beca-unit="seconds"]')
    };

    // Mensaje opcional que se añade al pie de texto
    var extraMessage = el.getAttribute('data-beca-message') || '';

    var fechaLegible = formatearFecha(targetDate);
    var isToday = targetDate.toDateString() === new Date().toDateString();
    var tomorrow = new Date(Date.now() + 86400000);
    var isTomorrow = targetDate.toDateString() === tomorrow.toDateString();

    function update() {
      var diff = targetDate.getTime() - Date.now();

      // ---------- YA CERRÓ ----------
      if (diff <= 0) {
        el.setAttribute('data-state', 'open');
        labelEl.textContent = 'Convocatoria cerrada';

        units.days.textContent    = '00';
        units.hours.textContent   = '00';
        units.minutes.textContent = '00';
        units.seconds.textContent = '00';

        footEl.innerHTML = 'Cerrada el <strong>' + fechaLegible + '</strong>' +
                           (extraMessage ? ' · ' + extraMessage : '');
        return;
      }

      // ---------- AÚN ABIERTA ----------
      el.setAttribute('data-state', 'waiting');

      if (isToday) {
        labelEl.textContent = 'Cierra hoy';
      } else if (isTomorrow) {
        labelEl.textContent = 'Cierra mañana';
      } else {
        labelEl.textContent = 'Cierre de convocatoria';
      }

      var sec  = Math.floor(diff / 1000);
      var days = Math.floor(sec / 86400);
      var hrs  = Math.floor((sec % 86400) / 3600);
      var mins = Math.floor((sec % 3600) / 60);
      var secs = sec % 60;

      units.days.textContent    = days < 100 ? pad(days) : String(days);
      units.hours.textContent   = pad(hrs);
      units.minutes.textContent = pad(mins);
      units.seconds.textContent = pad(secs);

      var autoMsg;
      if (isToday) {
        autoMsg = '<strong>Cierra hoy</strong> · ' + fechaLegible;
      } else if (isTomorrow) {
        autoMsg = '<strong>Cierra mañana</strong> · ' + fechaLegible;
      } else {
        autoMsg = '<strong>' + fechaLegible + '</strong> · ' +
                  pluralizar(days, 'día', 'días') + ' para el cierre';
      }

      footEl.innerHTML = extraMessage
        ? autoMsg + ' · ' + extraMessage
        : autoMsg;
    }

    update();
    setInterval(update, 1000);
  }

  function initAll() {
    var countdowns = document.querySelectorAll('.beca-countdown');
    if (!countdowns.length) return;
    Array.prototype.forEach.call(countdowns, initCountdown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
