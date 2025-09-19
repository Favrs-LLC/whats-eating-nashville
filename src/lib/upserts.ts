import { prisma } from './prisma'
import type { Creator, Place } from '@prisma/client'

export interface CreatorUpsertData {
  instagram_handle: string
  display_name: string
  instagram_url: string
  avatar_url?: string
  bio?: string
  links?: Record<string, unknown>
}

export interface PlaceUpsertData {
  google_place_id: string
  name: string
  maps_url?: string
  lat?: number
  lng?: number
  address?: string
  avg_rating?: number
  review_count?: number
  neighborhood?: string
  cuisines?: string[]
  review_quotes?: Array<{
    author?: string
    rating?: number
    text: string
    reviewed_at?: string
  }>
}

/**
 * Upsert creator by Instagram handle
 */
export async function upsertCreator(data: CreatorUpsertData): Promise<Creator> {
  try {
    const creator = await prisma.creator.upsert({
      where: {
        instagramHandle: data.instagram_handle,
      },
      update: {
        displayName: data.display_name,
        instagramUrl: data.instagram_url,
        avatarUrl: data.avatar_url,
        bio: data.bio,
        links: data.links as any,
        isActive: true,
      },
      create: {
        instagramHandle: data.instagram_handle,
        displayName: data.display_name,
        instagramUrl: data.instagram_url,
        avatarUrl: data.avatar_url,
        bio: data.bio,
        links: data.links as any,
        isActive: true,
      },
    })

    return creator
  } catch (error) {
    console.error('Error upserting creator:', error)
    throw new Error(`Failed to upsert creator: ${error}`)
  }
}

/**
 * Upsert place by Google Place ID
 */
export async function upsertPlace(data: PlaceUpsertData): Promise<Place> {
  try {
    const place = await prisma.place.upsert({
      where: {
        googlePlaceId: data.google_place_id,
      },
      update: {
        name: data.name,
        mapsUrl: data.maps_url,
        lat: data.lat,
        lng: data.lng,
        address: data.address,
        avgRating: data.avg_rating,
        reviewCount: data.review_count,
        neighborhood: data.neighborhood,
        cuisines: data.cuisines || [],
      },
      create: {
        googlePlaceId: data.google_place_id,
        name: data.name,
        mapsUrl: data.maps_url,
        lat: data.lat,
        lng: data.lng,
        address: data.address,
        avgRating: data.avg_rating,
        reviewCount: data.review_count,
        neighborhood: data.neighborhood,
        cuisines: data.cuisines || [],
      },
    })

    // Handle review quotes if provided
    if (data.review_quotes && data.review_quotes.length > 0) {
      await upsertReviewQuotes(place.id, data.review_quotes)
    }

    return place
  } catch (error) {
    console.error('Error upserting place:', error)
    throw new Error(`Failed to upsert place: ${error}`)
  }
}

/**
 * Upsert review quotes for a place (with deduplication)
 */
async function upsertReviewQuotes(
  placeId: string,
  quotes: Array<{
    author?: string
    rating?: number
    text: string
    reviewed_at?: string
  }>
) {
  try {
    for (const quote of quotes) {
      // Check if similar quote already exists (by text similarity)
      const existingQuote = await prisma.reviewQuote.findFirst({
        where: {
          placeId,
          text: quote.text,
        },
      })

      if (!existingQuote) {
        await prisma.reviewQuote.create({
          data: {
            placeId,
            author: quote.author,
            rating: quote.rating,
            text: quote.text,
            reviewedAt: quote.reviewed_at ? new Date(quote.reviewed_at) : null,
            source: 'google',
          },
        })
      }
    }
  } catch (error) {
    console.error('Error upserting review quotes:', error)
    // Don't throw - review quotes are not critical
  }
}

/**
 * Generate article slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .substring(0, 100) // Limit length
}

/**
 * Check for duplicate articles for the same place
 */
export async function checkForDuplicateArticle(placeId: string): Promise<{
  isDuplicate: boolean
  canonicalArticle?: any
}> {
  try {
    const existingArticle = await prisma.article.findFirst({
      where: {
        placeId,
        status: 'published',
      },
      orderBy: {
        createdAt: 'asc', // Get the oldest (canonical) article
      },
      include: {
        creator: true,
        place: true,
      },
    })

    return {
      isDuplicate: !!existingArticle,
      canonicalArticle: existingArticle,
    }
  } catch (error) {
    console.error('Error checking for duplicate article:', error)
    return { isDuplicate: false }
  }
}
