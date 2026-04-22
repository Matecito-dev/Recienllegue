import { getUserDb } from '@/lib/db'

export type SavedItem = {
  id: string
  userId: string
  entityType: 'hospedaje' | 'comercio'
  entityId: string
  status?: 'saved' | 'contacted' | 'replied' | 'discarded'
  notes?: string
  compare?: boolean
}

export function getCookieValue(name: string) {
  if (typeof document === 'undefined') return ''
  const entry = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))
  return entry ? entry.split('=').slice(1).join('=') : ''
}

export async function loadSavedItems(userId: string, entityType?: 'hospedaje' | 'comercio') {
  const token = getCookieValue('mb_token_pub')
  if (!token || !userId) return []
  const db = getUserDb(token)
  let query = db.from('user_saved_items').eq('userId', userId)
  if (entityType) query = query.eq('entityType', entityType)
  return query.latest().limit(200).find().catch(() => []) as Promise<SavedItem[]>
}

export async function upsertSavedItem(input: Omit<SavedItem, 'id'>) {
  const token = getCookieValue('mb_token_pub')
  if (!token) throw new Error('Tenes que iniciar sesion')
  const db = getUserDb(token)
  const existing = await db.from('user_saved_items').findOne({
    userId: input.userId,
    entityType: input.entityType,
    entityId: input.entityId,
  }).catch(() => null)
  const payload = { ...input, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() }
  if (existing?.id) return db.from('user_saved_items').eq('id', existing.id).merge({ ...input, updatedAt: payload.updatedAt })
  return db.from('user_saved_items').insert(payload)
}

export async function deleteSavedItem(id: string) {
  const token = getCookieValue('mb_token_pub')
  if (!token) throw new Error('Tenes que iniciar sesion')
  return getUserDb(token).from('user_saved_items').delete(id)
}
