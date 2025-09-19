import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const cursor = searchParams.get('cursor')

    const where: any = {
      isActive: true,
    }

    if (cursor) {
      where.id = { lt: cursor }
    }

    const creators = await prisma.creator.findMany({
      where,
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
      take: limit + 1,
    })

    const hasMore = creators.length > limit
    const items = hasMore ? creators.slice(0, -1) : creators
    const nextCursor = hasMore ? items[items.length - 1]?.id : null

    const response = {
      creators: items.map(creator => ({
        id: creator.id,
        display_name: creator.displayName,
        instagram_handle: creator.instagramHandle,
        instagram_url: creator.instagramUrl,
        avatar_url: creator.avatarUrl,
        bio: creator.bio,
        article_count: creator._count.articles,
        created_at: creator.createdAt,
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
    console.error('Error fetching creators:', error)
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
