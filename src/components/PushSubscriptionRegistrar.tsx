'use client'

import { useEffect } from 'react'
import { useUser } from '@/hooks/useUser'
import { syncFcmToken } from '@/lib/firebase-notifications'

function getAuthToken() {
  const entry = document.cookie.split('; ').find((row) => row.startsWith('mb_token_pub='))
  return entry ? decodeURIComponent(entry.split('=').slice(1).join('=')) : null
}

export default function PushSubscriptionRegistrar() {
  const { user } = useUser()

  useEffect(() => {
    if (!user?.id) return
    if (!('Notification' in window) || Notification.permission !== 'granted') return

    const authToken = getAuthToken()
    if (!authToken) return

    syncFcmToken(user.id, authToken)
      .then((fcmToken) => {
        if (fcmToken) localStorage.setItem('rl_fcm_token_synced', `${new Date().toISOString()}:${fcmToken}`)
      })
      .catch(() => null)
  }, [user?.id])

  return null
}
