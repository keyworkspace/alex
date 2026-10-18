/* ==========================================================================
   TRACKER & RETENTION · Inyección automática
   ========================================================================== */
(function () {
  'use strict';

  // 1. Inyectar los estilos CSS (con barra de progreso y posicionamiento forzado)
  var style = document.createElement('style');
  style.innerHTML = `
    .aw-toast { 
      position: fixed !important; 
      top: 100px !important; 
      right: 24px !important; 
      left: auto !important;
      width: 320px; 
      background: var(--paper, #fff); 
      border: 1px solid var(--line, #ddd); 
      border-left: 4px solid var(--teal, #05A696); 
      border-radius: 12px; 
      padding: 1rem; 
      display: flex; 
      gap: 1rem; 
      box-shadow: 0 12px 32px rgba(13, 47, 68, 0.15); 
      z-index: 9999; 
      opacity: 0; 
      transform: translateX(40px); 
      transition: opacity 400ms ease, transform 400ms ease; 
      overflow: hidden;
    }
    .aw-toast.is-visible { opacity: 1; transform: translateX(0); }
    .aw-toast__icon { width: 36px; height: 36px; background: rgba(5, 166, 150, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--teal, #05A696); }
    .aw-toast__icon svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 1.6; }
    .aw-toast__content { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
    .aw-toast__label { font-family: var(--mono, monospace); font-size: 0.55rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold, #BF9445); font-weight: 600; }
    .aw-toast__title { font-family: var(--ui, sans-serif); font-weight: 800; font-size: 0.95rem; color: var(--navy, #143F59); margin: 0; }
    .aw-toast__text { font-size: 0.82rem; line-height: 1.45; color: var(--ink-soft, #4A6B82); margin: 0 0 0.5rem 0; }
    .aw-toast__link { font-size: 0.82rem; font-weight: 700; color: var(--teal, #05A696); text-decoration: none; }
    .aw-toast__close { position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; cursor: pointer; opacity: 0.5; font-size: 0.8rem; }
    .aw-toast__close:hover { opacity: 1; }
    
    /* Barra de progreso (7 segundos) */
    .aw-toast__progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 4px;
      background: var(--teal, #05A696);
      width: 100%;
      animation: aw-progress 7s linear forwards;
    }
    @keyframes aw-progress {
      from { width: 100%; }
      to { width: 0%; }
    }

    .aw-exit-modal { position: fixed !important; inset: 0 !important; background: rgba(13, 47, 68, 0.85); backdrop-filter: blur(4px); z-index: 10000; display: flex; align-items: center; justify-content: center; opacity: 0; visibility: hidden; transition: opacity 300ms ease, visibility 300ms ease; }
    .aw-exit-modal.is-visible { opacity: 1; visibility: visible; }
    .aw-exit-modal__inner { background: var(--paper, #fff); border-radius: 24px; padding: clamp(2rem, 5vw, 3rem); max-width: 500px; text-align: center; transform: translateY(20px); transition: transform 400ms ease; position: relative; }
    .aw-exit-modal.is-visible .aw-exit-modal__inner { transform: translateY(0); }
    .aw-exit-modal__label { font-family: var(--mono, monospace); font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--teal, #05A696); display: block; margin-bottom: 1rem; }
    .aw-exit-modal__title { font-family: var(--ui, sans-serif); font-weight: 800; font-size: clamp(1.8rem, 4vw, 2.5rem); line-height: 1.1; color: var(--navy, #143F59); margin-bottom: 1rem; }
    .aw-exit-modal__text { font-size: 1rem; line-height: 1.6; color: var(--ink-soft, #4A6B82); margin-bottom: 2rem; }
    .aw-exit-modal__actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    
    /* Móviles: posición inferior y ancho completo */
    @media (max-width: 768px) {
      .aw-toast { 
        top: auto !important; 
        bottom: 24px !important; 
        right: 16px !important; 
        left: 16px !important; 
        width: auto; 
        transform: translateY(40px); 
      }
      .aw-toast.is-visible { transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // 2. Lógica del Algoritmo
  var RECOMMENDATION_MAP = {
    'univo': { title: '¿Buscas más opciones?', text: 'Explora la Unidad de Becas completa.', link: 'unidad-de-becas/', icon: 'ic-book' },
    'unidad-de-becas': { title: '¿Aún no sabes qué estudiar?', text: 'Revisa la Unidad de Orientación Vocacional.', link: 'unidad-de-orientacion-vocacional/', icon: 'ic-compass' },
    'proyectos': { title: '¿Quieres crear tu propio proyecto?', text: 'Aprende el método en la Unidad de Emprendimiento.', link: 'unidad-de-emprendimiento/', icon: 'ic-spark' },
    'sobre-mi': { title: 'Conoce mi trayectoria', text: 'Revisa las certificaciones que respaldan mi perfil.', link: 'formacion.html', icon: 'ic-cert' },
    'unidad-de-orientacion-vocacional': { title: '¿Listo para emprender?', text: 'Descubre cómo validar tus ideas en la Unidad de Emprendimiento.', link: 'unidad-de-emprendimiento/', icon: 'ic-target' },
    'unidad-de-emprendimiento': { title: '¿Necesitas financiamiento?', text: 'Si tienes un proyecto, quizás te interese buscar becas.', link: 'unidad-de-becas/', icon: 'ic-book' }
  };

  var profile = JSON.parse(localStorage.getItem('aw_user_profile')) || { history: [], clicks: [], keywords: [] };
  
  var path = window.location.pathname;
  var isSub = /\/unidad-/.test(path);
  var base = isSub ? '../' : '';
  
  // Obtener el nombre exacto de la página actual (ej. 'univo' o 'unidad-de-becas')
  var currentPath = path.split('/').filter(Boolean).pop() || 'index';
  if (currentPath.includes('.')) {
    currentPath = currentPath.split('.')[0];
  }
  
  var timeOnPage = 0;

  function saveProfile() { localStorage.setItem('aw_user_profile', JSON.stringify(profile)); }

  // Rastreo de tiempo
  setInterval(function() { timeOnPage++; }, 1000);
  window.addEventListener('beforeunload', function() {
    profile.history.push({ page: currentPath, time: timeOnPage });
    if (profile.history.length > 20) profile.history.shift();
    saveProfile();
  });

  // Rastreo de clics
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a');
    if (link) {
      var text = link.innerText.trim() || link.href;
      if (text && !profile.clicks.includes(text)) {
        profile.clicks.push(text);
        if (profile.clicks.length > 15) profile.clicks.shift();
        saveProfile();
      }
    }
  });

  // Rastreo de Palabras clave
  document.querySelectorAll('h1, h2').forEach(function(h) {
    var t = h.innerText.trim();
    if (t && t.length < 50 && !profile.keywords.includes(t)) {
      profile.keywords.push(t);
    }
  });
  if (profile.keywords.length > 20) profile.keywords = profile.keywords.slice(-20);
  saveProfile();

  // Mostrar Recomendación
  setTimeout(function() {
    var bestRec = null;
    // Buscar en el historial la página más reciente que NO sea la actual
    for (var i = profile.history.length - 1; i >= 0; i--) {
      var past = profile.history[i].page;
      
      // CONDICIÓN CLAVE: Evitar recomendar la misma página donde está el usuario
      if (past !== currentPath && past !== currentPath + '.html') {
        if (RECOMMENDATION_MAP[past]) {
          var rec = RECOMMENDATION_MAP[past];
          var recTarget = rec.link.replace('.html', '').replace('/', '');
          
          // Evitar recomendar un enlace que apunte a la página actual
          if (recTarget !== currentPath) {
            bestRec = rec;
            break;
          }
        }
      }
    }

    if (!bestRec) return;

    var toast = document.createElement('div');
    toast.className = 'aw-toast';
    toast.innerHTML = 
      '<div class="aw-toast__icon"><svg viewBox="0 0 24 24"><use href="#' + bestRec.icon + '"/></svg></div>' +
      '<div class="aw-toast__content">' +
        '<span class="aw-toast__label">Recomendado para ti</span>' +
        '<h4 class="aw-toast__title">' + bestRec.title + '</h4>' +
        '<p class="aw-toast__text">' + bestRec.text + '</p>' +
        '<a href="' + base + bestRec.link + '" class="aw-toast__link">Ver ahora →</a>' +
      '</div>' +
      '<button class="aw-toast__close">✕</button>' +
      '<div class="aw-toast__progress"></div>'; // <-- Aquí está la barra de progreso

    document.body.appendChild(toast);
    
    // Animación de entrada
    setTimeout(function() { toast.classList.add('is-visible'); }, 100);
    
    // Botón de cerrar manual
    toast.querySelector('.aw-toast__close').addEventListener('click', function() {
      toast.classList.remove('is-visible');
      setTimeout(function() { toast.remove(); }, 400);
    });

    // Autocerrar a los 7 segundos (7000ms) igual que la animación CSS
    setTimeout(function() {
      if (document.body.contains(toast)) {
        toast.classList.remove('is-visible');
        setTimeout(function() { toast.remove(); }, 400);
      }
    }, 7000);

  }, 4000); // Aparece después de 4 segundos

  // Exit Intent (Sin cambios)
  if (!sessionStorage.getItem('aw_exit_shown') && currentPath !== 'contacto' && currentPath !== 'unidades') {
    document.addEventListener('mouseleave', function(e) {
      if (e.clientY < 10) {
        sessionStorage.setItem('aw_exit_shown', 'true');
        var modal = document.createElement('div');
        modal.className = 'aw-exit-modal';
        modal.innerHTML = 
          '<div class="aw-exit-modal__inner">' +
            '<span class="aw-exit-modal__label">Espera un momento</span>' +
            '<h2 class="aw-exit-modal__title">¿Te vas sin ver esto?</h2>' +
            '<p class="aw-exit-modal__text">Antes de irte, descubre cómo podemos ayudarte a alcanzar tus objetivos con nuestras unidades.</p>' +
            '<div class="aw-exit-modal__actions">' +
              '<a href="' + base + 'unidades.html" class="btn-big btn-big--purple"><span class="btn-big__label">Ver Unidades</span></a>' +
              '<button class="btn-big btn-big--light aw-exit-modal__close"><span class="btn-big__label">No, gracias</span></button>' +
            '</div>' +
          '</div>';
        document.body.appendChild(modal);
        setTimeout(function() { modal.classList.add('is-visible'); }, 50);

        modal.querySelector('.aw-exit-modal__close').addEventListener('click', function() {
          modal.classList.remove('is-visible');
          setTimeout(function() { modal.remove(); }, 300);
        });
      }
    });
  }
})();
