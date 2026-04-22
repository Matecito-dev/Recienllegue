'use client'

import { useEffect, useMemo, useState } from 'react'
import { BedDouble, Heart, MessageCircle, Phone, ShoppingBag, Trash2 } from 'lucide-react'
import { publicDb } from '@/lib/db'
import { useUser } from '@/hooks/useUser'
import { deleteSavedItem, loadSavedItems, upsertSavedItem, type SavedItem } from '@/lib/user-saved-items'

type Listing = {
  id: string
  name?: string
  type?: string
  category?: string
  address?: string
  phone?: string
  price?: string
  priceMax?: string
  availabilityStatus?: string
}

const STATUS_LABELS: Record<NonNullable<SavedItem['status']>, string> = {
  saved: 'Guardado',
  contacted: 'Contacté',
  replied: 'Me respondió',
  discarded: 'Descartado',
}

const STATUS_OPTIONS = Object.entries(STATUS_LABELS) as [NonNullable<SavedItem['status']>, string][]

export default function FavoritosPage() {
  const { user, loading } = useUser()
  const [items, setItems] = useState<SavedItem[]>([])
  const [listings, setListings] = useState<Record<string, Listing>>({})
  const [tab, setTab] = useState<'todos' | 'hospedaje' | 'comercio'>('todos')
  const [busy, setBusy] = useState(false)

  const refresh = async () => {
    if (!user?.id) return
    setBusy(true)
    const saved = await loadSavedItems(user.id)
    setItems(saved)
    const pairs = await Promise.all(saved.map(async (item) => {
      const collection = item.entityType === 'hospedaje' ? 'hospedajes' : 'comercios'
      const row = await publicDb.from(collection).findOne({ id: item.entityId }).catch(() => null)
      return [item.entityId, row] as const
    }))
    setListings(Object.fromEntries(pairs.filter(([, row]) => row).map(([id, row]) => [id, row as Listing])))
    setBusy(false)
  }

  useEffect(() => {
    void refresh()
  }, [user?.id])

  const filtered = useMemo(() => {
    if (tab === 'todos') return items
    return items.filter((item) => item.entityType === tab)
  }, [items, tab])

  const updateItem = async (item: SavedItem, patch: Partial<SavedItem>) => {
    if (!user?.id) return
    await upsertSavedItem({
      userId: user.id,
      entityType: item.entityType,
      entityId: item.entityId,
      status: item.status ?? 'saved',
      notes: item.notes ?? '',
      compare: item.compare ?? false,
      ...patch,
    })
    await refresh()
  }

  const removeItem = async (item: SavedItem) => {
    await deleteSavedItem(item.id)
    await refresh()
  }

  if (!loading && !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Necesitás iniciar sesión para guardar favoritos.</p>
        <a href="/login" className="inline-flex mt-4 px-5 py-3 rounded-xl text-sm font-bold" style={{ background: '#0F172A', color: '#fff' }}>Ingresar</a>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 sm:py-8 space-y-6 pb-28 lg:pb-8">
      <section className="rounded-[28px] p-6 sm:p-8" style={{ background: '#0F172A' }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: '#CBD5E1' }}>Mis favoritos</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: '#E2E8F0' }}>Organizá lo que estás evaluando</h1>
        <p className="text-sm sm:text-base mt-2 max-w-2xl" style={{ color: '#94A3B8' }}>
          Guardá hospedajes y comercios, anotá el estado de cada contacto y compará opciones antes de decidir.
        </p>
      </section>

      <section className="app-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[
              ['todos', 'Todo'],
              ['hospedaje', 'Hospedajes'],
              ['comercio', 'Comercios'],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTab(value as typeof tab)}
                className="px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider"
                style={{ background: tab === value ? '#0F172A' : 'var(--surface-soft)', color: tab === value ? '#fff' : 'var(--text-muted)' }}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>{busy ? 'Actualizando...' : `${filtered.length} guardado${filtered.length === 1 ? '' : 's'}`}</span>
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="app-card px-5 py-14 text-center">
          <Heart size={24} className="mx-auto mb-3" style={{ color: 'var(--accent)' }} />
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Todavía no guardaste nada</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <a href="/app/hospedajes" className="px-4 py-3 rounded-xl text-xs font-bold" style={{ background: '#0F172A', color: '#fff' }}>Ver hospedajes</a>
            <a href="/app/comercios" className="px-4 py-3 rounded-xl text-xs font-bold" style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}>Ver comercios</a>
          </div>
        </section>
      ) : (
        <section className="grid lg:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const listing = listings[item.entityId]
            const isHospedaje = item.entityType === 'hospedaje'
            const digits = listing?.phone?.replace(/\D/g, '') ?? ''
            const message = 'Hola, vi tu hospedaje en Recién Llegué. Quería consultar disponibilidad, precio y requisitos.'
            return (
              <article key={item.id} className="app-card p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}>
                    {isHospedaje ? <BedDouble size={18} /> : <ShoppingBag size={18} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted-soft)' }}>
                      {isHospedaje ? listing?.type ?? 'Hospedaje' : listing?.category ?? 'Comercio'}
                    </p>
                    <h2 className="text-lg font-black truncate" style={{ color: 'var(--text-primary)' }}>{listing?.name ?? 'Publicación no disponible'}</h2>
                    {listing?.address && <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{listing.address}</p>}
                    {isHospedaje && listing?.price && <p className="text-sm font-bold mt-2" style={{ color: 'var(--accent)' }}>{listing.price}{listing.priceMax ? ` - ${listing.priceMax}` : ''}</p>}
                  </div>
                  <button onClick={() => removeItem(item)} className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#FEE2E2', color: '#991B1B' }} aria-label="Eliminar favorito">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <select
                    value={item.status ?? 'saved'}
                    onChange={(event) => updateItem(item, { status: event.target.value as SavedItem['status'] })}
                    className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                    style={{ background: 'var(--surface-soft)', color: 'var(--text-primary)' }}
                  >
                    {STATUS_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  {isHospedaje && (
                    <button
                      onClick={() => updateItem(item, { compare: !item.compare })}
                      className="rounded-2xl px-4 py-3 text-sm font-bold"
                      style={{ background: item.compare ? '#0F172A' : 'var(--surface-soft)', color: item.compare ? '#fff' : 'var(--accent)' }}
                    >
                      {item.compare ? 'En comparador' : 'Comparar'}
                    </button>
                  )}
                </div>

                <textarea
                  value={item.notes ?? ''}
                  onChange={(event) => updateItem(item, { notes: event.target.value })}
                  placeholder="Notas personales: requisitos, horarios, si te respondió, dudas pendientes..."
                  className="w-full rounded-2xl px-4 py-3 text-sm outline-none min-h-24 resize-none"
                  style={{ background: 'var(--surface-soft)', color: 'var(--text-primary)' }}
                />

                <div className="flex flex-wrap gap-2">
                  <a href={`/app/${isHospedaje ? 'hospedajes' : 'comercios'}/${item.entityId}`} className="px-4 py-3 rounded-xl text-xs font-bold" style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}>Ver detalle</a>
                  {digits && <a href={`tel:${digits}`} className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold" style={{ background: '#0F172A', color: '#fff' }}><Phone size={13} /> Llamar</a>}
                  {isHospedaje && digits && (
                    <a href={`https://wa.me/${digits.startsWith('54') ? digits : `54${digits}`}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold" style={{ background: '#DCFCE7', color: '#166534' }}>
                      <MessageCircle size={13} /> WhatsApp
                    </a>
                  )}
                </div>
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}
