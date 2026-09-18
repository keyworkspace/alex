/* ==========================================================================
   TALAPO · Asistente torogoz de Alex Workspace
   Sistema de preguntas y respuestas por coincidencia de palabras clave.
   No usa IA, no hace peticiones externas, no almacena nada.
   ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     SVG DEL TOROGOZ
     Silueta estilizada con cresta, pico largo, ceja y cola de raqueta.
     ====================================================================== */
  var TOROGOZ_SVG =
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      /* cuerpo */
      '<path d="M12 22 Q12 12 22 10 Q30 8 34 14 Q38 20 34 26 L34 28 Q28 32 20 32 Q14 32 12 26 Z"/>' +
      /* cresta */
      '<path d="M20 11 Q23 6 27 8"/>' +
      /* ojo */
      '<circle cx="25" cy="18" r="1.3" fill="currentColor" stroke="none"/>' +
      /* pico */
      '<path d="M34 16 L44 18 L34 20"/>' +
      /* ceja */
      '<path d="M20 13 Q25 10 31 13"/>' +
      /* cola de raqueta */
      '<path d="M15 28 Q11 36 9 43"/>' +
      '<circle cx="9" cy="43" r="1.6"/>' +
      '<path d="M19 30 Q17 36 15 43"/>' +
      '<circle cx="15" cy="43" r="1.6"/>' +
    '</svg>';

  /* ======================================================================
     BASE DE CONOCIMIENTO
     ======================================================================
     Cada entrada tiene:
       id: identificador interno
       keywords: lista de frases clave que activan esta respuesta
       answer: HTML con la respuesta (puede contener enlaces)
       suggestions: chips de seguimiento que aparecen debajo
     ====================================================================== */
  var KB = [
    {
      id: 'hola',
      keywords: ['hola', 'buenas', 'hey', 'saludos', 'buenos dias', 'buenas tardes', 'buenas noches', 'que tal', 'hi'],
      answer: '¡Hola! Soy <strong>Talapo</strong>, el torogoz de Alex Workspace. Puedo responderte sobre Alexander, sus proyectos, su formación, su filosofía o cómo contactarlo. ¿Qué quieres saber?',
      suggestions: ['¿Quién es Alexander?', '¿Qué proyectos tiene?', '¿Cómo contacto?']
    },
    {
      id: 'quien',
      keywords: ['quien es alexander', 'quien es alex', 'quien eres', 'sobre alexander', 'sobre alex', 'sobre mi', 'biografia', 'presentate', 'presentacion'],
      answer: 'Alexander Hernández es un estudiante salvadoreño que está construyendo deliberadamente su trayectoria. Le interesan las personas, las organizaciones, la estrategia y la creación de proyectos. Es director de Recursos Humanos en Heliot Media y fundador de Key Workspace y sus proyectos. <a href="sobre-mi.html">Ver más en Sobre mí →</a>',
      suggestions: ['¿Qué es Alex Workspace?', '¿Cuáles son sus valores?', '¿Cómo contacto?']
    },
    {
      id: 'workspace',
      keywords: ['alex workspace', 'que es alex workspace', 'que es este sitio', 'que es esta pagina', 'que es la marca', 'marca personal'],
      answer: '<strong>Alex Workspace</strong> es una marca personal, no una empresa. Es el espacio digital donde Alexander organiza y presenta su trayectoria: formación, proyectos, ideas y filosofía. No recibe financiamiento externo ni comercializa datos. <a href="transparencia.html">Ver Portal de Transparencia →</a>',
      suggestions: ['¿Quién está detrás?', '¿Cómo se sostiene?', '¿Qué datos recoge?']
    },
    {
      id: 'contacto',
      keywords: ['contacto', 'contactar', 'como contacto', 'como hablar', 'escribir', 'correo', 'email', 'mail', 'linkedin', 'instagram', 'redes', 'mensaje'],
      answer: 'Puedes escribirle por varios canales:<br>· LinkedIn: <a href="https://www.linkedin.com/in/alexanderhrnndz/" target="_blank" rel="noopener">/in/alexanderhrnndz</a><br>· Instagram: <a href="https://instagram.com/kanderth" target="_blank" rel="noopener">@kanderth</a><br>· Email: <a href="mailto:alexhrnndz32@gmail.com">alexhrnndz32@gmail.com</a><br><br><a href="contacto.html">Ver página de Contacto →</a>',
      suggestions: ['¿Dónde vive?', '¿Qué proyectos tiene?', '¿Cuál es su filosofía?']
    },
    {
      id: 'formacion',
      keywords: ['formacion', 'estudios', 'educacion', 'certificaciones', 'certificados', 'cursos', 'aprendizaje', 'instituto', 'bachillerato'],
      answer: 'Actualmente cursa el Bachillerato Técnico Vocacional en Administración Contable en el Instituto de Yamabal (2023 – actualidad) y participa en el Programa Oportunidades de la Fundación Gloria Kriete. Además tiene 8 certificaciones verificables: Google (Gemini), Platzi (Emprendimiento, Reclutamiento, LinkedIn), Canva, CREO El Salvador, Aflatoun International y Fundación Carlos Slim. <a href="formacion.html">Ver Formación completa →</a>',
      suggestions: ['¿Qué idiomas habla?', '¿Qué proyectos tiene?', '¿Cómo contacto?']
    },
    {
      id: 'proyectos',
      keywords: ['proyectos', 'proyecto', 'heliot', 'heliot media', 'key workspace', 'windsor', 'the new key', 'arts and culture', 'key arts', 'museo digital', 'emprendimiento', 'fundador'],
      answer: 'Actualmente administra cinco proyectos:<br>· <strong>Heliot Media</strong> — producción audiovisual<br>· <strong>Key Workspace</strong> — espacio digital de educación, empleabilidad y cultura<br>· <strong>Windsor</strong> — servicios digitales<br>· <strong>The New Key</strong> — blog editorial<br>· <strong>Key Arts &amp; Culture</strong> — museo digital<br><br>También tiene dos proyectos académicos con resultados medibles. <a href="proyectos.html">Ver todos →</a>',
      suggestions: ['¿Qué es Heliot Media?', '¿Qué es Key Workspace?', '¿Cómo contacto?']
    },
    {
      id: 'heliot',
      keywords: ['heliot', 'heliot media', 'audiovisual', 'produccion audiovisual', 'video'],
      answer: '<strong>Heliot Media</strong> es un proyecto de producción audiovisual con equipo activo, clientes reales e ingresos por servicios. Alexander es Director de Recursos Humanos ahí. <a href="https://keyworkspace.github.io/Heliot-Media/" target="_blank" rel="noopener">Visitar Heliot Media →</a>',
      suggestions: ['¿Qué proyectos tiene?', '¿Cuál es su experiencia?', '¿Cómo contacto?']
    },
    {
      id: 'key',
      keywords: ['key workspace', 'que es key', 'espacio digital'],
      answer: '<strong>Key Workspace</strong> es un espacio digital independiente que trabaja educación, empleabilidad y cultura en línea. No es una fundación ni una persona jurídica: es una marca operativa con tres proyectos: Windsor, The New Key y Key Arts &amp; Culture. <a href="https://keyworkspace.github.io/key/" target="_blank" rel="noopener">Visitar Key Workspace →</a>',
      suggestions: ['¿Qué es Windsor?', '¿Qué es The New Key?', '¿Qué es Key Arts & Culture?']
    },
    {
      id: 'windsor',
      keywords: ['windsor', 'servicios digitales', 'diseno', 'diseno digital', 'tecnologia'],
      answer: '<strong>Windsor</strong> es un proyecto dentro de Key Workspace que ofrece servicios digitales: estrategia, diseño y tecnología para emprendedores que quieren construir con propósito. <a href="https://keyworkspace.github.io/windsor/" target="_blank" rel="noopener">Visitar Windsor →</a>',
      suggestions: ['¿Qué es Key Workspace?', '¿Qué proyectos tiene?', '¿Cómo contacto?']
    },
    {
      id: 'newkey',
      keywords: ['the new key', 'new key', 'blog editorial', 'blog', 'articulos', 'reflexiones'],
      answer: '<strong>The New Key</strong> es el blog editorial de Key Workspace. Es un espacio para pensar en voz alta sobre actualidad, sociedad, tecnología y cultura. <a href="https://the-newkey.blogspot.com/" target="_blank" rel="noopener">Visitar The New Key →</a>',
      suggestions: ['¿Qué es Key Workspace?', '¿Qué es Key Arts & Culture?', '¿Cómo contacto?']
    },
    {
      id: 'arts',
      keywords: ['key arts', 'arts and culture', 'arts culture', 'museo digital', 'museo', 'arte', 'cultura'],
      answer: '<strong>Key Arts &amp; Culture</strong> es un museo digital: un archivo cultural con 50 piezas emblemáticas del arte y la cultura universal, de acceso abierto. <a href="https://keyworkspace.github.io/artsandculture/" target="_blank" rel="noopener">Visitar Key Arts &amp; Culture →</a>',
      suggestions: ['¿Qué es Key Workspace?', '¿Qué es The New Key?', '¿Cómo contacto?']
    },
    {
      id: 'siges',
      keywords: ['siges', 'sistema interno', 'plataforma interna', 'zoho books', 'gestion estrategica'],
      answer: '<strong>SIGES</strong> es la plataforma interna de gestión estratégica que el equipo de Heliot Media usa a diario para reservas, clientes, pagos y tareas. <a href="proyectos.html">Ver proyectos →</a>',
      suggestions: ['¿Qué es Heliot Media?', '¿Qué proyectos tiene?', '¿Cuál es su experiencia?']
    },
    {
      id: 'filosofia',
      keywords: ['filosofia', 'construir deliberadamente', 'mision', 'vision', 'proposito', 'valores', 'manifiesto', 'esencia', 'principios', 'que cree'],
      answer: 'La filosofía de Alexander se resume en <strong>construir deliberadamente</strong>: no quiere que las cosas simplemente ocurran, quiere comprenderlas, cuestionarlas y diseñarlas. Sus valores son excelencia, autenticidad, aprendizaje, estrategia, responsabilidad, creatividad, resiliencia e impacto. <a href="filosofia.html">Ver Filosofía completa →</a>',
      suggestions: ['¿Cuál es su misión?', '¿Cuál es su visión?', '¿Qué es el manifiesto?']
    },
    {
      id: 'mision',
      keywords: ['mision', 'que busca', 'que hace ahora'],
      answer: 'Su misión es <strong>aprender, crear y liderar</strong>: desarrollar capacidades en las áreas que le interesan —personas, organizaciones, estrategia, comunicación, creación de proyectos— y convertirlas en algo útil mientras todavía está aprendiendo. <a href="filosofia.html">Ver misión →</a>',
      suggestions: ['¿Cuál es su visión?', '¿Cuál es su propósito?', '¿Qué es el manifiesto?']
    },
    {
      id: 'vision',
      keywords: ['vision', 'hacia donde', 'futuro', 'plan de vida', 'que quiere ser'],
      answer: 'Su visión es desarrollar una <strong>trayectoria multidisciplinaria</strong> donde el conocimiento, las personas, la estrategia y la creación puedan encontrarse. Una vida profesional activa, independiente, con espacio para pensar, diseñar y ejecutar. <a href="filosofia.html">Ver visión completa →</a>',
      suggestions: ['¿Cuál es su propósito?', '¿Cuál es su misión?', '¿Qué proyectos tiene?']
    },
    {
      id: 'proposito',
      keywords: ['proposito', 'para que', 'por que importa', 'que sentido'],
      answer: 'Su propósito es <strong>convertir potencial en posibilidad</strong>: usar lo que aprende y construye para abrir oportunidades —para él y para otras personas, especialmente para quienes están empezando, eligiendo un camino o buscando su lugar. <a href="filosofia.html">Ver propósito →</a>',
      suggestions: ['¿Cuál es su misión?', '¿Cuál es su visión?', '¿Qué es Alex Workspace?']
    },
    {
      id: 'manifiesto',
      keywords: ['manifiesto', 'en que cree', 'creencias'],
      answer: 'Su manifiesto gira alrededor de construir deliberadamente el futuro, entender antes de decidir, convertir ideas en acción, respetar a las personas, adaptarse cuando algo cambia y aportar al entorno donde vive. <a href="filosofia.html#manifiesto">Leer manifiesto →</a>',
      suggestions: ['¿Cuáles son sus valores?', '¿Qué es la resiliencia?', '¿Cuál es su filosofía?']
    },
    {
      id: 'resiliencia',
      keywords: ['resiliencia', 'resiliente', 'dificultades', 'caer', 'levantarse'],
      answer: 'Para Alexander, la resiliencia no es una frase motivacional: es la capacidad de <strong>continuar, adaptarse y reconstruir</strong>. Atravesar dificultades, aprender de ellas y seguir avanzando sin permitir que un obstáculo puntual defina toda la trayectoria.',
      suggestions: ['¿Cuáles son sus valores?', '¿Qué es el manifiesto?', '¿Qué es Alex Workspace?']
    },
    {
      id: 'valores',
      keywords: ['valores', 'principios que sigue', 'que defiende'],
      answer: 'Sus ocho valores son: <strong>Excelencia · Autenticidad · Aprendizaje · Estrategia · Responsabilidad · Creatividad · Resiliencia · Impacto</strong>. Funcionan como criterios de decisión, no como palabras decorativas. <a href="filosofia.html">Ver valores →</a>',
      suggestions: ['¿Qué es la resiliencia?', '¿Qué es el manifiesto?', '¿Cuál es su filosofía?']
    },
    {
      id: 'voluntariado',
      keywords: ['voluntariado', 'voluntario', 'servicio', 'tutor', 'consejero', 'ambiental', 'reforestacion', 'limpieza', 'yamabal'],
      answer: 'Alexander ha hecho voluntariado en tres frentes:<br>· <strong>Tutor de inglés A2</strong> en el Instituto de Yamabal (2025)<br>· <strong>Consejero vocacional</strong> para jóvenes en exploración académica (2025)<br>· <strong>Voluntariado ambiental</strong> con la Alcaldía de Yamabal: jornadas de limpieza y reforestación (2024–2026)<br><br><a href="sobre-mi.html">Ver voluntariado →</a>',
      suggestions: ['¿Qué es Key Arts & Culture?', '¿Qué estudia?', '¿Cómo contacto?']
    },
    {
      id: 'habilidades',
      keywords: ['habilidades', 'skills', 'que sabe hacer', 'competencias', 'herramientas', 'excel', 'zoho', 'canva', 'office'],
      answer: 'Maneja herramientas como <strong>Zoho Books, Zoho Projects, Excel avanzado, Google Workspace, Microsoft Office, Canva y Adobe Illustrator</strong>. También tiene habilidades organizacionales (liderazgo, gestión de proyectos, planificación estratégica) y de comunicación (entrevistas por competencias, presentaciones, redacción). <a href="sobre-mi.html">Ver habilidades →</a>',
      suggestions: ['¿Qué idiomas habla?', '¿Cuál es su experiencia?', '¿Qué estudia?']
    },
    {
      id: 'idiomas',
      keywords: ['idiomas', 'habla ingles', 'ingles', 'espanol', 'bilingue', 'duolingo'],
      answer: 'Habla <strong>español</strong> con competencia bilingüe o nativa, e <strong>inglés</strong> en formación continua (Duolingo Score 60, competencia básica). <a href="formacion.html">Ver idiomas →</a>',
      suggestions: ['¿Qué estudia?', '¿Qué certificaciones tiene?', '¿Cómo contacto?']
    },
    {
      id: 'experiencia',
      keywords: ['experiencia', 'trabajo', 'trabaja', 'director', 'rrhh', 'recursos humanos', 'cargo', 'puesto actual'],
      answer: 'Es <strong>Director de Recursos Humanos en Heliot Media</strong> (marzo 2026 – actualidad). Se encarga de la gestión del equipo, organización interna, distribución de tareas, seguimiento del desempeño y planificación estratégica. <a href="sobre-mi.html">Ver experiencia →</a>',
      suggestions: ['¿Qué proyectos tiene?', '¿Qué habilidades tiene?', '¿Qué estudia?']
    },
    {
      id: 'psicologia',
      keywords: ['psicologia', 'psicologo', 'carrera', 'universidad', 'va a estudiar'],
      answer: 'La <strong>psicología</strong> es una de las áreas que Alexander explora por su relación con el comportamiento humano, las organizaciones y el desarrollo. No es todavía una decisión de carrera cerrada. Lo que sí tiene claro es el tipo de trabajo que quiere aprender a hacer: entender bien, organizar con criterio, crear cosas que funcionen y trabajar con personas. <a href="filosofia.html">Ver filosofía →</a>',
      suggestions: ['¿Qué estudia?', '¿Qué le interesa?', '¿Cuál es su visión?']
    },
    {
      id: 'transparencia',
      keywords: ['transparencia', 'portal de transparencia', 'legalidad', 'legal', 'empresa', 'fundacion', 'ong', 'persona juridica', 'financiamiento'],
      answer: '<strong>Alex Workspace es una marca personal, no una empresa.</strong> No es una fundación, no es una ONG, no es una persona jurídica. No recibe financiamiento externo, no vende productos y no comercializa la información de quienes la visitan. <a href="transparencia.html">Ver Portal de Transparencia →</a>',
      suggestions: ['¿Quién está detrás?', '¿Cómo se sostiene?', '¿Qué datos recoge?']
    },
    {
      id: 'sostenimiento',
      keywords: ['como se sostiene', 'financia', 'financiamiento', 'ingresos', 'publicidad', 'cookies', 'patrocinio'],
      answer: 'Alex Workspace es <strong>autofinanciado</strong>. No tiene patrocinadores, donaciones ni inversores. No hay publicidad de terceros ni enlaces pagados. Tampoco hay cookies de rastreo, píxeles de seguimiento ni sistemas de perfilado. <a href="transparencia.html">Ver más →</a>',
      suggestions: ['¿Qué datos recoge?', '¿Qué es Alex Workspace?', '¿Quién está detrás?']
    },
    {
      id: 'privacidad',
      keywords: ['privacidad', 'datos', 'cookies', 'rastreo', 'informacion personal', 'gdpr'],
      answer: 'No se recogen datos de forma automática. No hay formularios que almacenen información ni analíticas de terceros. Si escribes a los correos o perfiles de contacto, la información se usa únicamente para responder esa conversación. <a href="transparencia.html">Ver más →</a>',
      suggestions: ['¿Cómo se sostiene?', '¿Qué es Alex Workspace?', '¿Cómo contacto?']
    },
    {
      id: 'ubicacion',
      keywords: ['donde vive', 'pais', 'ubicacion', 'el salvador', 'yamabal', 'morazan', 'centroamerica'],
      answer: 'Alexander es de <strong>El Salvador</strong>, Centroamérica. Estudia en el Instituto de Yamabal, en el departamento de Morazán. Su marca se firma como <em>El Salvador · MMXXVI</em>.',
      suggestions: ['¿Quién es Alexander?', '¿Qué proyectos tiene?', '¿Cómo contacto?']
    },
    {
      id: 'estudios',
      keywords: ['que estudia', 'colegio', 'instituto', 'yamabal', 'contabilidad', 'administracion contable'],
      answer: 'Estudia el <strong>Bachillerato Técnico Vocacional en Administración Contable</strong> en el Instituto de Yamabal (2023 – actualidad) y participa en el Programa Oportunidades de la Fundación Gloria Kriete. <a href="formacion.html">Ver formación →</a>',
      suggestions: ['¿Qué certificaciones tiene?', '¿Cuál es su experiencia?', '¿Qué idiomas habla?']
    },
    {
      id: 'certificaciones',
      keywords: ['certificaciones', 'certificados', 'certificacion', 'credenciales', 'google', 'platzi', 'canva', 'creo', 'aflatoun', 'carlos slim', 'gemini'],
      answer: 'Tiene <strong>8 certificaciones verificables</strong>: Google (Domina la IA con Gemini), Platzi (Emprendimiento para Jóvenes, Reclutamiento de Talento, LinkedIn para Empresas), Canva (Fundamentos para docentes), CREO El Salvador (Liderazgo Ciudadano), Aflatoun International (Gestión de Proyectos) y Fundación Carlos Slim (Grammatica). <a href="formacion.html">Ver certificaciones →</a>',
      suggestions: ['¿Qué estudia?', '¿Qué idiomas habla?', '¿Qué proyectos tiene?']
    },
    {
      id: 'talapo',
      keywords: ['talapo', 'quien eres tu', 'que eres', 'que eres tu', 'torogoz', 'eres un pajaro', 'eres un ave', 'eres ia', 'eres un bot'],
      answer: 'Soy <strong>Talapo</strong>, el torogoz de Alex Workspace. El torogoz es el ave nacional de El Salvador. No soy una inteligencia artificial: soy un pequeño sistema que reconoce palabras clave y responde con la información del sitio. Si no encuentro una respuesta, te lo digo y te sugiero por dónde seguir.',
      suggestions: ['¿Quién es Alexander?', '¿Qué es Alex Workspace?', '¿Cómo contacto?']
    },
    {
      id: 'gracias',
      keywords: ['gracias', 'thanks', 'te lo agradezco', 'muy amable'],
      answer: '¡Con gusto! Si quieres saber algo más, aquí sigo. También puedes escribirle directamente a Alexander desde la página de <a href="contacto.html">Contacto</a>.',
      suggestions: ['¿Quién es Alexander?', '¿Qué proyectos tiene?', '¿Cuál es su filosofía?']
    },
    {
      id: 'adios',
      keywords: ['adios', 'chao', 'hasta luego', 'bye', 'nos vemos'],
      answer: '¡Hasta luego! Si en algún momento quieres retomar la conversación, aquí estaré posado.',
      suggestions: ['¿Cómo contacto?', '¿Qué es Alex Workspace?', '¿Cuál es su filosofía?']
    }
  ];

  var DEFAULT_SUGGESTIONS = [
    '¿Quién es Alexander?',
    '¿Qué proyectos tiene?',
    '¿Qué estudia?',
    '¿Cómo contacto?'
  ];

  /* ======================================================================
     NORMALIZACIÓN Y BÚSQUEDA
     ====================================================================== */

  function normalize(str) {
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function score(query, entry) {
    var nq = normalize(query);
    if (!nq) return 0;
    var total = 0;
    for (var i = 0; i < entry.keywords.length; i++) {
      var kw = normalize(entry.keywords[i]);
      if (!kw) continue;
      var idx = nq.indexOf(kw);
      if (idx !== -1) {
        var words = kw.split(' ').length;
        total += words * 2 + kw.length * 0.1;
      }
    }
    return total;
  }

  function findMatch(query) {
    var best = null;
    var bestScore = 0;
    for (var i = 0; i < KB.length; i++) {
      var s = score(query, KB[i]);
      if (s > bestScore) {
        bestScore = s;
        best = KB[i];
      }
    }
    return bestScore > 0 ? best : null;
  }

  /* ======================================================================
     CONSTRUCCIÓN DEL WIDGET
     ====================================================================== */

  var root = document.createElement('div');
  root.className = 'assistant';
  root.setAttribute('data-open', 'false');
  root.setAttribute('role', 'complementary');
  root.setAttribute('aria-label', 'Talapo, asistente de Alex Workspace');

  root.innerHTML =
    '<button class="assistant__toggle" type="button" aria-label="Abrir a Talapo" aria-expanded="false">' +
      TOROGOZ_SVG +
    '</button>' +
    '<div class="assistant__panel" role="dialog" aria-label="Talapo, asistente de Alex Workspace" aria-modal="false">' +
      '<div class="assistant__header">' +
        '<span class="assistant__mark">' + TOROGOZ_SVG + '</span>' +
        '<div class="assistant__head-text">' +
          '<span class="assistant__name">Talapo</span>' +
          '<span class="assistant__sub">Torogoz · Alex Workspace</span>' +
        '</div>' +
        '<button class="assistant__close" type="button" aria-label="Cerrar a Talapo">✕</button>' +
      '</div>' +
      '<div class="assistant__body" id="assistantBody" aria-live="polite"></div>' +
      '<div class="assistant__chips" id="assistantChips"></div>' +
      '<form class="assistant__form" id="assistantForm" autocomplete="off">' +
        '<input class="assistant__input" id="assistantInput" type="text" placeholder="Pregúntale a Talapo…" aria-label="Escribe tu pregunta" />' +
        '<button class="assistant__send" type="submit" aria-label="Enviar">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<line x1="5" y1="12" x2="19" y2="12"/>' +
            '<polyline points="12 5 19 12 12 19"/>' +
          '</svg>' +
        '</button>' +
      '</form>' +
    '</div>';

  document.body.appendChild(root);

  var toggle   = root.querySelector('.assistant__toggle');
  var closeBtn = root.querySelector('.assistant__close');
  var body     = root.querySelector('.assistant__body');
  var chipsBox = root.querySelector('.assistant__chips');
  var form     = root.querySelector('.assistant__form');
  var input    = root.querySelector('.assistant__input');

  var started = false;

  /* ---------- HELPERS ---------- */
  function bubble(html, who) {
    var el = document.createElement('div');
    el.className = 'assistant__bubble assistant__bubble--' + who;
    if (who === 'bot') el.innerHTML = html;
    else el.textContent = html;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function showChips(list) {
    chipsBox.innerHTML = '';
    if (!list || !list.length) return;
    for (var i = 0; i < list.length; i++) {
      (function (label) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'assistant__chip';
        b.textContent = label;
        b.addEventListener('click', function () { ask(label); });
        chipsBox.appendChild(b);
      })(list[i]);
    }
  }

  function open() {
    root.setAttribute('data-open', 'true');
    toggle.setAttribute('aria-expanded', 'true');
    setTimeout(function () { input.focus(); }, 100);
    if (!started) {
      started = true;
      bubble('¡Hola! Soy <strong>Talapo</strong>, el torogoz de Alex Workspace. Puedo responderte sobre Alexander, sus proyectos, su formación o su filosofía. ¿Qué quieres saber?', 'bot');
      showChips(DEFAULT_SUGGESTIONS);
    }
  }

  function close() {
    root.setAttribute('data-open', 'false');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function ask(text) {
    text = String(text || '').trim();
    if (!text) return;
    bubble(text, 'user');
    input.value = '';

    var match = findMatch(text);

    setTimeout(function () {
      if (match) {
        bubble(match.answer, 'bot');
        showChips(match.suggestions || DEFAULT_SUGGESTIONS);
      } else {
        bubble(
          'No encontré una respuesta exacta. Puedo ayudarte con: <strong>Alexander</strong>, <strong>proyectos</strong>, <strong>formación</strong>, <strong>filosofía</strong>, <strong>contacto</strong>, <strong>transparencia</strong> o <strong>voluntariado</strong>. Prueba con una de estas:',
          'bot'
        );
        showChips(DEFAULT_SUGGESTIONS);
      }
    }, 220);
  }

  /* ---------- EVENTOS ---------- */
  toggle.addEventListener('click', function () {
    if (root.getAttribute('data-open') === 'true') close();
    else open();
  });

  closeBtn.addEventListener('click', close);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    ask(input.value);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.getAttribute('data-open') === 'true') {
      close();
    }
  });

})();
