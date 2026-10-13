/* ==========================================================================
   BECAS · lógica compartida
   Detecta todos los .beca-countdown de la página y los activa.
   Solo requiere data-beca-target. Todo lo demás se genera automáticamente.
   ========================================================================== */
(function () {
  'use strict';

  var MESES_CORTOS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function formatearFecha(date) {
    var d = date.getDate();
    var m = MESES_CORTOS[date.getMonth()];
    var y = date.getFullYear();
    return d + ' ' + m + ' ' + y;
  }

  function pluralizar(n, singular, plural) {
    return n + ' ' + (n === 1 ? singular : plural);
  }

  function construirEstructura(el) {
    // Si ya tiene la estructura interna, no la reconstruye
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

    // Construye la estructura la primera vez
    construirEstructura(el);

    // Referencias
    var labelEl = el.querySelector('[data-beca-label]');
    var footEl  = el.querySelector('[data-beca-foot]');
    var units = {
      days:    el.querySelector('[data-beca-unit="days"]'),
      hours:   el.querySelector('[data-beca-unit="hours"]'),
      minutes: el.querySelector('[data-beca-unit="minutes"]'),
      seconds: el.querySelector('[data-beca-unit="seconds"]')
    };

    // Overrides opcionales
    var waitingMessage = el.getAttribute('data-beca-waiting-message');
    var openMessage    = el.getAttribute('data-beca-open-message');

    var fechaLegible = formatearFecha(targetDate);
    var isToday = targetDate.toDateString() === new Date().toDateString();

    function update() {
      var diff = targetDate.getTime() - Date.now();

      if (diff <= 0) {
        // ---------- ESTADO ABIERTO ----------
        el.setAttribute('data-state', 'open');
        labelEl.textContent = 'Convocatoria abierta';

        units.days.textContent    = '00';
        units.hours.textContent   = '00';
        units.minutes.textContent = '00';
        units.seconds.textContent = '00';

        if (isToday) {
          footEl.innerHTML = '<strong>' + fechaLegible + '</strong> · Abre hoy';
        } else {
          footEl.innerHTML = 'Abierta desde el <strong>' + fechaLegible + '</strong>' +
                             (openMessage ? ' · ' + openMessage : '');
        }
        return;
      }

      // ---------- ESTADO ESPERANDO ----------
      el.setAttribute('data-state', 'waiting');
      labelEl.textContent = 'Próxima convocatoria';

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
      if (days === 0) {
        autoMsg = '<strong>Abre hoy</strong> · ' + fechaLegible;
      } else if (days === 1) {
        autoMsg = '<strong>Abre mañana</strong> · ' + fechaLegible;
      } else {
        autoMsg = '<strong>' + fechaLegible + '</strong> · Faltan ' +
                  pluralizar(days, 'día', 'días');
      }

      footEl.innerHTML = waitingMessage
        ? autoMsg + ' · ' + waitingMessage
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
