const fs = require('fs')
const path = require('path')
const { createClient } = require('../node_modules/matecitodb/dist/cjs/index.js')

const envPath = path.join(process.cwd(), '.env.local')
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !line.trim().startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=')
      return [line.slice(0, idx), line.slice(idx + 1)]
    })
)

const db = createClient(env.NEXT_PUBLIC_MATECITODB_URL, {
  apiKey: env.MATECITODB_SERVICE_KEY,
  apiVersion: 'v2',
})

const seeds = [
  {
    userId: 'seed-editorial-recien-llegue',
    userName: 'Recién Llegué',
    userRole: 'equipo',
    category: 'apuntes',
    title: 'Dato útil: Progresar Superior sigue abierto hasta el 30 de abril',
    body: 'Si cursás una carrera superior, la UNNOBA informó que la inscripción a Becas Progresar Superior 2026 está abierta del 6 al 30 de abril. Lo dejamos por acá porque puede servir si todavía no la hiciste.',
    likesCount: 0,
    commentsCount: 0,
    created_at: '2026-04-24T09:10:00.000Z',
  },
  {
    userId: 'seed-editorial-recien-llegue',
    userName: 'Recién Llegué',
    userRole: 'equipo',
    category: 'apuntes',
    title: 'Recordatorio: la confirmación de inscripción de ingreso 2026 sigue activa',
    body: 'Para ingresantes UNNOBA 2026, en el calendario académico figura la confirmación de inscripción a la carrera hasta el 30 de mayo. Si venís postergándolo, conviene revisarlo esta semana.',
    likesCount: 0,
    commentsCount: 0,
    created_at: '2026-04-23T15:20:00.000Z',
  },
  {
    userId: 'seed-editorial-recien-llegue',
    userName: 'Recién Llegué',
    userRole: 'equipo',
    category: 'eventos',
    title: 'Dato de cursada: el primer semestre UNNOBA está en marcha hasta julio',
    body: 'Por si a alguien le sirve ordenarse, el calendario académico 2026 marca que las materias cuatrimestrales y anuales del primer semestre van del 16 de marzo al 11 de julio.',
    likesCount: 0,
    commentsCount: 0,
    created_at: '2026-04-22T18:45:00.000Z',
  },
  {
    userId: 'seed-editorial-recien-llegue',
    userName: 'Recién Llegué',
    userRole: 'equipo',
    category: 'otro',
    title: 'Servicio útil: farmacias de turno de Pergamino',
    body: 'Si necesitás una farmacia hoy, la Municipalidad tiene un buscador específico de farmacias de turno por fecha. Lo dejamos fijado como referencia útil para consultas rápidas.',
    likesCount: 0,
    commentsCount: 0,
    created_at: '2026-04-21T20:05:00.000Z',
  },
  {
    userId: 'seed-editorial-recien-llegue',
    userName: 'Recién Llegué',
    userRole: 'equipo',
    category: 'apuntes',
    title: 'Dato útil: Progresar Formación Profesional abre el 27 de abril',
    body: 'Si estás buscando una opción corta para capacitarte, la línea Progresar Formación Profesional abre su convocatoria 2026 el 27 de abril y queda disponible hasta el 27 de noviembre.',
    likesCount: 0,
    commentsCount: 0,
    created_at: '2026-04-20T13:30:00.000Z',
  },
  {
    userId: 'seed-editorial-recien-llegue',
    userName: 'Recién Llegué',
    userRole: 'equipo',
    category: 'otro',
    title: 'Trámite rápido: la muni centraliza turnos y accesos en Ventanilla Única',
    body: 'Si tenés que resolver algo municipal, la Ventanilla Única de Pergamino centraliza accesos a turnos de licencia, juzgado de faltas, salud, comercio y otros servicios. Puede ahorrar bastante tiempo.',
    likesCount: 0,
    commentsCount: 0,
    created_at: '2026-04-19T11:40:00.000Z',
  },
]

async function main() {
  const created = []
  const skipped = []

  for (const seed of seeds) {
    const existing = await db.from('muro_posts').eq('title', seed.title).limit(1).find()
    const match = Array.isArray(existing?.data) ? existing.data[0] : existing?.data
    if (match) {
      skipped.push(seed.title)
      continue
    }

    const res = await db.from('muro_posts').insert(seed)
    if (!res || !res.data) throw new Error(`No se pudo insertar: ${seed.title}`)
    created.push(seed.title)
  }

  console.log(JSON.stringify({ created, skipped }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
