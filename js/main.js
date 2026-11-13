(function () {
  var S = window.SITE, $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nav + barra de progreso
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    $('progress').style.width = (max > 0 ? Math.min(100, y / max * 100) : 0) + '%';
    $('nav').classList.toggle('is-scrolled', y > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Aparición al hacer scroll
  // El contenido solo se oculta si la página está visible y hay IntersectionObserver;
  // si el observador no responde en 1.5s, se muestra todo.
  var reveals = document.querySelectorAll('.reveal'), revealOn = false;
  function initReveal() {
    if (revealOn || reduce || document.hidden || !('IntersectionObserver' in window)) return;
    revealOn = true;
    document.documentElement.classList.add('js-reveal');
    var fired = false;
    var io = new IntersectionObserver(function (es) {
      fired = true;
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    reveals.forEach(function (el) {
      el.style.transitionDelay = (el.dataset.delay || 0) + 'ms';
      io.observe(el);
      if (el.getBoundingClientRect().top < window.innerHeight) requestAnimationFrame(function () { el.classList.add('is-in'); });
    });
    setTimeout(function () { if (!fired) reveals.forEach(function (el) { el.classList.add('is-in'); }); }, 1500);
  }
  initReveal();
  document.addEventListener('visibilitychange', initReveal);

  // Marquesina de canciones (dos copias para el bucle)
  var songs = S.canciones.map(function (c) { return '<span>' + c + '</span><i>·</i>'; }).join('');
  $('marquee').innerHTML = songs + songs;

  // Frases rotativas
  var q = 0, qTimer, quote = $('quote'), dots = $('quoteDots');
  S.frases.forEach(function (_, i) {
    var b = document.createElement('button');
    b.setAttribute('aria-label', 'Frase ' + (i + 1));
    b.addEventListener('click', function () { setQuote(i); startQuotes(); });
    dots.appendChild(b);
  });
  function paintQuote() {
    quote.textContent = '“' + S.frases[q] + '”';
    Array.prototype.forEach.call(dots.children, function (d, i) { d.classList.toggle('is-active', i === q); });
  }
  function setQuote(i) {
    quote.style.opacity = 0;
    setTimeout(function () { q = i; paintQuote(); quote.style.opacity = 1; }, 350);
  }
  function startQuotes() { clearInterval(qTimer); qTimer = setInterval(function () { setQuote((q + 1) % S.frases.length); }, 7000); }
  paintQuote(); startQuotes();

  // Trayectoria
  var T = S.trayectoria, idx = S.trayectoriaInicial || 0, tabs = [], tTimer;
  var railInner = document.querySelector('.rail__inner');
  T.forEach(function (t, i) {
    var b = document.createElement('button');
    b.className = 'rail__tab'; b.textContent = t.corto;
    b.addEventListener('click', function () { setIdx(i); });
    railInner.appendChild(b); tabs.push(b);
  });
  function paintT() {
    var t = T[idx];
    $('tBig').textContent = t.grande; $('tMeta').textContent = t.etapa; $('tText').textContent = t.texto;
    $('tCount').textContent = String(idx + 1).padStart(2, '0') + ' / ' + T.length;
    $('railFill').style.width = (idx / (T.length - 1) * 100) + '%';
    tabs.forEach(function (b, i) { b.classList.toggle('is-active', i === idx); b.classList.toggle('is-past', i < idx); });
  }
  function setIdx(i, instant) {
    i = (i + T.length) % T.length;
    if (instant) { idx = i; paintT(); return; }
    if (i === idx) return;
    $('tBig').style.opacity = 0; $('tFade').style.opacity = 0;
    clearTimeout(tTimer);
    tTimer = setTimeout(function () { idx = i; paintT(); $('tBig').style.opacity = 1; $('tFade').style.opacity = 1; }, 180);
  }
  $('tPrev').addEventListener('click', function () { setIdx(idx - 1); });
  $('tNext').addEventListener('click', function () { setIdx(idx + 1); });
  $('rail').addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); setIdx(idx + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); setIdx(idx - 1); }
  });
  document.querySelectorAll('[data-era]').forEach(function (b) {
    b.addEventListener('click', function () {
      setIdx(+b.dataset.era, true);
      var top = $('trayectoria').getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
  paintT();

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
