import { NextRequest } from 'next/server'
import { verifyBasicAuth, createUnauthorizedResponse } from '@/lib/auth'
import { summarizeArticle, isOpenAIConfigured } from '@/lib/ai'

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

    const { html } = await request.json()

    if (!html) {
      return new Response(JSON.stringify({ 
        error: 'Article HTML content is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const result = await summarizeArticle(html)

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error summarizing article:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to summarize article' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
