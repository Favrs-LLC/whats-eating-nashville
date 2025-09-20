import { supabase } from './supabase'

/**
 * Get article by slug with all related data
 */
export async function getArticleBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('Article')
      .select(`
        id,
        slug,
        title,
        excerpt,
        bodyHtml,
        publishedAt,
        creator:Creator!inner(
          id,
          displayName,
          instagramHandle,
          instagramUrl,
          avatarUrl,
          bio
        ),
        place:Place!inner(
          id,
          googlePlaceId,
          name,
          address,
          neighborhood,
          cuisines,
          avgRating,
          reviewCount,
          mapsUrl,
          lat,
          lng
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

/**
 * Get creator by handle with articles
 */
export async function getCreatorByHandle(handle: string) {
  try {
    const { data, error } = await supabase
      .from('Creator')
      .select(`
        id,
        displayName,
        instagramHandle,
        instagramUrl,
        avatarUrl,
        bio,
        isActive,
        createdAt,
        articles:Article!inner(
          id,
          slug,
          title,
          excerpt,
          publishedAt,
          sourcePostUrl,
          place:Place!inner(
            id,
            name,
            neighborhood,
            cuisines,
            avgRating
          )
        )
      `)
      .eq('instagramHandle', handle)
      .eq('isActive', true)
      .eq('articles.status', 'published')
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching creator:', error)
    return null
  }
}

/**
 * Get place by slug with articles and reviews
 */
export async function getPlaceBySlug(slug: string) {
  try {
    // First get the place
    const { data: place, error: placeError } = await supabase
      .from('Place')
      .select(`
        id,
        googlePlaceId,
        slug,
        name,
        address,
        city,
        neighborhood,
        cuisines,
        avgRating,
        reviewCount,
        mapsUrl,
        lat,
        lng,
        createdAt
      `)
      .eq('slug', slug)
      .single()

    if (placeError) throw placeError
    if (!place) return null

    // Get articles for this place
    const { data: articles } = await supabase
      .from('Article')
      .select(`
        id,
        slug,
        title,
        excerpt,
        publishedAt,
        sourcePostUrl,
        creator:Creator!inner(
          id,
          displayName,
          instagramHandle,
          avatarUrl
        )
      `)
      .eq('placeId', place.id)
      .eq('status', 'published')
      .order('publishedAt', { ascending: false })

    // Get reviews for this place
    const { data: reviews } = await supabase
      .from('ReviewQuote')
      .select(`
        id,
        author,
        rating,
        text,
        source,
        reviewedAt
      `)
      .eq('placeId', place.id)
      .order('reviewedAt', { ascending: false })

    return {
      ...place,
      articles: articles || [],
      reviews: reviews || []
    }
  } catch (error) {
    console.error('Error fetching place by slug:', error)
    return null
  }
}

/**
 * Get place by ID with articles and reviews (legacy function)
 */
export async function getPlaceById(id: string) {
  try {
    const { data, error } = await supabase
      .from('Place')
      .select(`
        id,
        googlePlaceId,
        name,
        address,
        city,
        neighborhood,
        cuisines,
        avgRating,
        reviewCount,
        mapsUrl,
        lat,
        lng,
        createdAt,
        articles:Article!inner(
          id,
          slug,
          title,
          excerpt,
          publishedAt,
          sourcePostUrl,
          creator:Creator!inner(
            id,
            displayName,
            instagramHandle,
            avatarUrl
          )
        ),
        reviews:ReviewQuote(
          id,
          author,
          rating,
          text,
          source,
          reviewedAt
        )
      `)
      .eq('id', id)
      .eq('articles.status', 'published')
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching place:', error)
    return null
  }
}

/**
 * Get recent articles for home page
 */
export async function getRecentArticles(limit = 6) {
  try {
    const { data, error } = await supabase
      .from('Article')
      .select(`
        id,
        slug,
        title,
        excerpt,
        publishedAt,
        sourcePostUrl,
        creator:Creator!inner(
          displayName,
          instagramHandle,
          avatarUrl
        ),
        place:Place!inner(
          name,
          neighborhood,
          cuisines
        )
      `)
      .eq('status', 'published')
      .order('publishedAt', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching recent articles:', error)
    return []
  }
}

/**
 * Get all creators with article counts
 */
export async function getAllCreators() {
  try {
    const { data, error } = await supabase
      .from('Creator')
      .select(`
        id,
        displayName,
        instagramHandle,
        instagramUrl,
        avatarUrl,
        bio,
        isActive,
        createdAt
      `)
      .eq('isActive', true)
      .order('createdAt', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching creators:', error)
    return []
  }
}

/**
 * Get all places with article counts
 */
export async function getAllPlaces() {
  try {
    const { data, error } = await supabase
      .from('Place')
      .select(`
        id,
        googlePlaceId,
        slug,
        name,
        address,
        city,
        neighborhood,
        cuisines,
        avgRating,
        reviewCount,
        mapsUrl,
        lat,
        lng,
        createdAt
      `)
      .order('createdAt', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching places:', error)
    return []
  }
}
