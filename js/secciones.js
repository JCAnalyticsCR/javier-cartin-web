// VIDEOS, GALERÍA, CONTACTO. Dueño: agente secciones-cierre.
(function () {
  'use strict';
  var S = window.SITE;
  var $ = function (id) { return document.getElementById(id); };

  /* ── Helpers ─────────────────────────────────────────────────── */

  // Escapa entidades HTML para texto inyectado en innerHTML
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Convierte 1–10 a numeral romano; mayor o igual a 11 → decimal
  function romano(n) {
    var t = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
    return t[n - 1] || String(n);
  }

  /* ── VIDEOS ──────────────────────────────────────────────────── */
  var V = S.videos;
  var vid = 0;
  var playing = false;
  var list = $('playlist');
  var rows = [];

  V.forEach(function (v, i) {
    var b = document.createElement('button');
    b.setAttribute('type', 'button');
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML =
      '<span class="playlist__num">' + romano(i + 1) + '</span>' +
      '<span class="playlist__info">' +
        '<span class="playlist__title">' + esc(v.titulo) + '</span>' +
        '<span class="playlist__detail">' + esc(v.detalle) + '</span>' +
      '</span>';
    b.addEventListener('click', function () {
      if (i !== vid) { vid = i; playing = true; paintV(); }
    });
    list.appendChild(b);
    rows.push(b);
  });

  function paintV() {
    var v = V[vid];
    var p = $('player');
    $('vTitle').textContent = v.titulo;
    $('vSub').textContent = v.detalle;
    $('vUrl').href = 'https://www.youtube.com/watch?v=' + v.id;
    rows.forEach(function (b, i) {
      var active = i === vid;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (playing) {
      p.innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(v.id) +
        '?autoplay=1&rel=0" title="' + esc(v.titulo) +
        '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    } else {
      p.innerHTML =
        '<button type="button" aria-label="Reproducir ' + esc(v.titulo) + '">' +
        '<img src="https://img.youtube.com/vi/' + esc(v.id) + '/hqdefault.jpg" alt="">' +
        '</button>';
      p.firstChild.addEventListener('click', function () { playing = true; paintV(); });
    }
  }
  paintV();

  /* ── GALERÍA ─────────────────────────────────────────────────── */
  $('gallery').innerHTML = S.galeria.map(function (g) {
    if (g.src) {
      // Foto real: marco dorado + figcaption en hover
      return '<figure class="has-img' + (g.archivo ? ' is-archivo' : '') + '">' +
        '<img src="' + esc(g.src) + '" alt="' + esc(g.alt) + '"' +
          (g.w ? ' width="' + g.w + '" height="' + g.h + '"' : '') + ' loading="lazy" decoding="async">' +
        '<figcaption><span class="gallery__pie">' + esc(g.pie || g.alt) + '</span>' +
          (g.credito ? '<small class="gallery__credito">' + esc(g.credito) + '</small>' : '') +
        '</figcaption>' +
        '</figure>';
    }
    // Placa elegante mientras no hay foto
    return '<figure class="gallery__plate" role="img" aria-label="' + esc(g.alt) + '">' +
      '<div class="gallery__inner">' +
        '<p class="gallery__scene-title">' + esc(g.alt) + '</p>' +
        '<span class="gallery__soon">Próximamente</span>' +
      '</div>' +
      '</figure>';
  }).join('');

  /* ── CONTACTO ────────────────────────────────────────────────── */
  var C = S.contacto;

  // Teléfono: aplicar gradiente oro metálico
  var phoneEl = document.querySelector('.phone');
  if (phoneEl) phoneEl.classList.add('oro-metal');

  // Eliminar botones de WhatsApp si el número no tiene WA
  if (!C.whatsapp) {
    document.querySelectorAll('[data-whatsapp]').forEach(function (el) { el.remove(); });
  }

  // Botón copiar número
  var copyBtn = $('copyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var b = this;
      try {
        navigator.clipboard.writeText(C.telefono.replace(/\s/g, ''));
      } catch (e) {}
      b.textContent = 'Número copiado';
      setTimeout(function () { b.textContent = 'Copiar número'; }, 2000);
    });
  }

  // Formulario
  var form = $('form');
  var err = $('formErr');
  form.addEventListener('input', function () { err.textContent = ''; });

  function buildMessage() {
    var f = form.elements;
    var m = f.mensaje.value.trim();
    return 'Hola Javier, soy ' + f.nombre.value.trim() +
      '. Quisiera información para una contratación.\n' +
      'Tipo de evento: ' + f.tipo.value + '\n' +
      'Fecha: ' + (f.fecha.value || 'por definir') +
      (m ? '\n' + m : '');
  }

  function validate() {
    if (!form.elements.nombre.value.trim()) {
      err.textContent = 'Escriba su nombre para enviar la solicitud.';
      form.elements.nombre.focus();
      return false;
    }
    return true;
  }

  var wa = $('sendWa');
  if (wa) {
    wa.addEventListener('click', function () {
      if (validate()) {
        window.open(
          'https://wa.me/' + C.telefonoE164 + '?text=' + encodeURIComponent(buildMessage()),
          '_blank'
        );
      }
    });
  }

  $('sendMail').addEventListener('click', function () {
    if (validate()) {
      window.location.href =
        'mailto:' + C.correo +
        '?subject=' + encodeURIComponent('Contratación: ' + form.elements.tipo.value) +
        '&body=' + encodeURIComponent(buildMessage());
    }
  });

})();
