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

if (!BASE_URL || !PROJECT_ID || !SRV_KEY) {
  console.error('Faltan variables de entorno'); process.exit(1)
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

const COLLECTIONS = [
  {
    name: 'muro_posts',
    fields: [
      { name: 'userId',        type: 'text',    required: true  },
      { name: 'userName',      type: 'text',    required: true  },
      { name: 'title',         type: 'text',    required: true  },
      { name: 'body',          type: 'text',    required: true  },
      { name: 'category',      type: 'text',    required: true  },
      { name: 'likesCount',    type: 'number',  required: false },
      { name: 'commentsCount', type: 'number',  required: false },
    ],
  },
  {
    name: 'muro_likes',
    fields: [
      { name: 'postId', type: 'text', required: true },
      { name: 'userId', type: 'text', required: true },
    ],
  },
  {
    name: 'muro_comments',
    fields: [
      { name: 'postId',   type: 'text', required: true },
      { name: 'userId',   type: 'text', required: true },
      { name: 'userName', type: 'text', required: true },
      { name: 'body',     type: 'text', required: true },
    ],
  },
  {
    name: 'muro_reports',
    fields: [
      { name: 'postId', type: 'text', required: true },
      { name: 'userId', type: 'text', required: true },
      { name: 'reason', type: 'text', required: false },
    ],
  },
]

async function syncFields(collection, fields) {
  const existing      = await call('GET', `/collections/${collection}/fields`)
  const existingNames = new Set((existing.data?.fields ?? []).map(f => f.name))
  let created = 0
  for (const field of fields) {
    if (existingNames.has(field.name)) continue
    const r = await call('POST', `/collections/${collection}/fields`, field)
    if (r.status === 201) created++
    else console.warn(`   ⚠ Campo "${field.name}":`, r.data?.error)
  }
  return created
}

async function main() {
  console.log('\n=== SEED: Muro ===\n')

  for (const col of COLLECTIONS) {
    process.stdout.write(`Colección "${col.name}"... `)
    const res = await call('POST', '/collections', { name: col.name })

    if (res.status === 201)      process.stdout.write('✓ creada  ')
    else if (res.status === 409) process.stdout.write('ℹ existe  ')
    else { console.error('✗ error:', res.data); continue }

    const created = await syncFields(col.name, col.fields)
    console.log(`→ ${created} campos nuevos`)
  }

  console.log('\n✓ Listo\n')
}

main().catch(err => { console.error(err); process.exit(1) })
