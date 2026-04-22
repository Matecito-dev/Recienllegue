'use client'

import { useEffect, useState } from 'react'

export default function OfflinePage() {
  const [online, setOnline] = useState(false)

  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: 'rgba(15,23,42,0.08)' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight mb-2" style={{ color: '#0F172A' }}>
        Sin conexión
      </h1>
      <p className="text-sm leading-relaxed max-w-xs mb-8" style={{ color: 'rgba(15,23,42,0.5)' }}>
        {online
          ? 'La conexión volvió. Podés reintentar para actualizar la app.'
          : 'No hay internet por ahora. Podés seguir viendo secciones que ya cargaste antes.'}
      </p>

      <div className="grid gap-2 w-full max-w-xs">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-80"
          style={{ background: '#0F172A', color: '#F59E0B' }}
        >
          {online ? 'Actualizar ahora' : 'Reintentar'}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <a href="/app/inicio" className="px-4 py-3 rounded-xl text-xs font-bold" style={{ background: '#E2E8F0', color: '#0F172A', textDecoration: 'none' }}>Inicio</a>
          <a href="/app/hospedajes" className="px-4 py-3 rounded-xl text-xs font-bold" style={{ background: '#E2E8F0', color: '#0F172A', textDecoration: 'none' }}>Hospedajes</a>
        </div>
        <a href="/app/farmacias" className="px-4 py-3 rounded-xl text-xs font-bold" style={{ background: '#E2E8F0', color: '#0F172A', textDecoration: 'none' }}>Farmacias de turno</a>
        <a href="/app/notificaciones" className="px-4 py-3 rounded-xl text-xs font-bold" style={{ background: '#E2E8F0', color: '#0F172A', textDecoration: 'none' }}>Ver notificaciones guardadas</a>
      </div>
    </div>
  )
}
