'use client'

import { MapPin, X } from 'lucide-react'

interface Props {
  onAllow: () => void
  onDismiss: () => void
  loading?: boolean
}

export default function GeoPermissionBanner({ onAllow, onDismiss, loading }: Props) {
  return (
    <div
      className="rounded-2xl p-3.5 flex items-center gap-3"
      style={{ background: '#daf1de', border: '1px solid rgba(22,56,50,0.12)' }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: '#163832' }}
      >
        <MapPin size={14} color="#daf1de" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold" style={{ color: '#051f20' }}>
          Activá tu ubicación para ver los más cercanos
        </p>
        <p className="text-[10px]" style={{ color: 'rgba(5,31,32,0.45)' }}>
          Solo para ordenar por cercanía
        </p>
      </div>

      <button
        onClick={onAllow}
        disabled={loading}
        className="shrink-0 px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all hover:opacity-80 disabled:opacity-50"
        style={{ background: '#163832', color: '#daf1de', minHeight: 44 }}
      >
        {loading ? '...' : 'Activar'}
      </button>

      <button
        onClick={onDismiss}
        className="shrink-0 p-1.5 rounded-lg transition-opacity hover:opacity-60"
        style={{ color: '#163832', opacity: 0.4, minHeight: 44, minWidth: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        aria-label="Cerrar"
      >
        <X size={14} />
      </button>
    </div>
  )
}
