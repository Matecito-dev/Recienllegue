'use client'

import { useEffect, useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { publicDb as db } from '@/lib/db'
import { useGeolocation } from '@/hooks/useGeolocation'

interface Hospedaje {
  id: string
  name: string
  type?: string
  address?: string
  price?: string
  lat?: number
  lng?: number
  latitude?: number
  longitude?: number
}

interface Comercio {
  id: string
  name: string
  category?: string
  address?: string
  lat?: number
  lng?: number
}

interface FarmaciaTurno {
  name: string
  address: string
  phone: string
  mapsUrl: string
}

interface Tramo { puntos: [number, number][] }
interface Ramal { id: string; ramal: string; color: string; ida: Tramo[]; vuelta: Tramo[] }

type LayerKey = 'hospedajes' | 'comercios' | 'colectivos' | 'unnoba' | 'farmacias' | 'supermercados'

const UNNOBA: [number, number] = [-33.89275, -60.57485]
const CENTER: [number, number] = [-33.894, -60.573]

function toLatLng(puntos: [number, number][]): [number, number][] {
  return puntos.map(([lng, lat]) => [lat, lng])
}

function FitUser({ coords }: { coords: { lat: number; lng: number } | null }) {
  const map = useMap()
  useEffect(() => {
    if (coords) map.setView([coords.lat, coords.lng], 15)
  }, [coords, map])
  return null
}

export default function MapaCombinado() {
  const [hospedajes, setHospedajes] = useState<Hospedaje[]>([])
  const [comercios, setComercios] = useState<Comercio[]>([])
  const [ramales, setRamales] = useState<Ramal[]>([])
  const [farmaciasTurno, setFarmaciasTurno] = useState<FarmaciaTurno[]>([])
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    hospedajes: true,
    comercios: true,
    colectivos: true,
    unnoba: true,
    farmacias: true,
    supermercados: true,
  })
  const { coords, requestPermission, status } = useGeolocation()

  useEffect(() => {
    db.from('hospedajes').limit(100).find().then((rows: any[]) => setHospedajes(rows ?? [])).catch(() => {})
    db.from('comercios').limit(500).find().then((rows: any[]) => setComercios(rows ?? [])).catch(() => {})
    db.from('colectivos').limit(20).find().then((rows: any[]) => setRamales(rows ?? [])).catch(() => {})
    fetch('/api/farmacias-turno').then((res) => res.json()).then((data) => setFarmaciasTurno(data?.farmacias ?? [])).catch(() => {})
  }, [])

  const filteredComercios = useMemo(() => {
    return comercios.filter((item) => {
      const cat = (item.category ?? '').toLowerCase()
      if (layers.farmacias && cat.includes('farmacia')) return true
      if (layers.supermercados && (cat.includes('super') || cat.includes('mercado'))) return true
      return layers.comercios && !cat.includes('farmacia') && !cat.includes('super')
    })
  }, [comercios, layers])

  const toggle = (key: LayerKey) => setLayers((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="relative h-[calc(100dvh-56px)] lg:h-[calc(100dvh-56px)]">
      <MapContainer center={CENTER} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://carto.com/">CARTO</a>' />
        <FitUser coords={coords} />

        {layers.unnoba && (
          <CircleMarker center={UNNOBA} radius={10} pathOptions={{ color: '#0F172A', fillColor: '#F59E0B', fillOpacity: 0.95 }}>
            <Popup>UNNOBA · Sede Pergamino</Popup>
          </CircleMarker>
        )}

        {coords && (
          <CircleMarker center={[coords.lat, coords.lng]} radius={8} pathOptions={{ color: '#2563EB', fillColor: '#2563EB', fillOpacity: 0.8 }}>
            <Popup>Tu ubicación</Popup>
          </CircleMarker>
        )}

        {layers.hospedajes && hospedajes.map((h) => {
          const lat = h.lat ?? h.latitude
          const lng = h.lng ?? h.longitude
          if (lat == null || lng == null) return null
          return (
            <CircleMarker key={h.id} center={[lat, lng]} radius={7} pathOptions={{ color: '#0F172A', fillColor: '#10B981', fillOpacity: 0.85 }}>
              <Popup>
                <strong>{h.name}</strong><br />
                {h.type || 'Hospedaje'} · {h.price || 'Consultar'}<br />
                {h.address}
              </Popup>
            </CircleMarker>
          )
        })}

        {filteredComercios.map((c) => {
          if (c.lat == null || c.lng == null) return null
          const cat = (c.category ?? '').toLowerCase()
          const color = cat.includes('farmacia') ? '#DC2626' : cat.includes('super') || cat.includes('mercado') ? '#7C3AED' : '#F59E0B'
          return (
            <CircleMarker key={c.id} center={[c.lat, c.lng]} radius={6} pathOptions={{ color: '#0F172A', fillColor: color, fillOpacity: 0.82 }}>
              <Popup>
                <strong>{c.name}</strong><br />
                {c.category || 'Comercio'}<br />
                {c.address}
                {cat.includes('farmacia') && farmaciasTurno.some((f) => f.name.toLowerCase() === c.name.toLowerCase()) ? (
                  <>
                    <br /><strong>De turno hoy</strong>
                  </>
                ) : null}
              </Popup>
            </CircleMarker>
          )
        })}

        {layers.colectivos && ramales.map((r) => (
          <span key={r.id}>
            {r.ida?.map((tramo, i) => <Polyline key={`${r.id}-ida-${i}`} positions={toLatLng(tramo.puntos)} pathOptions={{ color: r.color || '#0F172A', weight: 3, opacity: 0.7 }} />)}
            {r.vuelta?.map((tramo, i) => <Polyline key={`${r.id}-vuelta-${i}`} positions={toLatLng(tramo.puntos)} pathOptions={{ color: r.color || '#0F172A', weight: 2, opacity: 0.45, dashArray: '6 5' }} />)}
          </span>
        ))}
      </MapContainer>

      <div className="absolute left-4 right-4 top-4 z-[1000] pointer-events-none">
        <div className="mx-auto max-w-5xl flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between pointer-events-auto">
          <div className="rounded-2xl px-4 py-3 shadow-lg" style={{ background: 'rgba(255,255,255,0.96)', border: '1px solid rgba(15,23,42,0.08)' }}>
            <p className="text-sm font-black" style={{ color: '#0F172A' }}>Mapa de llegada</p>
            <p className="text-[11px]" style={{ color: 'rgba(15,23,42,0.55)' }}>Hospedajes, comercios, UNNOBA y recorridos.</p>
            {farmaciasTurno.length > 0 ? (
              <a href="/app/farmacias" className="inline-flex mt-2 text-[11px] font-bold" style={{ color: '#DC2626', textDecoration: 'none' }}>
                {farmaciasTurno.length} farmacia{farmaciasTurno.length === 1 ? '' : 's'} de turno
              </a>
            ) : null}
          </div>
          <div className="flex gap-2 overflow-x-auto rounded-2xl p-2 shadow-lg" style={{ background: 'rgba(255,255,255,0.96)', border: '1px solid rgba(15,23,42,0.08)' }}>
            {([
              ['hospedajes', 'Hospedajes'],
              ['comercios', 'Comercios'],
              ['farmacias', 'Farmacias'],
              ['supermercados', 'Super'],
              ['colectivos', 'Colectivos'],
              ['unnoba', 'UNNOBA'],
            ] as [LayerKey, string][]).map(([key, label]) => (
              <button key={key} onClick={() => toggle(key)} className="shrink-0 px-3 py-2 rounded-xl text-[11px] font-bold"
                style={{ background: layers[key] ? '#0F172A' : '#E2E8F0', color: layers[key] ? '#F59E0B' : '#0F172A' }}>
                {label}
              </button>
            ))}
            <button onClick={() => requestPermission('combined_map')} className="shrink-0 px-3 py-2 rounded-xl text-[11px] font-bold" style={{ background: '#F59E0B', color: '#0F172A' }}>
              {status === 'requesting' ? 'Ubicando...' : 'Mi ubicación'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
