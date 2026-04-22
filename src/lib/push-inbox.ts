'use client'

export interface PushInboxItem {
  id: string
  title: string
  body: string
  href: string
  read: boolean
  createdAt: string
}

const DB_NAME = 'recienllegue_push_inbox'
const STORE_NAME = 'notifications'
const CHANGE_EVENT = 'rl-push-inbox-changed'
const MAX_ITEMS = 100
const RETENTION_DAYS = 30

function openInboxDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function listPushInbox(): Promise<PushInboxItem[]> {
  const db = await openInboxDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const request = tx.objectStore(STORE_NAME).getAll()
    request.onsuccess = () => {
      const rows = (request.result as PushInboxItem[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      resolve(rows)
    }
    request.onerror = () => reject(request.error)
  })
}

export async function cleanupPushInbox(options: { maxItems?: number; retentionDays?: number } = {}) {
  const maxItems = options.maxItems ?? MAX_ITEMS
  const retentionDays = options.retentionDays ?? RETENTION_DAYS
  const rows = await listPushInbox()
  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000
  const expired = rows.filter((item) => {
    const time = Date.parse(item.createdAt)
    return Number.isFinite(time) && time < cutoff
  })
  const overflow = rows.slice(maxItems)
  const ids = new Set([...expired, ...overflow].map((item) => item.id))
  if (ids.size === 0) return

  const db = await openInboxDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    ids.forEach((id) => store.delete(id))
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export async function unreadPushInboxCount(): Promise<number> {
  const rows = await listPushInbox()
  return rows.filter((item) => !item.read).length
}

export async function savePushInboxItem(item: Omit<PushInboxItem, 'id' | 'read' | 'createdAt'> & Partial<PushInboxItem>) {
  const db = await openInboxDb()
  const record: PushInboxItem = {
    id: item.id ?? crypto.randomUUID(),
    title: item.title,
    body: item.body,
    href: item.href || '/app/notificaciones',
    read: item.read ?? false,
    createdAt: item.createdAt ?? new Date().toISOString(),
  }

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const request = tx.objectStore(STORE_NAME).put(record)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export async function markPushInboxRead(id: string) {
  const db = await openInboxDb()
  const row = await new Promise<PushInboxItem | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const request = tx.objectStore(STORE_NAME).get(id)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  if (!row) return
  await savePushInboxItem({ ...row, read: true })
}

export async function markAllPushInboxRead() {
  const rows = await listPushInbox()
  await Promise.all(rows.filter((item) => !item.read).map((item) => savePushInboxItem({ ...item, read: true })))
}

export async function deletePushInboxItem(id: string) {
  const db = await openInboxDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const request = tx.objectStore(STORE_NAME).delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export async function deleteReadPushInbox() {
  const rows = await listPushInbox()
  const readIds = rows.filter((item) => item.read).map((item) => item.id)
  if (readIds.length === 0) return

  const db = await openInboxDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    readIds.forEach((id) => store.delete(id))
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function onPushInboxChange(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback)
  return () => window.removeEventListener(CHANGE_EVENT, callback)
}
