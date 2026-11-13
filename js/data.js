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
    'Yo prefiero mil veces un aplauso del público que un reconocimiento.',
    'Pienso morir cantando.'
  ],
  // Trayectoria: un "acto" por hito. El ORDEN importa: los botones [data-era] del hero apuntan a los
  // índices 1 (La Banda), 2 (La Pandylla), 5 (La Selección) y 6 (Solista).
  // corto: etiqueta del riel · grande: año protagonista · circa: true = fecha aproximada ("circa")
  // decada: agrupa el riel · capitulo + etapa: cabecera del acto · nota: aclaración opcional
  // texto: descripción (*así* = itálica) · video: id de YouTube opcional, su miniatura se usa velada de fondo
  trayectoria: [
    { corto: '1973', grande: '1973', circa: true, decada: 1970, capitulo: 'Preludio', etapa: 'Los inicios', texto: 'Dieciséis años y un micrófono en la mano: así empezó todo.' },
    { corto: '1978', grande: '1978–79', decada: 1970, capitulo: 'Capítulo I', etapa: 'La Banda', texto: 'Con La Banda nace una voz para recordar, la de “Cada día que pasa”.', video: 'xX0LiMxWiBE' },
    { corto: '1982', grande: '1982', decada: 1980, capitulo: 'Capítulo II', etapa: 'La Pandylla', texto: 'Llega a La Pandylla y comienza la década en que todo el país cantó con él.' },
    { corto: '1986', grande: '1986', decada: 1980, capitulo: 'Capítulo II', etapa: 'La Pandylla', texto: 'En su voz, “De mañana en adelante” conquista la radio tica.', video: '52tZShfG4R0' },
    { corto: '80s', grande: 'Años 80', decada: 1980, capitulo: 'Capítulo II', etapa: 'La Pandylla', nota: 'Finales de los 80', texto: '“Amor perdido”: merengue, videoclip y la pista llena.', video: 'i5y0mRQfbVU' },
    { corto: '90s', grande: 'Años 90', decada: 1990, capitulo: 'Capítulo III', etapa: 'La Selección', texto: 'Con La Selección, la fiesta continúa.' },
    { corto: '2004', grande: '2004', decada: 2000, capitulo: 'Capítulo IV', etapa: 'Solista', texto: '*Las cosas que nos pasan*, con su hijo Xavier a su lado.' },
    { corto: '2016', grande: '2016', decada: 2010, capitulo: 'Capítulo IV', etapa: 'Solista', texto: 'Estadio Nacional: *AuténTicos por siempre*, junto a 35 músicos sinfónicos.' },
    { corto: '2018', grande: '2018', decada: 2010, capitulo: 'Capítulo IV', etapa: 'Solista', texto: '“Represento”, junto a CR Music All Stars; temporada de shows en el Mirador IBUX y concierto en San Ramón.' },
    { corto: '2021', grande: '2021', decada: 2020, capitulo: 'Capítulo IV', etapa: 'Solista', texto: '“Petición por mi Costa Rica”, un canto de unión.' },
    { corto: '2024', grande: '2024', decada: 2020, capitulo: 'Capítulo IV', etapa: 'Solista', texto: '*Javier Acústico*: la voz, al desnudo.', video: 'ByUzl3ksBno' },
    { corto: '2026', grande: '2026', decada: 2020, capitulo: 'Capítulo IV', etapa: 'Solista', texto: 'Homenaje en Retro Sin Complejos y “La serenata que mamá merece”, en Heredia.' }
  ],
  trayectoriaInicial: 3,
  videos: [
    { id: '9BciEi-Ccgw', titulo: 'De mañana en adelante', detalle: 'Nueva versión · canal oficial' },
    { id: 'xX0LiMxWiBE', titulo: 'Cada día que pasa', detalle: 'Canal oficial' },
    { id: 'ByUzl3ksBno', titulo: 'Juro por mi vida', detalle: 'Javier Acústico' },
    { id: 'i5y0mRQfbVU', titulo: 'Amor perdido', detalle: 'La Pandylla · videoclip' },
    { id: '3h9goAlc3Ec', titulo: 'Una niña, una historia', detalle: 'La Pandylla' },
    { id: '52tZShfG4R0', titulo: 'De mañana en adelante', detalle: 'La Pandylla · original de 1986' }
  ],
  // src vacío = casilla pendiente. Guardar las fotos en assets/galeria/ y poner la ruta en src.
  galeria: [
    { src: '', alt: 'En el escenario hoy' },
    { src: '', alt: 'La Pandylla, años 80' },
    { src: '', alt: 'La Selección, años 90' },
    { src: '', alt: 'Foto de archivo' }
  ]
};
