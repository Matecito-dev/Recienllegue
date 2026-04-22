import { notFound } from 'next/navigation'
import { serverDb } from '@/lib/db-server'
import PublicListingPage from '@/components/PublicListingPage'

export default async function AppComercioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await serverDb.from('comercios').findOne({ id }).catch(() => null)
  if (!item) notFound()
  return <PublicListingPage item={item} kind="comercio" backHref="/app/comercios" chrome="app" />
}
