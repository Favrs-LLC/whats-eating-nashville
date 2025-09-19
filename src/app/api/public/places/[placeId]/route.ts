import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { placeId: string } }
) {
  try {
    const place = await prisma.place.findUnique({
      where: {
        id: params.placeId,
      },
      include: {
        articles: {
          where: { status: 'published' },
          include: {
            creator: {
              select: {
                id: true,
                displayName: true,
                instagramHandle: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            publishedAt: 'desc',
          },
        },
        reviews: {
          orderBy: {
            reviewedAt: 'desc',
          },
          take: 10, // Latest 10 review quotes
        },
        _count: {
          select: {
            articles: {
              where: { status: 'published' },
            },
            reviews: true,
          },
        },
      },
    })

    if (!place) {
      return new Response(JSON.stringify({ error: 'Place not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    const response = {
      place: {
        id: place.id,
        google_place_id: place.googlePlaceId,
        name: place.name,
        address: place.address,
        city: place.city,
        neighborhood: place.neighborhood,
        cuisines: place.cuisines,
        avg_rating: place.avgRating,
        review_count: place.reviewCount,
        maps_url: place.mapsUrl,
        coordinates: place.lat && place.lng ? {
          lat: place.lat,
          lng: place.lng,
        } : null,
        article_count: place._count.articles,
        review_quote_count: place._count.reviews,
        created_at: place.createdAt,
        articles: place.articles.map(article => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          published_at: article.publishedAt,
          source_post_url: article.sourcePostUrl,
          creator: {
            id: article.creator.id,
            display_name: article.creator.displayName,
            instagram_handle: article.creator.instagramHandle,
            avatar_url: article.creator.avatarUrl,
          },
        })),
        recent_reviews: place.reviews.map(review => ({
          id: review.id,
          author: review.author,
          rating: review.rating,
          text: review.text,
          reviewed_at: review.reviewedAt,
          source: review.source,
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
    console.error('Error fetching place:', error)
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
