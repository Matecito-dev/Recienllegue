'use client'

import { useState, useEffect, useCallback } from 'react'
import { publicDb } from '@/lib/db'
import { useUser } from './useUser'

export type GeoCoords = {
  lat: number
  lng: number
  accuracy: number
}

export type GeoStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable'

export function useGeolocation() {
  const { user } = useUser()
  const [coords, setCoords] = useState<GeoCoords | null>(null)
  const [status, setStatus] = useState<GeoStatus>('idle')
  const [hasAsked, setHasAsked] = useState(false)

  // Leer estado inicial desde localStorage (solo en cliente)
  useEffect(() => {
    const asked = localStorage.getItem('geo_asked') === 'true'
    setHasAsked(asked)

    // Si ya había dado permiso antes, intentar obtener ubicación silenciosamente
    if (asked && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy })
          setStatus('granted')
        },
        () => {
          setStatus('denied')
        },
        { timeout: 8000, maximumAge: 300000 }
      )
    }
  }, [])

  const requestPermission = useCallback(async (source: string) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('unavailable')
      localStorage.setItem('geo_asked', 'true')
      setHasAsked(true)
      return
    }

    setStatus('requesting')

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const c: GeoCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }
        setCoords(c)
        setStatus('granted')
        localStorage.setItem('geo_asked', 'true')
        setHasAsked(true)

        // Guardar en DB — fire-and-forget
        try {
          await publicDb.from('user_locations').insert({
            userId: user?.id ?? null,
            latitude: c.lat,
            longitude: c.lng,
            accuracy: c.accuracy,
            source,
          })
        } catch {
          // Silencioso — no bloquear UX si falla
        }
      },
      () => {
        setStatus('denied')
        localStorage.setItem('geo_asked', 'true')
        setHasAsked(true)
      },
      { timeout: 10000, maximumAge: 300000 }
    )
  }, [user?.id])

  /**
   * Calcula distancia en km entre coords del usuario y un punto dado.
   * Fórmula Haversine. Devuelve null si no hay coords del usuario.
   */
  const getDistanceKm = useCallback((lat2: number, lng2: number): number | null => {
    if (!coords) return null
    const R = 6371
    const dLat = (lat2 - coords.lat) * Math.PI / 180
    const dLng = (lng2 - coords.lng) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coords.lat * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }, [coords])

  return { coords, status, hasAsked, requestPermission, getDistanceKm }
}
