const fs   = require('fs')
const path = require('path')

// Cargar .env.local manualmente
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const eq = line.indexOf('=')
    if (eq === -1 || line.trimStart().startsWith('#')) continue
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

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

// Definición de campos
const FIELDS = [
  { name: 'name',           type: 'text',    required: true  },
  { name: 'category',       type: 'text',    required: false },
  { name: 'categories',     type: 'json',    required: false },
  { name: 'rating',         type: 'number',  required: false },
  { name: 'reviewsCount',   type: 'number',  required: false },
  { name: 'address',        type: 'text',    required: false },
  { name: 'phone',          type: 'text',    required: false },
  { name: 'website',        type: 'url',     required: false },
  { name: 'googleMapsUrl',  type: 'url',     required: false },
  { name: 'lat',            type: 'number',  required: false },
  { name: 'lng',            type: 'number',  required: false },
  { name: 'distanceMeters', type: 'number',  required: false },
  { name: 'walkTime',       type: 'text',    required: false },
  { name: 'isFeatured',     type: 'boolean', required: false },
  { name: 'isVerified',     type: 'boolean', required: false },
]

async function syncFields(collection) {
  const existing = await call('GET', `/collections/${collection}/fields`)
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

async function main() {
  const FORCE = process.argv.includes('--force')
  console.log(`\n=== SEED: Comercios ===`)
  console.log(`API: ${API}\n`)

  // 1. Crear colección
  console.log('1. Colección "comercios"...')
  const col = await call('POST', '/collections', { name: 'comercios' })
  if      (col.status === 201) console.log('   ✓ Creada\n')
  else if (col.status === 409) console.log('   ℹ Ya existe\n')
  else { console.error('   ✗ Error:', col.data); process.exit(1) }

  // 2. Sincronizar campos del schema
  console.log('2. Campos del schema...')
  const { created, skipped } = await syncFields('comercios')
  console.log(`   ✓ ${created} creados, ${skipped} ya existían\n`)

  // Chequear existentes
  const existing = await call('GET', '/records?collection=comercios&limit=1')
  const total    = existing.data?.pagination?.total ?? 0

  if (total > 0 && !FORCE) {
    console.log(`   ℹ Ya hay ${total} comercios. Usá --force para recargar.`)
    process.exit(0)
  }

  // 3. Limpiar si --force
  if (total > 0 && FORCE) {
    console.log(`3a. Eliminando ${total} registros existentes...`)
    let deleted = 0
    let page = 1
    while (true) {
      const res = await call('GET', `/records?collection=comercios&perPage=50&page=${page}`)
      const items = res.data?.items ?? res.data?.records ?? []
      if (!items.length) break

      const ops = items.map(r => ({ op: 'delete', id: r.id, collection: 'comercios' }))
      await call('POST', '/batch', { operations: ops })
      deleted += items.length
      process.stdout.write(`\r   Eliminados: ${deleted}`)
    }
    console.log('\n')
  }

  // 4. Cargar JSON
  const filePath = path.join(__dirname, '..', 'public', 'assets', 'jsons', 'locales_con_distancia.json')
  const locales  = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  console.log(`2. Locales en JSON: ${locales.length}`)

  const records = locales
    .filter(l => l.title)
    .map(local => ({
      op: 'insert',
      collection: 'comercios',
      data: {
        name:           local.title,
        category:       local.categoryName || local.categories?.[0] || 'Comercio',
        categories:     local.categories ?? [],
        rating:         Number(local.totalScore) || 0,
        reviewsCount:   Number(local.reviewsCount) || 0,
        address:        local.street ? `${local.street}, ${local.city ?? 'Pergamino'}` : '',
        phone:          local.phone || '',
        website:        local.website || '',
        googleMapsUrl:  local.url || '',
        lat:            local.lat  != null ? Number(local.lat)  : null,
        lng:            local.lng  != null ? Number(local.lng)  : null,
        distanceMeters: local.distanceMeters != null ? Number(local.distanceMeters) : null,
        walkTime:       local.walkTime || '',
        isFeatured:     false,
        isVerified:     false,
      }
    }))

  // 5. Insertar en batches de 50
  console.log('\n3. Insertando en batches...\n')
  let ok = 0, errors = 0

  for (const batch of chunk(records, 50)) {
    const r = await call('POST', '/batch', { operations: batch })
    if (r.status === 200) {
      const batchOk = r.data.results?.filter(x => x.ok).length ?? 0
      ok += batchOk
      process.stdout.write(`\r   Insertados: ${ok}`)
    } else {
      errors += batch.length
      console.error('\n   ✗ Batch error:', JSON.stringify(r.data))
    }
  }

  console.log('\n')
  console.log(`=== RESULTADO ===`)
  console.log(`   Insertados: ${ok}`)
  console.log(`   Errores:    ${errors}`)

  const verify = await call('GET', '/records?collection=comercios&limit=1')
  console.log(`   Total en DB: ${verify.data?.pagination?.total ?? '?'}\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
