import { notFound } from 'next/navigation'
import { serverDb } from '@/lib/db-server'
import PublicListingPage from '@/components/PublicListingPage'

export default async function AppHospedajeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await serverDb.from('hospedajes').findOne({ id }).catch(() => null)
  if (!item) notFound()
  return <PublicListingPage item={item} kind="hospedaje" backHref="/app/hospedajes" chrome="app" />
}
