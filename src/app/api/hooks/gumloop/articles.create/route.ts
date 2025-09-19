import { NextRequest } from 'next/server'
import { verifyWebhookToken, verifyWebhookHmac, createUnauthorizedResponse } from '@/lib/auth'
import { 
  logWebhookRequest, 
  checkIdempotencyKey, 
  createWebhookResponse, 
  createWebhookError,
  extractRequestBody,
  validateRequiredFields 
} from '@/lib/webhooks'
import { createArticle } from '@/lib/articles'
import type { CreateArticleData } from '@/lib/articles'

const REQUIRED_FIELDS = [
  'title',
  'body_html',
  'source.platform',
  'source.post_url',
  'source.username',
  'creator.instagram_handle',
  'creator.display_name',
  'creator.instagram_url',
  'place.google_place_id',
  'place.name'
]

export async function POST(request: NextRequest) {
  const endpoint = '/api/hooks/gumloop/articles.create'
  let requestBody: any = null

  try {
    // Check idempotency key first
    const idemKey = request.headers.get('x-idempotency-key')
    if (idemKey) {
      const { exists, response } = await checkIdempotencyKey(idemKey, endpoint)
      if (exists && response) {
        return createWebhookResponse(response, 200)
      }
    }

    // Verify authentication (Bearer token or HMAC)
    const hasValidToken = verifyWebhookToken(request)
    const hasValidHmac = await verifyWebhookHmac(request.clone())

    if (!hasValidToken && !hasValidHmac) {
      await logWebhookRequest('gumloop', endpoint, 401, false, { error: 'Unauthorized' }, idemKey || undefined)
      return createUnauthorizedResponse('Invalid authentication')
    }

    // Extract and validate request body
    const { success, body, error } = await extractRequestBody(request)
    if (!success) {
      await logWebhookRequest('gumloop', endpoint, 400, false, { error }, idemKey)
      return createWebhookError('Invalid JSON body', 400)
    }

    requestBody = body

    // Validate required fields
    const validation = validateRequiredFields(body, REQUIRED_FIELDS)
    if (!validation.valid) {
      const errorMsg = `Missing required fields: ${validation.missing?.join(', ')}`
      await logWebhookRequest('gumloop', endpoint, 400, false, { error: errorMsg, body }, idemKey)
      return createWebhookError(errorMsg, 400, 'MISSING_FIELDS')
    }

    // Transform request data to internal format
    const articleData: CreateArticleData = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      body_html: body.body_html,
      tags: body.tags,
      source: {
        platform: body.source.platform,
        post_url: body.source.post_url,
        username: body.source.username,
      },
      creator: {
        instagram_handle: body.creator.instagram_handle,
        display_name: body.creator.display_name,
        instagram_url: body.creator.instagram_url,
        avatar_url: body.creator.avatar_url,
        bio: body.creator.bio,
      },
      place: {
        google_place_id: body.place.google_place_id,
        name: body.place.name,
        maps_url: body.place.maps_url,
        lat: body.place.lat,
        lng: body.place.lng,
        address: body.place.address,
        avg_rating: body.place.avg_rating,
        review_count: body.place.review_count,
        review_quotes: body.place.review_quotes,
      },
      raw: body.raw,
    }

    // Create the article
    const result = await createArticle(articleData)

    if (!result.success) {
      await logWebhookRequest('gumloop', endpoint, 500, false, { 
        error: result.error, 
        body: requestBody 
      }, idemKey)
      return createWebhookError(result.error || 'Failed to create article', 500, 'CREATION_FAILED')
    }

    // Handle duplicate case
    if (result.duplicate && result.canonical_article_id) {
      const response = {
        duplicate: true,
        canonical_article_id: result.canonical_article_id,
        message: 'Article for this place already exists',
      }

      await logWebhookRequest('gumloop', endpoint, 202, true, response, idemKey)

      // Optionally notify enhancer service
      if (process.env.GUMLOOP_ENHANCER_URL) {
        await notifyEnhancerService(result.canonical_article_id, articleData)
      }

      return createWebhookResponse(response, 202)
    }

    // Success case
    const response = {
      article_id: result.article_id,
      slug: result.slug,
      canonical: result.canonical,
      message: 'Article created successfully',
    }

    await logWebhookRequest('gumloop', endpoint, 201, true, response, idemKey)
    return createWebhookResponse(response, 201)

  } catch (error) {
    console.error('Unexpected error in articles.create webhook:', error)
    
    await logWebhookRequest('gumloop', endpoint, 500, false, { 
      error: error instanceof Error ? error.message : 'Unknown error',
      body: requestBody 
    }, request.headers.get('x-idempotency-key'))

    return createWebhookError('Internal server error', 500, 'INTERNAL_ERROR')
  }
}

/**
 * Notify enhancer service about duplicate article
 */
async function notifyEnhancerService(canonicalArticleId: string, newArticleData: CreateArticleData) {
  try {
    const enhancerUrl = process.env.GUMLOOP_ENHANCER_URL
    const enhancerSecret = process.env.ENHANCER_SECRET

    if (!enhancerUrl || !enhancerSecret) {
      console.warn('Enhancer service not configured')
      return
    }

    const payload = {
      canonical_article_id: canonicalArticleId,
      new_article_fields: {
        body_html: newArticleData.body_html,
        excerpt: newArticleData.excerpt,
        sources: [
          {
            platform: newArticleData.source.platform,
            post_url: newArticleData.source.post_url,
          },
        ],
      },
    }

    await fetch(enhancerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${enhancerSecret}`,
      },
      body: JSON.stringify(payload),
    })

    console.log('Notified enhancer service about duplicate article')
  } catch (error) {
    console.error('Failed to notify enhancer service:', error)
    // Don't throw - this is optional
  }
}

// Only allow POST requests
export async function GET() {
  return createWebhookError('Method not allowed', 405, 'METHOD_NOT_ALLOWED')
}

export async function PUT() {
  return createWebhookError('Method not allowed', 405, 'METHOD_NOT_ALLOWED')
}

export async function DELETE() {
  return createWebhookError('Method not allowed', 405, 'METHOD_NOT_ALLOWED')
}
