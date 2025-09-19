import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const cursor = searchParams.get('cursor')
    const q = searchParams.get('q') // Search query
    const neighborhood = searchParams.get('neighborhood')
    const cuisine = searchParams.get('cuisine')

    // Build where clause
    const where: any = {
      status: 'published',
    }

    // Add search query
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { excerpt: { contains: q, mode: 'insensitive' } },
        { creator: { displayName: { contains: q, mode: 'insensitive' } } },
        { place: { name: { contains: q, mode: 'insensitive' } } },
      ]
    }

    // Add neighborhood filter
    if (neighborhood) {
      where.place = {
        ...where.place,
        neighborhood: { equals: neighborhood, mode: 'insensitive' },
      }
    }

    // Add cuisine filter
    if (cuisine) {
      where.place = {
        ...where.place,
        cuisines: { has: cuisine },
      }
    }

    // Add cursor pagination
    if (cursor) {
      where.id = { lt: cursor }
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
            instagramHandle: true,
            avatarUrl: true,
          },
        },
        place: {
          select: {
            id: true,
            name: true,
            neighborhood: true,
            cuisines: true,
            avgRating: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit + 1, // Get one extra to check if there are more
    })

    const hasMore = articles.length > limit
    const items = hasMore ? articles.slice(0, -1) : articles
    const nextCursor = hasMore ? items[items.length - 1]?.id : null

    const response = {
      articles: items.map(article => ({
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        published_at: article.publishedAt,
        creator: {
          id: article.creator.id,
          display_name: article.creator.displayName,
          instagram_handle: article.creator.instagramHandle,
          avatar_url: article.creator.avatarUrl,
        },
        place: {
          id: article.place.id,
          name: article.place.name,
          neighborhood: article.place.neighborhood,
          cuisines: article.place.cuisines,
          avg_rating: article.place.avgRating,
        },
      })),
      pagination: {
        limit,
        next_cursor: nextCursor,
        has_more: hasMore,
      },
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })

  } catch (error) {
    console.error('Error fetching articles:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
