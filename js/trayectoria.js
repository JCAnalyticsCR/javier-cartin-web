// TRAYECTORIA — incluye los botones [data-era] del hero. Dueño: agente trayectoria.
(function () {
  var S = window.SITE, $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
})();
