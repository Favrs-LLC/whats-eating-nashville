import { NextRequest } from 'next/server'
import { verifyBasicAuth, createUnauthorizedResponse } from '@/lib/auth'
import { generateSEOTitleDesc, isOpenAIConfigured } from '@/lib/ai'

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

    const { article } = await request.json()

    if (!article || !article.title || !article.place || !article.creator) {
      return new Response(JSON.stringify({ 
        error: 'Article with title, place, and creator information is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const seoResult = await generateSEOTitleDesc(article)

    return new Response(JSON.stringify(seoResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error generating SEO content:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to generate SEO content' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
