const fs   = require('fs')
const path = require('path')

// Cargar .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const eq = line.indexOf('='); if (eq === -1 || line.trimStart().startsWith('#')) continue
    const key = line.slice(0, eq).trim()
    const val = line.slice(eq + 1).trim()
    if (key) process.env[key] = val
  }
}

const BASE_URL   = process.env.MATECITODB_URL
const PROJECT_ID = process.env.MATECITODB_PROJECT_ID
const SRV_KEY    = process.env.MATECITODB_SERVICE_KEY

if (!BASE_URL || !PROJECT_ID || !SRV_KEY) {
  console.error('Faltan variables: MATECITODB_URL, MATECITODB_PROJECT_ID, MATECITODB_SERVICE_KEY')
  process.exit(1)
}

const HEADERS = { 'Content-Type': 'application/json', 'x-matecito-key': SRV_KEY }
const API     = `${BASE_URL}/api/project/${PROJECT_ID}`

async function call(method, endpoint, body) {
  const res = await fetch(`${API}${endpoint}`, {
    method, headers: HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  })
  return { status: res.status, data: await res.json().catch(() => null) }
}

// ─── Campos de la colección ────────────────────────────────────

const FIELDS = [
  { name: 'nombre',       type: 'text',    required: true  },
  { name: 'ramal',        type: 'text',    required: true  },
  { name: 'empresa',      type: 'text',    required: false },
  { name: 'color',        type: 'text',    required: false },
  { name: 'actualizacion',type: 'text',    required: false },
  { name: 'ida',          type: 'json',    required: false }, // [{ longitud_km, puntos: [[lng,lat],...] }]
  { name: 'vuelta',       type: 'json',    required: false }, // idem
]

const RAMAL_COLORS = {
  'A':                '#ef4444',
  'B':                '#3b82f6',
  'C':                '#10b981',
  'D':                '#f59e0b',
  'E':                '#8b5cf6',
  'Parque Industrial': '#ec4899',
}

async function syncFields(collection) {
  const existing     = await call('GET', `/collections/${collection}/fields`)
  const existingNames = new Set((existing.data?.fields ?? []).map(f => f.name))
  let created = 0
  for (const field of FIELDS) {
    if (existingNames.has(field.name)) continue
    const r = await call('POST', `/collections/${collection}/fields`, field)
    if (r.status === 201) created++
    else console.warn(`   ⚠ Campo "${field.name}":`, r.data?.error ?? r.status)
  }
  return { created, skipped: existingNames.size }
}

// ─── Parseo KML ───────────────────────────────────────────────

function parseKML(kmlPath) {
  const kml = fs.readFileSync(kmlPath, 'utf-8')

  const placemarks = [...kml.matchAll(/<Placemark[^>]*>([\s\S]*?)<\/Placemark>/g)]

  const get = (block, name) => {
    const r = block.match(new RegExp(`<SimpleData name="${name}">(.*?)<\/SimpleData>`))
    return r?.[1]?.trim() ?? ''
  }

  const parseCoords = (block) => {
    const raw = block.match(/<coordinates>([\s\S]*?)<\/coordinates>/)?.[1]?.trim() ?? ''
    return raw.split(/\s+/).map(pair => {
      const [lng, lat] = pair.split(',').map(Number)
      return [lng, lat]
    }).filter(([lng, lat]) => !isNaN(lng) && !isNaN(lat))
  }

  // Agrupar por ramal
  const byRamal = {}

  for (const m of placemarks) {
    const block     = m[1]
    const ramal     = get(block, 'ramal')
    const recorrido = get(block, 'recorrido')      // IDA | VUELTA
    const longitud  = parseFloat(get(block, 'longitud_km')) || 0
    const empresa   = get(block, 'fuente')
    const actualizacion = get(block, 'actualizacion')
    const puntos    = parseCoords(block)

    if (!ramal) continue

    if (!byRamal[ramal]) {
      byRamal[ramal] = {
        nombre:      get(block, 'nombre_linea') || 'Línea 1',
        ramal,
        empresa,
        actualizacion,
        color:       RAMAL_COLORS[ramal] ?? '#163832',
        ida:         [],
        vuelta:      [],
      }
    }

    const tramo = { longitud_km: longitud, puntos }

    if (recorrido === 'IDA')    byRamal[ramal].ida.push(tramo)
    if (recorrido === 'VUELTA') byRamal[ramal].vuelta.push(tramo)
  }

  return Object.values(byRamal)
}

// ─── Main ─────────────────────────────────────────────────────

async function main() {
  const FORCE = process.argv.includes('--force')
  console.log('\n=== SEED: Colectivos ===')
  console.log(`API: ${API}\n`)

  // 1. Crear colección
  console.log('1. Colección "colectivos"...')
  const col = await call('POST', '/collections', { name: 'colectivos' })
  if      (col.status === 201) console.log('   ✓ Creada\n')
  else if (col.status === 409) console.log('   ℹ Ya existe\n')
  else { console.error('   ✗ Error:', col.data); process.exit(1) }

  // 2. Sincronizar campos
  console.log('2. Campos del schema...')
  const { created, skipped } = await syncFields('colectivos')
  console.log(`   ✓ ${created} creados, ${skipped} ya existían\n`)

  // 3. Chequear existentes
  const existing = await call('GET', '/records?collection=colectivos&limit=1')
  const total    = existing.data?.pagination?.total ?? 0

  if (total > 0 && !FORCE) {
    console.log(`   ℹ Ya hay ${total} registros. Usá --force para recargar.`)
    process.exit(0)
  }

  // 4. Parsear KML
  const kmlPath = path.join(__dirname, '..', 'public', 'assets', 'colectivos', 'colectivos_urbanos.kml')
  const ramales = parseKML(kmlPath)

  console.log(`3. Ramales encontrados en KML: ${ramales.length}`)
  ramales.forEach(r => console.log(`   - Ramal ${r.ramal}: ${r.ida.length} tramo(s) IDA, ${r.vuelta.length} tramo(s) VUELTA`))
  console.log()

  // 5. Limpiar si --force
  if (total > 0 && FORCE) {
    console.log('4. Limpiando registros existentes...')
    const all = await call('GET', '/records?collection=colectivos&limit=200')
    const ops = (all.data?.records ?? []).map(r => ({ op: 'delete', id: r.id, collection: 'colectivos' }))
    if (ops.length) await call('POST', '/batch', { operations: ops })
    console.log(`   ✓ ${ops.length} eliminados\n`)
  }

  // 6. Insertar
  console.log('5. Insertando...')
  let ok = 0
  for (const ramal of ramales) {
    const r = await call('POST', '/records', { collection: 'colectivos', data: ramal })
    if (r.status === 201) {
      ok++
      console.log(`   ✓ Ramal ${ramal.ramal} — IDA: ${ramal.ida.reduce((s,t)=>s+t.longitud_km,0).toFixed(2)} km | VUELTA: ${ramal.vuelta.reduce((s,t)=>s+t.longitud_km,0).toFixed(2)} km`)
    } else {
      console.error(`   ✗ Ramal ${ramal.ramal}:`, r.data)
    }
  }

  const verify = await call('GET', '/records?collection=colectivos&limit=1')
  console.log(`\n=== RESULTADO ===`)
  console.log(`   Insertados: ${ok} / ${ramales.length}`)
  console.log(`   Total en DB: ${verify.data?.pagination?.total ?? '?'}\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
