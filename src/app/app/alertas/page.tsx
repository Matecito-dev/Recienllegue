'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, Home, Plus, Trash2 } from 'lucide-react'
import { getUserDb, publicDb } from '@/lib/db'
import { useUser } from '@/hooks/useUser'
import { generateId } from '@/lib/uuid'
import { requestFcmToken } from '@/lib/firebase-notifications'

interface AlertRecord {
  id: string
  userId: string
  type: string
  enabled: boolean
  housingType?: string
  maxPrice?: number
  zones?: string[]
  keywords?: string[]
  frequency?: string
}

const HOUSING_TYPES = ['Habitacion', 'Pension', 'Departamento', 'Casa de familia']
const ZONES = ['Monteagudo', 'Centro', 'Terminal', 'Acevedo', 'Trocha', 'Belgrano']

export default function AlertasPage() {
  const { user, loading } = useUser()
  const [token, setToken] = useState<string | null>(null)
  const [alerts, setAlerts] = useState<AlertRecord[]>([])
  const [housingType, setHousingType] = useState('Habitacion')
  const [maxPrice, setMaxPrice] = useState('')
  const [zone, setZone] = useState('Monteagudo')
  const [keywords, setKeywords] = useState('')
  const [saving, setSaving] = useState(false)
  const [pushStatus, setPushStatus] = useState<'idle' | 'saving' | 'enabled' | 'blocked'>('idle')

  useEffect(() => {
    const entry = document.cookie.split('; ').find((row) => row.startsWith('mb_token_pub='))
    setToken(entry ? decodeURIComponent(entry.split('=').slice(1).join('=')) : null)
  }, [])

  const loadAlerts = () => {
    if (!user?.id) return
    publicDb.from('user_alerts').eq('userId', user.id).find()
      .then((rows: any[]) => setAlerts(rows ?? []))
      .catch(() => setAlerts([]))
  }

  useEffect(loadAlerts, [user?.id])

  const createAlert = async () => {
    if (!user?.id || !token) return
    setSaving(true)
    const now = new Date().toISOString()
    const userDb = getUserDb(token)
    await userDb.from('user_alerts').insert({
      id: generateId(),
      userId: user.id,
      type: 'housing',
      enabled: true,
      housingType,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      zones: [zone],
      keywords: keywords.split(',').map((item) => item.trim()).filter(Boolean),
      frequency: 'instant',
      createdAt: now,
      updatedAt: now,
    }).catch(() => {})
    setSaving(false)
    setMaxPrice('')
    setKeywords('')
    loadAlerts()
  }

  const toggleAlert = async (alert: AlertRecord) => {
    if (!token) return
    try {
      await getUserDb(token).from('user_alerts').eq('id', alert.id).merge({ enabled: !alert.enabled, updatedAt: new Date().toISOString() })
    } catch {}
    loadAlerts()
  }

  const deleteAlert = async (alert: AlertRecord) => {
    if (!token) return
    try {
      await getUserDb(token).from('user_alerts').delete(alert.id)
    } catch {}
    loadAlerts()
  }

  const enablePush = async () => {
    if (!user?.id || !token) return
    setPushStatus('saving')
    const fcmToken = await requestFcmToken(user.id, token)
    setPushStatus(fcmToken ? 'enabled' : 'blocked')
  }

  if (!loading && !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Necesitás iniciar sesión para crear alertas.</p>
        <a href="/login" className="inline-flex mt-4 px-5 py-3 rounded-xl text-sm font-bold" style={{ background: '#0F172A', color: '#F59E0B' }}>Ingresar</a>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 sm:py-8 space-y-6 pb-28 lg:pb-8">
      <section className="rounded-[28px] p-6 sm:p-8" style={{ background: '#0F172A' }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: '#CBD5E1' }}>Alertas personalizadas</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: '#E2E8F0' }}>Avisame si aparece algo que encaja</h1>
        <p className="text-sm sm:text-base mt-2 max-w-2xl" style={{ color: '#94A3B8' }}>
          Creá alertas de hospedaje por tipo, zona y presupuesto. Por ahora quedan guardadas en la app y preparadas para notificaciones.
        </p>
      </section>

      <section className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-5 items-start">
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="app-card px-5 py-12 text-center">
              <Bell size={22} className="mx-auto mb-3" style={{ color: '#F59E0B' }} />
              <p className="text-sm font-bold" style={{ color: '#0F172A' }}>Todavía no tenés alertas</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Creá una para recordar qué estás buscando.</p>
            </div>
          ) : alerts.map((alert) => (
            <article key={alert.id} className="app-card p-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#E2E8F0', color: '#0F172A' }}>
                  <Home size={16} />
                </div>
                <div>
                  <p className="text-sm font-extrabold" style={{ color: '#0F172A' }}>{alert.housingType ?? 'Hospedaje'} hasta {alert.maxPrice ? `$${Number(alert.maxPrice).toLocaleString('es-AR')}` : 'presupuesto abierto'}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {(alert.zones ?? []).join(', ') || 'Cualquier zona'} · {alert.enabled ? 'Activa' : 'Pausada'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => toggleAlert(alert)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#E2E8F0', color: '#0F172A' }}>
                  {alert.enabled ? <BellOff size={14} /> : <Bell size={14} />}
                </button>
                <button onClick={() => deleteAlert(alert)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#fee2e2', color: '#dc2626' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="app-card p-5 space-y-4 sticky top-20">
          <div>
            <p className="app-section-kicker mb-1">Nueva alerta</p>
            <h2 className="app-section-title text-xl">Hospedaje</h2>
          </div>
          <label className="block text-xs font-bold" style={{ color: '#0F172A' }}>Tipo</label>
          <select value={housingType} onChange={(e) => setHousingType(e.target.value)} className="w-full px-4 py-3 rounded-2xl text-sm outline-none" style={{ background: '#E2E8F0' }}>
            {HOUSING_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <label className="block text-xs font-bold" style={{ color: '#0F172A' }}>Presupuesto máximo</label>
          <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} inputMode="numeric" placeholder="Ej: 250000" className="w-full px-4 py-3 rounded-2xl text-sm outline-none" style={{ background: '#E2E8F0' }} />
          <label className="block text-xs font-bold" style={{ color: '#0F172A' }}>Zona</label>
          <select value={zone} onChange={(e) => setZone(e.target.value)} className="w-full px-4 py-3 rounded-2xl text-sm outline-none" style={{ background: '#E2E8F0' }}>
            {ZONES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <label className="block text-xs font-bold" style={{ color: '#0F172A' }}>Palabras clave</label>
          <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="wifi, amueblado, mascota" className="w-full px-4 py-3 rounded-2xl text-sm outline-none" style={{ background: '#E2E8F0' }} />
          <button onClick={createAlert} disabled={saving} className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold disabled:opacity-50" style={{ background: '#0F172A', color: '#F59E0B' }}>
            <Plus size={15} /> {saving ? 'Guardando...' : 'Crear alerta'}
          </button>
          <button onClick={enablePush} disabled={pushStatus === 'saving'} className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold disabled:opacity-50" style={{ background: '#F59E0B', color: '#0F172A' }}>
            <Bell size={15} /> {pushStatus === 'saving' ? 'Activando...' : pushStatus === 'enabled' ? 'Notificaciones activas' : 'Activar notificaciones push'}
          </button>
          {pushStatus === 'blocked' ? (
            <p className="text-xs font-semibold" style={{ color: '#dc2626' }}>No se pudo activar. Revisá el permiso de notificaciones del navegador.</p>
          ) : null}
        </aside>
      </section>
    </div>
  )
}
