/* ==========================================================================
   BECAS · lógica compartida para todas las fichas
   Detecta todos los .beca-countdown de la página y los activa.
   ========================================================================== */
(function () {
  'use strict';

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function initCountdown(el) {
    var target = el.getAttribute('data-beca-target');
    if (!target) return;

    var targetDate = new Date(target);
    if (isNaN(targetDate.getTime())) return;

    var units = {
      days:    el.querySelector('[data-beca-unit="days"]'),
      hours:   el.querySelector('[data-beca-unit="hours"]'),
      minutes: el.querySelector('[data-beca-unit="minutes"]'),
      seconds: el.querySelector('[data-beca-unit="seconds"]')
    };
    var labelEl = el.querySelector('[data-beca-label]');
    var footEl  = el.querySelector('[data-beca-foot]');

    var openLabel      = el.getAttribute('data-beca-open-label')    || 'Convocatoria abierta';
    var waitingLabel   = el.getAttribute('data-beca-waiting-label') || 'Próxima convocatoria';
    var openMessage    = el.getAttribute('data-beca-open-message')  || '';
    var waitingMessage = el.getAttribute('data-beca-waiting-message') || '';

    function update() {
      var diff = targetDate.getTime() - Date.now();

      if (diff <= 0) {
        el.setAttribute('data-state', 'open');
        if (labelEl) labelEl.textContent = openLabel;
        if (footEl && openMessage) footEl.innerHTML = openMessage;
        if (units.days)    units.days.textContent    = '00';
        if (units.hours)   units.hours.textContent   = '00';
        if (units.minutes) units.minutes.textContent = '00';
        if (units.seconds) units.seconds.textContent = '00';
        return;
      }

      el.setAttribute('data-state', 'waiting');
      if (labelEl) labelEl.textContent = waitingLabel;

      var sec  = Math.floor(diff / 1000);
      var days = Math.floor(sec / 86400);
      var hrs  = Math.floor((sec % 86400) / 3600);
      var mins = Math.floor((sec % 3600) / 60);
      var secs = sec % 60;

      if (units.days)    units.days.textContent    = days < 100 ? pad(days) : days;
      if (units.hours)   units.hours.textContent   = pad(hrs);
      if (units.minutes) units.minutes.textContent = pad(mins);
      if (units.seconds) units.seconds.textContent = pad(secs);

      if (footEl && waitingMessage) footEl.innerHTML = waitingMessage;
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
