export type GrowthPage = {
  slug: string
  title: string
  description: string
  h1: string
  intro: string
  appHref: string
  sections: { title: string; body: string }[]
  stats: { value: string; label: string }[]
  steps: { title: string; body: string }[]
  seoBlocks: { title: string; body: string }[]
  faqs: { q: string; a: string }[]
}

export const growthPages: GrowthPage[] = [
  {
    slug: 'hospedajes-estudiantes',
    title: 'Hospedajes para estudiantes en Pergamino | Recién Llegué',
    description: 'Pensiones, habitaciones y departamentos para estudiantes en Pergamino, con datos claros para comparar antes de mudarte.',
    h1: 'Hospedajes para estudiantes en Pergamino',
    intro: 'Compará opciones pensadas para ingresantes y estudiantes de UNNOBA: precio, zona, contacto y datos útiles para decidir rápido.',
    appHref: '/app/hospedajes',
    sections: [
      { title: 'Qué mirar antes de señar', body: 'Confirmá precio final, servicios incluidos, reglas de convivencia, ubicación real y forma de pago. Si podés, visitá o pedí fotos actuales.' },
      { title: 'Zonas prácticas', body: 'Monteagudo, Centro y barrios con conexión directa suelen ser los puntos más buscados por estudiantes que llegan sin conocer Pergamino.' },
    ],
    stats: [{ value: 'UNNOBA', label: 'foco estudiantil' }, { value: 'Directo', label: 'sin intermediarios' }, { value: 'PWA', label: 'usable desde el celular' }],
    steps: [
      { title: 'Compará opciones', body: 'Revisá precio, ubicación, tipo de alojamiento, fotos y contacto antes de escribir.' },
      { title: 'Contactá al responsable', body: 'Usá teléfono o WhatsApp cuando esté disponible y pedí datos actualizados.' },
      { title: 'Guardá alternativas', body: 'No te quedes con una sola opción si estás por mudarte en temporada de ingreso.' },
    ],
    seoBlocks: [
      { title: 'Hospedajes para ingresantes', body: 'Los estudiantes que llegan a Pergamino suelen priorizar cercanía, precio cerrado y un contacto confiable. Por eso Recién Llegué organiza pensiones, habitaciones y departamentos en una experiencia simple para comparar sin perder tiempo entre publicaciones sueltas.' },
      { title: 'Cómo elegir zona', body: 'La zona ideal depende de tu sede, tu rutina y el transporte que vas a usar. Vivir cerca de UNNOBA puede simplificar horarios, pero también conviene mirar barrios conectados si buscás mejor precio o más disponibilidad.' },
    ],
    faqs: [
      { q: '¿Conviene pensión o departamento?', a: 'La pensión suele ser más simple para empezar; el departamento puede convenir si compartís gastos.' },
      { q: '¿Recién Llegué alquila propiedades?', a: 'No intermediamos. Mostramos información y contacto directo para que compares mejor.' },
    ],
  },
  {
    slug: 'pensiones-para-estudiantes',
    title: 'Pensiones estudiantiles en Pergamino | Recién Llegué',
    description: 'Guía para encontrar pensiones estudiantiles en Pergamino cerca de UNNOBA, con recomendaciones para elegir bien.',
    h1: 'Pensiones estudiantiles en Pergamino',
    intro: 'Una pensión puede resolver los primeros meses en la ciudad con menos trámites y costos más previsibles.',
    appHref: '/app/hospedajes',
    sections: [
      { title: 'Preguntas clave', body: 'Consultá si incluye luz, gas, internet, limpieza, cocina, horarios y condiciones para visitas.' },
      { title: 'Para ingresantes', body: 'Si llegás por primera vez, priorizá ubicación, seguridad y referencias antes que ahorrar unos pesos.' },
    ],
    stats: [{ value: 'Simple', label: 'para primeros meses' }, { value: 'Costo', label: 'más previsible' }, { value: 'Cerca', label: 'zonas universitarias' }],
    steps: [
      { title: 'Pedí reglas claras', body: 'Consultá horarios, visitas, uso de cocina, limpieza y espacios compartidos.' },
      { title: 'Revisá servicios', body: 'Internet, luz, gas, agua caliente y limpieza pueden cambiar mucho el costo real.' },
      { title: 'Confirmá disponibilidad', body: 'Las pensiones se ocupan rápido en época de ingreso, por eso conviene consultar temprano.' },
    ],
    seoBlocks: [
      { title: 'Por qué una pensión puede convenir', body: 'Para quien recién llega, una pensión estudiantil puede ser una solución inicial más flexible que un alquiler tradicional. Suele requerir menos trámites y permite conocer la ciudad antes de tomar una decisión más larga.' },
      { title: 'Qué comparar entre pensiones', body: 'No mires solo el precio mensual. Compará servicios incluidos, ambiente, cantidad de personas, distancia a la sede, seguridad y referencias del responsable.' },
    ],
    faqs: [
      { q: '¿Hay pensiones cerca de UNNOBA?', a: 'La disponibilidad cambia durante el año. En temporada de ingreso conviene consultar temprano.' },
      { q: '¿Qué datos debería pedir?', a: 'Fotos actuales, dirección, precio total, servicios incluidos y contacto de la persona responsable.' },
    ],
  },
  {
    slug: 'alquileres-para-estudiantes',
    title: 'Alquileres para estudiantes en Pergamino | Recién Llegué',
    description: 'Cómo buscar alquiler para estudiantes en Pergamino: barrios, costos, garantías y pasos antes de mudarte.',
    h1: 'Alquileres para estudiantes en Pergamino',
    intro: 'Una guía práctica para comparar alquileres, entender costos y evitar decisiones apuradas antes de llegar a Pergamino.',
    appHref: '/app/hospedajes',
    sections: [
      { title: 'Costos a comparar', body: 'Además del alquiler, considerá expensas, servicios, internet, transporte y gastos iniciales de mudanza.' },
      { title: 'Garantías', body: 'Cada dueño puede pedir condiciones distintas. Confirmá requisitos antes de avanzar con una reserva.' },
    ],
    stats: [{ value: 'Barrios', label: 'comparables' }, { value: 'Gastos', label: 'a estimar' }, { value: 'Guía', label: 'para decidir' }],
    steps: [
      { title: 'Calculá el costo total', body: 'Sumá alquiler, servicios, internet, transporte y gastos de ingreso.' },
      { title: 'Validá requisitos', body: 'Preguntá garantías, depósitos, contrato y condiciones antes de señar.' },
      { title: 'Compará distancia', body: 'Un alquiler más barato puede salir caro si suma mucho transporte o tiempo.' },
    ],
    seoBlocks: [
      { title: 'Alquilar siendo estudiante', body: 'Buscar alquiler en una ciudad nueva requiere ordenar información dispersa. Recién Llegué ayuda a entender qué mirar, qué preguntar y cómo comparar opciones sin depender únicamente de recomendaciones sueltas.' },
      { title: 'Garantías y documentación', body: 'Cada propietario puede pedir requisitos distintos. Antes de avanzar, confirmá si aceptan garante, seguro de caución, recibos u otras alternativas.' },
    ],
    faqs: [
      { q: '¿Se puede alquilar sin garante?', a: 'Depende del propietario. Algunos aceptan seguro de caución u otras alternativas.' },
      { q: '¿Dónde buscar primero?', a: 'Empezá por opciones cercanas a tu sede o con transporte simple hacia UNNOBA.' },
    ],
  },
  {
    slug: 'comercios-cerca-unnoba',
    title: 'Comercios cerca de UNNOBA Pergamino | Recién Llegué',
    description: 'Comercios útiles cerca de UNNOBA Pergamino: comida, kioscos, supermercados, librerías y servicios para estudiantes.',
    h1: 'Comercios cerca de UNNOBA Pergamino',
    intro: 'Encontrá lugares útiles para resolver comida, compras, fotocopias y trámites cotidianos al llegar a la ciudad.',
    appHref: '/app/comercios',
    sections: [
      { title: 'Para el día a día', body: 'Priorizamos comercios útiles para estudiantes: comida rápida, cafeterías, kioscos, supermercados, librerías y servicios.' },
      { title: 'Contacto directo', body: 'Cuando el comercio tiene teléfono o mapas, podés contactarlo sin intermediarios.' },
    ],
    stats: [{ value: '500+', label: 'lugares relevados' }, { value: 'Mapa', label: 'referencias útiles' }, { value: 'Dueños', label: 'pueden reclamar' }],
    steps: [
      { title: 'Buscá por necesidad', body: 'Comida, cafeterías, kioscos, supermercados, librerías y servicios cotidianos.' },
      { title: 'Abrí el detalle', body: 'Cuando haya datos disponibles, revisá dirección, teléfono, mapa e imágenes.' },
      { title: 'Compartí el lugar', body: 'Mandá el comercio a otro estudiante o guardalo para resolver más rápido.' },
    ],
    seoBlocks: [
      { title: 'Comercios útiles para estudiantes', body: 'Al llegar a Pergamino, encontrar dónde comer, imprimir, comprar o resolver trámites puede tomar más tiempo del esperado. Esta guía concentra comercios relevantes para la vida universitaria.' },
      { title: 'Visibilidad para comercios locales', body: 'Los dueños pueden reclamar su comercio, corregir datos y sumar imágenes. Esto mejora la calidad del directorio y genera más confianza para quienes llegan por primera vez.' },
    ],
    faqs: [
      { q: '¿Puedo reclamar mi comercio?', a: 'Sí. Los dueños pueden reclamarlo desde el panel propietario y pedir cambios.' },
      { q: '¿Los comercios pagan por aparecer?', a: 'Pueden sumarse gratis. El badge verificado es una opción paga para destacar confianza.' },
    ],
  },
  {
    slug: 'farmacias-de-turno',
    title: 'Farmacias de turno en Pergamino | Recién Llegué',
    description: 'Consultá farmacias de turno en Pergamino con acceso rápido desde Recién Llegué y enlace a la fuente oficial.',
    h1: 'Farmacias de turno en Pergamino',
    intro: 'Accedé rápido a la farmacia de turno desde una página pensada para estudiantes y recién llegados.',
    appHref: '/app/farmacias',
    sections: [
      { title: 'Información actualizada', body: 'La app consulta la fuente local y muestra un fallback claro si no puede actualizarse.' },
      { title: 'Emergencias', body: 'Ante urgencias médicas, usá canales oficiales de salud. Esta guía es solo una ayuda para ubicar farmacias.' },
    ],
    stats: [{ value: 'Turno', label: 'consulta rápida' }, { value: 'Fuente', label: 'local' }, { value: 'Fallback', label: 'si falla' }],
    steps: [
      { title: 'Abrí la guía', body: 'Entrá a la sección de farmacias desde la app o desde esta página.' },
      { title: 'Confirmá antes de ir', body: 'Si es urgente, llamá o revisá la fuente oficial por posibles cambios.' },
      { title: 'Guardá el acceso', body: 'Instalar la PWA ayuda a tenerlo a mano cuando lo necesitás.' },
    ],
    seoBlocks: [
      { title: 'Farmacias de turno para recién llegados', body: 'Cuando no conocés la ciudad, encontrar una farmacia abierta puede ser complicado. Recién Llegué facilita un acceso rápido y contextual para estudiantes y familias.' },
      { title: 'Información responsable', body: 'La disponibilidad puede cambiar por feriados, horarios o actualizaciones externas. Por eso se muestra un fallback y enlace a la fuente cuando hace falta.' },
    ],
    faqs: [
      { q: '¿La información puede cambiar?', a: 'Sí. Siempre conviene confirmar con la fuente oficial o llamar antes de ir.' },
      { q: '¿Funciona desde el celular?', a: 'Sí, también como PWA instalada.' },
    ],
  },
  {
    slug: 'colectivos',
    title: 'Colectivos en Pergamino para estudiantes | Recién Llegué',
    description: 'Mapa y guía de colectivos urbanos en Pergamino para moverte hacia UNNOBA y zonas clave.',
    h1: 'Colectivos en Pergamino para estudiantes',
    intro: 'Una guía simple para entender cómo moverte por Pergamino cuando recién llegás.',
    appHref: '/app/transportes',
    sections: [
      { title: 'Mapa y recorridos', body: 'La app centraliza recorridos y referencias para que puedas comparar opciones de traslado.' },
      { title: 'Planificar antes de salir', body: 'Si estás lejos de tu sede, revisá combinaciones, tiempos y alternativas como bici o remis.' },
    ],
    stats: [{ value: 'Mapa', label: 'recorridos' }, { value: 'UNNOBA', label: 'zonas clave' }, { value: 'PWA', label: 'desde el celular' }],
    steps: [
      { title: 'Identificá tu zona', body: 'Ubicá tu alojamiento, sede y puntos frecuentes.' },
      { title: 'Revisá recorridos', body: 'Compará transporte con mapa y alternativas.' },
      { title: 'Planificá margen', body: 'Los primeros días conviene salir con tiempo hasta conocer horarios reales.' },
    ],
    seoBlocks: [
      { title: 'Moverse en Pergamino', body: 'El transporte define cuánto tiempo perdés por día. Para estudiantes, entender recorridos y zonas conectadas ayuda a elegir alojamiento y organizar la rutina.' },
      { title: 'Colectivos y alternativas', body: 'Además de colectivos, algunas distancias se resuelven caminando, en bicicleta o con remis. La decisión depende de horario, seguridad y presupuesto.' },
    ],
    faqs: [
      { q: '¿Sirve para ir a UNNOBA?', a: 'Sí, la guía está pensada para estudiantes que se mueven hacia sedes y zonas de uso frecuente.' },
      { q: '¿Incluye mapa?', a: 'Sí, desde la app podés ver mapa combinado y transporte.' },
    ],
  },
  {
    slug: 'vivir-cerca-unnoba',
    title: 'Vivir cerca de UNNOBA en Pergamino | Recién Llegué',
    description: 'Barrios, costos y consejos para vivir cerca de UNNOBA Pergamino siendo estudiante.',
    h1: 'Vivir cerca de UNNOBA en Pergamino',
    intro: 'Elegir zona impacta en transporte, seguridad, costos y rutina. Esta guía resume lo importante antes de mudarte.',
    appHref: '/pergamino/alojamiento-estudiantes',
    sections: [
      { title: 'Cercanía vs precio', body: 'Vivir cerca simplifica horarios y traslados, pero puede tener menos disponibilidad. Compará con barrios conectados.' },
      { title: 'Primer mes en la ciudad', body: 'Para arrancar, priorizá una ubicación práctica y datos confiables antes que una opción perfecta.' },
    ],
    stats: [{ value: 'Zonas', label: 'para comparar' }, { value: 'Costos', label: 'a considerar' }, { value: 'Rutina', label: 'más simple' }],
    steps: [
      { title: 'Definí tu sede', body: 'La cercanía real depende de dónde cursás y tus horarios.' },
      { title: 'Compará barrios', body: 'Mirar solo el mapa no alcanza: transporte, seguridad y servicios también pesan.' },
      { title: 'Elegí con margen', body: 'Si recién llegás, priorizá una zona práctica para los primeros meses.' },
    ],
    seoBlocks: [
      { title: 'Vivir cerca de UNNOBA', body: 'La cercanía a la universidad puede reducir traslados, mejorar seguridad nocturna y facilitar la adaptación. Pero también puede limitar opciones, por eso conviene mirar zonas conectadas.' },
      { title: 'Barrios y vida cotidiana', body: 'Un buen barrio para estudiantes no solo queda cerca: también tiene comercios, transporte, conectividad y opciones para resolver el día a día.' },
    ],
    faqs: [
      { q: '¿Cuál es la mejor zona?', a: 'Depende de tu sede, presupuesto y si vas a caminar, usar colectivo o bici.' },
      { q: '¿Conviene llegar antes del inicio de clases?', a: 'Sí. Llegar con algunos días de margen ayuda a resolver transporte, compras y documentación.' },
    ],
  },
]
