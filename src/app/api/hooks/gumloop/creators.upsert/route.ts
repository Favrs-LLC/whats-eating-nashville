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
import { upsertCreator } from '@/lib/upserts'

const REQUIRED_FIELDS = [
  'instagram_handle',
  'display_name',
  'instagram_url'
]

export async function POST(request: NextRequest) {
  const endpoint = '/api/hooks/gumloop/creators.upsert'
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

    // Validate Instagram handle format
    const instagramHandle = body.instagram_handle.replace('@', '') // Remove @ if present
    if (!/^[a-zA-Z0-9._]{1,30}$/.test(instagramHandle)) {
      const errorMsg = 'Invalid Instagram handle format'
      await logWebhookRequest('gumloop', endpoint, 400, false, { error: errorMsg, body }, idemKey)
      return createWebhookError(errorMsg, 400, 'INVALID_HANDLE')
    }

    // Upsert the creator
    const creator = await upsertCreator({
      instagram_handle: instagramHandle,
      display_name: body.display_name,
      instagram_url: body.instagram_url,
      avatar_url: body.avatar_url,
      bio: body.bio,
      links: body.links,
    })

    // Success response
    const response = {
      creator_id: creator.id,
      instagram_handle: creator.instagramHandle,
      display_name: creator.displayName,
      created_at: creator.createdAt,
      message: 'Creator upserted successfully',
    }

    await logWebhookRequest('gumloop', endpoint, 200, true, response, idemKey)
    return createWebhookResponse(response, 200)

  } catch (error) {
    console.error('Unexpected error in creators.upsert webhook:', error)
    
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
