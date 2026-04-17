const fs   = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const eq = line.indexOf('='); if (eq === -1 || line.trimStart().startsWith('#')) continue
    process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
  }
}

const BASE_URL   = process.env.MATECITODB_URL
const PROJECT_ID = process.env.MATECITODB_PROJECT_ID
const SRV_KEY    = process.env.MATECITODB_SERVICE_KEY
const API        = `${BASE_URL}/api/project/${PROJECT_ID}`
const HEADERS    = { 'Content-Type': 'application/json', 'x-matecito-key': SRV_KEY }

async function call(method, endpoint, body) {
  const res = await fetch(`${API}${endpoint}`, {
    method, headers: HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  })
  return { status: res.status, data: await res.json().catch(() => null) }
}

const FIELDS = [
  { name: 'userId',    type: 'text',   required: true  },
  { name: 'role',      type: 'text',   required: false }, // estudiante | comercio
  { name: 'career',   type: 'text',   required: false },
  { name: 'bio',       type: 'text',   required: false },
  { name: 'age',       type: 'number', required: false },
  { name: 'contact',  type: 'text',   required: false },
  { name: 'avatarUrl', type: 'text',   required: false },
]

async function syncFields(collection) {
  const existing      = await call('GET', `/collections/${collection}/fields`)
  const existingNames = new Set((existing.data?.fields ?? []).map(f => f.name))
  let created = 0
  for (const field of FIELDS) {
    if (existingNames.has(field.name)) continue
    const r = await call('POST', `/collections/${collection}/fields`, field)
    if (r.status === 201) created++
    else console.warn(`  ⚠ Campo "${field.name}":`, r.data?.error)
  }
  return created
}

async function main() {
  console.log('\n=== SEED: Profiles ===\n')

  const res = await call('POST', '/collections', { name: 'profiles' })
  if      (res.status === 201) console.log('✓ Colección "profiles" creada')
  else if (res.status === 409) console.log('ℹ Colección "profiles" ya existe')
  else { console.error('✗ Error:', res.data); process.exit(1) }

  const created = await syncFields('profiles')
  console.log(`✓ ${created} campos nuevos`)
  console.log('\n✓ Listo\n')
}

main().catch(err => { console.error(err); process.exit(1) })
