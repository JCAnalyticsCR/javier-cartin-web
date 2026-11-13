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
  // texto: descripción (*así* = itálica) · video: id de YouTube opcional, su miniatura se usa velada de fondo
  // Hechos verificados con fuente: ver investigacion/hechos/ficha.md (fuera del repo). Nada sin fuente.
  trayectoria: [
    { corto: '1973', grande: '1973', circa: true, decada: 1970, capitulo: 'Preludio', etapa: 'Los inicios', texto: 'Dieciséis años y un micrófono en la mano: así empezó todo.' },
    { corto: '70s', grande: 'Años 70', circa: true, decada: 1970, capitulo: 'Capítulo I', etapa: 'La Banda', nota: 'Finales de los 70', texto: 'Canta con La Banda, una de las agrupaciones bailables de su tiempo.' },
    { corto: '1982', grande: '1982', decada: 1980, capitulo: 'Capítulo II', etapa: 'La Pandylla', texto: 'Nace La Pandylla. En los ochenta, Javier será su voz principal.' },
    { corto: '1986', grande: '1986', decada: 1980, capitulo: 'Capítulo II', etapa: 'La Pandylla', texto: 'En su voz, “De mañana en adelante”, de Alejandro Jaén, conquista la radio.', video: '52tZShfG4R0' },
    { corto: '80s', grande: 'Años 80', decada: 1980, capitulo: 'Capítulo II', etapa: 'La Pandylla', nota: 'Finales de los 80', texto: '“Amor perdido” y “Yo no sé qué me pasó”: merengues con videoclip que llenaron las pistas.', video: 'i5y0mRQfbVU' },
    { corto: '90s', grande: 'Años 90', decada: 1990, capitulo: 'Capítulo III', etapa: 'La Selección', texto: 'Con La Selección, la fiesta continúa hasta finales de la década.' },
    { corto: '2003', grande: '2003', decada: 2000, capitulo: 'Capítulo IV', etapa: 'Solista', texto: 'Tras *Siempre romántico*, llega *Las cosas que nos pasan*, con su hijo Xavier a su lado.', video: 'xX0LiMxWiBE' },
    { corto: '2015', grande: '2015', decada: 2010, capitulo: 'Capítulo IV', etapa: 'Solista', texto: 'Teletica lo recuerda como el “galán de los 80” y vuelve a ser la voz de La Pandylla en un homenaje a esa época.' },
    { corto: '2016', grande: '2016', decada: 2010, capitulo: 'Capítulo IV', etapa: 'Solista', texto: 'Estadio Nacional: *AuténTicos por siempre*, con orquesta sinfónica. Vuelve en agosto y otra vez en 2017.' },
    { corto: '2018', grande: '2018', decada: 2010, capitulo: 'Capítulo IV', etapa: 'Solista', texto: '“Represento”: una de las voces de CR Music All Stars, junto a más de 50 artistas nacionales.' },
    { corto: '2021', grande: '2021', decada: 2020, capitulo: 'Capítulo IV', etapa: 'Solista', texto: 'Invitado de gala en *Nace una Estrella*, a dúo con Leo Jara, y voz de “Petición por Costa Rica”.', video: 'Ap0fYMCSlso' },
    { corto: '2024', grande: '2024', decada: 2020, capitulo: 'Capítulo IV', etapa: 'Solista', texto: '*Javier Acústico* llega a su canal: la voz, al desnudo.', video: 'ByUzl3ksBno' },
    { corto: '2026', grande: '2026', decada: 2020, capitulo: 'Capítulo IV', etapa: 'Solista', texto: 'Estrena “El Pescador de Estrellas” y canta “La serenata que mamá merece” en Heredia, con Joaquín Yglesias y Víctor Kapusta.', video: '2rUW1-OscL8' }
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
  // Galería: selección final del debate (investigacion/debate/seleccion_final.md, fuera del repo).
  // Pies de foto sin años ni lugares que no tengan fuente. archivo: true = tratamiento de archivo (sepia + grano).
  // PENDIENTE antes de la versión final: permiso de uso de cada crédito de terceros.
  galeria: [
    { src: 'assets/galeria/01-pandylla-archivo.webp', w: 435, h: 544, archivo: true, alt: 'Portada del sencillo de La Pandylla con el logo de Coca-Cola, una foto en blanco y negro del grupo y los títulos El Criticón y Es tiempo para amar', pie: 'La Pandylla, años 80. Archivo.', credito: 'Arte del sencillo · vía página oficial' },
    { src: 'assets/galeria/02-teleton-2003.webp', w: 576, h: 720, archivo: true, alt: 'Javier Cartín canta con los ojos cerrados y el micrófono junto a los labios, sobre un fondo violeta', pie: 'Teletón, 2003.', credito: 'Teletón Costa Rica' },
    { src: 'assets/galeria/03-concierto-orquesta.webp', w: 541, h: 676, alt: 'Javier Cartín, de traje azul brillante, canta con la mano en alto frente a una orquesta de vientos', pie: 'En concierto, con orquesta.', credito: 'Página oficial de Javier Cartín' },
    { src: 'assets/galeria/04-autenticos-2016.webp', w: 576, h: 720, alt: 'Javier Cartín canta con el puño en alto bajo luz verde, con músicos de cuerda de una orquesta sinfónica detrás', pie: 'AuténTicos por siempre, Estadio Nacional, 2016.', credito: 'Más Q’ Entretenimiento' },
    { src: 'assets/galeria/05-sabado-feliz.webp', w: 576, h: 720, alt: 'Primer plano de Javier Cartín cantando con el micrófono en la mano y los ojos entrecerrados, con luces naranjas de escenario', pie: 'En vivo en Sábado Feliz.', credito: 'Sábado Feliz' },
    { src: 'assets/galeria/06-museo-dialoga-2026.webp', w: 576, h: 720, alt: 'Javier Cartín ríe sentado en una banca de madera al aire libre, con suéter gris y camisa celeste, frente a un jardín', pie: 'Entre canciones e historias, 2026.', credito: 'Museo de Cultura Popular, UNA' }
  ]
};
