// TRAYECTORIA — "Noche de gala en trece actos". Incluye los botones [data-era] del hero.
// Dueño: agente trayectoria. Sin dependencias. Expone window.JCTrayectoria = { ir(i) }.
(function () {
  var S = window.SITE, $ = function (id) { return document.getElementById(id); };
  var T = S.trayectoria, N = T.length;
  var sec = $('trayectoria'), escena = $('tPanel'), rielIn = $('tRielIn'), riel = $('rail');
  if (!sec || !escena || !rielIn || !N) return;

  // ---------- Modos (se evalúan en cada cambio: rotar el teléfono o redimensionar cambia de versión)
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqMovil = window.matchMedia('(max-width: 767px)');
  var mqExtra = window.matchMedia('(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)');
  var waapi = typeof Element.prototype.animate === 'function';

  // ---------- Tokens de movimiento: única fuente, leída desde :root
  var css = getComputedStyle(document.documentElement);
  function tok(n) { return css.getPropertyValue(n).trim(); }
  function ms(v) { return /ms$/.test(v) ? parseFloat(v) : parseFloat(v) * 1000; }
  var DUR = { micro: ms(tok('--dur-micro')), ui: ms(tok('--dur-ui')), seccion: ms(tok('--dur-seccion')), escena: ms(tok('--dur-escena')) };
  var EASE = { salida: tok('--ease-salida'), escena: tok('--ease-escena'), cine: tok('--ease-cine') };

  // ---------- Utilidades
  var ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  function dos(n) { return String(n).padStart(2, '0'); }
  function clamp(i) { return Math.max(0, Math.min(N - 1, i)); }
  // Texto con *itálica* simple, sin innerHTML (nada de HTML arbitrario desde data.js)
  function rich(el, txt) {
    el.textContent = '';
    String(txt).split('*').forEach(function (parte, k) {
      if (!parte) return;
      if (k % 2) { var em = document.createElement('em'); em.textContent = parte; el.appendChild(em); }
      else el.appendChild(document.createTextNode(parte));
    });
  }
  function plano(txt) { return String(txt).replace(/\*/g, ''); }

  // ---------- Construcción síncrona (base.js anima los .reveal existentes al final de la carga)
  sec.style.setProperty('--tray-n', N);
  $('tTotal').textContent = dos(N);

  // Medidas invisibles: todos los textos en la misma celda para reservar el alto del más largo
  var textos = $('tTextos');
  T.forEach(function (t) {
    var p = document.createElement('p');
    p.className = 'tray__medida'; p.setAttribute('aria-hidden', 'true');
    rich(p, t.texto); textos.appendChild(p);
  });

  // Décadas (agrupa hitos consecutivos con la misma década)
  var grupos = [];
  T.forEach(function (t, i) {
    var g = grupos[grupos.length - 1];
    if (g && g.decada === t.decada) g.n++;
    else grupos.push({ decada: t.decada, ini: i, n: 1 });
  });
  grupos.forEach(function (g) {
    var d = document.createElement('div');
    d.className = 'tray__decada'; d.setAttribute('aria-hidden', 'true');
    d.textContent = g.decada;
    d.style.gridColumn = (g.ini + 1) + ' / span ' + g.n;
    rielIn.appendChild(d);
  });

  // Pestañas del riel (patrón ARIA tabs con tabindex itinerante)
  var tabs = T.map(function (t, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'tray__tab'; b.id = 'tTab' + i;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', 'tPanel');
    b.setAttribute('aria-label', 'Acto ' + (i + 1) + ': ' + (t.circa ? 'hacia ' : '') + t.grande + ', ' + t.etapa);
    b.style.gridColumn = String(i + 1);
    b.textContent = t.corto;
    b.addEventListener('click', function () { ir(i, 'riel'); });
    rielIn.appendChild(b);
    return b;
  });

  // ---------- Estado
  var idx = clamp(S.trayectoriaInicial || 0); // lo que se ve en el escenario
  var destino = idx;                            // a dónde vamos
  var fase = 'quieto';                          // 'quieto' | 'saliendo' | 'entrando'
  var turno = 0, anims = [], origenPend = null;

  var capas = [$('tActoCapa'), $('tCapCapa'), $('tAnioCapa'), $('tText')];
  var ANIO = 2; // índice de la capa con barrido por clip-path
  var CLIP_REPOSO = 'inset(-25% -6% -25% -6%)';

  // ---------- Pintado
  function pintarRiel(i) {
    sec.style.setProperty('--tray-i', i);
    tabs.forEach(function (b, k) {
      var on = k === i;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
      b.classList.toggle('is-past', k < i);
    });
    escena.setAttribute('aria-labelledby', 'tTab' + i);
    $('tPrev').setAttribute('aria-disabled', i === 0 ? 'true' : 'false');
    $('tNext').setAttribute('aria-disabled', i === N - 1 ? 'true' : 'false');
    centrarPestana(i);
    moverFoco(i);
  }
  function pintarEscena(i) {
    var t = T[i];
    $('tCount').textContent = dos(i + 1);
    $('tCap').textContent = t.capitulo || '';
    $('tMeta').textContent = t.etapa;
    $('tNota').textContent = t.nota || '';
    $('tCirca').hidden = !t.circa;
    $('tBig').textContent = t.grande;
    rich($('tText'), t.texto);
    fondo(t.video);
  }
  function anunciar(i) {
    var t = T[i];
    $('tVivo').textContent = 'Acto ' + (i + 1) + ' de ' + N + '. ' + (t.circa ? 'Hacia ' : '') + t.grande + '. ' +
      (t.capitulo ? t.capitulo + ', ' : '') + t.etapa + (t.nota ? ', ' + t.nota : '') + '. ' + plano(t.texto);
  }
  // Mantiene la pestaña activa visible dentro del riel (scroll horizontal del riel, nunca de la página)
  function centrarPestana(i) {
    if (riel.scrollWidth <= riel.clientWidth + 1) return;
    var b = tabs[i];
    var x = b.offsetLeft - (riel.clientWidth - b.offsetWidth) / 2;
    riel.scrollTo({ left: Math.max(0, x), behavior: (mqReduce.matches || fase === 'inicio') ? 'auto' : 'smooth' });
  }

  // ---------- Foco de escenario: sigue al acto; en la capa extra, además al puntero
  var punteroX = null;
  function moverFoco(i) {
    var base = (i / (N - 1) - 0.5) * 30;                 // -15% … 15% según el acto
    var extra = punteroX === null ? 0 : punteroX * 24;   // -12% … 12% según el puntero
    escena.style.setProperty('--tray-foco-x', (base * (punteroX === null ? 1 : 0.4) + extra).toFixed(2) + '%');
  }
  var rafFoco = 0;
  escena.addEventListener('pointermove', function (e) {
    if (!mqExtra.matches || e.pointerType !== 'mouse') return;
    var r = escena.getBoundingClientRect();
    punteroX = (e.clientX - r.left) / r.width - 0.5;
    if (!rafFoco) rafFoco = requestAnimationFrame(function () { rafFoco = 0; moverFoco(destino); });
  });
  escena.addEventListener('pointerleave', function () { punteroX = null; moverFoco(destino); });

  // ---------- Fondo velado con la miniatura del video asociado (se carga solo cerca del viewport)
  var imgs = [$('tFondoA'), $('tFondoB')], visible = -1, fondoActual = null, fondoListo = false, fondoPend;
  function fondo(id) {
    fondoPend = id || null;
    if (!fondoListo || fondoPend === fondoActual) return;
    fondoActual = fondoPend;
    if (!fondoActual) { imgs.forEach(function (im) { im.classList.remove('is-visible'); }); visible = -1; return; }
    var sig = imgs[visible === 0 ? 1 : 0], pedido = fondoActual;
    sig.src = 'https://img.youtube.com/vi/' + pedido + '/hqdefault.jpg';
    var mostrar = function () {
      if (pedido !== fondoActual) return; // el usuario ya cambió de acto
      imgs.forEach(function (im) { im.classList.toggle('is-visible', im === sig); });
      visible = imgs.indexOf(sig);
    };
    if (sig.decode) sig.decode().then(mostrar).catch(function () { sig.removeAttribute('src'); });
    else sig.onload = mostrar;
  }
  function activarFondo() { if (fondoListo) return; fondoListo = true; fondo(T[destino].video); }

  // ---------- Transición de escena
  function cfg() {
    if (mqMovil.matches) return { salida: DUR.micro, entrada: DUR.ui, d: 16, clip: false, barrido: false };
    return { salida: DUR.ui, entrada: DUR.seccion, d: 28, clip: true, barrido: true };
  }
  function sinAnimacion() { return mqReduce.matches || !waapi; }
  function limpiar(lista) { lista.forEach(function (a) { a.cancel(); }); }
  function estadoActual(el, conClip) {
    var cs = getComputedStyle(el), k = { opacity: cs.opacity, transform: cs.transform === 'none' ? 'translate3d(0,0,0)' : cs.transform };
    if (conClip) k.clipPath = (cs.clipPath && cs.clipPath !== 'none') ? cs.clipPath : CLIP_REPOSO;
    return k;
  }

  function ir(i, origen) {
    i = clamp(+i || 0);
    if (i === destino && (fase !== 'quieto' || i === idx)) { if (origen !== 'riel') anunciar(i); return; }
    var dir = i > destino ? 1 : -1;
    destino = i; origenPend = origen;
    pintarRiel(i);
    abrirTelon();
    if (sinAnimacion()) {
      turno++; limpiar(anims); anims = []; fase = 'quieto';
      idx = i; pintarEscena(i); if (origen !== 'riel') anunciar(i);
      return;
    }
    if (fase === 'saliendo') return; // el cambio de contenido usará el nuevo destino
    salir(dir);
  }

  function salir(dir) {
    var c = cfg(), mio = ++turno, previas = anims, nuevas = [];
    fase = 'saliendo';
    var paso = DUR.micro / 4;
    capas.forEach(function (el, k) {
      var clip = c.clip && k === ANIO;
      var desde = estadoActual(el, clip);
      var hasta = { opacity: 0, transform: 'translate3d(' + (-dir * c.d) + 'px,0,0)' };
      if (clip) hasta.clipPath = dir > 0 ? 'inset(-25% -6% -25% 106%)' : 'inset(-25% 106% -25% -6%)';
      el.style.willChange = clip ? 'transform, opacity, clip-path' : 'transform, opacity';
      nuevas.push(el.animate([desde, hasta], { duration: c.salida, delay: k * paso, easing: EASE.escena, fill: 'both' }));
    });
    limpiar(previas); anims = nuevas;
    if (c.barrido) barrido(dir);
    nuevas[nuevas.length - 1].onfinish = function () { if (mio === turno) entrar(dir); };
  }

  function entrar(dir) {
    var c = cfg(), mio = ++turno, previas = anims, nuevas = [];
    fase = 'entrando';
    idx = destino;
    pintarEscena(idx);
    if (origenPend !== 'riel') anunciar(idx);
    var paso = DUR.micro / 2;
    capas.forEach(function (el, k) {
      var clip = c.clip && k === ANIO;
      var desde = { opacity: 0, transform: 'translate3d(' + (dir * c.d) + 'px,0,0)' };
      var hasta = { opacity: 1, transform: 'translate3d(0,0,0)' };
      if (clip) {
        desde.clipPath = dir > 0 ? 'inset(-25% 106% -25% -6%)' : 'inset(-25% -6% -25% 106%)';
        hasta.clipPath = CLIP_REPOSO;
        desde.opacity = 1; // el año aparece por la cortina de luz, no por fundido
      }
      nuevas.push(el.animate([desde, hasta], { duration: c.entrada, delay: k * paso, easing: EASE.cine, fill: 'backwards' }));
    });
    limpiar(previas); anims = nuevas; // se cancelan después de crear las nuevas: sin parpadeo
    nuevas[nuevas.length - 1].onfinish = function () {
      if (mio !== turno) return;
      fase = 'quieto'; anims = [];
      capas.forEach(function (el) { el.style.willChange = ''; });
      if (destino !== idx) salir(destino > idx ? 1 : -1);
    };
  }

  var animBarrido = null;
  function barrido(dir) {
    var el = $('tBarrido');
    if (animBarrido) animBarrido.cancel();
    el.style.willChange = 'transform, opacity';
    var a = dir > 0 ? '0%' : '100%', b = dir > 0 ? '100%' : '0%';
    animBarrido = el.animate([
      { transform: 'translate3d(' + a + ',0,0)', opacity: 0 },
      { opacity: 1, offset: 0.18 },
      { opacity: 1, offset: 0.78 },
      { transform: 'translate3d(' + b + ',0,0)', opacity: 0 }
    ], { duration: DUR.escena, easing: EASE.escena });
    animBarrido.onfinish = function () { el.style.willChange = ''; };
  }

  // ---------- Telón inicial (solo capa extra): se abre una vez cuando el escenario entra en foco
  var telonOn = false;
  // Se abre al entrar en foco o ante la primera interacción; al terminar (retraso --dur-ui +
  // transición --dur-escena) sale del árbol de pintado para no costar nada después.
  function abrirTelon() {
    if (!telonOn || sec.classList.contains('is-abierto')) return;
    sec.classList.add('is-abierto');
    setTimeout(function () { sec.classList.add('is-retirado'); telonOn = false; }, DUR.ui + DUR.escena);
  }

  if ('IntersectionObserver' in window) {
    // Precarga del fondo: medio viewport antes de llegar
    var ioFondo = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) { activarFondo(); ioFondo.disconnect(); }
    }, { rootMargin: '50% 0px' });
    ioFondo.observe(escena);

    if (mqExtra.matches && waapi && !document.hidden) {
      telonOn = true;
      sec.classList.add('tray--telon');
      var ioTelon = new IntersectionObserver(function (es) {
        if (es.some(function (e) { return e.isIntersecting; })) { abrirTelon(); ioTelon.disconnect(); }
      }, { threshold: 0.45 });
      ioTelon.observe(escena);
    }
  } else {
    activarFondo();
  }

  // ---------- Controles
  $('tPrev').addEventListener('click', function () { if (destino > 0) ir(destino - 1, 'boton'); });
  $('tNext').addEventListener('click', function () { if (destino < N - 1) ir(destino + 1, 'boton'); });

  // Teclado: ← → en toda la sección; Inicio/Fin dentro del riel. No secuestra flechas fuera de la sección.
  sec.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var enRiel = rielIn.contains(e.target), n = null;
    if (e.key === 'ArrowRight') n = destino + 1;
    else if (e.key === 'ArrowLeft') n = destino - 1;
    else if (enRiel && e.key === 'Home') n = 0;
    else if (enRiel && e.key === 'End') n = N - 1;
    if (n === null) return;
    e.preventDefault();
    n = clamp(n);
    ir(n, enRiel ? 'riel' : 'teclado');
    if (enRiel) tabs[n].focus({ preventScroll: true });
  });

  // Swipe táctil sobre el escenario (touch-action: pan-y deja el scroll vertical al navegador)
  var tx = null, ty = 0;
  escena.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { tx = null; return; }
    tx = e.touches[0].clientX; ty = e.touches[0].clientY;
  }, { passive: true });
  escena.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var p = e.changedTouches[0], dx = p.clientX - tx, dy = p.clientY - ty;
    tx = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    ir(destino + (dx < 0 ? 1 : -1), 'swipe');
  }, { passive: true });

  // ---------- Contrato con el hero: [data-era] = índice en SITE.trayectoria
  document.querySelectorAll('[data-era]').forEach(function (b) {
    b.addEventListener('click', function () {
      var i = clamp(+b.dataset.era);
      // Salta sin animar (el escenario no está a la vista) y luego lleva la página a la sección
      turno++; limpiar(anims); anims = []; fase = 'quieto';
      capas.forEach(function (el) { el.style.willChange = ''; });
      destino = idx = i; pintarRiel(i); pintarEscena(i); anunciar(i);
      var top = sec.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: top, behavior: mqReduce.matches ? 'auto' : 'smooth' });
    });
  });

  // ---------- API pública
  window.JCTrayectoria = { ir: function (i) { ir(i, 'api'); } };

  // ---------- Estado inicial
  fase = 'inicio';
  pintarRiel(idx); pintarEscena(idx);
  fase = 'quieto';
  window.addEventListener('resize', function () { centrarPestana(destino); }, { passive: true });
})();
