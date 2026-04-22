'use client'

import { useState } from 'react'
import { Flag } from 'lucide-react'
import { reportListingIssue } from '@/app/actions/public-reports'

export default function ReportListingIssue({ collection, recordId }: { collection: string; recordId: string }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('direccion')
  const [detail, setDetail] = useState('')
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const submit = async () => {
    setSending(true)
    setMessage('')
    const result = await reportListingIssue({ collection, recordId, reason, detail, contact })
    setSending(false)
    setMessage(result.ok ? 'Gracias. El equipo va a revisar este dato.' : result.error ?? 'No se pudo enviar')
    if (result.ok) {
      setDetail('')
      setContact('')
    }
  }

  return (
    <div className="rounded-2xl p-4" style={{ background: '#F8FAFC', border: '1px solid rgba(15,23,42,0.08)' }}>
      <button type="button" onClick={() => setOpen((value) => !value)} className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold" style={{ background: '#fff', color: '#0F172A' }}>
        <Flag size={14} /> Reportar dato incorrecto
      </button>
      {open && (
        <div className="mt-3 space-y-3">
          <select value={reason} onChange={(event) => setReason(event.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm outline-none" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.1)' }}>
            <option value="direccion">Dirección incorrecta</option>
            <option value="telefono">Teléfono no responde</option>
            <option value="precio">Precio desactualizado</option>
            <option value="disponibilidad">Ya no disponible</option>
            <option value="otro">Otro</option>
          </select>
          <textarea value={detail} onChange={(event) => setDetail(event.target.value)} placeholder="Contanos qué viste mal" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none min-h-24" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.1)' }} />
          <input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="Contacto opcional" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.1)' }} />
          <button type="button" onClick={submit} disabled={sending} className="w-full rounded-xl px-4 py-2.5 text-sm font-bold disabled:opacity-40" style={{ background: '#0F172A', color: '#fff' }}>{sending ? 'Enviando...' : 'Enviar reporte'}</button>
          {message && <p className="text-xs font-semibold" style={{ color: message.startsWith('Gracias') ? '#166534' : '#991B1B' }}>{message}</p>}
        </div>
      )}
    </div>
  )
}
