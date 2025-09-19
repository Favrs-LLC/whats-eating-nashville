import { prisma } from './prisma'
import { NextRequest } from 'next/server'

/**
 * Log webhook request and response
 */
export async function logWebhookRequest(
  source: string,
  endpoint: string,
  statusCode: number,
  ok: boolean,
  bodyJson: unknown,
  requestIdemKey?: string | null
) {
  try {
    await prisma.webhookLog.create({
      data: {
        source,
        endpoint,
        requestIdemKey: requestIdemKey || undefined,
        statusCode,
        ok,
        bodyJson: bodyJson as any,
      },
    })
  } catch (error) {
    console.error('Failed to log webhook request:', error)
    // Don't throw - logging shouldn't break the webhook
  }
}

/**
 * Check if idempotency key has been used before
 */
export async function checkIdempotencyKey(
  idemKey: string,
  endpoint: string
): Promise<{ exists: boolean; response?: any }> {
  try {
    const existingLog = await prisma.webhookLog.findFirst({
      where: {
        requestIdemKey: idemKey,
        endpoint,
        ok: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (existingLog) {
      return {
        exists: true,
        response: existingLog.bodyJson,
      }
    }

    return { exists: false }
  } catch (error) {
    console.error('Error checking idempotency key:', error)
    return { exists: false }
  }
}

/**
 * Create standardized webhook response
 */
export function createWebhookResponse(
  data: unknown,
  status = 200,
  headers: Record<string, string> = {}
) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
}

/**
 * Create error response for webhooks
 */
export function createWebhookError(
  message: string,
  status = 400,
  code?: string
) {
  return createWebhookResponse(
    {
      error: message,
      code,
      timestamp: new Date().toISOString(),
    },
    status
  )
}

/**
 * Extract request body safely
 */
export async function extractRequestBody(request: NextRequest) {
  try {
    const body = await request.json()
    return { success: true, body }
  } catch (error) {
    console.error('Error parsing request body:', error)
    return { success: false, error: 'Invalid JSON body' }
  }
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
  body: Record<string, unknown>,
  requiredFields: string[]
): { valid: boolean; missing?: string[] } {
  const missing = requiredFields.filter(field => {
    const value = getNestedValue(body, field)
    return value === undefined || value === null || value === ''
  })

  return {
    valid: missing.length === 0,
    missing: missing.length > 0 ? missing : undefined,
  }
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current: unknown, key: string) => {
    return current && typeof current === 'object' && current !== null && key in current 
      ? (current as Record<string, unknown>)[key] 
      : undefined
  }, obj)
}

/**
 * Generate SHA256 hash for source post deduplication
 */
export function generateSourceHash(postUrl: string, caption?: string, transcript?: string): string {
  const { createHash } = require('crypto')
  const content = `${postUrl}${caption || ''}${transcript || ''}`
  return createHash('sha256').update(content).digest('hex')
}
