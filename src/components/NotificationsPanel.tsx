'use client'

import { useCallback, useEffect, useState } from 'react'
import { Bell, CheckCheck, ExternalLink, Trash2 } from 'lucide-react'
import {
  cleanupPushInbox,
  deletePushInboxItem,
  deleteReadPushInbox,
  listPushInbox,
  markAllPushInboxRead,
  markPushInboxRead,
  onPushInboxChange,
  type PushInboxItem,
} from '@/lib/push-inbox'

interface NotificationsPanelProps {
  compact?: boolean
}

export default function NotificationsPanel({ compact = false }: NotificationsPanelProps) {
  const [items, setItems] = useState<PushInboxItem[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const load = useCallback(() => {
    cleanupPushInbox().catch(() => null)
    listPushInbox()
      .then(setItems)
      .catch(() => setItems([]))
  }, [])

  useEffect(() => {
    load()
    return onPushInboxChange(load)
  }, [load])

  const markAllRead = async () => {
    await markAllPushInboxRead()
    load()
  }

  const deleteRead = async () => {
    await deleteReadPushInbox()
    load()
  }

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="app-section-kicker mb-1">Centro</p>
          <h1 className={`app-section-title ${compact ? 'text-2xl' : 'text-3xl'}`}>Notificaciones</h1>
        </div>
        <div className="flex items-center gap-2">
          {items.some((item) => item.read) && (
            <button onClick={deleteRead} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold" style={{ background: '#E2E8F0', color: '#0F172A' }}>
              <Trash2 size={13} /> Limpiar
            </button>
          )}
          {items.some((item) => !item.read) && (
            <button onClick={markAllRead} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold" style={{ background: '#0F172A', color: '#F59E0B' }}>
              <CheckCheck size={14} /> Leídas
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="app-card px-5 py-12 text-center">
          <Bell size={24} className="mx-auto mb-3" style={{ color: '#F59E0B' }} />
          <p className="text-sm font-bold" style={{ color: '#0F172A' }}>Sin notificaciones todavía</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Cuando haya respuestas, alertas o novedades importantes, aparecen acá.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="app-card p-5 flex gap-4 cursor-pointer"
              onClick={async () => {
                setExpandedId((current) => current === item.id ? null : item.id)
                if (!item.read) {
                  await markPushInboxRead(item.id).catch(() => {})
                  load()
                }
              }}
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: item.read ? '#E2E8F0' : '#0F172A', color: item.read ? '#0F172A' : '#F59E0B' }}>
                <Bell size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-extrabold" style={{ color: '#0F172A' }}>{item.title}</p>
                  <button
                    type="button"
                    onClick={async (event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      await deletePushInboxItem(item.id)
                      load()
                    }}
                    className="w-8 h-8 -mt-1 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(220,38,38,0.09)', color: '#dc2626' }}
                    aria-label="Eliminar notificación"
                    title="Eliminar"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                {item.body ? (
                  <p className={`${expandedId === item.id ? '' : 'line-clamp-2'} text-xs mt-1 leading-relaxed`} style={{ color: 'var(--text-muted)' }}>
                    {item.body}
                  </p>
                ) : null}
                {expandedId === item.id && item.href && item.href !== '/app/notificaciones' ? (
                  <a
                    href={item.href}
                    onClick={(event) => event.stopPropagation()}
                    className="inline-flex items-center gap-2 mt-3 px-3 py-2 rounded-xl text-xs font-bold"
                    style={{ background: '#E2E8F0', color: '#0F172A', textDecoration: 'none' }}
                  >
                    Abrir detalle <ExternalLink size={12} />
                  </a>
                ) : null}
              </div>
              {!item.read && <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: '#F59E0B' }} />}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
