// Todo el contenido editable del sitio vive aquí.
window.SITE = {
  contacto: {
    telefono: '8748 7167',
    telefonoE164: '50687487167',
    correo: 'javier.cartin@gmail.com',
    whatsapp: true // poner en false si el número no tiene WhatsApp (pendiente de confirmar con Javier)
  },
  canciones: ['De mañana en adelante', 'Una niña, una historia', 'Amor perdido', 'Yo no sé qué me pasó', 'Cada día que pasa', 'Juro por mi vida'],
  frases: [
    'Si volviera a nacer y tuviera que escoger, escogería ser cantante.',
    'Fue una época de oro para la música nacional y eso no se puede olvidar así tan fácil.',
    'Pienso morir cantando.'
  ],
  // Trayectoria: un "acto" por hito. El ORDEN importa: los botones [data-era] del hero apuntan a los
  // índices 1 (La Banda), 2 (La Pandylla), 5 (La Selección) y 6 (Solista).
  // corto: etiqueta del riel · grande: año protagonista · circa: true = fecha aproximada ("circa")
  // decada: agrupa el riel · capitulo + etapa: cabecera del acto · nota: aclaración opcional
  // texto: descripción (*así* = itálica) · fondo: foto de la época, ya difuminada (assets/trayectoria/; varios actos
  // pueden compartirla). Fuente de cada fondo: investigacion/youtube y investigacion/facebook (manifest.md).
  // Hechos verificados con fuente: ver investigacion/hechos/ficha.md (fuera del repo). Nada sin fuente.
  trayectoria: [
    { corto: '1973', grande: '1973', circa: true, decada: 1970, capitulo: 'Preludio', etapa: 'Los inicios', texto: 'Dieciséis años y un micrófono en la mano: así empezó todo.', fondo: 'assets/trayectoria/70s-la-banda.webp' },
    { corto: '70s', grande: 'Años 70', circa: true, decada: 1970, capitulo: 'Capítulo I', etapa: 'La Banda', nota: 'Finales de los 70', texto: 'Canta con La Banda, una de las agrupaciones bailables de su tiempo.', fondo: 'assets/trayectoria/70s-la-banda.webp' },
    { corto: '1982', grande: '1982', decada: 1980, capitulo: 'Capítulo II', etapa: 'La Pandylla', texto: 'Nace La Pandylla. En los ochenta, Javier será su voz principal.', fondo: 'assets/trayectoria/1982-la-pandylla.webp' },
    { corto: '1986', grande: '1986', decada: 1980, capitulo: 'Capítulo II', etapa: 'La Pandylla', texto: 'En su voz, “De mañana en adelante”, de Alejandro Jaén, conquista la radio.', fondo: 'assets/trayectoria/1986-de-manana.webp' },
    { corto: '80s', grande: 'Años 80', decada: 1980, capitulo: 'Capítulo II', etapa: 'La Pandylla', nota: 'Finales de los 80', texto: '“Amor perdido” y “Yo no sé qué me pasó”: merengues con videoclip que llenaron las pistas.', fondo: 'assets/trayectoria/80s-amor-perdido.webp' },
    { corto: '90s', grande: 'Años 90', decada: 1990, capitulo: 'Capítulo III', etapa: 'La Selección', texto: 'Con La Selección, la fiesta continúa hasta finales de la década.', fondo: 'assets/trayectoria/90s-la-seleccion.webp' },
    { corto: '2003', grande: '2003', decada: 2000, capitulo: 'Capítulo IV', etapa: 'Solista', texto: 'Tras *Siempre romántico*, llega *Las cosas que nos pasan*, con su hijo Xavier a su lado.', fondo: 'assets/trayectoria/2003-teleton.webp' },
    { corto: '2015', grande: '2015', decada: 2010, capitulo: 'Capítulo IV', etapa: 'Solista', texto: 'Teletica lo recuerda como el “galán de los 80” y vuelve a ser la voz de La Pandylla en un homenaje a esa época.', fondo: 'assets/trayectoria/2015-homenaje.webp' },
    { corto: '2016', grande: '2016', decada: 2010, capitulo: 'Capítulo IV', etapa: 'Solista', texto: 'Estadio Nacional: *AuténTicos por siempre*, con orquesta sinfónica. Vuelve en agosto y otra vez en 2017.', fondo: 'assets/trayectoria/2016-autenticos.webp' },
    { corto: '2018', grande: '2018', decada: 2010, capitulo: 'Capítulo IV', etapa: 'Solista', texto: '“Represento”: una de las voces de CR Music All Stars, junto a más de 50 artistas nacionales.', fondo: 'assets/trayectoria/2018-estudio.webp' },
    { corto: '2021', grande: '2021', decada: 2020, capitulo: 'Capítulo IV', etapa: 'Solista', texto: 'Invitado de gala en *Nace una Estrella*, a dúo con Leo Jara, y voz de “Petición por Costa Rica”.', fondo: 'assets/trayectoria/2021-nace-una-estrella.webp' },
    { corto: '2024', grande: '2024', decada: 2020, capitulo: 'Capítulo IV', etapa: 'Solista', texto: '*Javier Acústico* llega a su canal: la voz, al desnudo.', fondo: 'assets/trayectoria/2024-acustico.webp' },
    { corto: '2026', grande: '2026', decada: 2020, capitulo: 'Capítulo IV', etapa: 'Solista', texto: 'Estrena “El Pescador de Estrellas” y canta “La serenata que mamá merece” en Heredia, con Joaquín Yglesias y Víctor Kapusta.', fondo: 'assets/trayectoria/2026-pescador.webp' }
  ],
  trayectoriaInicial: 3,
  videos: [
    { id: '2rUW1-OscL8', titulo: 'El Pescador de Estrellas', detalle: 'Estreno 2026 · canal oficial' },
    { id: '9BciEi-Ccgw', titulo: 'De mañana en adelante', detalle: 'Nueva versión · canal oficial' },
    { id: 'Ap0fYMCSlso', titulo: 'De mañana en adelante', detalle: 'Con Leo Jara · Nace una Estrella, Teletica' },
    { id: 'xX0LiMxWiBE', titulo: 'Cada día que pasa', detalle: 'Siempre romántico · canal oficial' },
    { id: '5lqeQ47QH3k', titulo: 'Una niña, una historia', detalle: 'Siempre romántico · canal oficial' },
    { id: 'ByUzl3ksBno', titulo: 'Juro por mi vida', detalle: 'Javier Acústico · canal oficial' },
    { id: 'i5y0mRQfbVU', titulo: 'Amor perdido', detalle: 'La Pandylla · videoclip' },
    { id: '52tZShfG4R0', titulo: 'De mañana en adelante', detalle: 'La Pandylla · original de 1986' }
  ],
  // Galería: fotos de shows en plano abierto (escenario, orquesta, luces), no solo primeros planos.
  // Fuentes y verificación: investigacion/ (fuera del repo). Pies sin años ni lugares sin fuente.
  // galeriaVisibles: cuántas se ven antes de "Ver toda la galería". archivo: true = sepia + grano.
  // PENDIENTE antes de la versión final: permiso de uso de cada crédito de terceros.
  galeriaVisibles: 3,
  galeria: [
    { src: 'assets/galeria/01-autenticos-orquesta.webp', w: 960, h: 720, alt: 'Javier Cartín canta en la tarima junto al director y la orquesta sinfónica, bajo luces verdes', pie: 'AuténTicos por siempre, Estadio Nacional, 2016.', credito: 'Más Q’ Entretenimiento' },
    { src: 'assets/galeria/02-nace-una-estrella-2021.webp', w: 860, h: 645, alt: 'Javier Cartín canta de traje oscuro en el escenario de Nace una Estrella, con luces azules y antorchas', pie: 'Invitado de gala en Nace una Estrella, 2021.', credito: 'Teletica' },
    { src: 'assets/galeria/03-sabado-feliz-escenario.webp', w: 960, h: 720, alt: 'Javier Cartín canta con los ojos cerrados en el escenario de Sábado Feliz, junto a una columna de luces naranjas', pie: 'En vivo en Sábado Feliz.', credito: 'Sábado Feliz' },
    { src: 'assets/galeria/04-autenticos-luz-azul.webp', w: 960, h: 720, alt: 'Javier Cartín levanta el brazo con el micrófono mientras el director dirige a la orquesta, bajo luz azul', pie: 'Con orquesta sinfónica, AuténTicos por siempre, 2016.', credito: 'Más Q’ Entretenimiento' },
    { src: 'assets/galeria/05-teleton-2003-escenario.webp', w: 960, h: 720, archivo: true, alt: 'Javier Cartín canta de saco gris en el escenario del Teletón', pie: 'Teletón, 2003.', credito: 'Teletón Costa Rica' },
    { src: 'assets/galeria/06-pandylla-archivo.webp', w: 435, h: 326, archivo: true, alt: 'Foto en blanco y negro de los integrantes de La Pandylla en la portada de un sencillo de los años 80', pie: 'La Pandylla, años 80. Archivo.', credito: 'Arte del sencillo · vía página oficial' }
  ]
};
