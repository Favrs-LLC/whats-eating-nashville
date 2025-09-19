// OpenAI integration utilities
// Guarded by OPENAI_API_KEY environment variable

interface EnhanceCreatorBioOptions {
  tone?: 'friendly' | 'professional' | 'casual'
  length?: number
}

interface SummarizeArticleResult {
  excerpt: string
  tags: string[]
}

interface SEOResult {
  title: string
  description: string
}

/**
 * Check if OpenAI is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY
}

/**
 * Enhance creator bio with AI
 */
export async function enhanceCreatorBio(
  bio: string, 
  options: EnhanceCreatorBioOptions = {}
): Promise<string> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured')
  }

  const { tone = 'friendly', length = 120 } = options

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional copywriter specializing in food and lifestyle content. Enhance creator bios to be engaging and authentic while maintaining the original voice.`
          },
          {
            role: 'user',
            content: `Please enhance this food creator bio to be more engaging while keeping it ${tone} in tone and under ${length} characters:\n\n"${bio}"`
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content?.trim() || bio
  } catch (error) {
    console.error('Error enhancing creator bio:', error)
    throw error
  }
}

/**
 * Generate article excerpt and tags from HTML content
 */
export async function summarizeArticle(html: string): Promise<SummarizeArticleResult> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured')
  }

  // Strip HTML tags for analysis
  const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional food writer and editor. Create compelling excerpts and relevant tags for Nashville food articles.`
          },
          {
            role: 'user',
            content: `Based on this article content, create:
1. A compelling excerpt (2-3 sentences, max 200 characters)
2. 3-5 relevant tags for Nashville food content

Article content:
"${textContent}"

Respond in JSON format:
{
  "excerpt": "...",
  "tags": ["tag1", "tag2", "tag3"]
}`
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content?.trim()
    
    try {
      return JSON.parse(content)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        excerpt: textContent.substring(0, 200) + '...',
        tags: ['Nashville', 'Food', 'Restaurant']
      }
    }
  } catch (error) {
    console.error('Error summarizing article:', error)
    throw error
  }
}

/**
 * Generate SEO-optimized title and description
 */
export async function generateSEOTitleDesc(article: {
  title: string
  excerpt?: string
  place: { name: string; neighborhood?: string }
  creator: { displayName: string }
}): Promise<SEOResult> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured')
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an SEO expert specializing in food and restaurant content. Create compelling, search-optimized titles and descriptions.`
          },
          {
            role: 'user',
            content: `Create SEO-optimized title and meta description for this Nashville food article:

Title: ${article.title}
Restaurant: ${article.place.name}
Neighborhood: ${article.place.neighborhood || 'Nashville'}
Creator: ${article.creator.displayName}
Excerpt: ${article.excerpt || 'A Nashville food review'}

Requirements:
- Title: 50-60 characters, include restaurant name and Nashville
- Description: 150-160 characters, compelling and informative

Respond in JSON format:
{
  "title": "...",
  "description": "..."
}`
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content?.trim()
    
    try {
      return JSON.parse(content)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        title: `${article.place.name} Review - ${article.place.neighborhood || 'Nashville'}`,
        description: `${article.excerpt || article.title} - A Nashville food review by ${article.creator.displayName}`
      }
    }
  } catch (error) {
    console.error('Error generating SEO content:', error)
    throw error
  }
}

/**
 * Enhance article content with AI suggestions
 */
export async function enhanceArticleContent(html: string): Promise<string> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured')
  }

  const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional food writer and editor. Enhance food articles to be more engaging, descriptive, and informative while maintaining the original voice and structure.`
          },
          {
            role: 'user',
            content: `Please enhance this food article to be more engaging and descriptive. Keep the original structure and voice, but add more vivid descriptions, sensory details, and helpful information for readers:\n\n"${textContent}"`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const enhancedContent = data.choices[0]?.message?.content?.trim()
    
    // Convert enhanced text back to HTML structure
    // This is a simple approach - in production, you might want more sophisticated HTML preservation
    return enhancedContent
      ? `<p>${enhancedContent.split('\n\n').join('</p><p>')}</p>`
      : html
  } catch (error) {
    console.error('Error enhancing article content:', error)
    throw error
  }
}
