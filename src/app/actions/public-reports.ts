'use server'

import { serverDb } from '@/lib/db-server'

function clean(value: unknown) {
  return String(value ?? '').trim()
}

export async function reportListingIssue(input: Record<string, unknown>) {
  const collection = clean(input.collection)
  const recordId = clean(input.recordId)
  const reason = clean(input.reason)
  const detail = clean(input.detail)
  const contact = clean(input.contact)

  if (!recordId || !reason) return { ok: false, error: 'Faltan datos para enviar el reporte' }

  const payload = {
    collection,
    recordId,
    reason,
    detail,
    contact,
    status: 'pending',
    source: 'public_listing',
    createdAt: new Date().toISOString(),
  }

  try {
    const result = await serverDb.from('reports').insert(payload)
    return { ok: true, data: result?.data ?? null }
  } catch {
    const result = await serverDb.from('muro_reports').insert({
      postId: recordId,
      userId: contact || 'public',
      reason: `${collection}: ${reason}${detail ? ` - ${detail}` : ''}`,
      createdAt: new Date().toISOString(),
    }).catch(() => null)
    return result ? { ok: true, data: null } : { ok: false, error: 'No se pudo enviar el reporte' }
  }
}
