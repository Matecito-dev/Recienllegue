'use server'

import { cookies } from 'next/headers'
import { serverDb as db } from '@/lib/db-server'

type NotificationAudience = {
  target: 'all' | 'role' | 'city'
  role?: string
  city?: string
}

function normalizeText(value: unknown) {
  return String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
}

function parsePrice(value: unknown) {
  const digits = String(value ?? '').replace(/[^\d]/g, '')
  return digits ? Number(digits) : null
}

function asArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : []
}

async function currentUserIdOrNull() {
  try {
    const cookieStore = await cookies()
    const raw = cookieStore.get('mb_user')?.value
    if (!raw) return null
    const parsed = JSON.parse(decodeURIComponent(raw))
    return parsed?.id ? String(parsed.id) : null
  } catch {
    return null
  }
}

async function upsertOwnerListingForHospedaje(hospedaje: any, ownerId: string) {
  if (!hospedaje?.id || !ownerId) return null
  const existing = await db.from('owner_listings').findOne({ ownerId, publishedRecordId: hospedaje.id }).catch(() => null)
  const payload = {
    ownerId,
    kind: 'hospedaje',
    status: 'approved',
    name: hospedaje.name ?? '',
    type: hospedaje.type ?? '',
    address: hospedaje.address ?? '',
    phone: hospedaje.phone ?? '',
    price: hospedaje.price ?? '',
    priceMax: hospedaje.priceMax ?? '',
    capacity: hospedaje.capacity ?? '',
    description: hospedaje.description ?? '',
    images: Array.isArray(hospedaje.images) ? hospedaje.images : [],
    verificationStatus: hospedaje.isVerified ? 'verified' : 'none',
    publishedRecordId: hospedaje.id,
    reviewedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  if (existing?.id) return db.from('owner_listings').eq('id', existing.id).merge(payload)
  return db.from('owner_listings').insert({ ...payload, createdAt: new Date().toISOString() })
}

async function resolveAudienceUserIds(audience: NotificationAudience) {
  const profiles = await db.from('profiles').limit(1000).find().catch(() => []) as any[]
  return profiles
    .filter((profile) => {
      if (!profile?.userId) return false
      if (audience.target === 'role') return normalizeText(profile.role) === normalizeText(audience.role)
      if (audience.target === 'city') return normalizeText(profile.city_origin ?? profile.city) === normalizeText(audience.city)
      return true
    })
    .map((profile) => profile.userId as string)
    .filter(Boolean)
}

function matchesHousingAlert(alert: any, hospedaje: Record<string, unknown>) {
  if (!alert?.enabled || alert.type !== 'housing') return false

  const housingType = normalizeText(alert.housingType)
  const hospedajeType = normalizeText(hospedaje.type)
  if (housingType && hospedajeType && housingType !== hospedajeType) return false

  const maxPrice = typeof alert.maxPrice === 'number' ? alert.maxPrice : null
  const price = parsePrice(hospedaje.price)
  if (maxPrice && price && price > maxPrice) return false

  const zones = asArray(alert.zones).map(normalizeText)
  const address = normalizeText(hospedaje.address)
  if (zones.length > 0 && address && !zones.some((zone) => address.includes(zone))) return false

  const keywords = asArray(alert.keywords).map(normalizeText)
  const haystack = normalizeText(`${hospedaje.name ?? ''} ${hospedaje.description ?? ''} ${hospedaje.address ?? ''} ${hospedaje.type ?? ''}`)
  if (keywords.length > 0 && !keywords.some((keyword) => haystack.includes(keyword))) return false

  return true
}

async function sendPushToUsers(userIds: string[], payload: { title: string; body: string; href?: string; type?: string }) {
  const uniqueUserIds = [...new Set(userIds)].filter(Boolean)
  if (uniqueUserIds.length === 0) return { sent: 0, error: null as string | null }

  const { error } = await db.notifications.send({
    userIds: uniqueUserIds,
    title: payload.title,
    body: payload.body,
    data: {
      href: payload.href ?? '/app/notificaciones',
      title: payload.title,
      body: payload.body,
      type: payload.type ?? 'admin',
      id: `${payload.type ?? 'notification'}-${Date.now()}`,
    },
  })

  return { sent: error ? 0 : uniqueUserIds.length, error: error?.message ?? null }
}

export async function notifyMatchingHousingAlerts(hospedaje: Record<string, unknown>, reason: 'new' | 'available_again' = 'new') {
  const alerts = await db.from('user_alerts').eq('enabled', true).find().catch(() => []) as any[]
  const matches = alerts.filter((alert) => matchesHousingAlert(alert, hospedaje))
  const userIds = matches.map((alert) => alert.userId).filter(Boolean)
  const price = hospedaje.price ? ` desde ${hospedaje.price}` : ''
  const title = reason === 'available_again'
    ? 'Un hospedaje volvió a estar disponible'
    : 'Nuevo hospedaje que coincide con tu alerta'
  const body = `${hospedaje.name ?? 'Hay una opción para revisar'}${price}. Revisalo antes de contactar.`
  const result = await sendPushToUsers(userIds, {
    title,
    body,
    href: '/app/hospedajes',
    type: reason === 'available_again' ? 'housing_available_again' : 'housing_alert',
  })

  await Promise.all(matches.map(async (alert) => {
    try {
      await db.from('user_alerts').eq('id', alert.id).merge({ lastTriggeredAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    } catch {}
  }))

  return { matched: matches.length, sent: result.sent, error: result.error }
}

// ─── Reports ──────────────────────────────────────────────────

export async function deleteReport(reportId: string) {
  await db.from('muro_reports').delete(reportId)
}

export async function hidePost(postId: string, reportId: string) {
  await db.from('muro').eq('id', postId).merge({ hidden: true })
  await deleteReport(reportId)
}

export async function banUser(userId: string, reportId: string) {
  const profile = await db.from('profiles').findOne({ userId })
  if (profile) {
    await db.from('profiles').eq('id', profile.id).merge({ banned: true })
  }
  await deleteReport(reportId)
}

// ─── Hospedajes ───────────────────────────────────────────────

export async function createHospedaje(data: Record<string, unknown>) {
  const { __assignToCurrentOwner, ...payload } = data
  const result = await db.from('hospedajes').insert(payload)
  const hospedaje = result?.data ?? payload
  if (__assignToCurrentOwner) {
    const ownerId = await currentUserIdOrNull()
    if (ownerId) await upsertOwnerListingForHospedaje(hospedaje, ownerId)
  }
  notifyMatchingHousingAlerts(hospedaje).catch((error) => {
    console.error('[notifyMatchingHousingAlerts]', error)
  })
  return result
}

export async function updateHospedaje(id: string, data: Record<string, unknown>) {
  const before = await db.from('hospedajes').findOne({ id }).catch(() => null)
  const result = await db.from('hospedajes').eq('id', id).merge(data)
  const nextStatus = String(data.availabilityStatus ?? before?.availabilityStatus ?? '')
  const prevStatus = String(before?.availabilityStatus ?? 'available')
  if (prevStatus === 'occupied' && nextStatus !== 'occupied') {
    notifyMatchingHousingAlerts({ ...(before ?? {}), ...data, id }, 'available_again').catch((error) => {
      console.error('[notifyAvailableAgain]', error)
    })
  }
  return result
}

export async function assignHospedajeToCurrentOwner(id: string) {
  const ownerId = await currentUserIdOrNull()
  if (!ownerId) return { data: null, error: { message: 'No se pudo identificar el usuario' } }
  const hospedaje = await db.from('hospedajes').findOne({ id })
  if (!hospedaje) return { data: null, error: { message: 'No existe el hospedaje' } }
  return upsertOwnerListingForHospedaje(hospedaje, ownerId)
}

export async function deleteHospedaje(id: string) {
  await db.from('hospedajes').delete(id)
}

// ─── Comercios ────────────────────────────────────────────────

export async function createComercio(data: Record<string, unknown>) {
  return db.from('comercios').insert(data)
}

export async function updateComercio(id: string, data: Record<string, unknown>) {
  return db.from('comercios').eq('id', id).merge(data)
}

export async function deleteComercio(id: string) {
  await db.from('comercios').delete(id)
}

// ─── Remises ──────────────────────────────────────────────────

export async function createRemis(data: Record<string, unknown>) {
  return db.from('remises').insert(data)
}

export async function updateRemis(id: string, data: Record<string, unknown>) {
  return db.from('remises').eq('id', id).merge(data)
}

export async function deleteRemis(id: string) {
  await db.from('remises').delete(id)
}

export async function setRemisDestacado(id: string, allIds: string[]) {
  // Set all to false first (in parallel)
  await Promise.all(
    allIds
      .filter(aid => aid !== id)
      .map(aid => db.from('remises').eq('id', aid).merge({ destacado: false }))
  )
  // Then set the chosen one to true
  return db.from('remises').eq('id', id).merge({ destacado: true })
}

// ─── Featured Businesses ─────────────────────────────────────

export async function createFeatured(data: Record<string, unknown>) {
  return db.from('featured_businesses').insert(data)
}

export async function updateFeatured(id: string, data: Record<string, unknown>) {
  return db.from('featured_businesses').eq('id', id).merge(data)
}

export async function deleteFeatured(id: string) {
  return db.from('featured_businesses').delete(id)
}

// ─── Notifications ───────────────────────────────────────────

export async function sendAdminNotification(payload: {
  audience: NotificationAudience
  title: string
  body: string
  href?: string
  type?: string
}) {
  const title = payload.title.trim()
  const body = payload.body.trim()
  if (!title || !body) return { sent: 0, error: 'Faltan título o mensaje' }

  const userIds = await resolveAudienceUserIds(payload.audience)
  return sendPushToUsers(userIds, {
    title,
    body,
    href: payload.href,
    type: payload.type ?? 'admin',
  })
}
