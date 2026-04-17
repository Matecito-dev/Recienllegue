require('dotenv').config({ path: '../.env.local' })

const puppeteer = require('puppeteer')
const cheerio   = require('cheerio')

// El proyecto está embebido en el subdominio (ej: recienllegue.matecito.dev)
// no se necesita PROJECT_ID separado
const API_BASE    = process.env.NEXT_PUBLIC_MATECITODB_URL
const SERVICE_KEY = process.env.MATECITODB_SERVICE_KEY

if (!API_BASE || !SERVICE_KEY) {
  console.error('Faltan variables de entorno: NEXT_PUBLIC_MATECITODB_URL, MATECITODB_SERVICE_KEY')
  process.exit(1)
}

const BASE = `${API_BASE}/api/v1`
const HEADERS = {
  'Content-Type': 'application/json',
  'x-matecito-key': SERVICE_KEY,
}

// ─── Matebase helpers ─────────────────────────────────────────

async function ensureCollection() {
  // Crea la colección si no existe (idempotente — el backend devuelve ok:true aunque ya exista)
  await fetch(`${BASE}/collections`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ collection: 'eventos' }),
  })
}

async function getExistingEvents() {
  const res = await fetch(`${BASE}/records?collection=eventos&limit=200`, { headers: HEADERS })
  const json = await res.json()
  return json.records ?? []
}

async function createEvent(data) {
  const res = await fetch(`${BASE}/records`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ collection: 'eventos', data }),
  })
  return res.json()
}

async function deleteEvent(id) {
  await fetch(`${BASE}/records/${id}`, { method: 'DELETE', headers: HEADERS })
}

// ─── Scraper ──────────────────────────────────────────────────

async function scrapeEventos() {
  console.log('[scraper] Iniciando...')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',   // evita crashes en contenedores CI con /dev/shm limitado
      '--disable-gpu',
    ],
    defaultViewport: { width: 1280, height: 800 },
  })

  const page = await browser.newPage()
  console.log('[scraper] Navegando a pergamino.tur.ar/agenda/')
  await page.goto('https://pergamino.tur.ar/agenda/', { waitUntil: 'networkidle2', timeout: 60000 })

  try {
    await page.waitForSelector('.evo_events_list_box', { timeout: 15000 })
    await new Promise(r => setTimeout(r, 4000))
  } catch {
    console.warn('[scraper] Selector del calendario no encontrado, continuando igual...')
  }

  const content = await page.content()
  await browser.close()

  const $ = cheerio.load(content)
  const events = []

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  $('.eventon_list_event').each((_, element) => {
    const scriptLdJson = $(element).find('script[type="application/ld+json"]').html()
    if (!scriptLdJson) return

    try {
      const eventData = JSON.parse(scriptLdJson.trim())

      // Descartar eventos pasados
      const endDate   = eventData.endDate   ? new Date(eventData.endDate)   : null
      const startDate = eventData.startDate ? new Date(eventData.startDate) : null
      const refDate   = endDate || startDate
      if (refDate && refDate < today) return

      if (!eventData.name) return

      // Formatear fecha: "2025-06-15T09:00" → date: "15/06/2025", time: "09:00 hs"
      const dateRaw  = eventData.startDate || ''
      const datePart = dateRaw.split('T')[0] || ''
      const timePart = dateRaw.split('T')[1] || ''

      let dateFormatted = datePart
      if (datePart) {
        const [y, m, d] = datePart.split('-')
        dateFormatted = `${d}/${m}/${y}`
      }
      const timeFormatted = timePart
        ? timePart.split('-')[0].split('+')[0] + ' hs'
        : ''

      // Location
      let location = ''
      if (Array.isArray(eventData.location) && eventData.location.length > 0) {
        location = eventData.location[0].name || ''
      } else if (eventData.location?.name) {
        location = eventData.location.name
      }
      if (!location) {
        location = $(element).find('.event_location_attrs').attr('data-location_name') || ''
      }

      const description = cheerio.load(eventData.description || '').text().trim()

      events.push({
        title:      eventData.name,
        description,
        date:       dateFormatted,
        dateSortable: datePart,   // ISO para ordenar en queries
        time:       timeFormatted,
        location,
        imageUrl:   eventData.image || '',
        link:       eventData.url   || '',
        isFeatured: false,
      })
    } catch (e) {
      console.error('[scraper] Error parseando evento:', e.message)
    }
  })

  console.log(`[scraper] Eventos extraídos: ${events.length}`)
  return events
}

// ─── Main ─────────────────────────────────────────────────────

async function main() {
  const scraped = await scrapeEventos()

  if (scraped.length === 0) {
    console.log('[matebase] No hay eventos para procesar.')
    return
  }

  // Asegurar que la colección existe antes de operar
  await ensureCollection()

  // Traer eventos existentes para evitar duplicados y limpiar los vencidos
  console.log('[matebase] Obteniendo eventos existentes...')
  const existing = await getExistingEvents()

  // Eliminar eventos que ya pasaron (limpieza mensual)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let deleted = 0

  for (const ev of existing) {
    const sortable = ev.data.dateSortable
    if (sortable && new Date(sortable) < today) {
      await deleteEvent(ev.id)
      deleted++
      console.log(`[matebase] Eliminado (vencido): ${ev.data.title}`)
    }
  }
  console.log(`[matebase] Eventos vencidos eliminados: ${deleted}`)

  // Insertar los nuevos evitando duplicados por title + date
  const existingKeys = new Set(
    existing.map(ev => `${ev.data.title}__${ev.data.date}`)
  )

  let inserted = 0
  let skipped  = 0

  for (const ev of scraped) {
    const key = `${ev.title}__${ev.date}`
    if (existingKeys.has(key)) {
      skipped++
      continue
    }
    await createEvent(ev)
    inserted++
    console.log(`[matebase] Creado: ${ev.title} (${ev.date})`)
  }

  console.log(`\n=== Finalizado. Creados: ${inserted} | Omitidos: ${skipped} | Vencidos eliminados: ${deleted} ===`)
}

main().catch(e => {
  console.error('[error]', e)
  process.exit(1)
})
