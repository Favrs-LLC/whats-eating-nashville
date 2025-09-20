import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type-safe database queries using Supabase client
export const supabaseQueries = {
  // Get creators with article counts
  async getCreators(limit = 20) {
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
        articles:Article!inner(count)
      `)
      .eq('isActive', true)
      .order('createdAt', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  // Get places with article counts  
  async getPlaces(limit = 20) {
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
        articles:Article!inner(count)
      `)
      .order('createdAt', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  // Get articles with creator and place info
  async getArticles(limit = 20) {
    const { data, error } = await supabase
      .from('Article')
      .select(`
        id,
        slug,
        title,
        excerpt,
        publishedAt,
        status,
        creator:Creator!inner(
          id,
          displayName,
          instagramHandle,
          avatarUrl
        ),
        place:Place!inner(
          id,
          name,
          neighborhood,
          cuisines,
          avgRating
        )
      `)
      .eq('status', 'published')
      .order('publishedAt', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  // Get single creator by handle
  async getCreatorByHandle(handle: string) {
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
          place:Place!inner(name, neighborhood)
        )
      `)
      .eq('instagramHandle', handle)
      .eq('isActive', true)
      .eq('articles.status', 'published')
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get single place by ID
  async getPlaceById(placeId: string) {
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
          creator:Creator!inner(displayName, instagramHandle, avatarUrl)
        ),
        reviews:ReviewQuote(
          id,
          author,
          rating,
          quote,
          source,
          createdAt
        )
      `)
      .eq('id', placeId)
      .eq('articles.status', 'published')
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get single article by slug
  async getArticleBySlug(slug: string) {
    const { data, error } = await supabase
      .from('Article')
      .select(`
        id,
        slug,
        title,
        excerpt,
        content,
        publishedAt,
        status,
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
      .single();
    
    if (error) throw error;
    return data;
  }
};
