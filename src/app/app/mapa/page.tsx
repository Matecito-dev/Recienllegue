'use client'

import dynamic from 'next/dynamic'

const MapaCombinado = dynamic(() => import('./MapaCombinado'), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100dvh-56px)] flex items-center justify-center" style={{ background: '#E2E8F0' }}>
      <p className="text-sm font-bold" style={{ color: '#0F172A' }}>Cargando mapa...</p>
    </div>
  ),
})

export default function MapaPage() {
  return <MapaCombinado />
}
