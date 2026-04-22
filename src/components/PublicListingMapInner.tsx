'use client'

import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const DEFAULT_CENTER: [number, number] = [-33.894, -60.573]

export type PublicListingMapProps = {
  lat?: number | null
  lng?: number | null
  title: string
  subtitle?: string
}

export default function PublicListingMapInner({
  lat,
  lng,
  title,
  subtitle,
}: PublicListingMapProps) {
  const hasCoords = lat != null && lng != null && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))
  const center: [number, number] = hasCoords ? [Number(lat), Number(lng)] : DEFAULT_CENTER

  return (
    <MapContainer center={center} zoom={hasCoords ? 16 : 13} style={{ width: '100%', height: '100%' }} zoomControl={false} scrollWheelZoom={false}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://carto.com/">CARTO</a>' />
      {hasCoords && (
        <CircleMarker center={center} radius={9} pathOptions={{ color: '#0F172A', fillColor: '#F59E0B', fillOpacity: 0.9 }}>
          <Popup>
            <strong>{title}</strong>
            {subtitle ? <><br />{subtitle}</> : null}
          </Popup>
        </CircleMarker>
      )}
    </MapContainer>
  )
}
