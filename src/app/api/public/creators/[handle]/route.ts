import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const creator = await prisma.creator.findUnique({
      where: {
        instagramHandle: params.handle,
        isActive: true,
      },
      include: {
        articles: {
          where: { status: 'published' },
          include: {
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
          take: 20, // Limit recent articles
        },
        _count: {
          select: {
            articles: {
              where: { status: 'published' },
            },
          },
        },
      },
    })

    if (!creator) {
      return new Response(JSON.stringify({ error: 'Creator not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    const response = {
      creator: {
        id: creator.id,
        display_name: creator.displayName,
        instagram_handle: creator.instagramHandle,
        instagram_url: creator.instagramUrl,
        avatar_url: creator.avatarUrl,
        bio: creator.bio,
        links: creator.links,
        article_count: creator._count.articles,
        created_at: creator.createdAt,
        recent_articles: creator.articles.map(article => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          published_at: article.publishedAt,
          place: {
            id: article.place.id,
            name: article.place.name,
            neighborhood: article.place.neighborhood,
            cuisines: article.place.cuisines,
            avg_rating: article.place.avgRating,
          },
        })),
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
    console.error('Error fetching creator:', error)
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
