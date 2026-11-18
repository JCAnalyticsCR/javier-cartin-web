// PRÓXIMOS EVENTOS — lee data/eventos.json (lo edita Javier desde /admin; no hay backend).
// Muestra solo eventos de hoy en adelante, por orden de fecha. Sin eventos: la sección y el enlace del menú quedan ocultos.
// Tarjetas compactas: miniatura + texto. Al tocar la miniatura se abre el afiche (o el video) en grande.
(function () {
  'use strict';
  var sec = document.getElementById('eventos'), lista = document.getElementById('eventosLista'), nav = document.getElementById('navEventos');
  if (!sec || !lista) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function urlSegura(u) { u = String(u || '').trim(); return /^https?:\/\//i.test(u) ? u : ''; }
  function imgSegura(u) {
    u = String(u || '').trim();
    if (/^https:\/\//i.test(u)) return u;
    return /^\/?assets\/[\w\-./ %]+$/i.test(u) && u.indexOf('..') < 0 ? u.replace(/^\//, '') : '';
  }
  // Video subido desde el panel (assets/) o enlace https a un archivo de video; solo mp4/webm/m4v
  function videoSeguro(u) {
    u = String(u || '').trim();
    var ok = /^https:\/\/[^\s"'<>]+\.(mp4|webm|m4v)(\?[^\s"'<>]*)?$/i.test(u) || (/^\/?assets\/[\w\-./ %]+\.(mp4|webm|m4v)$/i.test(u) && u.indexOf('..') < 0);
    return ok ? u.replace(/^\//, '') : '';
  }
  // Fecha de hoy en Costa Rica (YYYY-MM-DD) para no ocultar el evento de hoy por la zona horaria
  function hoyCR() {
    try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Costa_Rica', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
    catch (e) { return new Date().toISOString().slice(0, 10); }
  }
  function partes(f) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(f || ''));
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return {
      iso: m[1] + '-' + m[2] + '-' + m[3],
      dia: String(+m[3]),
      mes: d.toLocaleDateString('es-CR', { month: 'short' }).replace('.', ''),
      semana: d.toLocaleDateString('es-CR', { weekday: 'long' }),
      anio: m[1]
    };
  }

  var ICONO_PLAY = '<svg class="evento__play" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11"/><path d="M10 8l6 4-6 4z"/></svg>';
  var ICONO_ZOOM = '<svg class="evento__zoom" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5M10.5 8v5M8 10.5h5"/></svg>';

  function tarjeta(e, p, i) {
    var img = imgSegura(e.imagen), vid = videoSeguro(e.video), url = urlSegura(e.enlace);
    var desc = esc(e.descripcion || '').replace(/\r?\n/g, '<br>');
    var titulo = e.titulo || 'Evento';
    var fecha = '<span class="evento__fecha" aria-hidden="true"><span class="evento__dia">' + esc(p.dia) + '</span><span class="evento__mes">' + esc(p.mes) + '</span></span>';
    var media;
    if (vid || img) {
      // Miniatura tocable: abre el visor. Si hay video sin afiche, se usa el primer cuadro del video.
      var mini = img
        ? '<img src="' + esc(img) + '" alt="" loading="lazy" decoding="async">'
        : '<video src="' + esc(vid) + '#t=0.1" preload="metadata" muted playsinline tabindex="-1" aria-hidden="true"></video>';
      media = '<button type="button" class="evento__mini" data-i="' + i + '" aria-label="' + esc((vid ? 'Ver el video de ' : 'Ver el afiche de ') + titulo) + '">' +
        mini + (vid ? ICONO_PLAY : ICONO_ZOOM) + fecha + '</button>';
    } else {
      media = '<div class="evento__mini evento__mini--fecha">' + fecha + '</div>';
    }
    return '<article class="evento">' + media +
      '<div class="evento__cuerpo">' +
        '<time class="evento__cuando" datetime="' + p.iso + '">' + esc(p.semana) + ' ' + esc(p.dia) + ' de ' + esc(p.mes) + ', ' + esc(p.anio) + '</time>' +
        '<h3 class="evento__titulo">' + esc(titulo) + '</h3>' +
        (e.lugar ? '<p class="evento__lugar">' + esc(e.lugar) + '</p>' : '') +
        (desc ? '<p class="evento__desc">' + desc + '</p>' : '') +
        (url ? '<a class="evento__btn" href="' + esc(url) + '" target="_blank" rel="noopener">Más información</a>' : '') +
      '</div></article>';
  }

  // ---------- Visor (afiche o video en grande) ----------
  var visor = null, ultimoFoco = null;
  function crearVisor() {
    visor = document.createElement('dialog');
    visor.className = 'visor';
    visor.setAttribute('aria-label', 'Vista ampliada del evento');
    visor.innerHTML = '<button type="button" class="visor__x" aria-label="Cerrar">&times;</button><div class="visor__medio"></div><p class="visor__pie"></p>';
    document.body.appendChild(visor);
    visor.addEventListener('click', function (ev) { if (ev.target === visor || ev.target.classList.contains('visor__medio')) visor.close(); });
    visor.querySelector('.visor__x').addEventListener('click', function () { visor.close(); });
    visor.addEventListener('close', function () {
      visor.querySelector('.visor__medio').innerHTML = '';       // corta el video al cerrar
      document.documentElement.classList.remove('visor-abierto');
      if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    });
  }
  function abrir(ev, boton) {
    if (!visor) crearVisor();
    ultimoFoco = boton;
    var img = imgSegura(ev.imagen), vid = videoSeguro(ev.video);
    visor.querySelector('.visor__medio').innerHTML = vid
      ? '<video controls autoplay playsinline' + (img ? ' poster="' + esc(img) + '"' : '') + ' src="' + esc(vid) + '"></video>'
      : '<img src="' + esc(img) + '" alt="' + esc('Afiche: ' + (ev.titulo || 'evento')) + '">';
    visor.querySelector('.visor__pie').textContent = ev.titulo || '';
    document.documentElement.classList.add('visor-abierto');
    if (visor.showModal) visor.showModal(); else visor.setAttribute('open', '');
  }

  function pintar(datos) {
    var hoy = hoyCR();
    var items = ((datos && datos.eventos) || []).map(function (e) { return { e: e, p: partes(e.fecha) }; })
      .filter(function (x) { return x.p && x.p.iso >= hoy; })
      .sort(function (a, b) { return a.p.iso < b.p.iso ? -1 : a.p.iso > b.p.iso ? 1 : 0; });
    if (!items.length) return;                       // nada que mostrar: todo sigue oculto
    lista.className = 'eventos__lista' + (items.length === 1 ? ' eventos__lista--uno' : '');
    lista.innerHTML = items.map(function (x, i) { return tarjeta(x.e, x.p, i); }).join('');
    lista.onclick = function (ev) {
      var b = ev.target.closest && ev.target.closest('.evento__mini[data-i]');
      if (b) abrir(items[+b.getAttribute('data-i')].e, b);
    };
    sec.hidden = false;
    if (nav) nav.hidden = false;
  }

  fetch('data/eventos.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(pintar)
    .catch(function () {});                          // si falla, la página sigue igual, sin la sección
})();
