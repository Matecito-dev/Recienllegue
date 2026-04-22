'use client'

import { useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { requestFcmToken } from '@/lib/firebase-notifications'
import { onPushInboxChange, unreadPushInboxCount } from '@/lib/push-inbox'
import NotificationsPanel from './NotificationsPanel'

function getAuthToken() {
  const entry = document.cookie.split('; ').find((row) => row.startsWith('mb_token_pub='))
  return entry ? decodeURIComponent(entry.split('=').slice(1).join('=')) : null
}

export default function NotificationBell() {
  const { user } = useUser()
  const [count, setCount] = useState(0)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [savingPush, setSavingPush] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    let active = true
    const load = () => {
      unreadPushInboxCount()
        .then((nextCount) => {
          if (active) setCount(nextCount)
        })
        .catch(() => {
          if (active) setCount(0)
        })
    }
    load()
    const off = onPushInboxChange(load)
    const interval = window.setInterval(load, 15000)
    return () => {
      active = false
      off()
      window.clearInterval(interval)
    }
  }, [user?.id])

  useEffect(() => {
    if ('Notification' in window) setPermission(Notification.permission)
  }, [])

  const enablePush = async () => {
    if (!user?.id || savingPush) return
    const authToken = getAuthToken()
    if (!authToken) return

    setSavingPush(true)
    const fcmToken = await requestFcmToken(user.id, authToken)
    if ('Notification' in window) setPermission(Notification.permission)
    setSavingPush(false)

    if (!fcmToken && Notification.permission === 'denied') {
      window.location.href = '/app/notificaciones'
    }
  }

  const canAskForPush = user?.id && permission === 'default'
  const commonClassName = 'relative flex items-center justify-center w-9 h-9 rounded-xl transition-all'
  const commonStyle = {
    background: canAskForPush ? '#F59E0B' : 'rgba(15,23,42,0.06)',
    color: canAskForPush ? '#0F172A' : 'rgba(15,23,42,0.55)',
  }

  const badge = count > 0 ? (
    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-[9px] font-black flex items-center justify-center"
      style={{ background: canAskForPush ? '#0F172A' : '#F59E0B', color: canAskForPush ? '#F59E0B' : '#0F172A' }}>
      {count > 9 ? '9+' : count}
    </span>
  ) : null

  const modal = open ? (
    <div className="hidden lg:block fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Cerrar notificaciones"
        className="absolute inset-0 cursor-default"
        style={{ background: 'rgba(15,23,42,0.18)' }}
        onClick={() => setOpen(false)}
      />
      <section
        className="absolute right-6 top-16 w-[420px] max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-[24px] p-5 shadow-2xl"
        style={{ background: '#F8FAFC', border: '1px solid rgba(15,23,42,0.10)' }}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(15,23,42,0.06)', color: '#0F172A' }}
          aria-label="Cerrar"
        >
          <X size={15} />
        </button>
        <NotificationsPanel compact />
      </section>
    </div>
  ) : null

  if (canAskForPush) {
    return (
      <>
      <button
        type="button"
        onClick={enablePush}
        disabled={savingPush}
        className={commonClassName}
        style={commonStyle}
        aria-label="Activar notificaciones push"
        title="Activar notificaciones push"
      >
        <Bell size={15} />
        {badge}
      </button>
      {modal}
      </>
    )
  }

  return (
    <>
    <button
      type="button"
      onClick={() => {
        if (window.matchMedia('(min-width: 1024px)').matches) {
          setOpen(true)
        } else {
          window.location.href = '/app/notificaciones'
        }
      }}
      className={commonClassName}
      style={commonStyle}
      aria-label="Notificaciones"
      title={permission === 'granted' ? 'Notificaciones activas' : 'Notificaciones'}
    >
      <Bell size={15} />
      {badge}
    </button>
    {modal}
    </>
  )
}
