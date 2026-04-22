import { MetadataRoute } from 'next'
import { generateBaseSitemap } from '@/data/seo-data'
import { growthPages } from '@/data/public-growth-pages'
import { serverDb } from '@/lib/db-server'

const BASE_URL = 'https://recienllegue.com'
const SEO_LAST_MODIFIED = new Date('2026-04-21T00:00:00-03:00')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const landingUrls = generateBaseSitemap()
  const [comercios, hospedajes] = await Promise.all([
    serverDb.from('comercios').limit(500).find().catch(() => []),
    serverDb.from('hospedajes').limit(200).find().catch(() => []),
  ]) as any[]

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: SEO_LAST_MODIFIED, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/pergamino`, lastModified: SEO_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/soy-propietario`, lastModified: SEO_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.8 },
  ]

  const generatedPages: MetadataRoute.Sitemap = landingUrls.map((url) => ({
    url: `${BASE_URL}${url}`,
    lastModified: SEO_LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const growthUrls: MetadataRoute.Sitemap = growthPages.map((page) => ({
    url: `${BASE_URL}/pergamino/${page.slug}`,
    lastModified: SEO_LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const listingUrls: MetadataRoute.Sitemap = [
    ...(comercios ?? []).map((item: any) => ({
      url: `${BASE_URL}/comercios/${item.id}`,
      lastModified: SEO_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.55,
    })),
    ...(hospedajes ?? []).map((item: any) => ({
      url: `${BASE_URL}/hospedajes/${item.id}`,
      lastModified: SEO_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    })),
  ]

  return [...staticPages, ...generatedPages, ...growthUrls, ...listingUrls]
}
