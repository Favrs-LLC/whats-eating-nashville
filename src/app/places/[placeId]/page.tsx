import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ArticleCard from "@/components/cards/ArticleCard"
import { getPlaceById } from "@/lib/api"
import { generatePlaceJsonLd } from "@/lib/seo"
import { 
  MapPin, 
  Star, 
  ExternalLink, 
  FileText,
  MessageSquare,
  Calendar
} from "lucide-react"
import Link from "next/link"

// Enable ISR with 1-hour revalidation for place pages
export const revalidate = 3600

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ placeId: string }> }): Promise<Metadata> {
  const { placeId } = await params
  const place = await getPlaceById(placeId)
  
  if (!place) {
    return {
      title: 'Place Not Found',
    }
  }

  return {
    title: `${place.name} - ${place.neighborhood || 'Nashville'}`,
    description: `Discover ${place.name} in ${place.neighborhood || 'Nashville'}. ${place.cuisines.join(', ')} restaurant with ${place.reviewCount ? place.reviewCount.toLocaleString() + ' reviews' : 'great reviews'}.`,
    keywords: [
      place.name,
      place.neighborhood || 'Nashville',
      ...place.cuisines,
      'Nashville restaurant',
      'Nashville dining'
    ],
    openGraph: {
      title: `${place.name} - Nashville Restaurant`,
      description: `${place.cuisines.join(', ')} restaurant in ${place.neighborhood || 'Nashville'}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${place.name} - Nashville`,
      description: `${place.cuisines.join(', ')} in ${place.neighborhood || 'Nashville'}`,
    },
  }
}

export default async function PlaceDetailPage({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const place = await getPlaceById(placeId)
  
  if (!place) {
    notFound()
  }

  const placeJsonLd = generatePlaceJsonLd(place)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(placeJsonLd),
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Place Header */}
          <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Place Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {place.name}
                    </h1>
                    {place.neighborhood && (
                      <p className="text-lg text-gray-600 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {place.neighborhood}
                      </p>
                    )}
                    {place.address && (
                      <p className="text-gray-600 mt-1">
                        {place.address}
                      </p>
                    )}
                  </div>
                  
                  {place.avgRating && (
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-lg font-semibold text-amber-600">
                        <Star className="h-5 w-5 fill-current" />
                        {place.avgRating.toFixed(1)}
                      </div>
                      {place.reviewCount && (
                        <p className="text-sm text-gray-500">
                          {place.reviewCount.toLocaleString()} reviews
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Cuisines */}
                {place.cuisines.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {place.cuisines.map((cuisine: string) => (
                      <Badge key={cuisine} variant="secondary" className="text-sm">
                        {cuisine}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-red">
                      {place.articles?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Articles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-blue">
                      {place.reviews?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Reviews</div>
                  </div>
                  {place.avgRating && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600">
                        {place.avgRating.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700">
                      {place.cuisines.length}
                    </div>
                    <div className="text-sm text-gray-600">Cuisines</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {place.mapsUrl && (
                    <Button asChild className="bg-brand-blue hover:bg-brand-blue/90">
                      <Link 
                        href={place.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Google Maps
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Articles Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Coverage
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FileText className="h-4 w-4" />
                  <span>{place.articles?.length || 0} article{(place.articles?.length || 0) !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {place.articles.length > 0 ? (
                <div className="space-y-6">
                  {place.articles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={{
                        ...article,
                        excerpt: article.excerpt || undefined,
                        sourcePostUrl: article.sourcePostUrl || '',
                        creator: {
                          displayName: article.creator[0]?.displayName || '',
                          instagramHandle: article.creator[0]?.instagramHandle || '',
                          avatarUrl: article.creator[0]?.avatarUrl || undefined,
                        },
                        place: {
                          name: place.name,
                          neighborhood: place.neighborhood || undefined,
                          cuisines: place.cuisines,
                        },
                      }}
                      showPlace={false} // Don't show place since we're on the place page
                      className="w-full"
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No articles yet
                    </h3>
                    <p className="text-gray-600">
                      No one has written about {place.name} yet. Be the first to share your experience!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Review Quotes */}
              {place.reviews.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Recent Reviews
                    </CardTitle>
                    <CardDescription>
                      What people are saying on Google
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {place.reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="border-l-2 border-gray-200 pl-4">
                        <div className="flex items-center gap-2 mb-2">
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
                          <span className="text-sm font-medium text-gray-900">
                            {review.author || 'Anonymous'}
                          </span>
                          {review.reviewedAt && (
                            <span className="text-xs text-gray-500">
                              {review.reviewedAt.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">"{review.text}"</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Location Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Location Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {place.address && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Address</p>
                      <p className="text-sm text-gray-600">{place.address}</p>
                    </div>
                  )}
                  {place.neighborhood && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Neighborhood</p>
                      <p className="text-sm text-gray-600">{place.neighborhood}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">Cuisine Types</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {place.cuisines.map((cuisine: string) => (
                        <Badge key={cuisine} variant="outline" className="text-xs">
                          {cuisine}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Back to Places */}
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/places">
                ← Back to All Places
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
