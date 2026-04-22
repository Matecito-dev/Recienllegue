'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, MapPin, Phone, RefreshCw, ShieldPlus } from 'lucide-react'
import type { FarmaciasTurnoData } from '@/lib/farmacias-turno'

type FarmaciasResponse = FarmaciasTurnoData & { warning?: string }

export default function FarmaciasPage() {
  const [data, setData] = useState<FarmaciasResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    setError(null)
    fetch('/api/farmacias-turno', { cache: 'no-store' })
      .then(async (res) => {
        const body = await res.json()
        if (!res.ok) throw new Error(body?.error ?? 'No se pudo consultar el turno')
        setData(body)
      })
      .catch((err) => setError(err?.message ?? 'No se pudo consultar el turno'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 sm:py-8 space-y-6 pb-28 lg:pb-8">
      <section className="rounded-[28px] p-6 sm:p-8" style={{ background: '#0F172A' }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#F59E0B', color: '#0F172A' }}>
            <ShieldPlus size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: '#CBD5E1' }}>Salud urgente</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: '#E2E8F0' }}>Farmacias de turno</h1>
            <p className="text-sm sm:text-base mt-2 max-w-2xl" style={{ color: '#94A3B8' }}>
              Información tomada automáticamente de la Asociación Médica de Pergamino. Verificá antes de trasladarte si es una urgencia.
            </p>
          </div>
        </div>
      </section>

      <section className="app-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <p className="app-section-kicker mb-1">{data?.dateLabel || 'Turno actual'}</p>
            <h2 className="app-section-title text-xl">{data?.schedule || 'Consultando farmacia de turno'}</h2>
            {data?.fetchedAt ? (
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Actualizado: {new Date(data.fetchedAt).toLocaleString('es-AR')}
              </p>
            ) : null}
          </div>
          <button onClick={load} disabled={loading} className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold disabled:opacity-40" style={{ background: '#E2E8F0', color: '#0F172A' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualizar
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl p-4" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <p className="text-sm font-bold">{error}</p>
            <a href="http://www.ampergamino.com.ar/index.php?seccion_generica_id=1430" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-xs font-bold" style={{ color: '#991b1b' }}>
              Ver fuente oficial <ExternalLink size={12} />
            </a>
          </div>
        ) : null}

        {!error && data?.warning ? (
          <div className="rounded-2xl p-4 mb-4" style={{ background: '#FEF3C7', color: '#92400E' }}>
            <p className="text-sm font-bold">No pudimos leer automáticamente las farmacias de turno.</p>
            <p className="text-xs mt-1">Puede ser un cambio temporal en la fuente o en el formato de la página.</p>
            <a href={data.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-xs font-bold" style={{ color: '#92400E' }}>
              Ver fuente oficial <ExternalLink size={12} />
            </a>
          </div>
        ) : null}

        {loading && !data ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((item) => <div key={item} className="h-32 rounded-2xl animate-pulse" style={{ background: '#E2E8F0' }} />)}
          </div>
        ) : (
          (data?.farmacias?.length ?? 0) === 0 ? (
            <div className="rounded-2xl p-8 text-center" style={{ background: '#F8FAFC', border: '1px solid rgba(15,23,42,0.08)' }}>
              <ShieldPlus size={24} className="mx-auto mb-3" style={{ color: '#F59E0B' }} />
              <p className="text-sm font-bold" style={{ color: '#0F172A' }}>Sin datos automáticos por ahora</p>
              <p className="text-xs mt-1 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
                Para una urgencia, abrí la fuente oficial o consultá directamente con una farmacia cercana.
              </p>
              <a href={data?.sourceUrl || 'http://www.ampergamino.com.ar/index.php?seccion_generica_id=1430'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl text-xs font-bold" style={{ background: '#0F172A', color: '#F59E0B', textDecoration: 'none' }}>
                Ver fuente oficial <ExternalLink size={12} />
              </a>
            </div>
          ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {(data?.farmacias ?? []).map((farmacia) => (
              <article key={`${farmacia.name}-${farmacia.address}`} className="rounded-2xl p-4" style={{ background: '#F8FAFC', border: '1px solid rgba(15,23,42,0.08)' }}>
                <p className="text-lg font-black" style={{ color: '#0F172A' }}>{farmacia.name}</p>
                <div className="mt-3 space-y-2">
                  <p className="flex items-center gap-2 text-sm" style={{ color: 'rgba(15,23,42,0.65)' }}>
                    <MapPin size={14} /> {farmacia.address || 'Dirección no informada'}
                  </p>
                  {farmacia.phone ? (
                    <a href={`tel:${farmacia.phone.replace(/\D/g, '')}`} className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: '#0F172A', textDecoration: 'none' }}>
                      <Phone size={14} /> {farmacia.phone}
                    </a>
                  ) : null}
                </div>
                {farmacia.mapsUrl ? (
                  <a href={farmacia.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl text-xs font-bold" style={{ background: '#0F172A', color: '#F59E0B', textDecoration: 'none' }}>
                    Ver mapa <ExternalLink size={12} />
                  </a>
                ) : null}
              </article>
            ))}
          </div>
          )
        )}
      </section>

      <a href={data?.sourceUrl || 'http://www.ampergamino.com.ar/index.php?seccion_generica_id=1430'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold" style={{ color: 'rgba(15,23,42,0.55)' }}>
        Fuente: Asociación Médica de Pergamino <ExternalLink size={12} />
      </a>
    </div>
  )
}
