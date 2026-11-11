/* ==========================================================================
   CUENTA REGRESIVA · Formación Continua · Alex Workspace
   Cualquier elemento con [data-cuenta-target] se convierte en cuenta
   regresiva. Al llegar a 0 pasa a data-state="revealed" y muestra el
   bloque .cuenta__reveal.

   Modo de prueba: añade ?preview-cuenta=1 a la URL para forzar el
   estado revelado sin esperar a la fecha.
   ========================================================================== */
(function () {
  'use strict';

  var MESES = ['enero','febrero','marzo','abril','mayo','junio',
               'julio','agosto','septiembre','octubre','noviembre','diciembre'];

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  function fmtDate(date) {
    return date.getDate() + ' de ' + MESES[date.getMonth()] + ' de ' + date.getFullYear();
  }

  function init(el) {
    var target = el.getAttribute('data-cuenta-target');
    if (!target) return;
    var targetDate = new Date(target);
    if (isNaN(targetDate.getTime())) return;

    var head  = el.querySelector('[data-cuenta-head]');
    var foot  = el.querySelector('[data-cuenta-foot]');
    var units = {
      days:    el.querySelector('[data-cuenta-unit="days"]'),
      hours:   el.querySelector('[data-cuenta-unit="hours"]'),
      minutes: el.querySelector('[data-cuenta-unit="minutes"]'),
      seconds: el.querySelector('[data-cuenta-unit="seconds"]')
    };

    var preview = /[?&]preview-cuenta=1\b/.test(window.location.search);

    function reveal() {
      el.setAttribute('data-state', 'revealed');
      if (units.days)    units.days.textContent    = '00';
      if (units.hours)   units.hours.textContent   = '00';
      if (units.minutes) units.minutes.textContent = '00';
      if (units.seconds) units.seconds.textContent = '00';
    }

    // true si ya reveló (no seguir), false si sigue contando
    function update() {
      if (preview) { reveal(); return true; }

      var diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { reveal(); return true; }

      el.setAttribute('data-state', 'counting');

      var sec  = Math.floor(diff / 1000);
      var days = Math.floor(sec / 86400);
      var hrs  = Math.floor((sec % 86400) / 3600);
      var mins = Math.floor((sec % 3600) / 60);
      var secs = sec % 60;

      if (units.days)    units.days.textContent    = days < 100 ? pad(days) : String(days);
      if (units.hours)   units.hours.textContent   = pad(hrs);
      if (units.minutes) units.minutes.textContent = pad(mins);
      if (units.seconds) units.seconds.textContent = pad(secs);

      if (head) head.textContent = 'Faltan';
      if (foot) {
        foot.innerHTML = 'Cuenta regresiva hasta el <strong>' + fmtDate(targetDate) + '</strong> · ' +
                         plural(days, 'día', 'días') + ' restantes.';
      }
      return false;
    }

    if (!update()) {
      var timer = setInterval(function () {
        if (update()) clearInterval(timer);
      }, 1000);
    }
  }

  function initAll() {
    var els = document.querySelectorAll('[data-cuenta-target]');
    if (!els.length) return;
    Array.prototype.forEach.call(els, init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
