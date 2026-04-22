/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyCSs5ieSQF696XvhJPzL7w4RU1dBuseToU',
  authDomain: 'recienllegue-eb629.firebaseapp.com',
  projectId: 'recienllegue-eb629',
  storageBucket: 'recienllegue-eb629.firebasestorage.app',
  messagingSenderId: '682107304865',
  appId: '1:682107304865:web:919a6e7f93014c974369e0',
  measurementId: 'G-747CVW38V2',
})

const messaging = firebase.messaging()

const DB_NAME = 'recienllegue_push_inbox'
const STORE_NAME = 'notifications'
const MAX_ITEMS = 100
const RETENTION_DAYS = 30

function openInboxDb() {
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

async function saveInboxNotification(payload) {
  const db = await openInboxDb()
  const title = payload.notification?.title || payload.data?.title || 'Recién Llegué'
  const body = payload.notification?.body || payload.data?.body || ''
  const href = payload.data?.href || payload.fcmOptions?.link || '/app/notificaciones'
  const id = payload.data?.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const request = tx.objectStore(STORE_NAME).put({
      id,
      title,
      body,
      href,
      read: false,
      createdAt: new Date().toISOString(),
    })
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
  cleanupInbox().catch(() => {})
}

async function cleanupInbox() {
  const db = await openInboxDb()
  const rows = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const request = tx.objectStore(STORE_NAME).getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
  rows.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
  const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000
  const ids = new Set()
  rows.forEach((item, index) => {
    const time = Date.parse(item.createdAt)
    if (index >= MAX_ITEMS || (Number.isFinite(time) && time < cutoff)) ids.add(item.id)
  })
  if (ids.size === 0) return

  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    ids.forEach((id) => store.delete(id))
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || 'Recién Llegué'
  const body = payload.notification?.body || payload.data?.body || ''
  const url = payload.data?.href || payload.fcmOptions?.link || '/app/notificaciones'

  saveInboxNotification(payload).catch(() => {})

  self.registration.showNotification(title, {
    body,
    icon: '/logo.svg',
    badge: '/logo.svg',
    data: { url },
  })
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = new URL(event.notification?.data?.url || '/app/notificaciones', self.location.origin).href

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client && client.url === targetUrl) return client.focus()
      }
      return clients.openWindow(targetUrl)
    }),
  )
})
