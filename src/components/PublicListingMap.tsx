'use client'

import dynamic from 'next/dynamic'
import type { PublicListingMapProps } from './PublicListingMapInner'

const PublicListingMapInner = dynamic(() => import('./PublicListingMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[260px] flex items-center justify-center" style={{ background: '#E2E8F0' }}>
      <p className="text-xs font-bold" style={{ color: '#0F172A' }}>Cargando mapa...</p>
    </div>
  ),
})

export default function PublicListingMap(props: PublicListingMapProps) {
  return <PublicListingMapInner {...props} />
}
