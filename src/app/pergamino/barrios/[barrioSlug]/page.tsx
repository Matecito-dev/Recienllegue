import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import SimplePublicPage from '@/components/SimplePublicPage'
import { BARRIOS } from '@/data/seo-data'

const SITE_URL = 'https://recienllegue.com'

export function generateStaticParams() {
  return BARRIOS.map((barrio) => ({ barrioSlug: barrio.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ barrioSlug: string }> }): Promise<Metadata> {
  const { barrioSlug } = await params
  const barrio = BARRIOS.find((item) => item.slug === barrioSlug)
  if (!barrio) return { title: 'Barrio no encontrado' }
  const title = `${barrio.name} en Pergamino para estudiantes | Recién Llegué`
  const description = `${barrio.descripcion} Distancia UNNOBA: ${barrio.distanciaUNNOBA}. Guía para vivir, alquilar y moverse.`
  return { title, description, alternates: { canonical: `${SITE_URL}/pergamino/barrios/${barrio.slug}` } }
}

export default async function BarrioPage({ params }: { params: Promise<{ barrioSlug: string }> }) {
  const { barrioSlug } = await params
  const barrio = BARRIOS.find((item) => item.slug === barrioSlug)
  if (!barrio) notFound()

  return (
    <SimplePublicPage
      kicker="Barrios de Pergamino"
      title={`${barrio.name} para estudiantes`}
      intro={`${barrio.descripcion} Está a ${barrio.distanciaUNNOBA.toLowerCase()}, por eso puede ser una zona a considerar si estás llegando a Pergamino.`}
      canonicalPath={`/pergamino/barrios/${barrio.slug}`}
      ctaHref="/app/mapa"
      sections={[
        { title: 'Ubicación y rutina', body: `La referencia principal es: ${barrio.distanciaUNNOBA}. Antes de elegir, compará tiempos reales hacia tu sede y servicios cercanos.` },
        { title: 'Alojamiento', body: 'Revisá hospedajes disponibles, condiciones de ingreso, precio total y alternativas cercanas si hay poca disponibilidad.' },
        { title: 'Comercios útiles', body: 'Buscá supermercados, kioscos, cafeterías, fotocopias y servicios que te ayuden a resolver el día a día.' },
        { title: 'Transporte', body: 'Evaluá si podés caminar, usar bici, colectivo o remis según horarios de cursada y seguridad de la zona.' },
      ]}
    />
  )
}
