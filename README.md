# Javier Cartín · Landing "Telón"

Landing de una sola página, en español, para el cantante costarricense Javier Cartín: quién es, su trayectoria, videos y contacto para contrataciones.

## Qué es esta carpeta

Sitio estático sin paso de build (HTML + CSS + JS plano). Se abre con cualquier servidor estático:

```
npx serve .
```

Es la implementación de referencia del diseño aprobado ("1a Telón"). Se puede publicar tal cual (Netlify, Vercel, GitHub Pages) o migrar a un framework (Astro, Next, etc.) conservando tokens, estructura y comportamientos descritos abajo. El prototipo de diseño original está en `Javier Cartin - Telon.dc.html` en el proyecto de diseño; esta carpeta lo replica con clases CSS y media queries.

## Estructura

```
javier-cartin-web/
  index.html        Marcado y textos fijos (hero, bio, contacto)
  css/styles.css    Tokens (:root) y estilos por sección
  js/data.js        Contenido editable: contacto, frases, trayectoria, videos, galería
  js/main.js        Comportamiento (sin dependencias)
  assets/           javier-cartin.jpg (retrato principal, 2048×2047)
```

## Secciones (orden)

1. **Nav fijo**: logo en serif, enlaces ancla, botón "Contrataciones". Transparente sobre el hero; al pasar 40px de scroll toma fondo `rgba(11,10,9,.94)` y línea dorada inferior. Bajo 860px se ocultan los enlaces y queda solo el botón.
2. **Hero** (`#inicio`): alto `clamp(680px,100vh,900px)`. Retrato cuadrado anclado a la derecha, con máscara de degradado a la izquierda y zoom lento (20s, alterna). Título 64–116px, lema en itálica dorada, subtítulo, botones "Ver video" y "Contactar". Abajo, franja con 4 etapas (La Banda, La Pandylla, La Selección, Solista): cada una salta a su punto en la línea de tiempo.
3. **Marquesina**: títulos de canciones en itálica, desplazamiento continuo (45s).
4. **Su historia** (`#historia`, fondo crema): frase rotativa (cambia cada 7s, con puntos para elegir) + bio en 3 párrafos.
5. **Trayectoria** (`#trayectoria`): riel de 12 hitos con línea de progreso; panel con año grande, etapa y descripción; flechas anterior/siguiente, contador y teclas ← →. Cambio con fundido de 180ms.
6. **Videos** (`#videos`, fondo crema): reproductor 16:9 con miniatura; al hacer clic carga el iframe de YouTube (youtube-nocookie, autoplay). Lista de 6 videos: elegir uno lo carga y reproduce. Enlace "Abrir en YouTube".
7. **Galería** (`#galeria`): 11 fotos de shows y público en casillas 4:3 (3 columnas en escritorio, 1 en móvil). Se ven 3 y el botón "Ver toda la galería" despliega el resto. Contenido en `galeria` y `galeriaVisibles` de `data.js`.
8. **Contacto** (`#contacto`, fondo vino): teléfono gigante (`tel:`), correo, botones Llamar / WhatsApp / Copiar número, redes. Formulario "Solicite una fecha" (nombre, tipo de evento, fecha, mensaje) que arma un mensaje y lo abre en WhatsApp (`wa.me`) o en el correo (`mailto:`). Validación: nombre obligatorio. No hay backend.
9. **Footer**: tricolor discreto, nombre, lugar, "Volver arriba".

## Tokens

Colores
- `--negro #0b0a09` fondo base · `--tinta #1a1613` texto sobre crema
- `--crema #f3ecdd` · `--crema-2 #d9d0be` · `--crema-3 #e6dece` (texto secundario sobre negro)
- `--oro #c9a15a` · `--oro-claro #e0bd7c` (sobre vino) · `--oro-hover #dcb872`
- `--vino #5c1a25` (fondo contacto) · `--vino-texto #6e1f2b` (acentos sobre crema)
- `--gris #5a4f45` (texto secundario sobre crema)
- Tricolor: `#002b7f`, `#ffffff`, `#ce1126`

Tipografía (Google Fonts)
- Títulos: Cormorant Garamond 500/600 e itálica 500
- Texto: Work Sans 400/500/600
- Etiquetas: 13px, mayúsculas, tracking .22em
- Cuerpo: 18px / 1.7 · Botones: 15px, 600, mayúsculas, tracking .06em

Espaciado
- Margen lateral `--pad: clamp(20px,5.6vw,72px)`
- Alto de sección `--sec: clamp(72px,9vw,112px)`
- Sin radios (esquinas rectas), salvo círculos de controles (48px) y botón de play (88px)

Movimiento
- Aparición al scroll: opacidad 0→1 y translateY 28px→0, .8s, retrasos escalonados (`data-delay` en ms)
- Todo se desactiva con `prefers-reduced-motion`

## Pendientes antes de publicar

- Confirmar con Javier el teléfono, si ese número tiene WhatsApp (`contacto.whatsapp` en `data.js`) y que el correo sea el de contrataciones.
- Galería: 11 fotos (assets/galeria/, WebP 960×720) de la página oficial de Facebook y de videos de YouTube, con su crédito en el pie de cada foto. Permisos de uso de terceros confirmados (13/11/2026). Mejora opcional: originales en alta (sesión de ON Contenido y fotos de Peggy Tam) para sumar ampliación a pantalla completa.
- Contenido: solo hechos con fuente. Ninguna canción del sitio es de su autoría; no afirmar fechas de La Banda ni el año en que entró a La Pandylla.
- No presentarlo como compositor de "De mañana en adelante" (la canción es de Alejandro Jaén). No mencionar premios.
- Optimizar el retrato (WebP + tamaños) y añadir favicon y `og:image` con URL absoluta.
- Los videos de La Pandylla están en canales de terceros y podrían dejar de estar disponibles; los del canal oficial son los primeros de la lista.
