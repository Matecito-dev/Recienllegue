import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import GrowthPageLayout from '@/components/GrowthPageLayout'
import { growthPages } from '@/data/public-growth-pages'

const SITE_URL = 'https://recienllegue.com'

export function generateStaticParams() {
  return growthPages.map((page) => ({ growthSlug: page.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ growthSlug: string }> }): Promise<Metadata> {
  const { growthSlug } = await params
  const page = growthPages.find((item) => item.slug === growthSlug)
  if (!page) return { title: 'No encontrado' }
  const canonical = `${SITE_URL}/pergamino/${page.slug}`
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical },
    openGraph: { title: page.title, description: page.description, url: canonical, siteName: 'Recién Llegué', locale: 'es_AR', type: 'article' },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description },
  }
}

export default async function PublicGrowthPage({ params }: { params: Promise<{ growthSlug: string }> }) {
  const { growthSlug } = await params
  const page = growthPages.find((item) => item.slug === growthSlug)
  if (!page) notFound()
  return <GrowthPageLayout page={page} canonicalPath={`/pergamino/${page.slug}`} />
}
