'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { serverDb as db } from '@/lib/db-server'
import { notifyMatchingHousingAlerts } from './admin'

type ListingKind = 'comercio' | 'hospedaje'
type TargetCollection = 'comercios' | 'hospedajes'

function now() {
  return new Date().toISOString()
}

async function currentUserId() {
  const cookieStore = await cookies()
  const raw = cookieStore.get('mb_user')?.value
  if (!raw) throw new Error('Tenes que iniciar sesion')
  try {
    const parsed = JSON.parse(decodeURIComponent(raw))
    if (parsed?.id) return String(parsed.id)
  } catch {}
  throw new Error('No se pudo identificar el usuario')
}

function cleanString(value: unknown) {
  return String(value ?? '').trim()
}

function parseJsonArray(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  const text = cleanString(value)
  if (!text) return []
  return text.split('\n').map((item) => item.trim()).filter(Boolean)
}

function normalizeOwnerListing(input: Record<string, unknown>, ownerId: string) {
  const kind = cleanString(input.kind) as ListingKind
  if (kind !== 'comercio' && kind !== 'hospedaje') throw new Error('Tipo invalido')

  const name = cleanString(input.name)
  if (!name) throw new Error('Falta el nombre')

  return {
    ownerId,
    kind,
    status: 'pending',
    name,
    category: cleanString(input.category),
    type: cleanString(input.type),
    address: cleanString(input.address),
    phone: cleanString(input.phone),
    whatsapp: cleanString(input.whatsapp),
    price: cleanString(input.price),
    priceMax: cleanString(input.priceMax),
    capacity: cleanString(input.capacity),
    description: cleanString(input.description),
    images: parseJsonArray(input.images),
    evidenceText: cleanString(input.evidenceText),
    verificationStatus: 'none',
    createdAt: now(),
    updatedAt: now(),
  }
}

export async function createOwnerListing(input: Record<string, unknown>) {
  const ownerId = await currentUserId()
  const payload = normalizeOwnerListing(input, ownerId)
  const result = await db.from('owner_listings').insert(payload)
  revalidatePath('/app/propietario')
  return result
}

export async function createOwnerClaim(input: Record<string, unknown>) {
  const ownerId = await currentUserId()
  const sourceCollection = cleanString(input.sourceCollection) as TargetCollection
  if (sourceCollection !== 'comercios' && sourceCollection !== 'hospedajes') throw new Error('Coleccion invalida')

  const payload = {
    ownerId,
    sourceCollection,
    sourceRecordId: cleanString(input.sourceRecordId),
    businessName: cleanString(input.businessName),
    status: 'pending',
    evidenceType: cleanString(input.evidenceType) || 'other',
    evidenceText: cleanString(input.evidenceText),
    contactPhone: cleanString(input.contactPhone),
    contactEmail: cleanString(input.contactEmail),
    notes: cleanString(input.notes),
    createdAt: now(),
    updatedAt: now(),
  }

  if (!payload.sourceRecordId || !payload.businessName) throw new Error('Falta elegir el comercio')
  if (!payload.evidenceText && !payload.contactPhone && !payload.contactEmail) {
    throw new Error('Agrega algun dato para validar que sos el dueño')
  }

  const existing = await db.from('owner_claims').findOne({
    ownerId,
    sourceCollection,
    sourceRecordId: payload.sourceRecordId,
  }).catch(() => null)
  if (existing?.id) {
    const result = await db.from('owner_claims').eq('id', existing.id).merge({ ...payload, updatedAt: now() })
    revalidatePath('/app/propietario')
    return result
  }

  const result = await db.from('owner_claims').insert(payload)
  revalidatePath('/app/propietario')
  return result
}

export async function createOwnerChangeRequest(input: Record<string, unknown>) {
  const ownerId = await currentUserId()
  const sourceCollection = cleanString(input.sourceCollection) as TargetCollection
  if (sourceCollection !== 'comercios' && sourceCollection !== 'hospedajes') throw new Error('Coleccion invalida')

  const changes = {
    name: cleanString(input.name),
    category: cleanString(input.category),
    type: cleanString(input.type),
    address: cleanString(input.address),
    phone: cleanString(input.phone),
    whatsapp: cleanString(input.whatsapp),
    price: cleanString(input.price),
    priceMax: cleanString(input.priceMax),
    capacity: cleanString(input.capacity),
    availabilityStatus: cleanString(input.availabilityStatus),
    availableFrom: cleanString(input.availableFrom),
    availableSlots: input.availableSlots === '' || input.availableSlots == null ? '' : Number(input.availableSlots),
    lastAvailabilityUpdate: cleanString(input.lastAvailabilityUpdate),
    description: cleanString(input.description),
    images: parseJsonArray(input.images),
  }

  const payload = {
    ownerId,
    sourceCollection,
    sourceRecordId: cleanString(input.sourceRecordId),
    status: 'pending',
    changes,
    reason: cleanString(input.reason),
    createdAt: now(),
    updatedAt: now(),
  }

  if (!payload.sourceRecordId) throw new Error('Falta el registro')
  const result = await db.from('owner_change_requests').insert(payload)
  await db.from('owner_messages').insert({
    ownerId,
    relatedType: 'change_request',
    relatedId: result?.data?.id ?? payload.sourceRecordId,
    body: 'Recibimos tu solicitud de cambios. El equipo la va a revisar antes de publicarla.',
    createdBy: 'system',
    createdAt: now(),
    read: false,
  }).catch(() => null)
  revalidatePath('/app/propietario')
  return result
}

function publicPayloadFromListing(listing: any) {
  const base = {
    name: listing.name,
    address: listing.address,
    phone: listing.phone || listing.whatsapp,
    isVerified: listing.verificationStatus === 'verified',
  }

  if (listing.kind === 'hospedaje') {
    return {
      ...base,
      description: listing.description,
      images: Array.isArray(listing.images) ? listing.images : [],
      type: listing.type || listing.category || 'Habitacion',
      price: listing.price,
      priceMax: listing.priceMax,
      capacity: listing.capacity,
      availabilityStatus: listing.availabilityStatus || 'available',
      availableFrom: listing.availableFrom || '',
      availableSlots: listing.availableSlots ?? null,
      lastAvailabilityUpdate: now(),
      amenities: [],
    }
  }

  return {
    ...base,
    category: listing.category || 'Comercio',
    description: listing.description,
    images: Array.isArray(listing.images) ? listing.images : [],
    rating: 0,
    reviewsCount: 0,
    googleMapsUrl: '',
    distanceMeters: null,
    walkTime: '',
    isFeatured: false,
  }
}

export async function approveOwnerListing(id: string) {
  const listing = await db.from('owner_listings').findOne({ id })
  if (!listing) throw new Error('No existe la publicacion')
  const collection = listing.kind === 'hospedaje' ? 'hospedajes' : 'comercios'
  const created = await db.from(collection).insert(publicPayloadFromListing(listing))
  await db.from('owner_listings').eq('id', id).merge({
    status: 'approved',
    publishedRecordId: created?.data?.id ?? null,
    reviewedAt: now(),
    updatedAt: now(),
  })
  await db.from('owner_messages').insert({
    ownerId: listing.ownerId,
    relatedType: 'listing',
    relatedId: id,
    body: 'Tu publicacion fue aprobada y ya esta visible en Recién Llegué.',
    createdBy: 'team',
    createdAt: now(),
    read: false,
  }).catch(() => null)
  revalidatePath('/app/adm/propietarios')
  revalidatePath(`/app/${collection}`)
  return created
}

export async function rejectOwnerListing(id: string, adminNotes = '') {
  const listing = await db.from('owner_listings').findOne({ id }).catch(() => null)
  const result = await db.from('owner_listings').eq('id', id).merge({ status: 'rejected', adminNotes, reviewedAt: now(), updatedAt: now() })
  if (listing?.ownerId) {
    await db.from('owner_messages').insert({
      ownerId: listing.ownerId,
      relatedType: 'listing',
      relatedId: id,
      body: adminNotes || 'Tu publicacion necesita ajustes antes de publicarse.',
      createdBy: 'team',
      createdAt: now(),
      read: false,
    }).catch(() => null)
  }
  return result
}

export async function approveOwnerClaim(id: string) {
  const claim = await db.from('owner_claims').findOne({ id })
  if (!claim) throw new Error('No existe el reclamo')
  const result = await db.from('owner_claims').eq('id', id).merge({ status: 'approved', reviewedAt: now(), updatedAt: now() })
  await db.from('owner_messages').insert({
    ownerId: claim.ownerId,
    relatedType: 'claim',
    relatedId: id,
    body: `Aprobamos el reclamo de ${claim.businessName ?? 'tu comercio'}. Ya podés pedir cambios desde tu panel.`,
    createdBy: 'team',
    createdAt: now(),
    read: false,
  }).catch(() => null)
  revalidatePath('/app/adm/propietarios')
  return result
}

export async function rejectOwnerClaim(id: string, adminNotes = '') {
  const claim = await db.from('owner_claims').findOne({ id }).catch(() => null)
  const result = await db.from('owner_claims').eq('id', id).merge({ status: 'rejected', adminNotes, reviewedAt: now(), updatedAt: now() })
  if (claim?.ownerId) {
    await db.from('owner_messages').insert({
      ownerId: claim.ownerId,
      relatedType: 'claim',
      relatedId: id,
      body: adminNotes || 'No pudimos validar el reclamo con la informacion enviada. Sumá más datos para comprobar que sos responsable del comercio.',
      createdBy: 'team',
      createdAt: now(),
      read: false,
    }).catch(() => null)
  }
  return result
}

function cleanChanges(changes: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(changes ?? {}).filter(([_, value]) => {
      if (Array.isArray(value)) return value.length > 0
      return value !== '' && value !== null && value !== undefined
    })
  )
}

function allowedChangesFor(collection: TargetCollection, changes: Record<string, unknown>) {
  const allowed = collection === 'hospedajes'
    ? ['name', 'type', 'address', 'phone', 'price', 'priceMax', 'capacity', 'availabilityStatus', 'availableFrom', 'availableSlots', 'lastAvailabilityUpdate', 'description', 'images']
    : ['name', 'category', 'address', 'phone', 'description', 'images']
  return Object.fromEntries(Object.entries(cleanChanges(changes)).filter(([key]) => allowed.includes(key)))
}

export async function approveOwnerChangeRequest(id: string) {
  const request = await db.from('owner_change_requests').findOne({ id })
  if (!request) throw new Error('No existe la solicitud')
  const changes = allowedChangesFor(request.sourceCollection, request.changes ?? {})
  const before = request.sourceCollection === 'hospedajes'
    ? await db.from('hospedajes').findOne({ id: request.sourceRecordId }).catch(() => null)
    : null
  if (Object.keys(changes).length > 0) {
    await db.from(request.sourceCollection).eq('id', request.sourceRecordId).merge(changes)
  }
  if (
    request.sourceCollection === 'hospedajes' &&
    String(before?.availabilityStatus ?? 'available') === 'occupied' &&
    String(changes.availabilityStatus ?? before?.availabilityStatus ?? '') !== 'occupied'
  ) {
    notifyMatchingHousingAlerts({ ...(before ?? {}), ...changes, id: request.sourceRecordId }, 'available_again').catch(() => null)
  }
  const result = await db.from('owner_change_requests').eq('id', id).merge({ status: 'approved', reviewedAt: now(), updatedAt: now() })
  await db.from('owner_messages').insert({
    ownerId: request.ownerId,
    relatedType: 'change_request',
    relatedId: id,
    body: 'Aprobamos tus cambios. La informacion publica ya fue actualizada.',
    createdBy: 'team',
    createdAt: now(),
    read: false,
  }).catch(() => null)
  revalidatePath('/app/adm/propietarios')
  revalidatePath(`/app/${request.sourceCollection}`)
  return result
}

export async function rejectOwnerChangeRequest(id: string, adminNotes = '') {
  const request = await db.from('owner_change_requests').findOne({ id }).catch(() => null)
  const result = await db.from('owner_change_requests').eq('id', id).merge({ status: 'rejected', adminNotes, reviewedAt: now(), updatedAt: now() })
  if (request?.ownerId) {
    await db.from('owner_messages').insert({
      ownerId: request.ownerId,
      relatedType: 'change_request',
      relatedId: id,
      body: adminNotes || 'Tus cambios necesitan ajustes antes de publicarse.',
      createdBy: 'team',
      createdAt: now(),
      read: false,
    }).catch(() => null)
  }
  return result
}

export async function getOwnerMetrics(records: { id: string; type: TargetCollection }[]) {
  const ownerId = await currentUserId()
  if (!ownerId) return {}
  const ids = records.map((record) => record.id).filter(Boolean)
  if (ids.length === 0) return {}

  const events = await db.from('user_events').limit(3000).find().catch(() => []) as any[]
  const metrics: Record<string, { views: number; contacts: number }> = {}
  ids.forEach((id) => { metrics[id] = { views: 0, contacts: 0 } })

  events.forEach((event) => {
    const id = event.entityId
    if (!id || !metrics[id]) return
    if (event.eventType === 'click_item') metrics[id].views += 1
    if (event.eventType === 'contact_click') contactsIncrement(metrics[id])
  })

  return metrics
}

function contactsIncrement(metric: { views: number; contacts: number }) {
  metric.contacts += 1
}
