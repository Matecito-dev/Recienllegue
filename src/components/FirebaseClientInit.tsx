'use client'

import { useEffect } from 'react'
import { listenForegroundMessages } from '@/lib/firebase-notifications'
import { savePushInboxItem } from '@/lib/push-inbox'

export default function FirebaseClientInit() {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return undefined
    }

    listenForegroundMessages((payload) => {
      const title = payload.notification?.title ?? payload.data?.title ?? 'Recién Llegué'
      const body = payload.notification?.body ?? payload.data?.body ?? ''
      const href = payload.data?.href ?? '/app/notificaciones'
      savePushInboxItem({
        id: payload.data?.id,
        title,
        body,
        href,
      }).catch(() => null)
      const notification = new Notification(title, { body, icon: '/logo.svg' })
      notification.onclick = () => {
        window.focus()
        window.location.href = href
      }
    }).then((dispose) => {
      unsubscribe = dispose
    }).catch(() => null)

    return () => {
      unsubscribe?.()
    }
  }, [])

  return null
}
