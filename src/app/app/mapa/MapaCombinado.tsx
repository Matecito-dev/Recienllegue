'use client'

import { useEffect, useMemo, useState, type ComponentType } from 'react'
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { publicDb as db } from '@/lib/db'
import { useGeolocation } from '@/hooks/useGeolocation'
import { BedDouble, Building2, Bus, Cross, LocateFixed, MapPin, Navigation, School, ShoppingBag, X } from 'lucide-react'

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
type SelectedPlace = {
  id: string
  kind: 'hospedaje' | 'comercio' | 'unnoba' | 'user'
  name: string
  subtitle?: string
  address?: string
  href?: string
  color: string
}

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
  const [selected, setSelected] = useState<SelectedPlace | null>(null)
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
  const visibleCounts = {
    hospedajes: hospedajes.filter((h) => (h.lat ?? h.latitude) != null && (h.lng ?? h.longitude) != null).length,
    comercios: filteredComercios.filter((c) => c.lat != null && c.lng != null).length,
    colectivos: ramales.length,
  }
  const layerItems: { key: LayerKey; label: string; icon: ComponentType<{ size?: number }>; color: string }[] = [
    { key: 'hospedajes', label: 'Hospedajes', icon: BedDouble, color: '#10B981' },
    { key: 'comercios', label: 'Comercios', icon: ShoppingBag, color: '#F59E0B' },
    { key: 'farmacias', label: 'Farmacias', icon: Cross, color: '#DC2626' },
    { key: 'supermercados', label: 'Super', icon: Building2, color: '#7C3AED' },
    { key: 'colectivos', label: 'Colectivos', icon: Bus, color: '#2563EB' },
    { key: 'unnoba', label: 'UNNOBA', icon: School, color: '#0F172A' },
  ]

  return (
    <div className="relative h-[calc(100dvh-56px)] lg:h-[calc(100dvh-56px)] overflow-hidden" style={{ background: '#E2E8F0' }}>
      <MapContainer center={CENTER} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://carto.com/">CARTO</a>' />
        <FitUser coords={coords} />

        {layers.unnoba && (
          <CircleMarker
            center={UNNOBA}
            radius={10}
            pathOptions={{ color: '#0F172A', fillColor: '#F59E0B', fillOpacity: 0.95 }}
            eventHandlers={{
              click: () => setSelected({ id: 'unnoba', kind: 'unnoba', name: 'UNNOBA · Sede Pergamino', subtitle: 'Punto de referencia', address: 'Pergamino', color: '#F59E0B' }),
            }}
          >
            <Popup>UNNOBA · Sede Pergamino</Popup>
          </CircleMarker>
        )}

        {coords && (
          <CircleMarker
            center={[coords.lat, coords.lng]}
            radius={8}
            pathOptions={{ color: '#2563EB', fillColor: '#2563EB', fillOpacity: 0.8 }}
            eventHandlers={{
              click: () => setSelected({ id: 'user', kind: 'user', name: 'Tu ubicación', subtitle: 'Ubicación aproximada', color: '#2563EB' }),
            }}
          >
            <Popup>Tu ubicación</Popup>
          </CircleMarker>
        )}

        {layers.hospedajes && hospedajes.map((h) => {
          const lat = h.lat ?? h.latitude
          const lng = h.lng ?? h.longitude
          if (lat == null || lng == null) return null
          return (
            <CircleMarker
              key={h.id}
              center={[lat, lng]}
              radius={7}
              pathOptions={{ color: '#0F172A', fillColor: '#10B981', fillOpacity: 0.85 }}
              eventHandlers={{
                click: () => setSelected({ id: h.id, kind: 'hospedaje', name: h.name, subtitle: `${h.type || 'Hospedaje'} · ${h.price || 'Consultar'}`, address: h.address, href: `/app/hospedajes/${h.id}`, color: '#10B981' }),
              }}
            >
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
            <CircleMarker
              key={c.id}
              center={[c.lat, c.lng]}
              radius={6}
              pathOptions={{ color: '#0F172A', fillColor: color, fillOpacity: 0.82 }}
              eventHandlers={{
                click: () => setSelected({ id: c.id, kind: 'comercio', name: c.name, subtitle: c.category || 'Comercio', address: c.address, href: `/app/comercios/${c.id}`, color }),
              }}
            >
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

      <div className="absolute left-3 right-3 top-3 z-[1000] pointer-events-none lg:left-5 lg:right-5 lg:top-5">
        <div className="mx-auto max-w-6xl flex flex-col gap-3 pointer-events-auto">
          <div className="rounded-[22px] px-4 py-3 shadow-xl backdrop-blur-md flex items-start justify-between gap-4" style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(15,23,42,0.08)' }}>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 mb-2" style={{ background: '#F8FAFC', border: '1px solid rgba(15,23,42,0.06)' }}>
                <MapPin size={12} style={{ color: '#0F172A' }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: 'rgba(15,23,42,0.55)' }}>Pergamino</span>
              </div>
              <p className="text-base font-black tracking-tight" style={{ color: '#0F172A' }}>Mapa de llegada</p>
              <p className="text-[11px]" style={{ color: 'rgba(15,23,42,0.55)' }}>
                {visibleCounts.hospedajes} hospedajes · {visibleCounts.comercios} comercios · {visibleCounts.colectivos} recorridos
              </p>
            </div>
            <button
              onClick={() => requestPermission('combined_map')}
              className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-2xl text-[11px] font-bold"
              style={{ background: '#0F172A', color: '#fff' }}
            >
              <LocateFixed size={14} /> {status === 'requesting' ? 'Ubicando' : 'Mi ubicación'}
            </button>
          </div>

          <div className="rounded-[22px] p-2 shadow-xl backdrop-blur-md overflow-x-auto" style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(15,23,42,0.08)' }}>
            <div className="flex gap-2 min-w-max">
              {layerItems.map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-2xl text-[11px] font-bold transition-all"
                  style={{
                    background: layers[key] ? '#0F172A' : '#F8FAFC',
                    color: layers[key] ? '#fff' : 'rgba(15,23,42,0.62)',
                    border: `1px solid ${layers[key] ? '#0F172A' : 'rgba(15,23,42,0.08)'}`,
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <div className="absolute left-3 right-3 bottom-24 z-[1000] pointer-events-none lg:left-auto lg:right-5 lg:bottom-5 lg:w-[360px]">
          <div className="rounded-[24px] p-4 shadow-2xl pointer-events-auto" style={{ background: 'rgba(255,255,255,0.96)', border: '1px solid rgba(15,23,42,0.08)' }}>
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#F8FAFC', color: selected.color, border: '1px solid rgba(15,23,42,0.06)' }}>
                {selected.kind === 'hospedaje' ? <BedDouble size={18} /> : selected.kind === 'comercio' ? <ShoppingBag size={18} /> : selected.kind === 'unnoba' ? <School size={18} /> : <Navigation size={18} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black leading-snug" style={{ color: '#0F172A' }}>{selected.name}</p>
                {selected.subtitle && <p className="text-xs mt-1" style={{ color: 'rgba(15,23,42,0.58)' }}>{selected.subtitle}</p>}
                {selected.address && <p className="text-[11px] mt-1 line-clamp-2" style={{ color: 'rgba(15,23,42,0.45)' }}>{selected.address}</p>}
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#F8FAFC', color: 'rgba(15,23,42,0.5)' }}>
                <X size={14} />
              </button>
            </div>
            {selected.href && (
              <a href={selected.href} className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold" style={{ background: '#0F172A', color: '#fff', textDecoration: 'none' }}>
                Ver ficha <Navigation size={14} />
              </a>
            )}
            {farmaciasTurno.length > 0 ? (
              <a href="/app/farmacias" className="inline-flex mt-3 text-[11px] font-bold" style={{ color: '#DC2626', textDecoration: 'none' }}>
                {farmaciasTurno.length} farmacia{farmaciasTurno.length === 1 ? '' : 's'} de turno
              </a>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
