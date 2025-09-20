import { NextRequest, NextResponse } from 'next/server'
import { getAllPlaces } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const cuisine = searchParams.get('cuisine')
    const neighborhood = searchParams.get('neighborhood')

    // Get all places using Supabase client (includes slug field)
    const allPlaces = await getAllPlaces()
    
    // Filter by cuisine if specified
    let filteredPlaces = allPlaces
    if (cuisine) {
      filteredPlaces = allPlaces.filter(place => 
        place.cuisines.includes(cuisine)
      )
    }
    
    // Filter by neighborhood if specified
    if (neighborhood) {
      filteredPlaces = filteredPlaces.filter(place => 
        place.neighborhood?.toLowerCase() === neighborhood.toLowerCase()
      )
    }

    // Apply limit
    const places = filteredPlaces.slice(0, limit)
    const hasMore = filteredPlaces.length > limit

    const response = {
      places: places.map(place => ({
        id: place.id,
        google_place_id: place.googlePlaceId,
        slug: place.slug,
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
        article_count: 0, // TODO: Calculate from articles array
        review_quote_count: 0, // TODO: Calculate from reviews array
        created_at: place.createdAt,
      })),
      pagination: {
        limit,
        next_cursor: null, // Simplified pagination for now
        has_more: hasMore,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching places:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}