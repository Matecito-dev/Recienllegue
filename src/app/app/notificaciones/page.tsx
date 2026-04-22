'use client'

import { useUser } from '@/hooks/useUser'
import NotificationsPanel from '@/components/NotificationsPanel'

export default function NotificacionesPage() {
  const { user, loading } = useUser()

  if (!loading && !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Necesitás iniciar sesión para ver notificaciones.</p>
        <a href="/login" className="inline-flex mt-4 px-5 py-3 rounded-xl text-sm font-bold" style={{ background: '#0F172A', color: '#F59E0B' }}>Ingresar</a>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 sm:py-8 pb-28 lg:pb-8">
      <NotificationsPanel />
    </div>
  )
}
