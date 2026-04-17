import { NextResponse } from 'next/server'
import { createClient } from 'matecitodb'

// Ruta temporal one-time — eliminar después de migrar
// GET /api/migrate?secret=...

const MIGRATE_SECRET = process.env.MATECITODB_SERVICE_KEY?.slice(-8)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('secret') !== MIGRATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const DB_URL      = process.env.MATECITODB_URL ?? ''
  const SERVICE_KEY = process.env.MATECITODB_SERVICE_KEY ?? ''

  if (!DB_URL || !SERVICE_KEY) {
    return NextResponse.json({ error: 'Missing env vars' }, { status: 500 })
  }

  const db = createClient(DB_URL, { apiKey: SERVICE_KEY })
  const results: Record<string, string> = {}

  // ── user_locations ─────────────────────────────────────────
  const { error: e1 } = await db.collections.create('user_locations', {
    fields: [
      { name: 'userId',    type: 'text',   required: true  },
      { name: 'latitude',  type: 'number', required: true  },
      { name: 'longitude', type: 'number', required: true  },
      { name: 'accuracy',  type: 'number', required: false },
      { name: 'source',    type: 'text',   required: false },
    ]
  } as any)
  results.user_locations = e1 ? `warn: ${e1.message}` : 'created'

  // ── user_events ────────────────────────────────────────────
  const { error: e2 } = await db.collections.create('user_events', {
    fields: [
      { name: 'userId',     type: 'text', required: false },
      { name: 'sessionId',  type: 'text', required: true  },
      { name: 'eventType',  type: 'text', required: true  },
      { name: 'entityId',   type: 'text', required: false },
      { name: 'entityType', type: 'text', required: false },
      { name: 'page',       type: 'text', required: false },
      { name: 'metadata',   type: 'json', required: false },
    ]
  } as any)
  results.user_events = e2 ? `warn: ${e2.message}` : 'created'

  // ── profiles: agregar campos ───────────────────────────────
  const { data: fields, error: e3 } = await db.collections.fields('profiles').list()
  if (e3) {
    return NextResponse.json({ error: `profiles fields list failed: ${e3.message}`, results }, { status: 500 })
  }

  const existingNames = ((fields as any[]) ?? []).map((f: any) => f.name)
  results.profiles_existing = existingNames.join(', ')

  if (!existingNames.includes('city_origin')) {
    const { error } = await db.collections.fields('profiles').create({ name: 'city_origin', type: 'text', required: false } as any)
    results.city_origin = error ? `warn: ${error.message}` : 'added'
  } else {
    results.city_origin = 'already exists'
  }

  if (!existingNames.includes('year_of_study')) {
    const { error } = await db.collections.fields('profiles').create({ name: 'year_of_study', type: 'number', required: false } as any)
    results.year_of_study = error ? `warn: ${error.message}` : 'added'
  } else {
    results.year_of_study = 'already exists'
  }

  return NextResponse.json({ ok: true, results })
}
