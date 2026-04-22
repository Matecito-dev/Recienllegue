'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { BadgeCheck, BedDouble, Building2, CheckCircle2, Clock3, ExternalLink, Eye, MessageSquare, Pencil, Plus, Send, Store, X } from 'lucide-react'
import { createOwnerChangeRequest, createOwnerClaim, createOwnerListing, getOwnerMetrics } from '@/app/actions/owner'
import { getUserDb, publicDb } from '@/lib/db'
import { useUser } from '@/hooks/useUser'

const WHATSAPP_BADGE_URL = 'https://wa.me/5491124025239?text=Hola%2C%20quiero%20activar%20el%20badge%20verificado%20para%20mi%20comercio%20en%20Recien%20Llegue'

type OwnerRecord = {
  id: string
  status: string
  name?: string
  businessName?: string
  kind?: string
  category?: string
  type?: string
  address?: string
  phone?: string
  price?: string
  priceMax?: string
  capacity?: string
  description?: string
  images?: string[]
  publishedRecordId?: string
  sourceCollection?: string
  sourceRecordId?: string
  createdAt?: string
  updatedAt?: string
  reviewedAt?: string
  adminNotes?: string
  reason?: string
  changes?: Record<string, unknown>
}

type Comercio = {
  id: string
  name: string
  category?: string
  address?: string
  phone?: string
  description?: string
  images?: string[]
}

type ManagedPlace = {
  id: string
  sourceCollection: 'comercios' | 'hospedajes'
  sourceRecordId: string
  name: string
  category?: string
  type?: string
  address?: string
  phone?: string
  price?: string
  priceMax?: string
  capacity?: string
  description?: string
  images?: string[]
  metrics?: { views: number; contacts: number }
}

type OwnerMessage = {
  id: string
  body: string
  createdBy?: string
  createdAt?: string
  relatedType?: string
}

function getClientToken() {
  if (typeof document === 'undefined') return ''
  const entry = document.cookie.split('; ').find((row) => row.startsWith('mb_token_pub='))
  return entry ? entry.split('=').slice(1).join('=') : ''
}

function compressImage(file: File, maxSize: number, quality: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width)
          width = maxSize
        } else {
          width = Math.round((width * maxSize) / height)
          height = maxSize
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')?.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('No se pudo comprimir la imagen'))
          return
        }
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
      }, 'image/jpeg', quality)
    }
    img.onerror = reject
    img.src = url
  })
}

function dedupePlaces(places: ManagedPlace[]) {
  const seen = new Set<string>()
  return places.filter((place) => {
    const key = `${place.sourceCollection}:${place.sourceRecordId}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const inputStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-[0.16em] mb-1.5" style={{ color: 'var(--text-muted-soft)' }}>
        {label}
      </span>
      {children}
    </label>
  )
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full rounded-2xl px-4 py-3 text-sm outline-none" style={inputStyle} />
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="w-full rounded-2xl px-4 py-3 text-sm outline-none min-h-28 resize-y" style={inputStyle} />
}

function ImageManager({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [showUrlEditor, setShowUrlEditor] = useState(false)
  const imageList = useMemo(() => value.split('\n').map((url) => url.trim()).filter(Boolean), [value])
  const setImages = (images: string[]) => onChange(images.join('\n'))

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const token = getClientToken()
    if (!token) {
      setMessage('Tenes que iniciar sesion para subir imagenes.')
      return
    }
    setUploading(true)
    setMessage('')
    try {
      const userDb = getUserDb(token)
      const uploaded: string[] = []
      for (const file of Array.from(files)) {
        const compressed = await compressImage(file, 900, 0.82)
        const response = await userDb.storage.upload(compressed)
        const url = response.data?.url
        if (url) uploaded.push(url)
      }
      if (uploaded.length > 0) setImages([...imageList, ...uploaded])
    } catch (error: any) {
      setMessage(error?.message ?? 'No se pudieron subir las imagenes.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="block text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted-soft)' }}>Imagenes</span>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 rounded-xl text-[11px] font-bold disabled:opacity-40"
          style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}
        >
          {uploading ? 'Subiendo...' : 'Subir imagenes'}
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => uploadFiles(event.target.files)} />
      {imageList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          {imageList.map((url) => (
            <div key={url} className="relative rounded-2xl overflow-hidden aspect-video" style={{ background: 'var(--surface-soft)' }}>
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImages(imageList.filter((item) => item !== url))}
                className="absolute top-2 right-2 w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(15,23,42,0.82)', color: '#fff' }}
                aria-label="Eliminar imagen"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl p-4 mb-3 text-sm" style={{ background: 'var(--surface-soft)', color: 'var(--text-muted)' }}>
          Todavía no cargaste imágenes.
        </div>
      )}
      <button
        type="button"
        onClick={() => setShowUrlEditor((value) => !value)}
        className="px-3 py-2 rounded-xl text-[11px] font-bold"
        style={{ background: 'var(--surface-soft)', color: 'var(--text-muted)' }}
      >
        {showUrlEditor ? 'Ocultar URLs' : 'Editar URLs manualmente'}
      </button>
      {showUrlEditor && (
        <div className="mt-3">
          <TextArea value={value} onChange={(event) => onChange(event.target.value)} placeholder="Una URL por línea" />
        </div>
      )}
      {message && <p className="text-xs font-medium mt-2" style={{ color: message.includes('No se') ? '#b42318' : 'var(--accent)' }}>{message}</p>}
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pendiente', color: '#92400e', bg: '#FEF3C7' },
    approved: { label: 'Aprobado', color: '#166534', bg: '#DCFCE7' },
    rejected: { label: 'Rechazado', color: '#991B1B', bg: '#FEE2E2' },
    paused: { label: 'Pausado', color: '#475569', bg: '#E2E8F0' },
  }
  const item = config[status] ?? config.pending
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: item.bg, color: item.color }}>
      <Clock3 size={10} /> {item.label}
    </span>
  )
}

function OwnerListingForm({ kind, onDone }: { kind: 'comercio' | 'hospedaje'; onDone: () => void }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    type: '',
    address: '',
    phone: '',
    whatsapp: '',
    price: '',
    priceMax: '',
    capacity: '',
    description: '',
    images: '',
    evidenceText: '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const submit = async () => {
    setSaving(true)
    setMessage('')
    try {
      await createOwnerListing({ ...form, kind })
      setMessage('Enviado. Queda pendiente de aprobacion.')
      setForm({ name: '', category: '', type: '', address: '', phone: '', whatsapp: '', price: '', priceMax: '', capacity: '', description: '', images: '', evidenceText: '' })
      onDone()
    } catch (error: any) {
      setMessage(error?.message ?? 'No se pudo enviar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-card p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}>
          {kind === 'hospedaje' ? <BedDouble size={18} /> : <Store size={18} />}
        </div>
        <div>
          <p className="app-section-kicker mb-0.5">Nueva publicacion</p>
          <h2 className="app-section-title text-lg">{kind === 'hospedaje' ? 'Cargar hospedaje' : 'Cargar comercio'}</h2>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Nombre"><TextInput value={form.name} onChange={(e) => set('name', e.target.value)} placeholder={kind === 'hospedaje' ? 'Habitacion centro' : 'Nombre del comercio'} /></Field>
        {kind === 'hospedaje' ? (
          <Field label="Tipo"><TextInput value={form.type} onChange={(e) => set('type', e.target.value)} placeholder="Habitacion, pension, departamento" /></Field>
        ) : (
          <Field label="Categoria"><TextInput value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Cafeteria, kiosco, restaurante" /></Field>
        )}
        <Field label="Direccion"><TextInput value={form.address} onChange={(e) => set('address', e.target.value)} /></Field>
        <Field label="Telefono"><TextInput value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
        <Field label="WhatsApp"><TextInput value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} /></Field>
        {kind === 'hospedaje' && (
          <>
            <Field label="Precio desde"><TextInput value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="$180.000" /></Field>
            <Field label="Precio hasta"><TextInput value={form.priceMax} onChange={(e) => set('priceMax', e.target.value)} placeholder="Opcional" /></Field>
            <Field label="Capacidad"><TextInput value={form.capacity} onChange={(e) => set('capacity', e.target.value)} placeholder="1 persona, 2 personas" /></Field>
          </>
        )}
      </div>
      <Field label="Descripcion"><TextArea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Contanos lo importante para estudiantes recien llegados." /></Field>
      <ImageManager value={form.images} onChange={(value) => set('images', value)} />
      <Field label="Datos para validar"><TextArea value={form.evidenceText} onChange={(e) => set('evidenceText', e.target.value)} placeholder="Instagram, web, CUIT, foto del frente, o cualquier dato que ayude a confirmar que sos responsable del lugar." /></Field>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={submit} disabled={saving || !form.name.trim()} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold disabled:opacity-40" style={{ background: '#0F172A', color: '#F59E0B' }}>
          <Send size={15} /> {saving ? 'Enviando...' : 'Enviar a revision'}
        </button>
        {message && <p className="text-sm font-medium" style={{ color: message.includes('No se') ? '#b42318' : 'var(--accent)' }}>{message}</p>}
      </div>
    </div>
  )
}

function ClaimForm({ initialId, initialName, onDone }: { initialId: string; initialName: string; onDone: () => void }) {
  const [comercios, setComercios] = useState<Comercio[]>([])
  const [query, setQuery] = useState(initialName)
  const [selected, setSelected] = useState<Comercio | null>(initialId ? { id: initialId, name: initialName } : null)
  const [form, setForm] = useState({ evidenceType: 'whatsapp', evidenceText: '', contactPhone: '', contactEmail: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    publicDb.from('comercios').limit(500).find()
      .then((rows: any) => setComercios(rows ?? []))
      .catch(() => setComercios([]))
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return comercios
      .filter((item) => !q || item.name?.toLowerCase().includes(q) || item.address?.toLowerCase().includes(q))
      .slice(0, 8)
  }, [comercios, query])

  const submit = async () => {
    if (!selected) return
    setSaving(true)
    setMessage('')
    try {
      await createOwnerClaim({
        sourceCollection: 'comercios',
        sourceRecordId: selected.id,
        businessName: selected.name,
        ...form,
      })
      setMessage('Reclamo enviado. Lo revisa el equipo de Recién Llegué.')
      onDone()
    } catch (error: any) {
      setMessage(error?.message ?? 'No se pudo enviar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-card p-5 sm:p-6 space-y-4">
      <div>
        <p className="app-section-kicker mb-1">Reclamar existente</p>
        <h2 className="app-section-title text-lg">¿Tu comercio ya aparece?</h2>
        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
          Es más rápido si compartís datos que prueben que sos dueño o responsable: WhatsApp comercial, Instagram oficial, web, CUIT, foto del frente o comprobante público.
        </p>
      </div>

      <Field label="Buscar comercio"><TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nombre o direccion" /></Field>
      <div className="grid sm:grid-cols-2 gap-2">
        {filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => { setSelected(item); setQuery(item.name) }}
            className="text-left rounded-2xl px-4 py-3 transition-colors"
            style={{ background: selected?.id === item.id ? '#0F172A' : 'var(--surface-soft)', color: selected?.id === item.id ? '#E2E8F0' : 'var(--text-primary)' }}
          >
            <p className="text-sm font-bold">{item.name}</p>
            <p className="text-[11px] opacity-70">{item.address ?? item.category}</p>
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Tipo de prueba">
          <select value={form.evidenceType} onChange={(e) => setForm((p) => ({ ...p, evidenceType: e.target.value }))} className="w-full rounded-2xl px-4 py-3 text-sm outline-none" style={inputStyle}>
            <option value="whatsapp">WhatsApp comercial</option>
            <option value="instagram">Instagram oficial</option>
            <option value="website">Sitio web</option>
            <option value="tax_id">CUIT / razon social</option>
            <option value="storefront_photo">Foto del frente</option>
            <option value="other">Otro</option>
          </select>
        </Field>
        <Field label="Telefono de contacto"><TextInput value={form.contactPhone} onChange={(e) => setForm((p) => ({ ...p, contactPhone: e.target.value }))} /></Field>
        <Field label="Email de contacto"><TextInput value={form.contactEmail} onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))} /></Field>
      </div>
      <Field label="Datos de validacion"><TextArea value={form.evidenceText} onChange={(e) => setForm((p) => ({ ...p, evidenceText: e.target.value }))} placeholder="Pegá links o explicá cómo podemos verificarlo." /></Field>
      <Field label="Notas"><TextArea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Qué querés corregir o administrar primero." /></Field>

      <button onClick={submit} disabled={saving || !selected} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold disabled:opacity-40" style={{ background: '#0F172A', color: '#F59E0B' }}>
        <Send size={15} /> {saving ? 'Enviando...' : 'Enviar reclamo'}
      </button>
      {message && <p className="text-sm font-medium" style={{ color: message.includes('No se') ? '#b42318' : 'var(--accent)' }}>{message}</p>}
    </div>
  )
}

function ManagedPlaceEditor({ place, onClose, onDone }: { place: ManagedPlace; onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({
    name: place.name ?? '',
    category: place.category ?? '',
    type: place.type ?? '',
    address: place.address ?? '',
    phone: place.phone ?? '',
    price: place.price ?? '',
    priceMax: place.priceMax ?? '',
    capacity: place.capacity ?? '',
    description: place.description ?? '',
    images: (place.images ?? []).join('\n'),
    reason: '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const submit = async () => {
    setSaving(true)
    setMessage('')
    try {
      await createOwnerChangeRequest({
        sourceCollection: place.sourceCollection,
        sourceRecordId: place.sourceRecordId,
        ...form,
      })
      setMessage('Cambio enviado a revision.')
      onDone()
    } catch (error: any) {
      setMessage(error?.message ?? 'No se pudo enviar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(15,23,42,0.45)' }}>
      <div className="w-full max-w-3xl max-h-[92dvh] overflow-auto rounded-t-[28px] sm:rounded-[28px] p-5 sm:p-6 space-y-4" style={{ background: '#fff' }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="app-section-kicker mb-1">Editar informacion</p>
            <h2 className="app-section-title text-xl">{place.name}</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Los cambios quedan pendientes hasta que el equipo los revise.</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface-soft)', color: 'var(--text-primary)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Nombre"><TextInput value={form.name} onChange={(e) => set('name', e.target.value)} /></Field>
          {place.sourceCollection === 'hospedajes' ? (
            <Field label="Tipo"><TextInput value={form.type} onChange={(e) => set('type', e.target.value)} /></Field>
          ) : (
            <Field label="Categoria"><TextInput value={form.category} onChange={(e) => set('category', e.target.value)} /></Field>
          )}
          <Field label="Direccion"><TextInput value={form.address} onChange={(e) => set('address', e.target.value)} /></Field>
          <Field label="Telefono"><TextInput value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
          {place.sourceCollection === 'hospedajes' && (
            <>
              <Field label="Precio desde"><TextInput value={form.price} onChange={(e) => set('price', e.target.value)} /></Field>
              <Field label="Precio hasta"><TextInput value={form.priceMax} onChange={(e) => set('priceMax', e.target.value)} /></Field>
              <Field label="Capacidad"><TextInput value={form.capacity} onChange={(e) => set('capacity', e.target.value)} /></Field>
            </>
          )}
        </div>
        <Field label="Descripcion"><TextArea value={form.description} onChange={(e) => set('description', e.target.value)} /></Field>
        <ImageManager value={form.images} onChange={(value) => set('images', value)} />
        <Field label="Motivo del cambio"><TextArea value={form.reason} onChange={(e) => set('reason', e.target.value)} placeholder="Ej: actualicé la dirección, agregué fotos nuevas, cambió el teléfono." /></Field>

        <div className="flex flex-wrap gap-2">
          <button onClick={submit} disabled={saving || !form.name.trim()} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold disabled:opacity-40" style={{ background: '#0F172A', color: '#F59E0B' }}>
            <Send size={15} /> {saving ? 'Enviando...' : 'Enviar cambios'}
          </button>
          <button onClick={onClose} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold" style={{ background: 'var(--surface-soft)', color: 'var(--text-primary)' }}>
            Cancelar
          </button>
          {message && <p className="text-sm font-medium self-center" style={{ color: message.includes('No se') ? '#b42318' : 'var(--accent)' }}>{message}</p>}
        </div>
      </div>
    </div>
  )
}

function ManagedPlacesSection({ places, onDone }: { places: ManagedPlace[]; onDone: () => void }) {
  const [editing, setEditing] = useState<ManagedPlace | null>(null)

  return (
    <section className="app-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="app-section-kicker mb-1">Mis lugares</p>
          <h2 className="app-section-title text-lg">Información visible en Recién Llegué</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Revisá tus datos y pedí cambios de fotos, dirección, teléfono o descripción.</p>
        </div>
      </div>
      {places.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Todavía no tenés comercios u hospedajes aprobados para administrar.</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-3">
          {places.map((place) => (
            <article key={place.id} className="rounded-2xl p-4 flex gap-3" style={{ background: 'var(--surface-soft)' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#fff', color: 'var(--accent)' }}>
                {place.sourceCollection === 'hospedajes' ? <BedDouble size={20} /> : <Store size={20} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-black text-sm truncate" style={{ color: 'var(--text-primary)' }}>{place.name}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{place.type ?? place.category ?? place.sourceCollection}</p>
                  </div>
                  <button onClick={() => setEditing(place)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold shrink-0" style={{ background: '#0F172A', color: '#F59E0B' }}>
                    <Pencil size={12} /> Editar
                  </button>
                </div>
                {place.address && <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{place.address}</p>}
                {place.phone && <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--accent)' }}>{place.phone}</p>}
                <div className="flex flex-wrap gap-2 mt-2">
                  {(place.images?.length ?? 0) > 0 && <span className="text-[11px]" style={{ color: 'var(--text-muted-soft)' }}>{place.images?.length} imagen{place.images?.length === 1 ? '' : 'es'}</span>}
                  <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-muted-soft)' }}><Eye size={11} /> {place.metrics?.views ?? 0} clicks</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {editing && <ManagedPlaceEditor place={editing} onClose={() => setEditing(null)} onDone={() => { onDone(); setEditing(null) }} />}
    </section>
  )
}

function OwnerStatusPanel({ listings, claims, changes }: { listings: OwnerRecord[]; claims: OwnerRecord[]; changes: OwnerRecord[] }) {
  const pending = [...listings, ...claims, ...changes].filter((item) => item.status === 'pending').length
  const approved = [...listings, ...claims, ...changes].filter((item) => item.status === 'approved').length
  const rejected = [...listings, ...claims, ...changes].filter((item) => item.status === 'rejected').length

  return (
    <section className="grid sm:grid-cols-3 gap-3">
      {[
        { label: 'Pendientes', value: pending, color: '#92400e', bg: '#FEF3C7' },
        { label: 'Aprobadas', value: approved, color: '#166534', bg: '#DCFCE7' },
        { label: 'Con ajustes', value: rejected, color: '#991B1B', bg: '#FEE2E2' },
      ].map((item) => (
        <div key={item.label} className="app-card p-4">
          <p className="text-2xl font-black" style={{ color: item.color }}>{item.value}</p>
          <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
        </div>
      ))}
    </section>
  )
}

function OwnerMessages({ messages }: { messages: OwnerMessage[] }) {
  return (
    <section className="app-card p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}>
          <MessageSquare size={18} />
        </div>
        <div>
          <p className="app-section-kicker mb-0.5">Mensajes</p>
          <h2 className="app-section-title text-lg">Actualizaciones del equipo</h2>
        </div>
      </div>
      {messages.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Todavía no hay mensajes.</p>
      ) : (
        <div className="space-y-2">
          {messages.slice(0, 5).map((message) => (
            <div key={message.id} className="rounded-2xl px-4 py-3" style={{ background: 'var(--surface-soft)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{message.body}</p>
              {message.createdAt && <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted-soft)' }}>{new Date(message.createdAt).toLocaleDateString('es-AR')}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function ChangeHistory({ listings, claims, changes }: { listings: OwnerRecord[]; claims: OwnerRecord[]; changes: OwnerRecord[] }) {
  const items = [...changes, ...claims, ...listings]
    .sort((a, b) => String(b.updatedAt ?? b.createdAt ?? '').localeCompare(String(a.updatedAt ?? a.createdAt ?? '')))
    .slice(0, 12)

  return (
    <section className="app-card p-5 sm:p-6">
      <div className="mb-4">
        <p className="app-section-kicker mb-1">Historial</p>
        <h2 className="app-section-title text-lg">Movimientos recientes</h2>
      </div>
      {items.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Todavía no hay movimientos.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={`${item.id}-${item.createdAt}`} className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3" style={{ background: 'var(--surface-soft)' }}>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.name ?? item.businessName ?? item.sourceCollection ?? 'Solicitud'}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{item.adminNotes || item.reason || item.kind || item.sourceCollection || 'actualizacion'}</p>
              </div>
              <StatusPill status={item.status} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function OwnerContent() {
  const { user, loading } = useUser()
  const params = useSearchParams()
  const [token, setToken] = useState('')
  const [listings, setListings] = useState<OwnerRecord[]>([])
  const [claims, setClaims] = useState<OwnerRecord[]>([])
  const [changes, setChanges] = useState<OwnerRecord[]>([])
  const [managedPlaces, setManagedPlaces] = useState<ManagedPlace[]>([])
  const [messages, setMessages] = useState<OwnerMessage[]>([])
  const [loadError, setLoadError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const entry = document.cookie.split('; ').find((row) => row.startsWith('mb_token_pub='))
    setToken(entry ? entry.split('=').slice(1).join('=') : '')
  }, [])

  useEffect(() => {
    if (!token || !user?.id) return
    const userDb = getUserDb(token)
    setLoadError('')
    Promise.all([
      userDb.from('owner_listings').eq('ownerId', user.id).latest().limit(50).find(),
      userDb.from('owner_claims').eq('ownerId', user.id).latest().limit(50).find(),
      userDb.from('owner_change_requests').eq('ownerId', user.id).latest().limit(50).find(),
      userDb.from('owner_messages').eq('ownerId', user.id).latest().limit(20).find().catch(() => []),
    ]).then(([a, b, c, d]: any[]) => {
      const nextListings = a ?? []
      const nextClaims = b ?? []
      setListings(nextListings)
      setClaims(nextClaims)
      setChanges(c ?? [])
      setMessages(d ?? [])
      const approvedListingPlaces: ManagedPlace[] = nextListings
        .filter((item: OwnerRecord) => item.status === 'approved' && item.publishedRecordId)
        .map((item: OwnerRecord) => ({
          id: `listing-${item.id}`,
          sourceCollection: item.kind === 'hospedaje' ? 'hospedajes' : 'comercios',
          sourceRecordId: item.publishedRecordId as string,
          name: item.name ?? 'Sin nombre',
          category: item.category,
          type: item.type,
          address: item.address,
          phone: item.phone,
          price: item.price,
          priceMax: item.priceMax,
          capacity: item.capacity,
          description: item.description,
          images: item.images ?? [],
        }))

      const approvedClaims = nextClaims.filter((claim: OwnerRecord) => claim.status === 'approved' && claim.sourceCollection && claim.sourceRecordId)
      Promise.all(approvedClaims.map(async (claim: OwnerRecord) => {
        const sourceCollection = claim.sourceCollection as 'comercios' | 'hospedajes'
        try {
          const record: any = await publicDb.from(sourceCollection).findOne({ id: claim.sourceRecordId as string })
          return {
            id: `claim-${claim.id}`,
            sourceCollection,
            sourceRecordId: claim.sourceRecordId as string,
            name: record?.name ?? claim.businessName ?? 'Sin nombre',
            category: record?.category,
            type: record?.type,
            address: record?.address,
            phone: record?.phone,
            price: record?.price,
            priceMax: record?.priceMax,
            capacity: record?.capacity,
            description: record?.description,
            images: Array.isArray(record?.images) ? record.images : [],
          } as ManagedPlace
        } catch {
          return {
            id: `claim-${claim.id}`,
            sourceCollection,
            sourceRecordId: claim.sourceRecordId as string,
            name: claim.businessName ?? 'Sin nombre',
          } as ManagedPlace
        }
      })).then((claimPlaces) => {
        const deduped = dedupePlaces([...approvedListingPlaces, ...claimPlaces])
        getOwnerMetrics(deduped.map((place) => ({ id: place.sourceRecordId, type: place.sourceCollection })))
          .then((metrics) => {
            setManagedPlaces(deduped.map((place) => ({ ...place, metrics: metrics[place.sourceRecordId] })))
          })
          .catch(() => setManagedPlaces(deduped))
      })
    }).catch((error: any) => {
      setLoadError(error?.message ?? 'No se pudieron cargar tus solicitudes')
    })
  }, [token, user?.id, refreshKey])

  if (loading) return null

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 sm:py-8 space-y-6">
      <section className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-4">
        <div className="rounded-[28px] p-5 sm:p-7" style={{ background: '#0F172A' }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: '#F59E0B' }}>Panel propietario</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2" style={{ color: '#E2E8F0' }}>Publicá y administrá tu lugar</h1>
          <p className="text-sm sm:text-base leading-relaxed max-w-2xl" style={{ color: '#94A3B8' }}>
            Cargá tu comercio u hospedaje gratis. Si ya aparece en Recién Llegué, podés reclamarlo y pedir cambios para que el equipo los revise.
          </p>
        </div>
        <aside className="app-card p-5 flex flex-col gap-4">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: '#FEF3C7', color: '#92400e' }}>
            <BadgeCheck size={20} />
          </div>
          <div>
            <h2 className="font-black text-lg" style={{ color: 'var(--text-primary)' }}>Badge verificado</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Mostrá que tu comercio está validado y ganá más confianza con estudiantes y familias.
            </p>
          </div>
          <a href={WHATSAPP_BADGE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold" style={{ background: '#0F172A', color: '#F59E0B' }}>
            Comprar verificado <ExternalLink size={14} />
          </a>
        </aside>
      </section>

      <section className="grid lg:grid-cols-3 gap-4">
        {[
          { label: 'Publicaciones', value: listings.length, Icon: Plus },
          { label: 'Reclamos', value: claims.length, Icon: Building2 },
          { label: 'Cambios pedidos', value: changes.length, Icon: CheckCircle2 },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="app-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface-soft)', color: 'var(--accent)' }}><Icon size={18} /></div>
            <div><p className="text-xl font-black" style={{ color: 'var(--accent)' }}>{value}</p><p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p></div>
          </div>
        ))}
      </section>

      <OwnerStatusPanel listings={listings} claims={claims} changes={changes} />

      {loadError && (
        <div className="app-card px-5 py-4 text-sm font-semibold" style={{ background: '#FEE2E2', color: '#991B1B' }}>
          {loadError}
        </div>
      )}

      <ManagedPlacesSection places={managedPlaces} onDone={() => setRefreshKey((v) => v + 1)} />

      <div className="grid xl:grid-cols-2 gap-4">
        <OwnerMessages messages={messages} />
        <ChangeHistory listings={listings} claims={claims} changes={changes} />
      </div>

      <div className="grid xl:grid-cols-2 gap-4">
        <OwnerListingForm kind="comercio" onDone={() => setRefreshKey((v) => v + 1)} />
        <OwnerListingForm kind="hospedaje" onDone={() => setRefreshKey((v) => v + 1)} />
      </div>

      <ClaimForm initialId={params.get('claim') ?? ''} initialName={params.get('name') ?? ''} onDone={() => setRefreshKey((v) => v + 1)} />

      <section className="app-card p-5 sm:p-6">
        <div className="mb-4">
          <p className="app-section-kicker mb-1">Seguimiento</p>
          <h2 className="app-section-title text-lg">Tus solicitudes</h2>
        </div>
        {[...listings, ...claims, ...changes].length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Todavía no enviaste solicitudes.</p>
        ) : (
          <div className="space-y-2">
            {[...listings, ...claims, ...changes].map((item) => (
              <div key={item.id} className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3" style={{ background: 'var(--surface-soft)' }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.name ?? item.businessName ?? item.sourceCollection}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{item.kind ?? item.sourceCollection ?? 'solicitud'}</p>
                </div>
                <StatusPill status={item.status} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default function PropietarioPage() {
  return (
    <Suspense>
      <OwnerContent />
    </Suspense>
  )
}
