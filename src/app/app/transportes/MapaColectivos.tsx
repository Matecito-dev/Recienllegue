'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface Tramo {
  longitud_km: number
  puntos: [number, number][]  // [lng, lat]
}

interface Ramal {
  id:             string
  nombre:         string
  ramal:          string
  empresa:        string
  color:          string
  actualizacion:  string
  ida:            Tramo[]
  vuelta:         Tramo[]
}

interface Props {
  ramales: Ramal[]
  activoId: string | null  // null = mostrar todos
}

// Convierte [lng, lat] → [lat, lng] que espera Leaflet
function toLatLng(puntos: [number, number][]): [number, number][] {
  return puntos.map(([lng, lat]) => [lat, lng])
}

function FitBounds({ ramales, activoId }: Props) {
  const map = useMap()

  useEffect(() => {
    const targets = activoId
      ? ramales.filter(r => r.id === activoId)
      : ramales

    const allPts: [number, number][] = []
    for (const r of targets) {
      for (const t of [...r.ida, ...r.vuelta]) {
        allPts.push(...toLatLng(t.puntos))
      }
    }

    if (allPts.length > 0) {
      map.fitBounds(allPts, { padding: [32, 32], maxZoom: 14 })
    }
  }, [activoId, ramales, map])

  return null
}

export default function MapaColectivos({ ramales, activoId }: Props) {
  const pergamino: [number, number] = [-33.894, -60.573]

  return (
    <MapContainer
      center={pergamino}
      zoom={13}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      <FitBounds ramales={ramales} activoId={activoId} />

      {ramales.map(r => {
        const esActivo = activoId === null || activoId === r.id
        const color    = r.color

        return (
          <span key={r.id}>
            {/* IDA — línea sólida */}
            {r.ida.map((tramo, i) => (
              <Polyline
                key={`ida-${i}`}
                positions={toLatLng(tramo.puntos)}
                pathOptions={{
                  color,
                  weight:  esActivo ? 4 : 1.5,
                  opacity: esActivo ? 0.95 : 0.15,
                }}
              />
            ))}
            {/* VUELTA — línea punteada */}
            {r.vuelta.map((tramo, i) => (
              <Polyline
                key={`vuelta-${i}`}
                positions={toLatLng(tramo.puntos)}
                pathOptions={{
                  color,
                  weight:    esActivo ? 3 : 1.5,
                  opacity:   esActivo ? 0.65 : 0.1,
                  dashArray: '6 5',
                }}
              />
            ))}
          </span>
        )
      })}
    </MapContainer>
  )
}
