import { NextRequest } from 'next/server'
import { verifyBasicAuth, createUnauthorizedResponse } from '@/lib/auth'
import { enhanceCreatorBio, isOpenAIConfigured } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyBasicAuth(request)) {
      return createUnauthorizedResponse()
    }

    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      return new Response(JSON.stringify({ 
        error: 'OpenAI API not configured' 
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { bio, tone, length } = await request.json()

    if (!bio) {
      return new Response(JSON.stringify({ 
        error: 'Bio text is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const enhancedBio = await enhanceCreatorBio(bio, { tone, length })

    return new Response(JSON.stringify({ 
      enhanced_bio: enhancedBio 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error enhancing bio:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to enhance bio' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
