import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { serverDb } from '@/lib/db-server'
import PublicListingPage from '@/components/PublicListingPage'

const SITE_URL = 'https://recienllegue.com'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const item = await serverDb.from('comercios').findOne({ id }).catch(() => null)
  if (!item) return { title: 'Comercio no encontrado' }
  const title = `${item.name} en Pergamino | Recién Llegué`
  const description = `${item.category ?? 'Comercio'}${item.address ? ` en ${item.address}` : ''}. Contacto e información para estudiantes y recién llegados.`
  return { title, description, alternates: { canonical: `${SITE_URL}/comercios/${id}` }, openGraph: { title, description, url: `${SITE_URL}/comercios/${id}` } }
}

export default async function ComercioPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await serverDb.from('comercios').findOne({ id }).catch(() => null)
  if (!item) notFound()
  return <PublicListingPage item={item} kind="comercio" backHref="/app/comercios" />
}
