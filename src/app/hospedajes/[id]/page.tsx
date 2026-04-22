import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { serverDb } from '@/lib/db-server'
import PublicListingPage from '@/components/PublicListingPage'

const SITE_URL = 'https://recienllegue.com'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const item = await serverDb.from('hospedajes').findOne({ id }).catch(() => null)
  if (!item) return { title: 'Hospedaje no encontrado' }
  const title = `${item.name} | Hospedaje para estudiantes en Pergamino`
  const description = `${item.type ?? 'Hospedaje'}${item.price ? ` desde ${item.price}` : ''}${item.address ? ` en ${item.address}` : ''}. Contacto directo en Recién Llegué.`
  return { title, description, alternates: { canonical: `${SITE_URL}/hospedajes/${id}` }, openGraph: { title, description, url: `${SITE_URL}/hospedajes/${id}` } }
}

export default async function HospedajePublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await serverDb.from('hospedajes').findOne({ id }).catch(() => null)
  if (!item) notFound()
  return <PublicListingPage item={item} kind="hospedaje" backHref="/app/hospedajes" />
}
