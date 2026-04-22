'use client'

import { useEffect, useMemo, useState } from 'react'
import { BadgeCheck, Check, Clock3, FileText, Store, X } from 'lucide-react'
import {
  approveOwnerChangeRequest,
  approveOwnerClaim,
  approveOwnerListing,
  rejectOwnerChangeRequest,
  rejectOwnerClaim,
  rejectOwnerListing,
} from '@/app/actions/owner'
import { getUserDb, publicDb } from '@/lib/db'

type Row = Record<string, any>
type Tab = 'listings' | 'claims' | 'changes'

function getToken() {
  if (typeof document === 'undefined') return ''
  const entry = document.cookie.split('; ').find((row) => row.startsWith('mb_token_pub='))
  return entry ? entry.split('=').slice(1).join('=') : ''
}

function Status({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: '#FEF3C7', color: '#92400e' }}>
      <Clock3 size={10} /> {status || 'pending'}
    </span>
  )
}

function Detail({ label, value }: { label: string; value: unknown }) {
  if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) return null
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted-soft)' }}>{label}</p>
      <p className="text-sm break-words" style={{ color: 'var(--text-primary)' }}>{Array.isArray(value) ? value.join(', ') : String(value)}</p>
    </div>
  )
}

function ReviewCard({
  row,
  type,
  onApprove,
  onReject,
  busy,
}: {
  row: Row
  type: Tab
  onApprove: () => void
  onReject: () => void
  busy: boolean
}) {
  const title = row.name ?? row.businessName ?? `${row.sourceCollection} ${row.sourceRecordId}`
  const changes = row.changes && typeof row.changes === 'object' ? row.changes : null
  const [currentRecord, setCurrentRecord] = useState<Row | null>(null)

  useEffect(() => {
    if (type !== 'changes' || !row.sourceCollection || !row.sourceRecordId) return
    publicDb.from(row.sourceCollection).findOne({ id: row.sourceRecordId })
      .then((record: any) => setCurrentRecord(record ?? null))
      .catch(() => setCurrentRecord(null))
  }, [row.sourceCollection, row.sourceRecordId, type])

  return (
    <article className="app-card p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: 'var(--text-muted-soft)' }}>
            {type === 'listings' ? row.kind : row.sourceCollection}
          </p>
          <h2 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Owner: {row.ownerId}</p>
        </div>
        <Status status={row.status} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Detail label="Categoria / tipo" value={row.category ?? row.type} />
        <Detail label="Direccion" value={row.address} />
        <Detail label="Telefono" value={row.phone ?? row.contactPhone} />
        <Detail label="WhatsApp" value={row.whatsapp} />
        <Detail label="Email" value={row.contactEmail} />
        <Detail label="Precio" value={[row.price, row.priceMax].filter(Boolean).join(' - ')} />
        <Detail label="Prueba" value={row.evidenceText} />
        <Detail label="Notas" value={row.notes ?? row.reason} />
      </div>

      {changes && (
        <div className="rounded-2xl p-4" style={{ background: 'var(--surface-soft)' }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] mb-3" style={{ color: 'var(--text-muted-soft)' }}>Antes / después</p>
          <div className="space-y-2">
            {Object.entries(changes).filter(([_, value]) => value !== '' && value != null && (!Array.isArray(value) || value.length > 0)).map(([key, value]) => (
              <div key={key} className="grid sm:grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)] gap-2 rounded-2xl p-3" style={{ background: '#fff' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted-soft)' }}>{key}</p>
                <div>
                  <p className="text-[10px] font-bold mb-1" style={{ color: 'var(--text-muted-soft)' }}>Actual</p>
                  <p className="text-xs break-words" style={{ color: 'var(--text-muted)' }}>{Array.isArray(currentRecord?.[key]) ? currentRecord?.[key].join(', ') : String(currentRecord?.[key] ?? 'Sin dato')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold mb-1" style={{ color: '#166534' }}>Nuevo</p>
                  <p className="text-xs break-words font-semibold" style={{ color: 'var(--text-primary)' }}>{Array.isArray(value) ? value.join(', ') : String(value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={onApprove} disabled={busy} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold disabled:opacity-40" style={{ background: '#0F172A', color: '#F59E0B' }}>
          <Check size={15} /> Aprobar
        </button>
        <button onClick={onReject} disabled={busy} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold disabled:opacity-40" style={{ background: '#FEE2E2', color: '#991B1B' }}>
          <X size={15} /> Rechazar
        </button>
      </div>
    </article>
  )
}

export default function AdminPropietariosPage() {
  const [tab, setTab] = useState<Tab>('listings')
  const [listings, setListings] = useState<Row[]>([])
  const [claims, setClaims] = useState<Row[]>([])
  const [changes, setChanges] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState('')
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    const db = getUserDb(token)
    setLoading(true)
    Promise.all([
      db.from('owner_listings').eq('status', 'pending').latest().limit(100).find().catch(() => []),
      db.from('owner_claims').eq('status', 'pending').latest().limit(100).find().catch(() => []),
      db.from('owner_change_requests').eq('status', 'pending').latest().limit(100).find().catch(() => []),
    ]).then(([a, b, c]: any[]) => {
      setListings(a ?? [])
      setClaims(b ?? [])
      setChanges(c ?? [])
    }).finally(() => setLoading(false))
  }, [refresh])

  const current = useMemo(() => {
    if (tab === 'claims') return claims
    if (tab === 'changes') return changes
    return listings
  }, [tab, listings, claims, changes])

  const approve = async (row: Row) => {
    setBusyId(row.id)
    try {
      if (tab === 'claims') await approveOwnerClaim(row.id)
      else if (tab === 'changes') await approveOwnerChangeRequest(row.id)
      else await approveOwnerListing(row.id)
      setRefresh((v) => v + 1)
    } finally {
      setBusyId('')
    }
  }

  const reject = async (row: Row) => {
    const notes = window.prompt('Motivo para el propietario (opcional):') ?? ''
    setBusyId(row.id)
    try {
      if (tab === 'claims') await rejectOwnerClaim(row.id, notes)
      else if (tab === 'changes') await rejectOwnerChangeRequest(row.id, notes)
      else await rejectOwnerListing(row.id, notes)
      setRefresh((v) => v + 1)
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="px-4 lg:px-8 py-8 max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight mb-1" style={{ color: '#0F172A' }}>Propietarios</h1>
        <p className="text-sm" style={{ color: 'rgba(15,23,42,0.45)' }}>Aprobá publicaciones, reclamos de comercios y cambios solicitados.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { id: 'listings', label: 'Publicaciones', value: listings.length, Icon: Store },
          { id: 'claims', label: 'Reclamos', value: claims.length, Icon: BadgeCheck },
          { id: 'changes', label: 'Cambios', value: changes.length, Icon: FileText },
        ].map(({ id, label, value, Icon }) => (
          <button key={id} onClick={() => setTab(id as Tab)} className="app-card p-4 text-left flex items-center gap-3" style={{ outline: tab === id ? '2px solid #0F172A' : 'none' }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}><Icon size={18} /></div>
            <div><p className="text-xl font-black" style={{ color: 'var(--accent)' }}>{value}</p><p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{label}</p></div>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="app-card p-8 text-sm" style={{ color: 'var(--text-muted)' }}>Cargando solicitudes...</div>
      ) : current.length === 0 ? (
        <div className="app-card p-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No hay pendientes en esta bandeja.</div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {current.map((row) => (
            <ReviewCard key={row.id} row={row} type={tab} busy={busyId === row.id} onApprove={() => approve(row)} onReject={() => reject(row)} />
          ))}
        </div>
      )}
    </div>
  )
}
