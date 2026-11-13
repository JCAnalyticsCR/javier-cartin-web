// HERO + HISTORIA — marquesina, frases y parallax suave.
// Dueño: agente hero-historia.
(function () {
  'use strict';
  var S = window.SITE;
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     MARQUESINA DE CANCIONES
     Dos copias para el bucle continuo. Separador ornamental ✦.
  ------------------------------------------------------------------ */
  var songs = S.canciones.map(function (c) {
    return '<span>' + c + '</span><span class="orn" aria-hidden="true">✦</span>';
  }).join('');
  $('marquee').innerHTML = songs + songs;

  /* ------------------------------------------------------------------
     FRASES ROTATIVAS
     Transición con clase .fading (opacity+translateY en CSS).
  ------------------------------------------------------------------ */
  var q = 0;
  var qTimer;
  var quote  = $('quote');
  var dots   = $('quoteDots');

  S.frases.forEach(function (_, i) {
    var b = document.createElement('button');
    b.setAttribute('aria-label', 'Ver frase ' + (i + 1));
    b.addEventListener('click', function () { setQuote(i); startQuotes(); });
    dots.appendChild(b);
  });

  function paintQuote() {
    quote.textContent = '“' + S.frases[q] + '”';   // " … "
    Array.prototype.forEach.call(dots.children, function (d, i) {
      d.classList.toggle('is-active', i === q);
    });
  }

  function setQuote(i) {
    quote.classList.add('fading');
    setTimeout(function () {
      q = i;
      paintQuote();
      quote.classList.remove('fading');
    }, 320);
  }

  function startQuotes() {
    clearInterval(qTimer);
    qTimer = setInterval(function () {
      setQuote((q + 1) % S.frases.length);
    }, 7000);
  }

  paintQuote();
  startQuotes();

  /* ------------------------------------------------------------------
     PARALLAX SUAVE DEL RETRATO AL MOVER EL PUNTERO
     Solo en escritorio (hover:hover) con rAF + lerp.
     Sin listener que anime en cada evento — solo rAF.
  ------------------------------------------------------------------ */
  var desktopParallax = !reduce
    && window.matchMedia('(min-width:1024px) and (hover:hover)').matches;

  if (desktopParallax) {
    var photo = document.querySelector('.hero__photo');
    if (photo) {
      var mx = 0, my = 0;   // objetivo (cursor normalizado −1..1)
      var cx = 0, cy = 0;   // posición interpolada actual

      window.addEventListener('mousemove', function (e) {
        mx = (e.clientX / window.innerWidth  - 0.5) * 2;   // −1 … 1
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });

      function lerp(a, b, t) { return a + (b - a) * t; }

      var rafId;
      function tickParallax() {
        cx = lerp(cx, mx, 0.04);
        cy = lerp(cy, my, 0.04);
        // desplazamiento máximo ±12px horizontal, ±7px vertical
        var tx = cx * 12;
        var ty = cy * 7;
        photo.style.transform = 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px)';
        rafId = requestAnimationFrame(tickParallax);
      }

      // Arrancar el bucle solo cuando el hero es visible
      var heroEl = document.querySelector('.hero');
      if ('IntersectionObserver' in window && heroEl) {
        var heroIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              if (!rafId) rafId = requestAnimationFrame(tickParallax);
            } else {
              cancelAnimationFrame(rafId);
              rafId = null;
            }
          });
        }, { threshold: 0 });
        heroIO.observe(heroEl);
      } else {
        rafId = requestAnimationFrame(tickParallax);
      }
    }
  }
})();
