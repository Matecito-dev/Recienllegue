'use client'

import { useEffect, useState } from 'react'
import { Bell, CheckCircle2, Home, Map, PackageCheck, X } from 'lucide-react'
import { getUserDb, publicDb } from '@/lib/db'
import { generateId } from '@/lib/uuid'
import { useUser } from '@/hooks/useUser'

const STATUS = [
  { value: 'looking', label: 'Estoy buscando', icon: Home, cta: 'Crear alerta', href: '/app/alertas' },
  { value: 'contacted', label: 'Ya contacté', icon: Bell, cta: 'Ver hospedajes', href: '/app/hospedajes' },
  { value: 'reserved', label: 'Reservé', icon: PackageCheck, cta: 'Ver mapa', href: '/app/mapa' },
  { value: 'moved', label: 'Ya me mudé', icon: CheckCircle2, cta: 'Explorar comercios', href: '/app/comercios' },
] as const

type MoveStatus = typeof STATUS[number]['value']

export default function MoveStatusCard() {
  const { user, isLoggedIn } = useUser()
  const [status, setStatus] = useState<MoveStatus>('looking')
  const [recordId, setRecordId] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const entry = document.cookie.split('; ').find((row) => row.startsWith('mb_token_pub='))
    setToken(entry ? decodeURIComponent(entry.split('=').slice(1).join('=')) : null)
    setDismissed(localStorage.getItem('move_status_card_hidden') === 'true')
  }, [])

  useEffect(() => {
    if (!user?.id) return
    publicDb.from('user_onboarding_state').eq('userId', user.id).find()
      .then((rows: any[]) => {
        const current = rows?.[0]
        if (current?.status) {
          setRecordId(current.id)
          setStatus(current.status)
        }
      })
      .catch(() => {})
  }, [user?.id])

  if (!isLoggedIn || !user?.id || dismissed) return null

  const current = STATUS.find((item) => item.value === status) ?? STATUS[0]
  const CurrentIcon = current.icon

  const updateStatus = async (next: MoveStatus) => {
    if (!token || !user?.id) return
    setSaving(true)
    const userDb = getUserDb(token)
    const now = new Date().toISOString()
    const payload = { status: next, updatedAt: now }

    try {
      if (recordId) {
        await userDb.from('user_onboarding_state').eq('id', recordId).merge(payload)
      } else {
        const id = generateId()
        await userDb.from('user_onboarding_state').insert({
          id,
          userId: user.id,
          status: next,
          preferredHousingTypes: [],
          preferredZones: [],
          needsRoommates: false,
          notes: '',
          createdAt: now,
          updatedAt: now,
        })
        setRecordId(id)
      }
      setStatus(next)
    } catch {
    } finally {
      setSaving(false)
    }
  }

  const hideCard = () => {
    localStorage.setItem('move_status_card_hidden', 'true')
    setDismissed(true)
  }

  return (
    <section className="app-card p-5 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#0F172A', color: '#F59E0B' }}>
            <CurrentIcon size={20} />
          </div>
          <div>
            <p className="app-section-kicker mb-1">Mi llegada <span className="normal-case font-semibold opacity-60">opcional</span></p>
            <h2 className="app-section-title text-xl">{current.label}</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Si todavía estás organizando tu llegada, marcá tu etapa para ver acciones útiles. Si ya vivís en Pergamino, podés ocultar esta tarjeta.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <a href={current.href} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all hover:opacity-85"
            style={{ background: '#0F172A', color: '#F59E0B' }}>
            {current.cta}
            <Map size={13} />
          </a>
          <button
            onClick={hideCard}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-75"
            style={{ background: '#E2E8F0', color: '#0F172A' }}
            aria-label="Ocultar mi llegada"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-5">
        {STATUS.map((item) => (
          <button
            key={item.value}
            onClick={() => updateStatus(item.value)}
            disabled={saving}
            className="px-3 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            style={{
              background: status === item.value ? '#0F172A' : '#E2E8F0',
              color: status === item.value ? '#F59E0B' : '#0F172A',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  )
}
