'use client'

import { getToken, onMessage, type MessagePayload } from 'firebase/messaging'
import { getFirebaseMessaging } from '@/lib/firebase-client'

type FcmRegisterStatus = {
  ok: boolean
  userId: string
  tokenPreview?: string
  error?: { status?: number; message?: string; raw?: unknown }
  updatedAt: string
}

function rememberFcmRegisterStatus(status: FcmRegisterStatus) {
  localStorage.setItem('rl_fcm_register_status', JSON.stringify(status))
  if (status.ok) {
    localStorage.removeItem('rl_fcm_register_error')
  } else if (status.error) {
    localStorage.setItem('rl_fcm_register_error', JSON.stringify(status.error))
  }
}

export async function requestFcmToken(userId: string, authToken: string): Promise<string | null> {
  if (typeof window === 'undefined') return null
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return null

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return null

  return syncFcmToken(userId, authToken)
}

export async function syncFcmToken(userId: string, authToken: string): Promise<string | null> {
  if (typeof window === 'undefined') return null
  if (!userId || !authToken) return null
  if (!('serviceWorker' in navigator)) return null
  if (!('Notification' in window) || Notification.permission !== 'granted') return null

  const messaging = await getFirebaseMessaging()
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
  if (!messaging || !vapidKey) return null

  let fcmToken: string | null = null
  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
    fcmToken = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration })
  } catch {
    return null
  }
  if (!fcmToken) return null

  try {
    const res = await fetch('/api/push/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ token: fcmToken }),
    })
    const body = await res.json().catch(() => ({}))

    if (!res.ok || body?.error) {
      rememberFcmRegisterStatus({
        ok: false,
        userId,
        tokenPreview: `${fcmToken.slice(0, 12)}...${fcmToken.slice(-8)}`,
        error: {
          status: res.status,
          message: body?.error ?? body?.message ?? 'No se pudo registrar FCM en MatecitoDB',
          raw: body,
        },
        updatedAt: new Date().toISOString(),
      })
      return null
    }
    rememberFcmRegisterStatus({
      ok: true,
      userId,
      tokenPreview: `${fcmToken.slice(0, 12)}...${fcmToken.slice(-8)}`,
      updatedAt: new Date().toISOString(),
    })
  } catch {
    rememberFcmRegisterStatus({
      ok: false,
      userId,
      tokenPreview: `${fcmToken.slice(0, 12)}...${fcmToken.slice(-8)}`,
      error: { message: 'Error inesperado al registrar FCM en MatecitoDB' },
      updatedAt: new Date().toISOString(),
    })
    return null
  }

  return fcmToken
}

export async function listenForegroundMessages(handler: (payload: MessagePayload) => void) {
  const messaging = await getFirebaseMessaging()
  if (!messaging) return () => {}
  return onMessage(messaging, handler)
}
