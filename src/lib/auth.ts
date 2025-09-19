import { NextRequest } from 'next/server'
import { createHmac } from 'crypto'

/**
 * Verify webhook Bearer token authentication
 */
export function verifyWebhookToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const expectedToken = process.env.WEBHOOK_TOKEN
  
  if (!expectedToken) {
    console.error('WEBHOOK_TOKEN not configured')
    return false
  }
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  
  const token = authHeader.substring(7) // Remove 'Bearer ' prefix
  return token === expectedToken
}

/**
 * Verify webhook HMAC signature
 */
export async function verifyWebhookHmac(request: NextRequest | Request): Promise<boolean> {
  const signature = request.headers.get('x-signature')
  const secret = process.env.WEBHOOK_HMAC_SECRET
  
  if (!secret) {
    console.error('WEBHOOK_HMAC_SECRET not configured')
    return false
  }
  
  if (!signature) {
    return false
  }
  
  try {
    const body = await request.text()
    const expectedSignature = createHmac('sha256', secret)
      .update(body)
      .digest('hex')
    
    // Compare signatures using timing-safe comparison
    return signature === `sha256=${expectedSignature}`
  } catch (error) {
    console.error('Error verifying HMAC signature:', error)
    return false
  }
}

/**
 * Verify Basic Auth for admin routes
 */
export function verifyBasicAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const expectedUser = process.env.ADMIN_BASIC_AUTH_USER
  const expectedPass = process.env.ADMIN_BASIC_AUTH_PASS
  
  if (!expectedUser || !expectedPass) {
    console.error('Admin basic auth not configured')
    return false
  }
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false
  }
  
  try {
    const credentials = Buffer.from(authHeader.substring(6), 'base64').toString()
    const [username, password] = credentials.split(':')
    
    return username === expectedUser && password === expectedPass
  } catch (error) {
    console.error('Error verifying basic auth:', error)
    return false
  }
}

/**
 * Create a 401 Unauthorized response
 */
export function createUnauthorizedResponse(message = 'Unauthorized') {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

/**
 * Create a Basic Auth challenge response
 */
export function createBasicAuthChallenge() {
  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Area"',
    },
  })
}
