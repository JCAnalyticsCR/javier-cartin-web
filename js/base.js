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
})();
