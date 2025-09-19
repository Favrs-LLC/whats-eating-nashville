import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/creators`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/places`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  try {
    // Dynamic routes - articles
    const articles = await prisma.article.findMany({
      where: { status: 'published' },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    const articleRoutes = articles.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Dynamic routes - creators
    const creators = await prisma.creator.findMany({
      where: { isActive: true },
      select: {
        instagramHandle: true,
        createdAt: true,
      },
    })

    const creatorRoutes = creators.map((creator) => ({
      url: `${baseUrl}/creators/${creator.instagramHandle}`,
      lastModified: creator.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // Dynamic routes - places
    const places = await prisma.place.findMany({
      select: {
        id: true,
        createdAt: true,
      },
    })

    const placeRoutes = places.map((place) => ({
      url: `${baseUrl}/places/${place.id}`,
      lastModified: place.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...articleRoutes, ...creatorRoutes, ...placeRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static routes only if database is not available
    return staticRoutes
  }
}
