/**
 * Script one-time: agrega city_origin y year_of_study a la colección 'profiles'
 *
 * Uso:
 *   MATECITODB_URL=https://... MATECITODB_SERVICE_KEY=mk_service_... node scripts/migrate-profiles.mjs
 *
 * O con .env.local:
 *   node -r dotenv/config scripts/migrate-profiles.mjs dotenv_config_path=.env.local
 */

import { createClient } from 'matecitodb'

const DB_URL      = process.env.MATECITODB_URL
const SERVICE_KEY = process.env.MATECITODB_SERVICE_KEY

if (!DB_URL || !SERVICE_KEY) {
  console.error('Faltan variables: MATECITODB_URL y MATECITODB_SERVICE_KEY')
  process.exit(1)
}

const db = createClient(DB_URL, { apiKey: SERVICE_KEY })

async function run() {
  // 1. Crear tablas user_locations y user_events
  console.log('\n── Creando colección user_locations...')
  const { error: e1 } = await db.collections.create('user_locations', {
    fields: [
      { name: 'userId',    type: 'text',   required: true  },
      { name: 'latitude',  type: 'number', required: true  },
      { name: 'longitude', type: 'number', required: true  },
      { name: 'accuracy',  type: 'number', required: false },
      { name: 'source',    type: 'text',   required: false },
    ]
  })
  if (e1) console.warn('user_locations:', e1.message, '(puede que ya exista)')
  else console.log('✓ user_locations creada')

  console.log('\n── Creando colección user_events...')
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
  })
  if (e2) console.warn('user_events:', e2.message, '(puede que ya exista)')
  else console.log('✓ user_events creada')

  // 2. Agregar campos a profiles
  console.log('\n── Agregando campos a profiles...')

  const { data: fields, error: e3 } = await db.collections.fields('profiles').list()
  if (e3) {
    console.error('No se pudo listar campos de profiles:', e3.message)
    process.exit(1)
  }

  const existingNames = (fields ?? []).map(f => f.name)
  console.log('Campos existentes en profiles:', existingNames.join(', '))

  if (!existingNames.includes('city_origin')) {
    const { error } = await db.collections.fields('profiles').create({
      name: 'city_origin',
      type: 'text',
      required: false,
    })
    if (error) console.warn('city_origin:', error.message)
    else console.log('✓ city_origin agregado')
  } else {
    console.log('· city_origin ya existe')
  }

  if (!existingNames.includes('year_of_study')) {
    const { error } = await db.collections.fields('profiles').create({
      name: 'year_of_study',
      type: 'number',
      required: false,
    })
    if (error) console.warn('year_of_study:', error.message)
    else console.log('✓ year_of_study agregado')
  } else {
    console.log('· year_of_study ya existe')
  }

  console.log('\n✅ Migración completada\n')
}

run().catch(err => {
  console.error('Error fatal:', err)
  process.exit(1)
})
