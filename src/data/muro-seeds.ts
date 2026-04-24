export interface VerifiedMuroSeed {
  post: {
    userId: string
    userName: string
    userRole: string
    category: string
    title: string
    body: string
    likesCount: number
    commentsCount: number
    created_at: string
  }
  verification: {
    label: string
    url: string
    verifiedAt: string
    note: string
  }
}

const editorialUser = {
  userId: 'seed-editorial-recien-llegue',
  userName: 'Recién Llegué',
  userRole: 'equipo',
  likesCount: 0,
  commentsCount: 0,
}

export const verifiedMuroSeeds: VerifiedMuroSeed[] = [
  {
    post: {
      ...editorialUser,
      category: 'apuntes',
      title: 'Dato útil: Progresar Superior sigue abierto hasta el 30 de abril',
      body:
        'Si cursás una carrera superior, la UNNOBA informó que la inscripción a Becas Progresar Superior 2026 está abierta del 6 al 30 de abril. Lo dejamos por acá porque puede servir si todavía no la hiciste.',
      created_at: '2026-04-24T09:10:00.000Z',
    },
    verification: {
      label: 'UNNOBA · Becas Progresar Superior',
      url: 'https://unnoba.edu.ar/noticias/inscripcion-abierta-a-las-becas-progresar-superior/',
      verifiedAt: '2026-04-24',
      note: 'La nota publicada el 13 de abril de 2026 informa inscripción abierta del 6 al 30 de abril de 2026.',
    },
  },
  {
    post: {
      ...editorialUser,
      category: 'apuntes',
      title: 'Recordatorio: la confirmación de inscripción de ingreso 2026 sigue activa',
      body:
        'Para ingresantes UNNOBA 2026, en el calendario académico figura la confirmación de inscripción a la carrera hasta el 30 de mayo. Si venís postergándolo, conviene revisarlo esta semana.',
      created_at: '2026-04-23T15:20:00.000Z',
    },
    verification: {
      label: 'UNNOBA · Calendario académico 2026',
      url: 'https://elegi.unnoba.edu.ar/calendario/2026-04-26/',
      verifiedAt: '2026-04-24',
      note: 'El calendario muestra la confirmación de inscripción para ingreso 2026 del 19 de enero al 30 de mayo.',
    },
  },
  {
    post: {
      ...editorialUser,
      category: 'eventos',
      title: 'Dato de cursada: el primer semestre UNNOBA está en marcha hasta julio',
      body:
        'Por si a alguien le sirve ordenarse, el calendario académico 2026 marca que las materias cuatrimestrales y anuales del primer semestre van del 16 de marzo al 11 de julio.',
      created_at: '2026-04-22T18:45:00.000Z',
    },
    verification: {
      label: 'UNNOBA · Calendario académico 2026',
      url: 'https://elegi.unnoba.edu.ar/calendario/2026-04-26/',
      verifiedAt: '2026-04-24',
      note: 'El calendario publicado por UNNOBA indica desarrollo de clases del primer semestre entre el 16 de marzo y el 11 de julio de 2026.',
    },
  },
  {
    post: {
      ...editorialUser,
      category: 'otro',
      title: 'Servicio útil: farmacias de turno de Pergamino',
      body:
        'Si necesitás una farmacia hoy, la Municipalidad tiene un buscador específico de farmacias de turno por fecha. Lo dejamos fijado como referencia útil para consultas rápidas.',
      created_at: '2026-04-21T20:05:00.000Z',
    },
    verification: {
      label: 'Municipalidad de Pergamino · Farmacias de turno',
      url: 'https://aplicativos.pergamino.gob.ar/turnos_farmacias/',
      verifiedAt: '2026-04-24',
      note: 'El portal municipal mantiene un buscador de farmacias de turno por fecha para la ciudad de Pergamino.',
    },
  },
  {
    post: {
      ...editorialUser,
      category: 'apuntes',
      title: 'Dato útil: Progresar Formación Profesional abre el 27 de abril',
      body:
        'Si estás buscando una opción corta para capacitarte, la línea Progresar Formación Profesional abre su convocatoria 2026 el 27 de abril y queda disponible hasta el 27 de noviembre.',
      created_at: '2026-04-20T13:30:00.000Z',
    },
    verification: {
      label: 'Argentina.gob.ar · Progresar Formación Profesional',
      url: 'https://www.argentina.gob.ar/noticias/capital-humano-anuncia-la-apertura-de-la-convocatoria-para-progresar-formacion-profesional',
      verifiedAt: '2026-04-24',
      note: 'La nota oficial publicada el 17 de abril de 2026 informa apertura entre el 27 de abril y el 27 de noviembre de 2026.',
    },
  },
  {
    post: {
      ...editorialUser,
      category: 'otro',
      title: 'Trámite rápido: la muni centraliza turnos y accesos en Ventanilla Única',
      body:
        'Si tenés que resolver algo municipal, la Ventanilla Única de Pergamino centraliza accesos a turnos de licencia, juzgado de faltas, salud, comercio y otros servicios. Puede ahorrar bastante tiempo.',
      created_at: '2026-04-19T11:40:00.000Z',
    },
    verification: {
      label: 'Municipalidad de Pergamino · Ventanilla Única',
      url: 'https://aplicativos.pergamino.gob.ar/ventanilla/ventanilla_unica.php',
      verifiedAt: '2026-04-24',
      note: 'La página oficial municipal publica accesos rápidos a gestión de turnos, salud, comercio y servicios.',
    },
  },
]
