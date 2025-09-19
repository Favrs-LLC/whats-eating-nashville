import { prisma } from './prisma'

/**
 * Get article by slug with all related data
 */
export async function getArticleBySlug(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: {
        slug,
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

    return article
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
    const creator = await prisma.creator.findUnique({
      where: {
        instagramHandle: handle,
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

    return creator
  } catch (error) {
    console.error('Error fetching creator:', error)
    return null
  }
}

/**
 * Get place by ID with articles and reviews
 */
export async function getPlaceById(id: string) {
  try {
    const place = await prisma.place.findUnique({
      where: {
        id,
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
          take: 10,
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

    return place
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
    const articles = await prisma.article.findMany({
      where: { status: 'published' },
      include: {
        creator: {
          select: {
            displayName: true,
            instagramHandle: true,
            avatarUrl: true,
          },
        },
        place: {
          select: {
            name: true,
            neighborhood: true,
            cuisines: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
    })

    return articles
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
    const creators = await prisma.creator.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            articles: {
              where: { status: 'published' },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return creators
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
    const places = await prisma.place.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return places
  } catch (error) {
    console.error('Error fetching places:', error)
    return []
  }
}
