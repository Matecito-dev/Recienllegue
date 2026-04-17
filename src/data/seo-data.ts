

export type FAQ = { q: string; a: string };

export type ServiceBase = {
  slug: string;
  title: string;
  category: ServiceCategory;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  keywords: string[];
  faqs: FAQ[];
  priceRange?: string;
  urgency?: "alta" | "media" | "baja";
  schemaType?: string;
};

export type CityData = {
  name: string;
  slug: string;
  institution: string;
  hero: {
    title: string;
    subtitle: string;
  };
  details: {
    barrios: string[];
    precioPromedio: string;
    zonasClave: string[];
  };
  services: {
    [key: string]: ServiceBase;
  };
};

export type Barrio = {
  slug: string;
  name: string;
  distanciaUNNOBA: string;
  descripcion: string;
  keywords: string[];
};

export type Modifier = {
  slug: string;
  label: string;
  extraKeywords: string[];
  extraFaqs: FAQ[];
};

export type GeneratedLanding = {
  url: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  keywords: string[];
  faqs: FAQ[];
  service: ServiceBase;
  barrio?: Barrio;
  modifier?: Modifier;
  breadcrumb: { label: string; href: string }[];
  schema: LandingSchema;
};

export type LandingSchema = {
  "@type": string;
  name: string;
  description: string;
  areaServed: string;
  keywords: string;
};

export type ServiceCategory =
  | "alojamiento"
  | "transporte"
  | "gastronomia"
  | "salud"
  | "servicios"
  | "educacion"
  | "comercio";

// ─── BARRIOS ─────────────────────────────────────────────────

export const BARRIOS: Barrio[] = [
  {
    slug: "barrio-monteagudo",
    name: "Barrio Monteagudo",
    distanciaUNNOBA: "2 cuadras de la Sede Monteagudo",
    descripcion: "El barrio más cercano a la sede principal de la UNNOBA. Ideal para ingresantes.",
    keywords: ["barrio monteagudo pergamino", "cerca unnoba pergamino", "alquiler monteagudo"],
  },
  {
    slug: "barrio-centro",
    name: "Barrio Centro",
    distanciaUNNOBA: "15 minutos en colectivo a la UNNOBA",
    descripcion: "Centro urbano de Pergamino con todos los servicios a mano.",
    keywords: ["centro pergamino", "zona centro pergamino", "alquiler centro pergamino"],
  },
  {
    slug: "barrio-acevedo",
    name: "Barrio Acevedo",
    distanciaUNNOBA: "10 minutos en bici de la UNNOBA",
    descripcion: "Barrio tranquilo con buena conectividad y precios accesibles.",
    keywords: ["barrio acevedo pergamino", "alquiler acevedo", "vivir acevedo pergamino"],
  },
  {
    slug: "barrio-trocha",
    name: "Barrio Trocha",
    distanciaUNNOBA: "20 minutos en colectivo",
    descripcion: "Zona popular entre estudiantes por sus precios económicos.",
    keywords: ["barrio trocha pergamino", "alquiler trocha", "estudiantes trocha"],
  },
  {
    slug: "barrio-belgrano",
    name: "Barrio Belgrano",
    distanciaUNNOBA: "15 minutos en remis",
    descripcion: "Barrio residencial con mucha oferta de alquileres para compartir.",
    keywords: ["barrio belgrano pergamino", "alquiler belgrano pergamino"],
  },
  {
    slug: "zona-terminal",
    name: "Zona Terminal",
    distanciaUNNOBA: "Conexión directa con líneas de colectivo a la UNNOBA",
    descripcion: "Estratégica para estudiantes que viajan desde otras ciudades.",
    keywords: ["zona terminal pergamino", "cerca terminal pergamino", "hospedaje terminal"],
  },
  {
    slug: "barrio-norte",
    name: "Barrio Norte",
    distanciaUNNOBA: "25 minutos en colectivo",
    descripcion: "Barrio en crecimiento con nuevos emprendimientos de alquiler estudiantil.",
    keywords: ["barrio norte pergamino", "alquiler norte pergamino"],
  },
  {
    slug: "barrio-mariano-moreno",
    name: "Barrio Mariano Moreno",
    distanciaUNNOBA: "12 minutos en bici",
    descripcion: "Popular entre estudiantes de segundo y tercer año de la UNNOBA.",
    keywords: ["barrio mariano moreno pergamino", "alquiler mariano moreno"],
  },
];

// ─── MODIFICADORES ───────────────────────────────────────────

export const MODIFIERS: Modifier[] = [
  {
    slug: "barato",
    label: "Barato / Económico",
    extraKeywords: ["barato pergamino", "economico estudiantes", "precio bajo", "sin gastar de mas"],
    extraFaqs: [
      {
        q: "¿Cuál es la opción más barata para estudiantes en Pergamino?",
        a: "Las habitaciones en pensión compartida fuera del centro suelen arrancar en $60.000/mes en 2026.",
      },
      {
        q: "¿Se puede conseguir algo barato cerca de la UNNOBA?",
        a: "Sí, en barrios como Acevedo y Trocha hay opciones económicas a 10-15 minutos de la facultad.",
      },
    ],
  },
  {
    slug: "cerca-unnoba",
    label: "Cerca de la UNNOBA",
    extraKeywords: ["cerca unnoba", "a pasos de la facultad", "frente a unnoba", "zona universitaria"],
    extraFaqs: [
      {
        q: "¿Qué barrio está más cerca de la UNNOBA?",
        a: "El Barrio Monteagudo es el más cercano, a 2 cuadras de la Sede Monteagudo.",
      },
    ],
  },
  {
    slug: "para-ingresantes",
    label: "Para Ingresantes 2026",
    extraKeywords: ["ingresante unnoba 2026", "primer año universidad", "recien llegado pergamino"],
    extraFaqs: [
      {
        q: "¿Qué necesita saber un ingresante antes de mudarse a Pergamino?",
        a: "Conviene llegar al menos 2 semanas antes del inicio de clases para asegurar alojamiento. Usá la app Recién Llegué para encontrar opciones verificadas.",
      },
      {
        q: "¿Hay acompañamiento para ingresantes en Pergamino?",
        a: "La UNNOBA tiene un área de Bienestar Estudiantil que organiza reuniones de recepción para ingresantes.",
      },
    ],
  },
  {
    slug: "sin-garantia",
    label: "Sin Garantía",
    extraKeywords: ["alquiler sin garantia pergamino", "sin garante", "sin aval"],
    extraFaqs: [
      {
        q: "¿Se puede alquilar sin garantía en Pergamino?",
        a: "Sí, muchos propietarios aceptan depósito en efectivo o seguro de caución como reemplazo del garante.",
      },
    ],
  },
  {
    slug: "dueno-directo",
    label: "Dueño Directo",
    extraKeywords: ["dueno directo pergamino", "sin inmobiliaria", "alquiler directo"],
    extraFaqs: [
      {
        q: "¿Es más barato alquilar directamente con el dueño?",
        a: "Generalmente sí, porque no se pagan comisiones de inmobiliaria, que suelen ser 1 mes de alquiler.",
      },
    ],
  },
  {
    slug: "2026",
    label: "Precios 2026",
    extraKeywords: ["2026 pergamino", "precios actualizados 2026", "tarifas 2026"],
    extraFaqs: [
      {
        q: "¿Cuánto cuesta alquilar en Pergamino en 2026?",
        a: "Los monoambientes para estudiantes rondan $150.000 a $220.000 pesos mensuales en 2026.",
      },
    ],
  },
];

// ─── SERVICIOS BASE (25 categorías) ──────────────────────────

export const SERVICES: ServiceBase[] = [
  // ── ALOJAMIENTO ──────────────────────────────────────────
  {
    slug: "alojamiento-estudiantes",
    category: "alojamiento",
    title: "Alojamiento para Estudiantes",
    metaTitle: "Alojamiento para Estudiantes en Pergamino 2026 | Recién Llegué",
    metaDescription: "¿Dónde vivir estudiando en la UNNOBA? Compará pensiones, departamentos y habitaciones verificadas en Pergamino con precios 2026. → Unite a Recién Llegué gratis.",
    h1: "Alojamiento para Estudiantes en Pergamino",
    intro: "Si vas a estudiar en la UNNOBA, encontrar alojamiento es el primer paso. En Pergamino hay opciones para todos los presupuestos: pensiones con todo incluido, departamentos para compartir y habitaciones amuebladas cerca de la facultad. Esta guía te ayuda a comparar cada opción antes de decidir.",
    keywords: ["alojamiento estudiantes pergamino", "donde vivir pergamino unnoba", "donde dormir pergamino estudiante", "vivir en pergamino unnoba 2026"],
    priceRange: "$60k - $220k/mes",
    urgency: "alta",
    schemaType: "LodgingBusiness",
    faqs: [
      { q: "¿Cuánto cuesta alojamiento para estudiantes en Pergamino?", a: "Los precios van desde $60.000 (habitación en pensión) hasta $220.000 (depto amueblado solo). Para 2026 el promedio es $140.000/mes." },
      { q: "¿Cuándo tengo que buscar alojamiento para la UNNOBA?", a: "Lo ideal es empezar la búsqueda en noviembre-diciembre para asegurar lugar antes del inicio de clases en marzo." },
      { q: "¿La UNNOBA tiene residencia universitaria?", a: "No cuenta con residencia propia, pero Bienestar Estudiantil tiene un listado de alojamientos verificados." },
    ],
  },
  {
    slug: "alquiler-estudiantes",
    category: "alojamiento",
    title: "Alquileres para Estudiantes",
    metaTitle: "Alquiler para Estudiantes en Pergamino 2026 | Sin Inmobiliaria",
    metaDescription: "Alquilá un departamento o casa en Pergamino como estudiante de la UNNOBA: requisitos, contratos, garantías y precios 2026. → Registrate en Recién Llegué.",
    h1: "Alquiler para Estudiantes en Pergamino",
    intro: "El mercado de alquiler para estudiantes en Pergamino tiene opciones desde monoambientes hasta casas para compartir entre 3 o 4 estudiantes, lo que reduce mucho el costo individual. Entender los requisitos y el contrato de antemano te ahorra sorpresas.",
    keywords: ["alquiler estudiantes pergamino", "departamentos alquiler pergamino", "alquilar en pergamino sin garantia", "contrato alquiler estudiante pergamino"],
    priceRange: "$120k - $250k/mes",
    urgency: "alta",
    schemaType: "Accommodation",
    faqs: [
      { q: "¿Qué requisitos piden para alquilar en Pergamino?", a: "DNI, certificado de alumno regular y garantía (propietario en Capital o GBA, o seguro de caución)." },
      { q: "¿Cuántos meses de depósito piden?", a: "Generalmente 1 mes de depósito más el primer mes adelantado." },
      { q: "¿Hay alquileres temporarios para el año lectivo?", a: "Sí, muchos propietarios ofrecen contratos de 10 meses (marzo a diciembre) ideales para estudiantes." },
    ],
  },
  {
    slug: "pensiones-estudiantiles",
    category: "alojamiento",
    title: "Pensiones Estudiantiles",
    metaTitle: "Pensiones Estudiantiles en Pergamino 2026 | Todo Incluido",
    metaDescription: "Pensiones con comida, WiFi y limpieza para ingresantes de la UNNOBA en Pergamino. Todo incluido desde $100k/mes. → Encontrá la tuya en Recién Llegué.",
    h1: "Pensiones Estudiantiles en Pergamino",
    intro: "Las pensiones estudiantiles son la opción preferida para el primer año: comidas, WiFi y limpieza incluidos en una sola cuota mensual. Son ideales si llegás por primera vez a Pergamino y querés concentrarte en arrancar la facultad sin preocuparte por cocinar o limpiar.",
    keywords: ["pensiones pergamino", "pension con comida pergamino", "pension todo incluido unnoba", "pension ingresante pergamino unnoba"],
    priceRange: "$100k - $180k/mes todo incluido",
    urgency: "alta",
    schemaType: "LodgingBusiness",
    faqs: [
      { q: "¿Qué incluye una pensión estudiantil en Pergamino?", a: "Generalmente WiFi, limpieza semanal, almuerzo y cena. Algunos incluyen desayuno." },
      { q: "¿Es mejor una pensión que un departamento?", a: "Para el primer año sí: menos burocracia, comida asegurada y compañía." },
      { q: "¿Las pensiones tienen contrato?", a: "La mayoría acepta acuerdos mensuales sin contrato formal, lo que da más flexibilidad." },
    ],
  },
  {
    slug: "departamentos-monoambiente",
    category: "alojamiento",
    title: "Departamentos Monoambiente",
    metaTitle: "Departamentos Monoambiente en Pergamino para Estudiantes 2026",
    metaDescription: "Monoambientes amueblados en alquiler en Pergamino desde $150k/mes. Máxima independencia para estudiantes de la UNNOBA. → Sumate a Recién Llegué.",
    h1: "Departamentos Monoambiente para Estudiantes en Pergamino",
    intro: "Un monoambiente es la opción de mayor independencia para el estudiante universitario: tu propio espacio, tus tiempos y sin convivencia forzada. En Pergamino encontrás opciones amuebladas listas para mudarse en distintas zonas de la ciudad.",
    keywords: ["monoambiente pergamino", "departamento monoambiente amueblado pergamino", "alquiler monoambiente pergamino 2026", "vivir solo pergamino unnoba"],
    priceRange: "$150k - $250k/mes",
    urgency: "media",
    schemaType: "Accommodation",
    faqs: [
      { q: "¿Cuánto cuesta un monoambiente en Pergamino en 2026?", a: "Entre $150.000 y $250.000 pesos mensuales dependiendo de la zona y si está amueblado." },
      { q: "¿Los monoambientes incluyen servicios?", a: "Generalmente no. Luz, gas y agua van por separado y pueden sumar $30.000-$60.000 por mes." },
    ],
  },
  {
    slug: "habitaciones-compartidas",
    category: "alojamiento",
    title: "Habitaciones Compartidas",
    metaTitle: "Habitaciones Compartidas en Pergamino 2026 | Para Estudiantes",
    metaDescription: "Compartí casa o depto con otros estudiantes de la UNNOBA en Pergamino desde $50k/mes. La opción más económica. → Encontrá compañeros en Recién Llegué.",
    h1: "Habitaciones Compartidas para Estudiantes en Pergamino",
    intro: "Compartir casa o departamento con otros estudiantes reduce el gasto a menos de la mitad respecto a un monoambiente individual. Es la opción más popular entre quienes priorizan el bolsillo sin sacrificar ubicación cerca de la UNNOBA.",
    keywords: ["habitaciones compartidas pergamino", "compañero de cuarto unnoba pergamino", "compartir departamento pergamino estudiantes", "busco roommate pergamino"],
    priceRange: "$50k - $100k/mes por persona",
    urgency: "alta",
    schemaType: "Accommodation",
    faqs: [
      { q: "¿Cómo encuentro compañeros para compartir en Pergamino?", a: "Podés usar grupos de Facebook de la UNNOBA, el mural de Bienestar Estudiantil, o la app Recién Llegué." },
      { q: "¿Cuánto ahorro al compartir?", a: "Compartir una casa entre 3 estudiantes puede reducir el costo individual de $220k a $80k por mes." },
    ],
  },
  {
    slug: "residencias-universitarias",
    category: "alojamiento",
    title: "Residencias Universitarias",
    metaTitle: "Residencias Universitarias en Pergamino | Cerca de la UNNOBA",
    metaDescription: "Residencias privadas para universitarios en Pergamino: sala de estudio, WiFi rápido, seguridad y comunidad. Pensadas para rendir más. → Registrate gratis.",
    h1: "Residencias Universitarias en Pergamino",
    intro: "Las residencias universitarias privadas en Pergamino están diseñadas para estudiantes que quieren más que un cuarto: internet de alta velocidad, espacios de estudio comunes, lavandería y una comunidad de compañeros en la misma situación.",
    keywords: ["residencia universitaria pergamino", "residencia estudiantil privada pergamino", "residencia con sala de estudio pergamino", "residencia unnoba 2026"],
    priceRange: "$130k - $200k/mes",
    urgency: "media",
    schemaType: "LodgingBusiness",
    faqs: [
      { q: "¿Qué diferencia una residencia universitaria de una pensión?", a: "Las residencias suelen tener más servicios (sala de estudio, lavandería, seguridad 24hs) y una comunidad más activa." },
    ],
  },
  {
    slug: "hospedaje-urgente",
    category: "alojamiento",
    title: "Hospedaje Urgente para Estudiantes",
    metaTitle: "Hospedaje Urgente en Pergamino | Para Estudiantes UNNOBA",
    metaDescription: "¿Llegaste a Pergamino sin alojamiento? Hospedaje por noche o semana mientras resolvés tu situación. Desde $4.000/noche. → Recién Llegué te orienta.",
    h1: "Hospedaje Urgente en Pergamino para Estudiantes",
    intro: "Si llegaste a Pergamino y todavía no tenés alojamiento fijo, hay opciones por noche, por semana o por mes para instalarte mientras resolvés tu situación. Es la solución ideal para las primeras semanas de clases.",
    keywords: ["hospedaje urgente pergamino", "alojamiento por día pergamino estudiante", "donde quedarme hoy pergamino", "hostel pergamino unnoba"],
    priceRange: "$4.000 - $8.000/noche",
    urgency: "alta",
    schemaType: "LodgingBusiness",
    faqs: [
      { q: "¿Hay hostels en Pergamino?", a: "Hay algunos hospedajes económicos que aceptan estadías cortas. Desde Recién Llegué te podemos orientar." },
      { q: "¿Por cuánto tiempo puedo quedarme en un hospedaje urgente?", a: "La mayoría acepta desde 1 noche hasta 30 días. Es ideal para las primeras semanas." },
    ],
  },

  // ── TRANSPORTE ────────────────────────────────────────────
  {
    slug: "remis-24hs",
    category: "transporte",
    title: "Remises 24hs",
    metaTitle: "Remises en Pergamino 24 Horas | Números y Precios 2026",
    metaDescription: "Agencias de remis en Pergamino con servicio 24hs. Números, precios por zona y traslados a Junín 2026. → Accedé al directorio en Recién Llegué.",
    h1: "Remises en Pergamino 24 Horas",
    intro: "En Pergamino funcionan varias agencias de remises con servicio las 24 horas, ideales para traslados nocturnos, llegadas a la terminal o viajes a la sede universitaria en Junín. Tener los números a mano te salva en más de una ocasión.",
    keywords: ["remises pergamino", "remis 24hs pergamino", "agencias remis pergamino 2026", "remis pergamino junin"],
    priceRange: "$1.800 - $4.500 por viaje interno",
    urgency: "alta",
    schemaType: "TaxiService",
    faqs: [
      { q: "¿Cuánto cuesta un remis interno en Pergamino?", a: "Un viaje interno cuesta entre $1.800 y $3.500 pesos. De noche puede aplicar una tarifa adicional del 20%." },
      { q: "¿Hay remises a Junín desde Pergamino?", a: "Sí, varias agencias hacen el traslado inter-sedes. El costo ronda los $8.000-$12.000 por persona." },
      { q: "¿Es seguro el remis nocturno en Pergamino?", a: "Sí, las agencias habilitadas tienen radio seguimiento y los conductores están registrados." },
    ],
  },
  {
    slug: "colectivos-urbanos",
    category: "transporte",
    title: "Colectivos Urbanos",
    metaTitle: "Colectivos Urbanos en Pergamino | Líneas, Paradas y SUBE 2026",
    metaDescription: "Líneas de colectivo en Pergamino: recorridos, paradas y boleto universitario SUBE 2026. Moverse es fácil y económico. → Descubrí más en Recién Llegué.",
    h1: "Colectivos Urbanos en Pergamino — Guía Completa",
    intro: "El transporte urbano de Pergamino cuenta con 4 líneas principales que conectan todos los barrios con el centro y la sede de la UNNOBA. Solo se usa la tarjeta SUBE — te explicamos cómo cargarla y tramitar el boleto universitario con descuento.",
    keywords: ["colectivos pergamino", "lineas colectivo pergamino 2026", "SUBE pergamino recarga", "boleto universitario pergamino unnoba"],
    priceRange: "$180 con boleto universitario",
    urgency: "media",
    schemaType: "BusStop",
    faqs: [
      { q: "¿Qué colectivo va a la UNNOBA?", a: "La Línea A pasa por la puerta de la Sede Monteagudo. También podés tomar la Línea C desde el centro." },
      { q: "¿Funciona la SUBE en Pergamino?", a: "Sí, es el único medio de pago aceptado. Podés cargar saldo en kioscos habilitados o en la Terminal." },
      { q: "¿Hay descuento universitario?", a: "Sí, tramitando el boleto universitario en Bienestar Estudiantil pagás $180 en lugar del precio normal." },
    ],
  },
  {
    slug: "tarifas-transporte",
    category: "transporte",
    title: "Tarifas de Transporte",
    metaTitle: "Tarifas de Transporte en Pergamino 2026 | Colectivos y Remises",
    metaDescription: "Precios actualizados de colectivo, remis y traslados Pergamino-Junín 2026. Planificá tu presupuesto de transporte mensual. → Recién Llegué te ayuda.",
    h1: "Tarifas de Transporte en Pergamino 2026",
    intro: "Conocé todos los precios de transporte en Pergamino actualizados para 2026: boleto de colectivo con y sin descuento universitario, tarifas de remis por zona y costos de traslado a Junín para estudiantes de la UNNOBA.",
    keywords: ["tarifas transporte pergamino 2026", "cuanto cuesta colectivo pergamino", "precio remis pergamino 2026", "cuanto sale ir pergamino junin"],
    priceRange: "$180 - $15.000 según destino",
    urgency: "media",
    schemaType: "LocalBusiness",
    faqs: [
      { q: "¿Cuánto cuesta el boleto de colectivo en Pergamino?", a: "El boleto normal cuesta $450. Con descuento universitario baja a $180." },
      { q: "¿Cuánto sale ir de Pergamino a Junín?", a: "En remis compartido ronda $4.500-$6.000. En colectivo de larga distancia unos $3.200." },
    ],
  },
  {
    slug: "bicicletas-alquiler",
    category: "transporte",
    title: "Bicicletas en Alquiler",
    metaTitle: "Alquiler de Bicicletas en Pergamino | Para Estudiantes UNNOBA",
    metaDescription: "Alquilá una bicicleta en Pergamino por mes para ir a la UNNOBA. La forma más económica y rápida de moverte por la ciudad. → Unite a Recién Llegué.",
    h1: "Alquiler de Bicicletas para Estudiantes en Pergamino",
    intro: "La bicicleta es una de las formas más eficientes y económicas de moverse en Pergamino. Varios locales y emprendimientos ofrecen alquiler mensual pensado para estudiantes, con tarifas mucho menores al remis o al colectivo.",
    keywords: ["alquiler bicicletas pergamino", "bicicleta mensual estudiante pergamino", "bici para ir a la unnoba", "ciclovias pergamino"],
    priceRange: "$15k - $25k/mes",
    urgency: "baja",
    schemaType: "LocalBusiness",
    faqs: [
      { q: "¿Es seguro ir en bici a la UNNOBA?", a: "Sí, Pergamino tiene varias ciclovías y el tráfico es moderado. Se recomienda casco y candado." },
    ],
  },

  // ── SERVICIOS COTIDIANOS ──────────────────────────────────
  {
    slug: "fotocopiadora-libreria",
    category: "educacion",
    title: "Fotocopiadoras y Librerías",
    metaTitle: "Fotocopiadoras Cerca de la UNNOBA Pergamino | Apuntes 2026",
    metaDescription: "Fotocopiadoras y librerías cerca de la UNNOBA en Pergamino: impresión de apuntes, encuadernados y materiales universitarios 2026. → Recién Llegué te guía.",
    h1: "Fotocopiadoras y Librerías Cerca de la UNNOBA Pergamino",
    intro: "Imprimir apuntes, encuadernar trabajos prácticos y comprar útiles son parte de la vida universitaria. Acá te contamos dónde encontrar los mejores precios y los horarios extendidos cerca de la facultad, especialmente en época de parciales.",
    keywords: ["fotocopiadora unnoba pergamino", "imprimir apuntes pergamino", "libreria cerca unnoba pergamino", "encuadernado pergamino universitario"],
    priceRange: "$20 - $50 por hoja impresa",
    urgency: "alta",
    schemaType: "Store",
    faqs: [
      { q: "¿Hay fotocopiadoras abiertas a la noche en Pergamino?", a: "Algunas librerías cerca de la sede tienen horario extendido hasta las 22hs en época de parciales." },
      { q: "¿Se puede encargar apuntes en formato digital?", a: "Sí, varios locales ofrecen el servicio de imprimir a partir de archivos PDF enviados por WhatsApp." },
    ],
  },
  {
    slug: "lavanderia",
    category: "servicios",
    title: "Lavanderías",
    metaTitle: "Lavanderías en Pergamino para Estudiantes | Precios 2026",
    metaDescription: "Lavanderías cerca de la UNNOBA en Pergamino: lavado y secado por kilo con entrega en el día, desde $1.500/kg en 2026. → Encontrá la más cercana.",
    h1: "Lavanderías para Estudiantes en Pergamino",
    intro: "Si tu alojamiento no tiene lavarropas, las lavanderías de Pergamino ofrecen servicio por kilo con entrega en el mismo día o al siguiente. Conocé las más convenientes para estudiantes y los precios actualizados para 2026.",
    keywords: ["lavanderia pergamino", "lavado ropa por kilo pergamino", "lavanderia cerca unnoba pergamino", "laverap pergamino estudiante"],
    priceRange: "$1.500 - $2.500/kg",
    urgency: "baja",
    schemaType: "LocalBusiness",
    faqs: [
      { q: "¿Cuánto sale el lavado en lavandería en Pergamino?", a: "El precio promedio es de $1.800 a $2.200 por kilo, con entrega en el día o al día siguiente." },
    ],
  },
  {
    slug: "internet-wifi",
    category: "servicios",
    title: "Internet y WiFi",
    metaTitle: "Internet para Estudiantes en Pergamino | Proveedores y Precios 2026",
    metaDescription: "Comparativa de proveedores de internet en Pergamino 2026: fibra óptica, velocidades y precios para contratar en tu alojamiento. → Recién Llegué te guía.",
    h1: "Internet para Estudiantes en Pergamino",
    intro: "Una buena conexión a internet es esencial para estudiar, hacer trabajos prácticos y videoconferencias. En Pergamino hay varias opciones de proveedores con buena cobertura cerca de la UNNOBA. Te ayudamos a comparar antes de contratar.",
    keywords: ["internet pergamino estudiantes", "proveedores internet pergamino 2026", "contratar fibra optica pergamino", "wifi para alquiler pergamino"],
    priceRange: "$12k - $35k/mes según velocidad",
    urgency: "alta",
    schemaType: "LocalBusiness",
    faqs: [
      { q: "¿Qué proveedor de internet es mejor en Pergamino?", a: "Los más usados por estudiantes son Cablevisión/Fibertel y Telecentro, con fibra óptica disponible en varias zonas." },
      { q: "¿El WiFi suele estar incluido en los alquileres?", a: "En pensiones y residencias sí. En alquileres de departamentos generalmente va aparte." },
    ],
  },
  {
    slug: "supermercado-economico",
    category: "comercio",
    title: "Supermercados Económicos",
    metaTitle: "Supermercados Baratos en Pergamino para Estudiantes 2026",
    metaDescription: "Supermercados económicos y ferias en Pergamino para estudiantes: ubicaciones, horarios y descuentos 2026. Canasta básica ~$40k/semana. → Recién Llegué.",
    h1: "Supermercados Económicos para Estudiantes en Pergamino",
    intro: "Hacer una buena compra semanal es clave para mantener el presupuesto universitario. En Pergamino hay supermercados de bajo costo, almacenes de barrio y ferias que ayudan a estirar el dinero, especialmente cerca de la UNNOBA.",
    keywords: ["supermercado barato pergamino", "donde hacer las compras pergamino estudiante", "feria barrial pergamino", "almacen cerca unnoba pergamino"],
    priceRange: "Canasta básica ~$40k/semana",
    urgency: "media",
    schemaType: "GroceryStore",
    faqs: [
      { q: "¿Hay descuentos para estudiantes en supermercados de Pergamino?", a: "Algunos supermercados aceptan la tarjeta SIDECREER con descuentos del 10-15% los días de semana." },
    ],
  },
  {
    slug: "gym-deporte",
    category: "salud",
    title: "Gimnasios y Deporte",
    metaTitle: "Gimnasios en Pergamino para Estudiantes | Precios 2026",
    metaDescription: "Gimnasios con cuota estudiantil en Pergamino cerca de la UNNOBA. Deportes gratuitos en la facultad y opciones privadas desde $15k/mes 2026. → Registrate.",
    h1: "Gimnasios para Estudiantes en Pergamino",
    intro: "Hacer deporte ayuda a manejar el estrés universitario. Pergamino tiene varios gimnasios con cuota estudiantil especial, y la UNNOBA ofrece actividades físicas gratuitas para sus alumnos a través de Bienestar Estudiantil.",
    keywords: ["gimnasio pergamino estudiantes", "gym cuota estudiantil pergamino", "deporte gratis unnoba pergamino", "actividad fisica pergamino universitario"],
    priceRange: "$15k - $40k/mes",
    urgency: "baja",
    schemaType: "SportsActivityLocation",
    faqs: [
      { q: "¿La UNNOBA tiene instalaciones deportivas?", a: "Sí, ofrece actividades gratuitas para alumnos regulares. Consultar en Bienestar Estudiantil." },
      { q: "¿Hay descuento estudiantil en gimnasios de Pergamino?", a: "Varios gimnasios ofrecen descuentos del 20-30% presentando el certificado de alumno regular." },
    ],
  },
  {
    slug: "farmacia",
    category: "salud",
    title: "Farmacias de Turno",
    metaTitle: "Farmacias de Turno en Pergamino | 24hs y Cerca de la UNNOBA",
    metaDescription: "¿Necesitás medicamentos de urgencia en Pergamino? Farmacias de turno 24hs cerca de la UNNOBA. Cómo consultar el turno actualizado. → Recién Llegué.",
    h1: "Farmacias de Turno en Pergamino",
    intro: "Saber dónde está la farmacia de turno es fundamental cuando llegás a una ciudad nueva. En Pergamino el sistema de farmacias de turno garantiza atención las 24 horas en todos los barrios, con rotación diaria.",
    keywords: ["farmacia turno pergamino", "farmacia 24hs pergamino", "farmacia cerca unnoba pergamino", "donde comprar remedios urgente pergamino"],
    priceRange: "Sin cargo de consulta",
    urgency: "alta",
    schemaType: "Pharmacy",
    faqs: [
      { q: "¿Cómo sé qué farmacia está de turno en Pergamino?", a: "Podés consultar en el sitio del Colegio de Farmacéuticos de Buenos Aires o llamar al 0-800." },
    ],
  },
  {
    slug: "banco-cajero",
    category: "servicios",
    title: "Bancos y Cajeros Automáticos",
    metaTitle: "Bancos y Cajeros Automáticos en Pergamino | Mapa 2026",
    metaDescription: "Cajeros automáticos y bancos en Pergamino cerca de la UNNOBA: Banco Nación, Provincia y redes Link 2026. Sin esperar. → Encontrá el más cercano.",
    h1: "Bancos y Cajeros en Pergamino",
    intro: "Los trámites bancarios y la extracción de efectivo son necesidades frecuentes, especialmente cuando cobrás tu beca o cuota universitaria. Acá mapeamos las sucursales y cajeros más convenientes para estudiantes de la UNNOBA.",
    keywords: ["banco pergamino", "cajero automatico pergamino", "ATM cerca unnoba pergamino", "banco nacion pergamino estudiante"],
    priceRange: "Sin costo en cajeros propios",
    urgency: "media",
    schemaType: "BankOrCreditUnion",
    faqs: [
      { q: "¿Hay cajeros del Banco Nación en Pergamino?", a: "Sí, hay varias sucursales del Banco Nación y cajeros distribuidos en el centro y zonas comerciales." },
    ],
  },
  {
    slug: "comida-universitaria",
    category: "gastronomia",
    title: "Comida Cerca de la Facultad",
    metaTitle: "Dónde Comer Cerca de la UNNOBA Pergamino | Opciones 2026",
    metaDescription: "Los mejores lugares para almorzar cerca de la UNNOBA en Pergamino. Menú del día desde $2.500, viandas y opciones baratas para estudiantes 2026. → Registrate.",
    h1: "Dónde Comer Cerca de la UNNOBA en Pergamino",
    intro: "Comer bien sin gastar de más es posible cerca de la facultad. Pergamino tiene varios restaurantes, rotiserías y cantinas con menú estudiantil a precios accesibles, ideales para el descanso del mediodía entre clases.",
    keywords: ["donde comer cerca unnoba pergamino", "menu del dia pergamino estudiante", "almuerzo barato unnoba pergamino", "rotiseria cerca facultad pergamino"],
    priceRange: "$2.500 - $5.000 menú del día",
    urgency: "alta",
    schemaType: "FoodEstablishment",
    faqs: [
      { q: "¿Hay comedor universitario en la UNNOBA?", a: "Hay un espacio de comedor, aunque limitado. La mayoría de los estudiantes come en locales cercanos a la sede." },
      { q: "¿Qué es más barato, cocinar o comer afuera en Pergamino?", a: "Cocinar en casa sigue siendo más económico, pero el menú del día en locales locales es una alternativa razonable." },
    ],
  },
  {
    slug: "delivery-pergamino",
    category: "gastronomia",
    title: "Delivery en Pergamino",
    metaTitle: "Delivery en Pergamino | Apps y Locales con Envío a Domicilio 2026",
    metaDescription: "Pedí comida a domicilio en Pergamino: PedidosYa, locales con WhatsApp propio y precios de envío 2026. Perfecto para noche de parciales. → Recién Llegué.",
    h1: "Delivery en Pergamino para Estudiantes",
    intro: "En los días de estudio intenso, parciales o cuando simplemente no querés salir, el delivery es la solución. Pergamino tiene cobertura de PedidosYa y muchos locales con envío propio vía WhatsApp a precios razonables.",
    keywords: ["delivery pergamino", "pedidosya pergamino", "comida a domicilio pergamino", "delivery barato pergamino estudiante"],
    priceRange: "$600 - $1.500 costo de envío",
    urgency: "media",
    schemaType: "FoodEstablishment",
    faqs: [
      { q: "¿Funcionan PedidosYa o Rappi en Pergamino?", a: "PedidosYa tiene cobertura en Pergamino. Rappi tiene cobertura limitada. Muchos locales tienen WhatsApp propio." },
    ],
  },
  {
    slug: "psicologia-bienestar",
    category: "salud",
    title: "Psicología y Bienestar Estudiantil",
    metaTitle: "Psicólogos y Bienestar Estudiantil en Pergamino | UNNOBA",
    metaDescription: "Salud mental para estudiantes de la UNNOBA en Pergamino: psicólogos gratuitos, talleres y contención emocional. Estudiar está bueno; estar bien, más. → Registrate.",
    h1: "Psicología y Bienestar Estudiantil en Pergamino",
    intro: "El estrés universitario es real, especialmente el primer año lejos de casa. La UNNOBA cuenta con servicios de bienestar estudiantil gratuitos, y hay psicólogos accesibles en Pergamino para acompañar el proceso con consultas privadas a precios razonables.",
    keywords: ["psicologo pergamino estudiantes", "salud mental unnoba pergamino", "bienestar estudiantil unnoba", "psicologia gratis universidad pergamino"],
    priceRange: "Gratuito (UNNOBA) / $4k-$15k consulta privada",
    urgency: "alta",
    schemaType: "MedicalBusiness",
    faqs: [
      { q: "¿La UNNOBA tiene servicio de psicología gratuito?", a: "Sí, Bienestar Estudiantil ofrece orientación psicológica y talleres de manejo del estrés sin costo." },
    ],
  },
  {
    slug: "seguro-inquilino",
    category: "servicios",
    title: "Seguro de Caución para Alquileres",
    metaTitle: "Seguro de Caución para Alquilar en Pergamino 2026 | Sin Garante",
    metaDescription: "Alquilá sin garante en Pergamino con un seguro de caución: cómo tramitarlo, cuánto cuesta y qué propietarios lo aceptan 2026. → Recién Llegué te orienta.",
    h1: "Seguro de Caución para Alquilar en Pergamino",
    intro: "No tener garante ya no es un obstáculo para alquilar. El seguro de caución es el reemplazo legal aceptado por la mayoría de los propietarios en Pergamino y se tramita online en pocas horas.",
    keywords: ["seguro caucion pergamino", "alquilar sin garante pergamino estudiante", "seguro de caucion para alquiler pergamino", "garantia alternativa alquiler pergamino"],
    priceRange: "$15k - $30k/mes de cobertura",
    urgency: "alta",
    schemaType: "InsuranceAgency",
    faqs: [
      { q: "¿Cuánto cuesta un seguro de caución en Pergamino?", a: "Generalmente el 5-8% del valor del alquiler mensual. Para un alquiler de $200k serían $10k-$16k/mes." },
      { q: "¿Todos los propietarios aceptan seguro de caución?", a: "La mayoría sí, especialmente en publicaciones de inmobiliarias. Algunos dueños directos pueden ser más reacios." },
    ],
  },
  {
    slug: "mudanza-flete",
    category: "servicios",
    title: "Fletes y Mudanzas",
    metaTitle: "Fletes y Mudanzas en Pergamino 2026 | Para Estudiantes",
    metaDescription: "Fletes económicos para mudarte en Pergamino: traslado de muebles y cajas desde $15k 2026. Ideal para cambiar de alojamiento entre cuatrimestres. → Registrate.",
    h1: "Fletes y Mudanzas para Estudiantes en Pergamino",
    intro: "Para llevar tus cosas al nuevo alojamiento o cambiarte de lugar en Pergamino, hay servicios de flete accesibles con buenos precios para estudiantes. Es común cambiar de alojamiento entre cuatrimestres, y tener un flete confiable hace la diferencia.",
    keywords: ["flete pergamino estudiante", "mudanza economica pergamino 2026", "transporte muebles pergamino", "flete para cambio alquiler pergamino"],
    priceRange: "$15k - $45k por traslado local",
    urgency: "baja",
    schemaType: "MovingCompany",
    faqs: [
      { q: "¿Cuánto cuesta un flete dentro de Pergamino?", a: "Un flete de pocos bultos dentro de la ciudad ronda los $15.000-$25.000. Con más muebles puede llegar a $50.000." },
    ],
  },
  {
    slug: "veterinaria",
    category: "salud",
    title: "Veterinarias",
    metaTitle: "Veterinarias en Pergamino | Para Estudiantes con Mascotas 2026",
    metaDescription: "Clínicas veterinarias en Pergamino con atención de urgencias, consultas accesibles y guardia nocturna. Para estudiantes que viajan con su mascota. → Recién Llegué.",
    h1: "Veterinarias en Pergamino",
    intro: "Si estudiás en Pergamino y tenés una mascota, es fundamental saber dónde acudir ante una urgencia. Pergamino tiene varias clínicas veterinarias bien equipadas, incluyendo algunas con guardia nocturna.",
    keywords: ["veterinaria pergamino", "clinica veterinaria pergamino urgencia", "veterinaria guardia nocturna pergamino", "vet barato pergamino estudiante"],
    priceRange: "$5k - $15k consulta",
    urgency: "media",
    schemaType: "VeterinaryCare",
    faqs: [
      { q: "¿Hay veterinarias de urgencias en Pergamino?", a: "Sí, hay al menos 2 clínicas con guardia nocturna en Pergamino." },
    ],
  },
  {
    slug: "fotocopia-carnet",
    category: "servicios",
    title: "Foto Carnet y Trámites",
    metaTitle: "Foto Carnet y Trámites para Estudiantes en Pergamino 2026",
    metaDescription: "¿Ingresás a la UNNOBA? Dónde sacarte foto carnet, tramitar CIDI y obtener certificados universitarios en Pergamino 2026. → Recién Llegué te ayuda.",
    h1: "Foto Carnet y Trámites Universitarios en Pergamino",
    intro: "Al ingresar a la UNNOBA necesitarás foto carnet, certificados de alumno regular, CIDI y otros documentos. Te decimos dónde resolver todos los trámites en Pergamino sin perder tiempo.",
    keywords: ["foto carnet pergamino unnoba", "tramites ingresante pergamino", "certificado alumno regular unnoba pergamino", "CIDI pergamino como tramitar"],
    priceRange: "$1.500 - $3.000 foto carnet",
    urgency: "media",
    schemaType: "GovernmentOffice",
    faqs: [
      { q: "¿Dónde me saco la foto carnet para la UNNOBA en Pergamino?", a: "Hay estudios fotográficos cerca de la sede Monteagudo. También podés sacarla en algunas fotocopiadoras." },
    ],
  },
];

// ─── GENERADOR DE LANDINGS ────────────────────────────────────

function buildSchema(title: string, description: string, keywords: string[]): LandingSchema {
  return {
    "@type": "LocalBusiness",
    name: title,
    description: description,
    areaServed: "Pergamino, Buenos Aires, Argentina",
    keywords: keywords.join(", "),
  };
}

export function generateAllLandings(): GeneratedLanding[] {
  const landings: GeneratedLanding[] = [];

  // 1. LANDINGS BASE (25 páginas) — /pergamino/[slug]
  for (const service of SERVICES) {
    landings.push({
      url: `/pergamino/${service.slug}`,
      slug: service.slug,
      title: `${service.title} en Pergamino`,
      metaTitle: service.metaTitle,
      metaDescription: service.metaDescription,
      h1: service.h1,
      intro: service.intro,
      keywords: [
        ...service.keywords,
        `${service.slug} pergamino`,
        `${service.slug} unnoba`,
      ],
      faqs: service.faqs,
      service,
      breadcrumb: [
        { label: "Inicio", href: "/" },
        { label: "Pergamino", href: "/pergamino" },
        { label: service.title, href: `/pergamino/${service.slug}` },
      ],
      schema: buildSchema(service.metaTitle, service.metaDescription, service.keywords),
    });
  }

  // 2. LANDINGS POR BARRIO (25 × 8 = 200 páginas) — /pergamino/[slug]/[barrio]
  for (const service of SERVICES) {
    for (const barrio of BARRIOS) {
      const title = `${service.title} en ${barrio.name}`;
      const metaTitle = `${service.title} en ${barrio.name} Pergamino 2026`;
      const metaDescription = `${service.intro.slice(0, 100)}... ${barrio.descripcion} ${barrio.distanciaUNNOBA}.`;
      const keywords = [
        ...service.keywords,
        ...barrio.keywords,
        `${service.slug} ${barrio.slug} pergamino`,
        `${service.title.toLowerCase()} ${barrio.name.toLowerCase()}`,
      ];
      const barrioFaqs: FAQ[] = [
        {
          q: `¿Cuál es la mejor zona de ${barrio.name} para ${service.title.toLowerCase()}?`,
          a: `${barrio.descripcion} ${barrio.distanciaUNNOBA}.`,
        },
        ...service.faqs.slice(0, 2),
      ];

      landings.push({
        url: `/pergamino/${service.slug}/${barrio.slug}`,
        slug: `${service.slug}-${barrio.slug}`,
        title,
        metaTitle,
        metaDescription,
        h1: title,
        intro: `${service.intro} ${barrio.descripcion}. ${barrio.distanciaUNNOBA}.`,
        keywords,
        faqs: barrioFaqs,
        service,
        barrio,
        breadcrumb: [
          { label: "Inicio", href: "/" },
          { label: "Pergamino", href: "/pergamino" },
          { label: service.title, href: `/pergamino/${service.slug}` },
          { label: barrio.name, href: `/pergamino/${service.slug}/${barrio.slug}` },
        ],
        schema: buildSchema(metaTitle, metaDescription, keywords),
      });
    }
  }

  // 3. LANDINGS CON MODIFICADORES (servicios de alta prioridad × modificadores)
  const highPriorityServices = SERVICES.filter((s) => s.urgency === "alta");
  for (const service of highPriorityServices) {
    for (const mod of MODIFIERS) {
      const title = `${service.title} ${mod.label} en Pergamino`;
      const metaTitle = `${service.title} ${mod.label} en Pergamino 2026`;
      const metaDescription = `Encontrá ${service.title.toLowerCase()} ${mod.label.toLowerCase()} en Pergamino. ${service.metaDescription}`;
      const keywords = [
        ...service.keywords,
        ...mod.extraKeywords,
        `${service.slug} ${mod.slug} pergamino`,
      ];

      landings.push({
        url: `/pergamino/${service.slug}/${mod.slug}`,
        slug: `${service.slug}-${mod.slug}`,
        title,
        metaTitle,
        metaDescription,
        h1: title,
        intro: service.intro,
        keywords,
        faqs: [...service.faqs, ...mod.extraFaqs],
        service,
        modifier: mod,
        breadcrumb: [
          { label: "Inicio", href: "/" },
          { label: "Pergamino", href: "/pergamino" },
          { label: service.title, href: `/pergamino/${service.slug}` },
          { label: mod.label, href: `/pergamino/${service.slug}/${mod.slug}` },
        ],
        schema: buildSchema(metaTitle, metaDescription, keywords),
      });
    }
  }

  return landings;
}

// ─── UTILIDADES ───────────────────────────────────────────────

/** Devuelve todas las URLs generadas (útil para sitemap.xml) */
export function generateSitemap(): string[] {
  return generateAllLandings().map((l) => l.url);
}

/** Busca una landing por URL exacta */
export function getLandingByUrl(url: string): GeneratedLanding | undefined {
  return generateAllLandings().find((l) => l.url === url);
}

/** Filtra landings por categoría de servicio */
export function getLandingsByCategory(category: ServiceCategory): GeneratedLanding[] {
  return generateAllLandings().filter((l) => l.service.category === category);
}

/** Obtiene landings relacionadas para el widget "Ver también" */
export function getRelatedLandings(currentUrl: string, limit = 4): GeneratedLanding[] {
  const all = generateAllLandings();
  const current = all.find((l) => l.url === currentUrl);
  if (!current) return [];
  return all
    .filter(
      (l) =>
        l.url !== currentUrl &&
        (l.service.category === current.service.category ||
          l.barrio?.slug === current.barrio?.slug)
    )
    .slice(0, limit);
}

// ─── STATS ────────────────────────────────────────────────────

export function getLandingStats() {
  const all = generateAllLandings();
  return {
    total: all.length,
    base: SERVICES.length,
    porBarrio: SERVICES.length * BARRIOS.length,
    conModificador: all.filter((l) => l.modifier).length,
    porCategoria: Object.fromEntries(
      (["alojamiento", "transporte", "gastronomia", "salud", "servicios", "educacion", "comercio"] as ServiceCategory[]).map(
        (cat) => [cat, all.filter((l) => l.service.category === cat).length]
      )
    ),
  };
}

/*
  EJEMPLO DE USO EN NEXT.JS:
  ─────────────────────────────────────────────────────────────
  // pages/pergamino/[...slug].tsx
  import { generateAllLandings, getLandingByUrl } from "@/data/seo-data-pergamino";

  export async function getStaticPaths() {
    const landings = generateAllLandings();
    return {
      paths: landings.map((l) => ({ params: { slug: l.url.split("/").filter(Boolean).slice(1) } })),
      fallback: false,
    };
  }

  export async function getStaticProps({ params }) {
    const url = "/" + ["pergamino", ...params.slug].join("/");
    const landing = getLandingByUrl(url);
    return { props: { landing } };
  }

  // Sitemap: pages/sitemap.xml.tsx
  import { generateSitemap } from "@/data/seo-data-pergamino";
  const urls = generateSitemap(); // → 225+ URLs
  ─────────────────────────────────────────────────────────────

  STATS ESPERADAS:
  - Base (sin barrio):    25 landings
  - Por barrio (25 × 8): 200 landings
  - Con modificadores:   ~50 landings (solo servicios urgency="alta")
  ─────────────────────────────────────────────────────────────
  TOTAL: ~275 landing pages únicas e indexables
*/
// ─── EXPORTACION PARA COMPATIBILIDAD (EL PUENTE) ─────────────

export const cities: Record<string, CityData> = {
  pergamino: {
    name: "Pergamino",
    slug: "pergamino",
    institution: "UNNOBA",
    hero: {
      title: "Vivir y Estudiar en Pergamino",
      subtitle: "La guía definitiva para estudiantes de la UNNOBA. Todo sobre alojamiento, transporte y vida universitaria."
    },
    details: {
      barrios: BARRIOS.map(b => b.name),
      precioPromedio: "$150k - $220k",
      zonasClave: ["Cerca de Sede Monteagudo", "Zona Terminal", "Barrio Centro"]
    },
    services: Object.fromEntries(SERVICES.map(s => [s.slug, s]))
  }
};