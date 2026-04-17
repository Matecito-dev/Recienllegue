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

async function main() {
  // Traer todos los comercios con rating > 0, ordenados por rating desc
  const res = await fetch(
    `${API}/records?collection=comercios&limit=200&sort=created_at&order=asc`,
    { headers: HEADERS }
  )
  const data = await res.json()
  const all  = data.records ?? []

  // Ordenar por rating desc, tomar 6
  const sorted   = [...all].sort((a, b) => (b.data.rating ?? 0) - (a.data.rating ?? 0))
  const featured = sorted.slice(0, 6)

  console.log(`Marcando como destacados:`)
  for (const r of featured) {
    console.log(`  - ${r.data.name} (★ ${r.data.rating})`)
    await fetch(`${API}/records/${r.id}`, {
      method:  'PATCH',
      headers: HEADERS,
      body:    JSON.stringify({ collection: 'comercios', data: { isFeatured: true }, merge: true }),
    })
  }
  console.log('\n✓ Listo')
}

main().catch(err => { console.error(err); process.exit(1) })
