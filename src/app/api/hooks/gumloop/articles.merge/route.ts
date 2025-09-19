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
import { mergeArticle } from '@/lib/articles'

const REQUIRED_FIELDS = [
  'canonical_article_id',
  'place_id',
  'new_article_fields'
]

export async function POST(request: NextRequest) {
  const endpoint = '/api/hooks/gumloop/articles.merge'
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
      await logWebhookRequest('gumloop', endpoint, 401, false, { error: 'Unauthorized' }, idemKey)
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

    // Merge the article
    const result = await mergeArticle({
      canonical_article_id: body.canonical_article_id,
      place_id: body.place_id,
      new_article_fields: body.new_article_fields,
    })

    if (!result.success) {
      await logWebhookRequest('gumloop', endpoint, 500, false, { 
        error: result.error, 
        body: requestBody 
      }, idemKey)
      return createWebhookError(result.error || 'Failed to merge article', 500, 'MERGE_FAILED')
    }

    // Success response
    const response = {
      updated: result.updated,
      canonical_article_id: body.canonical_article_id,
      message: 'Article merged successfully',
    }

    await logWebhookRequest('gumloop', endpoint, 200, true, response, idemKey)
    return createWebhookResponse(response, 200)

  } catch (error) {
    console.error('Unexpected error in articles.merge webhook:', error)
    
    await logWebhookRequest('gumloop', endpoint, 500, false, { 
      error: error instanceof Error ? error.message : 'Unknown error',
      body: requestBody 
    }, request.headers.get('x-idempotency-key'))

    return createWebhookError('Internal server error', 500, 'INTERNAL_ERROR')
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
