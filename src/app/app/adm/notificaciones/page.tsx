'use client'

import { useState } from 'react'
import { Bell, Send, Sparkles } from 'lucide-react'
import { sendAdminNotification } from '@/app/actions/admin'

const TEMPLATES = [
  {
    id: 'housing_new',
    label: 'Hospedaje nuevo',
    title: 'Nuevo hospedaje disponible',
    body: 'Hay una nueva opción cargada en Recién Llegué. Revisala antes de contactar.',
    href: '/app/hospedajes',
  },
  {
    id: 'transport_update',
    label: 'Transporte',
    title: 'Actualización de transporte',
    body: 'Hay cambios útiles en la información de transporte para moverte por Pergamino.',
    href: '/app/transportes',
  },
  {
    id: 'pharmacy',
    label: 'Farmacia de turno',
    title: 'Farmacia de turno',
    body: 'Ya tenés una referencia útil para resolver una urgencia cerca de la ciudad.',
    href: '/app/farmacias',
  },
  {
    id: 'muro',
    label: 'Muro',
    title: 'Nueva actividad en el muro',
    body: 'Hay publicaciones nuevas de la comunidad estudiantil.',
    href: '/app/muro',
  },
]

type AudienceTarget = 'all' | 'role' | 'city'

export default function AdminNotificacionesPage() {
  const [target, setTarget] = useState<AudienceTarget>('all')
  const [role, setRole] = useState('estudiante')
  const [city, setCity] = useState('Pergamino')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [href, setHref] = useState('/app/notificaciones')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const applyTemplate = (template: typeof TEMPLATES[number]) => {
    setTitle(template.title)
    setBody(template.body)
    setHref(template.href)
  }

  const submit = async () => {
    setSending(true)
    setResult(null)
    const res = await sendAdminNotification({
      audience: { target, role, city },
      title,
      body,
      href,
      type: target === 'all' ? 'admin_broadcast' : `admin_${target}`,
    })
    setSending(false)
    setResult(res.error ? `Error: ${res.error}` : `Enviadas a ${res.sent} usuario${res.sent === 1 ? '' : 's'}.`)
  }

  return (
    <div className="px-4 lg:px-8 py-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight mb-1" style={{ color: '#0F172A' }}>
          Notificaciones
        </h1>
        <p className="text-sm" style={{ color: 'rgba(15,23,42,0.45)' }}>
          Enviá avisos de alto valor por push a estudiantes, dueños o segmentos puntuales.
        </p>
      </div>

      <section className="app-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: '#F59E0B' }} />
          <h2 className="text-sm font-extrabold" style={{ color: '#0F172A' }}>Plantillas</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => applyTemplate(template)}
              className="px-3 py-3 rounded-xl text-xs font-bold text-left transition-all hover:opacity-80"
              style={{ background: '#E2E8F0', color: '#0F172A' }}
            >
              {template.label}
            </button>
          ))}
        </div>
      </section>

      <section className="app-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Bell size={16} style={{ color: '#F59E0B' }} />
          <h2 className="text-sm font-extrabold" style={{ color: '#0F172A' }}>Audiencia</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-2">
          {[
            { value: 'all', label: 'Todos' },
            { value: 'role', label: 'Por rol' },
            { value: 'city', label: 'Por ciudad' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setTarget(item.value as AudienceTarget)}
              className="px-4 py-3 rounded-xl text-xs font-bold"
              style={{ background: target === item.value ? '#0F172A' : '#E2E8F0', color: target === item.value ? '#F59E0B' : '#0F172A' }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {target === 'role' && (
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#E2E8F0' }}>
            <option value="estudiante">Estudiantes</option>
            <option value="dueno">Dueños/comercios</option>
            <option value="admin">Admins</option>
          </select>
        )}

        {target === 'city' && (
          <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#E2E8F0' }} placeholder="Ej: Pergamino" />
        )}
      </section>

      <section className="app-card p-5 space-y-4">
        <label className="block text-xs font-bold" style={{ color: '#0F172A' }}>Título</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#E2E8F0' }} placeholder="Ej: Nuevo hospedaje disponible" />

        <label className="block text-xs font-bold" style={{ color: '#0F172A' }}>Mensaje</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: '#E2E8F0' }} placeholder="Mensaje corto, concreto y útil." />

        <label className="block text-xs font-bold" style={{ color: '#0F172A' }}>Destino al abrir</label>
        <input value={href} onChange={(e) => setHref(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#E2E8F0' }} placeholder="/app/hospedajes" />

        <button onClick={submit} disabled={sending || !title.trim() || !body.trim()} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold disabled:opacity-40" style={{ background: '#0F172A', color: '#F59E0B' }}>
          <Send size={15} /> {sending ? 'Enviando...' : 'Enviar notificación'}
        </button>
        {result && <p className="text-xs font-bold" style={{ color: result.startsWith('Error') ? '#dc2626' : '#0F172A' }}>{result}</p>}
      </section>
    </div>
  )
}
