// BASE — nav, barra de progreso y aparición al scroll. Se carga AL FINAL para ver los .reveal que crean las secciones. Dueño: integración.
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
  // Navegación por anclas: la sección llega centrada, sin el "hueco" del padding superior.
  // Si cabe en la pantalla (debajo del nav), se centra; si es más alta, su contenido arranca
  // justo debajo del nav. Lo usan el menú, los botones del hero y window.JCIrA desde otras secciones.
  function irA(el, instant) {
    if (!el) return;
    var navH = $('nav').offsetHeight, avail = window.innerHeight - navH;
    var r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    var pt = parseFloat(cs.paddingTop) || 0, pb = parseFloat(cs.paddingBottom) || 0;
    var contenido = r.height - pt - pb, top;
    if (r.height <= avail) top = r.top - navH - (avail - r.height) / 2;            // cabe entera: centrada
    else if (contenido <= avail - 48) top = r.top + pt - navH - (avail - contenido) / 2; // cabe el contenido: centrado
    else top = r.top + pt - navH - Math.min(40, avail * 0.06);                      // alta: arranca bajo el nav
    window.scrollTo({ top: Math.max(0, window.scrollY + top), behavior: (instant || reduce) ? 'instant' : 'smooth' });
  }
  window.JCIrA = irA;
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var id = a.getAttribute('href').slice(1), el = id ? document.getElementById(id) : null;
    if (!el) return;
    e.preventDefault();
    if (id === 'inicio') window.scrollTo({ top: 0, behavior: reduce ? 'instant' : 'smooth' }); else irA(el);
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });
  // Entrada directa con #ancla en la URL: corregir la posición una vez cargadas fuentes y fotos
  if (location.hash.length > 1) window.addEventListener('load', function () {
    var el = document.getElementById(location.hash.slice(1));
    if (el && el.id !== 'inicio') irA(el, true);
  });
})();
