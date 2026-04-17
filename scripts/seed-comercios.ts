import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import fs from 'fs'
import path from 'path'

const BASE_URL   = process.env.MATECITODB_URL!
const PROJECT_ID = process.env.MATECITODB_PROJECT_ID!
const SRV_KEY    = process.env.MATECITODB_SERVICE_KEY!

if (!BASE_URL || !PROJECT_ID || !SRV_KEY) {
  console.error('Faltan variables de entorno: MATECITODB_URL, MATECITODB_PROJECT_ID, MATECITODB_SERVICE_KEY')
  process.exit(1)
}

const HEADERS = {
  'Content-Type':   'application/json',
  'x-matecito-key': SRV_KEY,
}

const API = `${BASE_URL}/api/project/${PROJECT_ID}`

async function call(method: string, endpoint: string, body?: unknown) {
  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers: HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  })
  return { status: res.status, data: await res.json().catch(() => null) }
}

async function main() {
  console.log(`\n=== SEED: Comercios ===`)
  console.log(`API: ${API}\n`)

  // 1. Crear colección (ignora 409 si ya existe)
  console.log('1. Creando colección "comercios"...')
  const col = await call('POST', '/collections', { name: 'comercios' })
  if (col.status === 201) {
    console.log('   ✓ Colección creada\n')
  } else if (col.status === 409) {
    console.log('   ℹ Colección ya existe, continuando\n')
  } else {
    console.error('   ✗ Error al crear colección:', col.data)
    process.exit(1)
  }

  // 2. Cargar JSON
  const filePath = path.join(process.cwd(), 'public', 'assets', 'jsons', 'locales_con_distancia.json')
  const locales: any[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  console.log(`2. Locales en JSON: ${locales.length}`)

  // 3. Verificar cuántos ya están cargados
  const existing = await call('GET', '/records?collection=comercios&perPage=1')
  const totalExisting = existing.data?.total ?? 0
  if (totalExisting > 0) {
    console.log(`   ℹ Ya hay ${totalExisting} comercios cargados.`)
    const answer = process.argv.includes('--force')
      ? 'si'
      : 'no (usá --force para recargar)'
    console.log(`   Recargar: ${answer}`)
    if (!process.argv.includes('--force')) process.exit(0)
  }

  // 4. Insertar registros
  console.log('\n3. Insertando...\n')
  let ok = 0
  let errors = 0

  for (const local of locales) {
    if (!local.title) continue

    const data = {
      name:         local.title,
      category:     local.categoryName || (local.categories?.[0] ?? 'Comercio'),
      categories:   local.categories ?? [],
      rating:       Number(local.totalScore) || 0,
      reviewsCount: Number(local.reviewsCount) || 0,
      address:      local.street ? `${local.street}, ${local.city ?? 'Pergamino'}` : '',
      phone:        local.phone || '',
      website:      local.website || '',
      googleMapsUrl: local.url || '',
      lat:          local.lat != null ? Number(local.lat) : null,
      lng:          local.lng != null ? Number(local.lng) : null,
      distanceMeters: local.distanceMeters != null ? Number(local.distanceMeters) : null,
      walkTime:     local.walkTime || '',
      isFeatured:   false,
      isVerified:   false,
    }

    const r = await call('POST', '/records', { collection: 'comercios', data })

    if (r.status === 201) {
      ok++
      if (ok <= 5 || ok % 50 === 0) console.log(`   [${ok}] ${local.title}`)
    } else {
      errors++
      if (errors <= 3) console.error(`   ✗ ${local.title}:`, JSON.stringify(r.data))
    }
  }

  console.log(`\n=== RESULTADO ===`)
  console.log(`   Insertados: ${ok}`)
  console.log(`   Errores:    ${errors}`)

  // 5. Verificación
  const verify = await call('GET', '/records?collection=comercios&perPage=1')
  console.log(`   Total en DB: ${verify.data?.total ?? '?'}\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
