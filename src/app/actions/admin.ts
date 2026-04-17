'use server'

import { serverDb as db } from '@/lib/db-server'

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
  return db.from('hospedajes').insert(data)
}

export async function updateHospedaje(id: string, data: Record<string, unknown>) {
  return db.from('hospedajes').eq('id', id).merge(data)
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
