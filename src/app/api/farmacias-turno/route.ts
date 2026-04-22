import { NextResponse } from 'next/server'
import { fetchFarmaciasTurno } from '@/lib/farmacias-turno'

export async function GET() {
  try {
    const data = await fetchFarmaciasTurno()
    if (data.farmacias.length === 0) {
      return NextResponse.json({
        ...data,
        warning: 'No se encontraron farmacias en la fuente. Revisá el sitio oficial.',
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900',
        },
      })
    }
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'No se pudo obtener la farmacia de turno' }, { status: 502 })
  }
}
