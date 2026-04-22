/**
 * Crea/sincroniza las colecciones que usa el panel propietario usando la API de Matecito.
 *
 * Uso:
 *   node scripts/create-owner-panel-collections.cjs
 *
 * Lee MATECITODB_URL y MATECITODB_SERVICE_KEY desde .env.local o .env.
 */

const fs = require('node:fs')
const path = require('node:path')

function loadEnvFile(file) {
  const full = path.join(process.cwd(), file)
  if (!fs.existsSync(full)) return
  const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
    const index = trimmed.indexOf('=')
    const key = trimmed.slice(0, index).trim()
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile('.env.local')
loadEnvFile('.env')

const DB_URL = process.env.MATECITODB_URL || process.env.NEXT_PUBLIC_MATECITODB_URL
const PROJECT_ID = process.env.MATECITODB_PROJECT_ID
const SERVICE_KEY = process.env.MATECITODB_SERVICE_KEY

if (!DB_URL || !SERVICE_KEY) {
  console.error('Faltan MATECITODB_URL/NEXT_PUBLIC_MATECITODB_URL o MATECITODB_SERVICE_KEY')
  process.exit(1)
}

const API = PROJECT_ID ? `${DB_URL}/api/project/${PROJECT_ID}` : `${DB_URL}/api/v2/project`
const HEADERS = { 'Content-Type': 'application/json', 'x-matecito-key': SERVICE_KEY }

async function call(method, endpoint, body) {
  const response = await fetch(`${API}${endpoint}`, {
    method,
    headers: HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  })
  return { status: response.status, data: await response.json().catch(() => null) }
}

const collections = {
  owner_listings: [
    { name: 'ownerId', type: 'text', required: true },
    { name: 'kind', type: 'text', required: true },
    { name: 'status', type: 'text', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'category', type: 'text', required: false },
    { name: 'type', type: 'text', required: false },
    { name: 'address', type: 'text', required: false },
    { name: 'phone', type: 'text', required: false },
    { name: 'whatsapp', type: 'text', required: false },
    { name: 'price', type: 'text', required: false },
    { name: 'priceMax', type: 'text', required: false },
    { name: 'capacity', type: 'text', required: false },
    { name: 'description', type: 'text', required: false },
    { name: 'images', type: 'json', required: false },
    { name: 'evidenceText', type: 'text', required: false },
    { name: 'verificationStatus', type: 'text', required: false },
    { name: 'publishedRecordId', type: 'text', required: false },
    { name: 'adminNotes', type: 'text', required: false },
    { name: 'reviewedAt', type: 'date', required: false },
    { name: 'createdAt', type: 'date', required: false },
    { name: 'updatedAt', type: 'date', required: false },
  ],
  owner_claims: [
    { name: 'ownerId', type: 'text', required: true },
    { name: 'sourceCollection', type: 'text', required: true },
    { name: 'sourceRecordId', type: 'text', required: true },
    { name: 'businessName', type: 'text', required: true },
    { name: 'status', type: 'text', required: true },
    { name: 'evidenceType', type: 'text', required: false },
    { name: 'evidenceText', type: 'text', required: false },
    { name: 'contactPhone', type: 'text', required: false },
    { name: 'contactEmail', type: 'text', required: false },
    { name: 'notes', type: 'text', required: false },
    { name: 'adminNotes', type: 'text', required: false },
    { name: 'reviewedAt', type: 'date', required: false },
    { name: 'createdAt', type: 'date', required: false },
    { name: 'updatedAt', type: 'date', required: false },
  ],
  owner_change_requests: [
    { name: 'ownerId', type: 'text', required: true },
    { name: 'sourceCollection', type: 'text', required: true },
    { name: 'sourceRecordId', type: 'text', required: true },
    { name: 'status', type: 'text', required: true },
    { name: 'changes', type: 'json', required: false },
    { name: 'reason', type: 'text', required: false },
    { name: 'adminNotes', type: 'text', required: false },
    { name: 'reviewedAt', type: 'date', required: false },
    { name: 'createdAt', type: 'date', required: false },
    { name: 'updatedAt', type: 'date', required: false },
  ],
  owner_messages: [
    { name: 'ownerId', type: 'text', required: true },
    { name: 'relatedType', type: 'text', required: false },
    { name: 'relatedId', type: 'text', required: false },
    { name: 'body', type: 'text', required: true },
    { name: 'createdBy', type: 'text', required: false },
    { name: 'read', type: 'boolean', required: false },
    { name: 'createdAt', type: 'date', required: false },
  ],
  user_saved_items: [
    { name: 'userId', type: 'text', required: true },
    { name: 'entityType', type: 'text', required: true },
    { name: 'entityId', type: 'text', required: true },
    { name: 'status', type: 'text', required: false },
    { name: 'notes', type: 'text', required: false },
    { name: 'compare', type: 'boolean', required: false },
    { name: 'createdAt', type: 'date', required: false },
    { name: 'updatedAt', type: 'date', required: false },
  ],
  user_contributions: [
    { name: 'userId', type: 'text', required: true },
    { name: 'type', type: 'text', required: true },
    { name: 'entityType', type: 'text', required: false },
    { name: 'entityId', type: 'text', required: false },
    { name: 'points', type: 'number', required: false },
    { name: 'createdAt', type: 'date', required: false },
  ],
}

const extraFields = {
  comercios: [
    { name: 'description', type: 'text', required: false },
    { name: 'images', type: 'json', required: false },
  ],
  hospedajes: [
    { name: 'availabilityStatus', type: 'text', required: false },
    { name: 'availableFrom', type: 'date', required: false },
    { name: 'availableSlots', type: 'number', required: false },
    { name: 'lastAvailabilityUpdate', type: 'date', required: false },
  ],
}

async function syncCollection(name, fields) {
  console.log(`\n── ${name}`)
  const created = await call('POST', '/collections', { name })
  if (created.status >= 400) console.log(`· colección: ${created.data?.error ?? created.data?.message ?? created.status}`)
  else console.log('✓ colección creada')

  const listed = await call('GET', `/collections/${name}/fields`)
  if (listed.status >= 400) {
    console.error(`No se pudieron listar campos de ${name}:`, listed.data?.error ?? listed.data?.message ?? listed.status)
    return
  }

  const existing = new Set((listed.data?.fields ?? listed.data ?? []).map((field) => field.name))
  for (const field of fields) {
    if (existing.has(field.name)) {
      console.log(`· ${field.name}`)
      continue
    }
    const added = await call('POST', `/collections/${name}/fields`, field)
    if (added.status >= 400) console.warn(`! ${field.name}: ${added.data?.error ?? added.data?.message ?? added.status}`)
    else console.log(`✓ ${field.name}`)
  }
}

async function main() {
  for (const [name, fields] of Object.entries(collections)) {
    await syncCollection(name, fields)
  }
  for (const [name, fields] of Object.entries(extraFields)) {
    await syncCollection(name, fields)
  }
  console.log('\nListo. Ahora el SDK puede usar owner_listings, owner_claims y owner_change_requests.\n')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
