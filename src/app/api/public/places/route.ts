import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const cursor = searchParams.get('cursor')
    const neighborhood = searchParams.get('neighborhood')
    const cuisine = searchParams.get('cuisine')

    const where: any = {}

    // Add neighborhood filter
    if (neighborhood) {
      where.neighborhood = { equals: neighborhood, mode: 'insensitive' }
    }

    // Add cuisine filter
    if (cuisine) {
      where.cuisines = { has: cuisine }
    }

    // Add cursor pagination
    if (cursor) {
      where.id = { lt: cursor }
    }

    const places = await prisma.place.findMany({
      where,
      include: {
        _count: {
          select: {
            articles: {
              where: { status: 'published' },
            },
            reviews: true,
          },
        },
      },
      orderBy: [
        { _count: { articles: 'desc' } }, // Most covered places first
        { createdAt: 'desc' },
      ],
      take: limit + 1,
    })

    const hasMore = places.length > limit
    const items = hasMore ? places.slice(0, -1) : places
    const nextCursor = hasMore ? items[items.length - 1]?.id : null

    const response = {
      places: items.map(place => ({
        id: place.id,
        google_place_id: place.googlePlaceId,
        name: place.name,
        address: place.address,
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
    console.error('Error fetching places:', error)
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
