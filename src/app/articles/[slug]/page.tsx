import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import InstagramEmbed from "@/components/embeds/InstagramEmbed"
import { generateArticleJsonLd, generatePageSEO } from "@/lib/seo"
import { 
  Calendar, 
  MapPin, 
  Star, 
  ExternalLink, 
  Instagram,
  User,
  Share2
} from "lucide-react"
import Link from "next/link"

// Mock data - will be replaced with real database query
const mockArticle = {
  id: '1',
  slug: 'princes-hot-chicken-line-worth-it',
  title: "Prince's Hot Chicken: The Line Was Worth It",
  excerpt: "A spicy pilgrimage on Nolensville Pike that delivers on every promise.",
  bodyHtml: `
    <h2>The Legend Lives On</h2>
    <p>Walking up to Prince's Hot Chicken on Nolensville Pike, you can't help but feel the weight of history. This isn't just any hot chicken joint – this is where it all began.</p>
    <p>The line stretches around the building, but trust me when I say it's worth every minute of the wait.</p>
    
    <h2>The Heat is Real</h2>
    <p>I ordered the medium, thinking I could handle it. I was wrong. Deliciously, perfectly wrong.</p>
    <blockquote><p>"This is what hot chicken is supposed to be like." - Every bite confirmed it.</p></blockquote>
    <p>The chicken arrives with that signature dark red coating that promises pain and delivers pleasure. Each bite is a perfect balance of heat, flavor, and that unmistakable Prince's magic.</p>
    
    <h2>Worth the Journey</h2>
    <p>Prince's isn't just a restaurant – it's a pilgrimage site for anyone serious about Nashville food. The original location on Nolensville Pike maintains that authentic, no-frills atmosphere that made this place legendary.</p>
    <p>Come hungry, come prepared for heat, and come ready to understand why Nashville's hot chicken scene exists because of this place.</p>
  `,
  status: 'published',
  sourcePlatform: 'instagram',
  sourcePostUrl: 'https://www.instagram.com/p/example123/',
  publishedAt: new Date('2024-01-15T10:30:00'),
  creator: {
    id: '1',
    displayName: 'Nash Food Tours',
    instagramHandle: 'nashfoodtours',
    instagramUrl: 'https://instagram.com/nashfoodtours',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    bio: 'Exploring Nashville\'s incredible food scene one bite at a time! 🍴'
  },
  place: {
    id: '1',
    name: "Prince's Hot Chicken",
    address: '5814 Nolensville Pike, Nashville, TN 37211',
    neighborhood: 'Nolensville Pike',
    cuisines: ['Hot Chicken', 'Southern'],
    avgRating: 4.5,
    reviewCount: 2190,
    mapsUrl: 'https://maps.google.com/?cid=123456789',
    reviews: [
      {
        author: 'Jane D.',
        rating: 5,
        text: 'Life-changing heat! This is what hot chicken is all about.',
        reviewedAt: new Date('2024-08-15')
      },
      {
        author: 'Mike R.',
        rating: 4,
        text: 'The line was worth it. Crispy, spicy perfection.',
        reviewedAt: new Date('2024-08-20')
      }
    ]
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  // In production, this would fetch the real article
  const article = mockArticle
  
  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: article.title,
    description: article.excerpt || `Read about ${article.place.name} in ${article.place.neighborhood || 'Nashville'} by ${article.creator.displayName}`,
    keywords: [
      article.place.name,
      article.place.neighborhood || 'Nashville',
      ...article.place.cuisines,
      'Nashville food',
      'restaurant review'
    ],
    authors: [{ name: article.creator.displayName }],
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      type: 'article',
      publishedTime: article.publishedAt.toISOString(),
      authors: [article.creator.displayName],
      tags: article.place.cuisines,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.title,
    },
  }
}

// Enable ISR with 1-hour revalidation for articles
export const revalidate = 3600

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = mockArticle // In production: await getArticleBySlug(params.slug)
  
  if (!article) {
    notFound()
  }

  const articleJsonLd = generateArticleJsonLd(article)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd),
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{article.place.neighborhood}</Badge>
              <span className="text-sm text-gray-500">•</span>
              <time className="text-sm text-gray-500" dateTime={article.publishedAt.toISOString()}>
                {article.publishedAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                {article.excerpt}
              </p>
            )}

            {/* Creator Byline */}
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
              {article.creator.avatarUrl ? (
                <img
                  src={article.creator.avatarUrl}
                  alt={article.creator.displayName}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  <Link 
                    href={`/creators/${article.creator.instagramHandle}`}
                    className="hover:text-brand-red transition-colors"
                  >
                    {article.creator.displayName}
                  </Link>
                </p>
                <p className="text-sm text-gray-500">@{article.creator.instagramHandle}</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={article.creator.instagramUrl} target="_blank">
                    <Instagram className="h-4 w-4 mr-2" />
                    Follow
                  </Link>
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardContent className="p-8">
                  <article 
                    className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-gray-900 prose-p:text-gray-700 prose-blockquote:border-brand-red prose-blockquote:text-brand-red prose-a:text-brand-red"
                    dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
                  />
                </CardContent>
              </Card>

              {/* Instagram Embed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-pink-600" />
                    Original Post
                  </CardTitle>
                  <CardDescription>
                    View the original Instagram post that inspired this article
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InstagramEmbed url={article.sourcePostUrl} />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Place Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-brand-blue" />
                    {article.place.name}
                  </CardTitle>
                  <CardDescription>
                    {article.place.neighborhood}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{article.place.address}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {article.place.cuisines.map((cuisine) => (
                        <Badge key={cuisine} variant="secondary" className="text-xs">
                          {cuisine}
                        </Badge>
                      ))}
                    </div>
                    {article.place.avgRating && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{article.place.avgRating}</span>
                        </div>
                        <span className="text-gray-500">
                          ({article.place.reviewCount?.toLocaleString()} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                  <Button asChild className="w-full" variant="outline">
                    <Link href={article.place.mapsUrl || '#'} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Google Maps
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Review Quotes */}
              {article.place.reviews && article.place.reviews.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>What People Say</CardTitle>
                    <CardDescription>
                      Recent reviews from Google
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {article.place.reviews.slice(0, 3).map((review, index) => (
                      <div key={index} className="border-l-2 border-gray-200 pl-4">
                        <div className="flex items-center gap-2 mb-1">
                          {review.rating && (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating! 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                          <span className="text-sm font-medium">{review.author}</span>
                        </div>
                        <p className="text-sm text-gray-600">"{review.text}"</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Share */}
              <Card>
                <CardHeader>
                  <CardTitle>Share This Article</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Share on Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Share on Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Copy Link
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
