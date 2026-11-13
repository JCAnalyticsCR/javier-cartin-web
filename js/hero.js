// HERO + HISTORIA — marquesina y frases. Dueño: agente hero-historia.
(function () {
  var S = window.SITE, $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
})();
