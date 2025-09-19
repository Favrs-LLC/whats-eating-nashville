import { prisma } from './prisma'
import { upsertCreator, upsertPlace, generateSlug, checkForDuplicateArticle } from './upserts'
import { generateSourceHash } from './webhooks'
import type { Article } from '@prisma/client'

export interface CreateArticleData {
  title: string
  slug?: string
  excerpt?: string
  body_html: string
  tags?: string[]
  source: {
    platform: string
    post_url: string
    username: string
  }
  creator: {
    instagram_handle: string
    display_name: string
    instagram_url: string
    avatar_url?: string
    bio?: string
  }
  place: {
    google_place_id: string
    name: string
    maps_url?: string
    lat?: number
    lng?: number
    address?: string
    avg_rating?: number
    review_count?: number
    review_quotes?: Array<{
      author?: string
      rating?: number
      text: string
      reviewed_at?: string
    }>
  }
  raw?: {
    caption?: string
    transcript?: string
  }
}

export interface CreateArticleResult {
  success: boolean
  article_id?: string
  slug?: string
  canonical?: boolean
  duplicate?: boolean
  canonical_article_id?: string
  error?: string
}

/**
 * Create new article with creator and place upserts
 */
export async function createArticle(data: CreateArticleData): Promise<CreateArticleResult> {
  try {
    // Upsert creator
    const creator = await upsertCreator(data.creator)

    // Upsert place
    const place = await upsertPlace(data.place)

    // Check for duplicate articles
    const duplicateCheck = await checkForDuplicateArticle(place.id)
    
    if (duplicateCheck.isDuplicate && duplicateCheck.canonicalArticle) {
      // Log merge event
      await logMergeEvent(
        duplicateCheck.canonicalArticle.id,
        'incoming-article-id', // Will be set when we create the article
        place.id,
        data
      )

      return {
        success: true,
        duplicate: true,
        canonical_article_id: duplicateCheck.canonicalArticle.id,
      }
    }

    // Generate slug if not provided
    const slug = data.slug || generateSlug(data.title)

    // Create the article
    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: await ensureUniqueSlug(slug),
        excerpt: data.excerpt,
        bodyHtml: data.body_html,
        status: 'published',
        sourcePlatform: data.source.platform,
        sourcePostUrl: data.source.post_url,
        sourceUsername: data.source.username,
        creatorId: creator.id,
        placeId: place.id,
      },
    })

    // Create source post record
    await createSourcePost(data, creator.id, place.id)

    return {
      success: true,
      article_id: article.id,
      slug: article.slug,
      canonical: true,
    }

  } catch (error) {
    console.error('Error creating article:', error)
    return {
      success: false,
      error: `Failed to create article: ${error}`,
    }
  }
}

/**
 * Merge article content with existing canonical article
 */
export async function mergeArticle(data: {
  canonical_article_id: string
  place_id: string
  new_article_fields: {
    body_html?: string
    excerpt?: string
    review_quotes?: Array<{
      author?: string
      rating?: number
      text: string
    }>
    sources?: Array<{
      platform: string
      post_url: string
    }>
  }
}): Promise<{ success: boolean; updated?: boolean; error?: string }> {
  try {
    const canonicalArticle = await prisma.article.findUnique({
      where: { id: data.canonical_article_id },
      include: { place: true }
    })

    if (!canonicalArticle) {
      return { success: false, error: 'Canonical article not found' }
    }

    // Merge body HTML intelligently
    let mergedBodyHtml = canonicalArticle.bodyHtml
    if (data.new_article_fields.body_html) {
      mergedBodyHtml = mergeHtmlContent(
        canonicalArticle.bodyHtml,
        data.new_article_fields.body_html
      )
    }

    // Update the canonical article
    await prisma.article.update({
      where: { id: data.canonical_article_id },
      data: {
        bodyHtml: mergedBodyHtml,
        excerpt: data.new_article_fields.excerpt || canonicalArticle.excerpt,
        updatedAt: new Date(),
      },
    })

    // Add new review quotes if provided
    if (data.new_article_fields.review_quotes) {
      await addReviewQuotes(data.place_id, data.new_article_fields.review_quotes)
    }

    // Log the merge event
    await logMergeEvent(
      data.canonical_article_id,
      'merged-content',
      data.place_id,
      data.new_article_fields
    )

    return { success: true, updated: true }

  } catch (error) {
    console.error('Error merging article:', error)
    return { success: false, error: `Failed to merge article: ${error}` }
  }
}

/**
 * Create source post record for tracking
 */
async function createSourcePost(
  data: CreateArticleData,
  creatorId: string,
  placeId: string
) {
  try {
    const hash = generateSourceHash(
      data.source.post_url,
      data.raw?.caption,
      data.raw?.transcript
    )

    await prisma.sourcePost.create({
      data: {
        platform: data.source.platform,
        postUrl: data.source.post_url,
        caption: data.raw?.caption,
        transcript: data.raw?.transcript,
        mediaType: 'instagram_post', // Default for now
        mediaUrl: data.source.post_url,
        fetchedAt: new Date(),
        hash,
        creatorId,
        placeId,
      },
    })
  } catch (error) {
    console.error('Error creating source post:', error)
    // Don't throw - this is for tracking only
  }
}

/**
 * Ensure slug is unique by appending number if needed
 */
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await prisma.article.findUnique({
      where: { slug },
    })

    if (!existing) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

/**
 * Log merge event for audit trail
 */
async function logMergeEvent(
  canonicalArticleId: string,
  incomingArticleId: string,
  placeId: string,
  payload: any
) {
  try {
    await prisma.mergeEvent.create({
      data: {
        canonicalArticleId,
        incomingArticleId,
        placeId,
        payloadJson: payload,
      },
    })
  } catch (error) {
    console.error('Error logging merge event:', error)
  }
}

/**
 * Merge HTML content intelligently
 */
function mergeHtmlContent(existingHtml: string, newHtml: string): string {
  // Simple merge strategy: append new content as a new section
  // In production, this could be more sophisticated
  return `${existingHtml}\n\n<h2>Update</h2>\n${newHtml}`
}

/**
 * Add review quotes to a place
 */
async function addReviewQuotes(
  placeId: string,
  quotes: Array<{
    author?: string
    rating?: number
    text: string
  }>
) {
  try {
    for (const quote of quotes) {
      // Check for duplicates
      const existing = await prisma.reviewQuote.findFirst({
        where: {
          placeId,
          text: quote.text,
        },
      })

      if (!existing) {
        await prisma.reviewQuote.create({
          data: {
            placeId,
            author: quote.author,
            rating: quote.rating,
            text: quote.text,
            source: 'merged',
          },
        })
      }
    }
  } catch (error) {
    console.error('Error adding review quotes:', error)
  }
}
