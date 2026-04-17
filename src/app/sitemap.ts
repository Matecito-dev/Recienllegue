import { MetadataRoute } from 'next'
import { generateSitemap } from '@/data/seo-data'

const BASE_URL = 'https://recienllegue.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const landingUrls = generateSitemap()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/app/inicio`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/app/hospedajes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/app/comercios`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/app/transportes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/app/muro`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ]

  const generatedPages: MetadataRoute.Sitemap = landingUrls.map((url) => ({
    url: `${BASE_URL}${url}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: url.split('/').length === 3 ? 0.7 : 0.5, // base vs barrio/modifier
  }))

  return [...staticPages, ...generatedPages]
}
