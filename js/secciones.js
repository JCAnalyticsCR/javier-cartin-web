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
  // Muestra las primeras S.galeriaVisibles; el resto se despliega con "Ver toda la galería".
  var gal = $('gallery'), visibles = S.galeriaVisibles || S.galeria.length;
  gal.innerHTML = S.galeria.map(function (g, i) {
    var extra = i >= visibles;
    if (g.src) {
      return '<figure class="has-img' + (g.archivo ? ' is-archivo' : '') + (extra ? ' is-extra' : '') + '"' + (extra ? ' hidden' : '') + '>' +
        '<img src="' + esc(g.src) + '" alt="' + esc(g.alt) + '"' +
          (g.w ? ' width="' + g.w + '" height="' + g.h + '"' : '') + ' loading="lazy" decoding="async">' +
        '<figcaption><span class="gallery__pie">' + esc(g.pie || g.alt) + '</span>' +
          (g.credito ? '<small class="gallery__credito">' + esc(g.credito) + '</small>' : '') +
        '</figcaption>' +
        '</figure>';
    }
    return '<figure class="gallery__plate" role="img" aria-label="' + esc(g.alt) + '">' +
      '<div class="gallery__inner"><p class="gallery__scene-title">' + esc(g.alt) + '</p>' +
      '<span class="gallery__soon">Próximamente</span></div></figure>';
  }).join('');

  var ocultas = S.galeria.length - visibles;
  if (ocultas > 0) {
    var mas = document.createElement('div');
    mas.className = 'gallery__mas';
    mas.innerHTML = '<button type="button" class="gallery__btn" aria-expanded="false" aria-controls="gallery">' +
      '<span class="gallery__btn-txt">Ver toda la galería</span><span class="gallery__btn-n">+' + ocultas + '</span>' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>';
    gal.parentNode.insertBefore(mas, gal.nextSibling);
    var btn = mas.firstChild, abierta = false;
    btn.addEventListener('click', function () {
      abierta = !abierta;
      btn.setAttribute('aria-expanded', String(abierta));
      btn.querySelector('.gallery__btn-txt').textContent = abierta ? 'Ver menos' : 'Ver toda la galería';
      var extras = gal.querySelectorAll('.is-extra');
      Array.prototype.forEach.call(extras, function (f, k) {
        if (abierta) {
          f.hidden = false;
          f.style.transitionDelay = (k * 90) + 'ms';
          requestAnimationFrame(function () { requestAnimationFrame(function () { f.classList.add('is-visible'); }); });
        } else {
          f.classList.remove('is-visible'); f.hidden = true; f.style.transitionDelay = '';
        }
      });
      if (!abierta && window.JCIrA) window.JCIrA(document.getElementById('galeria'));
    });
  }

  /* ── CONTACTO ────────────────────────────────────────────────── */
  var C = S.contacto;

  // Eliminar botones de WhatsApp si el número no tiene WA
  if (!C.whatsapp) {
    document.querySelectorAll('[data-whatsapp]').forEach(function (el) { el.remove(); });
  }

  // Botón copiar número
  var copyBtn = $('copyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var b = this, label = b.querySelector('.accion__label') || b;
      if (!label.dataset.txt) label.dataset.txt = label.textContent;
      var num = C.telefono.replace(/\s/g, '');
      function respaldo() {           // sin permiso de portapapeles: copia con un campo temporal
        var t = document.createElement('textarea');
        t.value = num; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(t);
      }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(num).catch(respaldo);
        else respaldo();
      } catch (e) { respaldo(); }
      label.textContent = 'Copiado';
      b.classList.add('is-ok');
      setTimeout(function () { label.textContent = label.dataset.txt || 'Copiar número'; b.classList.remove('is-ok'); }, 2000);
    });
  }

  // Formulario
  var form = $('form');
  var err = $('formErr');
  form.addEventListener('input', function () { err.textContent = ''; });

  function buildMessage() {
    var f = form.elements;
    var m = f.mensaje ? f.mensaje.value.trim() : '';
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
