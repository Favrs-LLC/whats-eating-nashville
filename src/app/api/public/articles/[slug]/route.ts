import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: {
        slug: params.slug,
        status: 'published',
      },
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
            instagramHandle: true,
            instagramUrl: true,
            avatarUrl: true,
            bio: true,
          },
        },
        place: {
          select: {
            id: true,
            googlePlaceId: true,
            name: true,
            address: true,
            neighborhood: true,
            cuisines: true,
            avgRating: true,
            reviewCount: true,
            mapsUrl: true,
            lat: true,
            lng: true,
          },
        },
      },
    })

    if (!article) {
      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    const response = {
      article: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        body_html: article.bodyHtml,
        published_at: article.publishedAt,
        source_platform: article.sourcePlatform,
        source_post_url: article.sourcePostUrl,
        creator: {
          id: article.creator.id,
          display_name: article.creator.displayName,
          instagram_handle: article.creator.instagramHandle,
          instagram_url: article.creator.instagramUrl,
          avatar_url: article.creator.avatarUrl,
          bio: article.creator.bio,
        },
        place: {
          id: article.place.id,
          google_place_id: article.place.googlePlaceId,
          name: article.place.name,
          address: article.place.address,
          neighborhood: article.place.neighborhood,
          cuisines: article.place.cuisines,
          avg_rating: article.place.avgRating,
          review_count: article.place.reviewCount,
          maps_url: article.place.mapsUrl,
          coordinates: article.place.lat && article.place.lng ? {
            lat: article.place.lat,
            lng: article.place.lng,
          } : null,
        },
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
    console.error('Error fetching article:', error)
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
