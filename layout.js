/* ==========================================================================
   LAYOUT · Header + Footer centralizados para Alex Workspace
   Detecta automáticamente si estamos en subcarpeta y ajusta los enlaces.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Base path ---------- */
  function base() {
    var path = window.location.pathname;
    if (/\/unidad-de-becas\//.test(path)) return '../';
    return '';
  }

  /* ---------- Página actual ---------- */
  function currentPage() {
    var path = window.location.pathname;
    if (/\/unidad-de-becas\//.test(path)) return 'unidad-de-becas';
    var file = path.split('/').pop() || 'index.html';
    if (!file || file === '') file = 'index.html';
    if (file.indexOf('.') === -1) file = 'index.html';
    return file.replace('.html', '');
  }

  /* ---------- Definición única de la navegación ---------- */
  var NAV = [
    { label: 'Inicio',        href: 'index.html',             id: 'index' },
    {
      label: 'Sobre mí',
      href: 'sobre-mi.html',
      id: 'sobre-mi',
      children: [
        { label: 'Sobre mí',      href: 'sobre-mi.html',      id: 'sobre-mi' },
        { label: 'Formación',     href: 'formacion.html',     id: 'formacion' },
        { label: 'Filosofía',     href: 'filosofia.html',     id: 'filosofia' },
        { label: 'Generaciones',  href: 'generaciones.html',  id: 'generaciones' }
      ]
    },
    { label: 'Proyectos',     href: 'proyectos.html',         id: 'proyectos' },
    {
      label: 'Unidades',
      href: 'unidades.html',
      id: 'unidades',
      children: [
        { label: 'Todas las unidades', href: 'unidades.html',         id: 'unidades' },
        { label: 'Becas',              href: 'unidad-de-becas/',       id: 'unidad-de-becas' }
      ]
    },
    { label: 'Transparencia', href: 'transparencia.html',     id: 'transparencia' },
    { label: 'Contacto',      href: 'contacto.html',          id: 'contacto' }
  ];

  /* ---------- Símbolos SVG ---------- */
  var SYMBOLS = `
    <symbol id="al-mark" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="1.8"/>
      <text x="24" y="31" font-family="Inter, sans-serif" font-size="20" font-weight="800" fill="currentColor" text-anchor="middle">A</text>
    </symbol>
    <symbol id="ic-book" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14"/><path d="M8 7h8M8 11h8M8 15h5"/></symbol>
    <symbol id="ic-people" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 21v-1a6 6 0 016-6h0a6 6 0 016 6v1"/><circle cx="17" cy="9" r="2"/><path d="M15 21v-1a5 5 0 015-5h0a5 5 0 013 4"/></symbol>
    <symbol id="ic-spark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/><circle cx="12" cy="12" r="2.5"/></symbol>
    <symbol id="ic-compass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></symbol>
    <symbol id="ic-heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"/></symbol>
    <symbol id="ic-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/></symbol>
    <symbol id="ic-leaf" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c0-5 4-9 8-9-2 5-5 8-8 9z"/><path d="M12 21c0-5-4-9-8-9 2 5 5 8 8 9z"/><path d="M12 21V8"/><circle cx="12" cy="4" r="2"/></symbol>
    <symbol id="ic-mic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></symbol>
    <symbol id="ic-cert" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14.5L7 22l5-3 5 3-1.5-7.5"/></symbol>
    <symbol id="ic-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></symbol>
    <symbol id="ic-target" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></symbol>
    <symbol id="ic-crown" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18l2-9 5 4 2-8 2 8 5-4 2 9z"/><path d="M3 21h18"/></symbol>
    <symbol id="ic-hammer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 6l4 4-8 8-4-4z"/><path d="M17 3l4 4-3 3-4-4z"/><path d="M6 18l-2 2"/></symbol>
    <symbol id="ic-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></symbol>
    <symbol id="ic-doc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/></symbol>
    <symbol id="ic-ig" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></symbol>
    <symbol id="ic-li" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></symbol>
    <symbol id="ic-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></symbol>
  `;

  /* ---------- Render del header + mobile nav ---------- */
  function renderHeader() {
    var active = currentPage();
    var b = base();

    var linksDesktop = NAV.map(function (item) {
      if (item.children) {
        var sub = item.children.map(function (c) {
          var cur = c.id === active ? ' aria-current="page"' : '';
          return '<a class="nav__submenu-link" href="' + b + c.href + '" role="menuitem"' + cur + '>' + c.label + '</a>';
        }).join('');
        return (
          '<div class="nav__item">' +
            '<a class="nav__link nav__link--has-sub" href="' + b + item.href + '" aria-haspopup="true" aria-expanded="false">' + item.label + '</a>' +
            '<div class="nav__submenu" role="menu">' + sub + '</div>' +
          '</div>'
        );
      }
      var cur = item.id === active ? ' aria-current="page"' : '';
      return '<a class="nav__link" href="' + b + item.href + '"' + cur + '>' + item.label + '</a>';
    }).join('');

    var linksMobile = NAV.map(function (item) {
      if (item.children) {
        var sub = item.children.map(function (c) {
          var cur = c.id === active ? ' aria-current="page"' : '';
          return '<a class="mobile-nav__subitem" href="' + b + c.href + '"' + cur + '>' + c.label + '</a>';
        }).join('');
        return (
          '<div class="mobile-nav__group">' +
            '<button class="mobile-nav__item mobile-nav__item--has-sub" data-open="false" aria-expanded="false">' +
              item.label +
              '<svg class="mobile-nav__caret" viewBox="0 0 12 12" fill="none" aria-hidden="true">' +
                '<polyline points="3 5 6 8 9 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
              '</svg>' +
            '</button>' +
            '<div class="mobile-nav__subnav">' + sub + '</div>' +
          '</div>'
        );
      }
      return '<a class="mobile-nav__item" href="' + b + item.href + '">' + item.label + '</a>';
    }).join('');

    return (
      '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' + SYMBOLS + '</svg>' +

      '<header class="site-header" id="siteHeader">' +
        '<nav class="nav" id="nav" aria-label="Principal">' +
          '<div class="nav__inner">' +
            '<a href="' + b + 'index.html" class="brand">' +
              '<svg class="brand__mark" aria-hidden="true"><use href="#al-mark"/></svg>' +
              '<span class="brand__text"><span class="brand__name">Alex Workspace</span></span>' +
            '</a>' +
            '<div class="nav__links">' + linksDesktop + '</div>' +
            '<div class="nav__actions">' +
              '<a class="nav__official" href="https://www.linkedin.com/in/alexanderhrnndz/" target="_blank" rel="noopener">' +
                '<span class="nav__official__label">LinkedIn</span>' +
                '<span class="nav__official__arrow" aria-hidden="true">↗</span>' +
              '</a>' +
              '<button class="menu-toggle" id="menuToggle" aria-expanded="false" aria-controls="mobileNav">' +
                '<span class="menu-toggle__icon" aria-hidden="true"></span>Menú' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</nav>' +
      '</header>' +

      '<div class="nav-overlay" id="navOverlay" data-open="false"></div>' +

      '<aside class="mobile-nav" id="mobileNav" data-open="false">' +
        '<button class="mobile-nav__close" id="mobileClose" aria-label="Cerrar">✕</button>' +
        linksMobile +
        '<a class="mobile-nav__cta" href="https://www.linkedin.com/in/alexanderhrnndz/" target="_blank" rel="noopener">Ir a LinkedIn</a>' +
      '</aside>'
    );
  }

  /* ---------- Render del footer ---------- */
  function renderFooter() {
    var b = base();
    return (
      '<footer class="footer">' +
        '<div class="footer__inner">' +
          '<div class="footer__grid">' +

            '<div class="footer__col footer__col--brand">' +
              '<div class="footer__brand">' +
                '<svg class="footer__brand-mark" aria-hidden="true"><use href="#al-mark"/></svg>' +
                '<span class="footer__brand-name">Alex Workspace</span>' +
              '</div>' +
              '<p class="footer__desc">Espacio personal entre las personas, las organizaciones y las ideas.</p>' +
            '</div>' +

            '<div class="footer__col">' +
              '<h4>Navegación</h4>' +
              '<ul>' +
                '<li><a href="' + b + 'index.html">Inicio</a></li>' +
                '<li><a href="' + b + 'sobre-mi.html">Sobre mí</a></li>' +
                '<li><a href="' + b + 'formacion.html">Formación</a></li>' +
                '<li><a href="' + b + 'proyectos.html">Proyectos</a></li>' +
                '<li><a href="' + b + 'unidades.html">Unidades</a></li>' +
              '</ul>' +
            '</div>' +

            '<div class="footer__col">' +
              '<h4>Más</h4>' +
              '<ul>' +
                '<li><a href="' + b + 'filosofia.html">Filosofía</a></li>' +
                '<li><a href="' + b + 'generaciones.html">Generaciones</a></li>' +
                '<li><a href="' + b + 'contacto.html">Contacto</a></li>' +
                '<li><a href="' + b + 'transparencia.html">Transparencia</a></li>' +
              '</ul>' +
            '</div>' +

            '<div class="footer__col">' +
              '<h4>Proyectos</h4>' +
              '<ul>' +
                '<li><a href="https://keyworkspace.github.io/Heliot-Media/" target="_blank" rel="noopener">Heliot Media</a></li>' +
                '<li><a href="https://keyworkspace.github.io/windsor/" target="_blank" rel="noopener">Windsor</a></li>' +
                '<li><a href="https://the-newkey.blogspot.com/" target="_blank" rel="noopener">The New Key</a></li>' +
              '</ul>' +
            '</div>' +

          '</div>' +

          '<div class="footer__seal">' +
            '<span class="footer__signature">No venimos a repetir, venimos a innovar.</span>' +
          '</div>' +

          '<div class="footer__socials-wrap">' +
            '<div class="footer__socials">' +
              '<a class="footer__social" href="https://instagram.com/kanderth" target="_blank" rel="noopener" aria-label="Instagram"><svg><use href="#ic-ig"/></svg></a>' +
              '<a class="footer__social" href="https://www.linkedin.com/in/alexanderhrnndz/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg><use href="#ic-li"/></svg></a>' +
              '<a class="footer__social" href="mailto:alexhrnndz32@gmail.com" aria-label="Email"><svg><use href="#ic-mail"/></svg></a>' +
            '</div>' +
          '</div>' +

          '<div class="footer__bottom">' +
            '<span>© <span id="year"></span> · Alex Workspace</span>' +
          '</div>' +

        '</div>' +
      '</footer>'
    );
  }

  /* ---------- Custom elements ---------- */
  if (window.customElements && !window.customElements.get('aw-header')) {
    window.customElements.define('aw-header', class extends HTMLElement {
      connectedCallback() { this.innerHTML = renderHeader(); }
    });
    window.customElements.define('aw-footer', class extends HTMLElement {
      connectedCallback() { this.innerHTML = renderFooter(); }
    });
  }
})();
