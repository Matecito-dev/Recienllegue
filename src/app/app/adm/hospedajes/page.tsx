'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import {
  createHospedaje,
  updateHospedaje,
  deleteHospedaje,
} from '@/app/actions/admin'
import { publicDb as db } from '@/lib/db'

// ─── Types ────────────────────────────────────────────────────

interface HospedajeRecord {
  id: string
  data: {
    name: string
    type: string
    address: string
    price: string
    priceMax: string
    capacity: string
    phone: string
    description: string
    isVerified: boolean
  }
}

const EMPTY_FORM = {
  name: '',
  type: 'Pension',
  address: '',
  price: '',
  priceMax: '',
  capacity: '',
  phone: '',
  description: '',
  isVerified: false,
}

const TYPES = ['Pension', 'Departamento', 'Casa de familia', 'Habitacion']

// ─── Input helpers ────────────────────────────────────────────

const inputStyle = {
  background: 'rgba(22,56,50,0.04)',
  border: '1px solid rgba(22,56,50,0.1)',
  color: '#051f20',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5"
        style={{ color: 'rgba(22,56,50,0.5)' }}>
        {label}
      </p>
      {children}
    </div>
  )
}

// ─── Form ─────────────────────────────────────────────────────

function HospedajeForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
}: {
  initial: typeof EMPTY_FORM
  onSubmit: (data: typeof EMPTY_FORM) => void
  onCancel: () => void
  submitting: boolean
}) {
  const [form, setForm] = useState(initial)
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div
      className="rounded-2xl p-6 mb-6"
      style={{ background: '#fff', border: '1px solid rgba(22,56,50,0.1)' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field label="Nombre">
          <input
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Ej: Pension San Martin"
          />
        </Field>
        <Field label="Tipo">
          <select
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
            value={form.type}
            onChange={e => set('type', e.target.value)}
          >
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Direccion">
          <input
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
            value={form.address}
            onChange={e => set('address', e.target.value)}
            placeholder="Av. San Martin 1240"
          />
        </Field>
        <Field label="Capacidad">
          <input
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
            value={form.capacity}
            onChange={e => set('capacity', e.target.value)}
            placeholder="1–2 personas"
          />
        </Field>
        <Field label="Precio minimo">
          <input
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
            value={form.price}
            onChange={e => set('price', e.target.value)}
            placeholder="$80.000"
          />
        </Field>
        <Field label="Precio maximo">
          <input
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
            value={form.priceMax}
            onChange={e => set('priceMax', e.target.value)}
            placeholder="$120.000"
          />
        </Field>
        <Field label="Telefono">
          <input
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
            placeholder="(02477) 43-0000"
          />
        </Field>
      </div>

      <Field label="Descripcion (opcional)">
        <textarea
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none mb-4"
          style={inputStyle}
          rows={3}
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Detalles adicionales..."
        />
      </Field>

      <label className="flex items-center gap-2.5 cursor-pointer mb-5">
        <input
          type="checkbox"
          checked={form.isVerified}
          onChange={e => set('isVerified', e.target.checked)}
          className="w-4 h-4 accent-[#163832]"
        />
        <span className="text-sm font-medium" style={{ color: '#051f20' }}>
          Verificado
        </span>
      </label>

      <div className="flex gap-2">
        <button
          onClick={() => onSubmit(form)}
          disabled={submitting || !form.name.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40"
          style={{ background: '#163832', color: '#daf1de' }}
        >
          <Check size={14} />
          {submitting ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
          style={{ background: 'rgba(22,56,50,0.06)', color: '#163832' }}
        >
          <X size={14} />
          Cancelar
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export default function AdminHospedajesPage() {
  const [records, setRecords] = useState<HospedajeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId]   = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    db.from('hospedajes').latest().limit(50).find()
      .then((records: any) => setRecords(records as any))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (form: typeof EMPTY_FORM) => {
    setSubmitting(true)
    const res = await createHospedaje(form)
    if (res.data) {
      setRecords(prev => [res.data, ...prev])
      setShowAdd(false)
    }
    setSubmitting(false)
  }

  const handleUpdate = async (id: string, form: typeof EMPTY_FORM) => {
    setSubmitting(true)
    const res = await updateHospedaje(id, form)
    if (res.data) {
      setRecords(prev => prev.map(r => r.id === id ? res.data : r))
      setEditId(null)
    }
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar este hospedaje?')) return
    await deleteHospedaje(id)
    setRecords(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="px-4 lg:px-8 py-8 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-1" style={{ color: '#051f20' }}>
            Hospedajes
          </h1>
          <p className="text-sm" style={{ color: 'rgba(22,56,50,0.45)' }}>
            {records.length} registros
          </p>
        </div>
        {!showAdd && (
          <button
            onClick={() => { setShowAdd(true); setEditId(null) }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ background: '#163832', color: '#daf1de' }}
          >
            <Plus size={14} />
            Agregar
          </button>
        )}
      </div>

      {/* Add form */}
      {showAdd && (
        <HospedajeForm
          initial={EMPTY_FORM}
          onSubmit={handleCreate}
          onCancel={() => setShowAdd(false)}
          submitting={submitting}
        />
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-2xl h-20 animate-pulse"
              style={{ background: 'rgba(22,56,50,0.05)' }} />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: '#fff', border: '1px solid rgba(22,56,50,0.08)' }}
        >
          <p className="text-sm font-medium" style={{ color: 'rgba(22,56,50,0.4)' }}>
            No hay hospedajes cargados todavia.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map(r => (
            <div key={r.id}>
              {editId === r.id ? (
                <HospedajeForm
                  initial={{
                    name: r.data.name ?? '',
                    type: r.data.type ?? 'Pension',
                    address: r.data.address ?? '',
                    price: r.data.price ?? '',
                    priceMax: r.data.priceMax ?? '',
                    capacity: r.data.capacity ?? '',
                    phone: r.data.phone ?? '',
                    description: r.data.description ?? '',
                    isVerified: r.data.isVerified ?? false,
                  }}
                  onSubmit={form => handleUpdate(r.id, form)}
                  onCancel={() => setEditId(null)}
                  submitting={submitting}
                />
              ) : (
                <div
                  className="rounded-2xl px-5 py-4 flex items-center gap-4"
                  style={{ background: '#fff', border: '1px solid rgba(22,56,50,0.08)' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-extrabold text-sm" style={{ color: '#051f20' }}>
                        {r.data.name}
                      </p>
                      {r.data.isVerified && (
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ background: '#daf1de', color: '#163832' }}
                        >
                          Verificado
                        </span>
                      )}
                    </div>
                    <p className="text-[11px]" style={{ color: 'rgba(22,56,50,0.45)' }}>
                      {r.data.type} — {r.data.address}
                    </p>
                    <p className="text-[11px] font-semibold mt-0.5" style={{ color: '#163832' }}>
                      {r.data.price}{r.data.priceMax ? ` – ${r.data.priceMax}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => { setEditId(r.id); setShowAdd(false) }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-70"
                      style={{ background: 'rgba(22,56,50,0.06)', color: '#163832' }}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-70"
                      style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
