// PRÓXIMOS EVENTOS — lee data/eventos.json (lo edita Javier desde /admin; no hay backend).
// Muestra solo eventos de hoy en adelante, por orden de fecha. Sin eventos: la sección y el enlace del menú quedan ocultos.
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

  function tarjeta(e, p) {
    var img = imgSegura(e.imagen), url = urlSegura(e.enlace);
    var desc = esc(e.descripcion || '').replace(/\n/g, '<br>');
    var fecha = '<div class="evento__fecha" aria-hidden="true"><span class="evento__dia">' + esc(p.dia) + '</span><span class="evento__mes">' + esc(p.mes) + '</span></div>';
    var media = img
      ? '<div class="evento__img"><img src="' + esc(img) + '" alt="' + esc('Afiche: ' + (e.titulo || 'evento')) + '" loading="lazy" decoding="async">' + fecha + '</div>'
      : '<div class="evento__img evento__img--sin">' + fecha + '</div>';
    return '<article class="evento' + (img ? '' : ' evento--sin-img') + '">' + media +
      '<div class="evento__cuerpo">' +
        '<time class="evento__cuando" datetime="' + p.iso + '">' + esc(p.semana) + ' ' + esc(p.dia) + ' de ' + esc(p.mes) + ', ' + esc(p.anio) + '</time>' +
        '<h3 class="evento__titulo">' + esc(e.titulo || 'Evento') + '</h3>' +
        (e.lugar ? '<p class="evento__lugar">' + esc(e.lugar) + '</p>' : '') +
        (desc ? '<p class="evento__desc">' + desc + '</p>' : '') +
        (url ? '<a class="evento__btn" href="' + esc(url) + '" target="_blank" rel="noopener">Más información</a>' : '') +
      '</div></article>';
  }

  function pintar(datos) {
    var hoy = hoyCR();
    var items = ((datos && datos.eventos) || []).map(function (e) { return { e: e, p: partes(e.fecha) }; })
      .filter(function (x) { return x.p && x.p.iso >= hoy; })
      .sort(function (a, b) { return a.p.iso < b.p.iso ? -1 : a.p.iso > b.p.iso ? 1 : 0; });
    if (!items.length) return;                       // nada que mostrar: todo sigue oculto
    lista.className = 'eventos__lista' + (items.length === 1 ? ' eventos__lista--uno' : '');
    lista.innerHTML = items.map(function (x) { return tarjeta(x.e, x.p); }).join('');
    sec.hidden = false;
    if (nav) nav.hidden = false;
  }

  fetch('data/eventos.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(pintar)
    .catch(function () {});                          // si falla, la página sigue igual, sin la sección
})();
