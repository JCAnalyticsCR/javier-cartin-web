// VIDEOS, GALERÍA, CONTACTO. Dueño: agente secciones-cierre.
(function () {
  var S = window.SITE, $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Videos
  var V = S.videos, vid = 0, playing = false, list = $('playlist'), rows = [];
  V.forEach(function (v, i) {
    var b = document.createElement('button');
    b.innerHTML = '<small>' + String(i + 1).padStart(2, '0') + '</small><span><b>' + v.titulo + '</b><em>' + v.detalle + '</em></span>';
    b.addEventListener('click', function () { if (i !== vid) { vid = i; playing = true; paintV(); } });
    list.appendChild(b); rows.push(b);
  });
  function paintV() {
    var v = V[vid], p = $('player');
    $('vTitle').textContent = v.titulo; $('vSub').textContent = v.detalle;
    $('vUrl').href = 'https://www.youtube.com/watch?v=' + v.id;
    rows.forEach(function (b, i) { b.classList.toggle('is-active', i === vid); });
    if (playing) {
      p.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + v.id + '?autoplay=1&rel=0" title="' + v.titulo + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    } else {
      p.innerHTML = '<button aria-label="Reproducir video"><img src="https://img.youtube.com/vi/' + v.id + '/hqdefault.jpg" alt=""></button>';
      p.firstChild.addEventListener('click', function () { playing = true; paintV(); });
    }
  }
  paintV();

  // Galería
  $('gallery').innerHTML = S.galeria.map(function (g) {
    return g.src ? '<figure class="has-img"><img src="' + g.src + '" alt="' + g.alt + '" loading="lazy"></figure>' : '<figure>' + g.alt + '<br>(foto pendiente)</figure>';
  }).join('');

  // Contacto
  var C = S.contacto;
  if (!C.whatsapp) document.querySelectorAll('[data-whatsapp]').forEach(function (el) { el.remove(); });
  $('copyBtn').addEventListener('click', function () {
    var b = this;
    try { navigator.clipboard.writeText(C.telefono.replace(/\s/g, '')); } catch (e) {}
    b.textContent = 'Número copiado';
    setTimeout(function () { b.textContent = 'Copiar número'; }, 2000);
  });
  var form = $('form'), err = $('formErr');
  form.addEventListener('input', function () { err.textContent = ''; });
  function message() {
    var f = form.elements, m = f.mensaje.value.trim();
    return 'Hola Javier, soy ' + f.nombre.value.trim() + '. Quisiera información para una contratación.\nTipo de evento: ' + f.tipo.value + '\nFecha: ' + (f.fecha.value || 'por definir') + (m ? '\n' + m : '');
  }
  function valid() {
    if (!form.elements.nombre.value.trim()) { err.textContent = 'Escriba su nombre para enviar la solicitud.'; form.elements.nombre.focus(); return false; }
    return true;
  }
  var wa = $('sendWa');
  if (wa) wa.addEventListener('click', function () {
    if (valid()) window.open('https://wa.me/' + C.telefonoE164 + '?text=' + encodeURIComponent(message()), '_blank');
  });
  $('sendMail').addEventListener('click', function () {
    if (valid()) window.location.href = 'mailto:' + C.correo + '?subject=' + encodeURIComponent('Contratación: ' + form.elements.tipo.value) + '&body=' + encodeURIComponent(message());
  });
})();
