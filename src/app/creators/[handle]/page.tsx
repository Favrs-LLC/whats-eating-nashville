import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ArticleCard from "@/components/cards/ArticleCard"
import { getCreatorByHandle } from "@/lib/api"
import { generatePageSEO } from "@/lib/seo"
import { 
  Instagram, 
  User, 
  FileText, 
  Calendar,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

// Enable ISR with 1-hour revalidation for creator profiles
export const revalidate = 3600

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const creator = await getCreatorByHandle(handle)
  
  if (!creator) {
    return {
      title: 'Creator Not Found',
    }
  }

  return {
    title: `${creator.displayName} (@${creator.instagramHandle})`,
    description: creator.bio || `Discover Nashville food content by ${creator.displayName}, a local food creator sharing the best of Music City's culinary scene.`,
    keywords: [
      creator.displayName,
      creator.instagramHandle,
      'Nashville food creator',
      'Nashville restaurants',
      'food blogger',
      'Instagram food'
    ],
    openGraph: {
      title: `${creator.displayName} - Nashville Food Creator`,
      description: creator.bio || `Follow ${creator.displayName} for the best Nashville food content`,
      type: 'profile',
      images: creator.avatarUrl ? [
        {
          url: creator.avatarUrl,
          width: 400,
          height: 400,
          alt: creator.displayName,
        },
      ] : undefined,
    },
    twitter: {
      card: 'summary',
      title: `${creator.displayName} (@${creator.instagramHandle})`,
      description: creator.bio || `Nashville food creator sharing the best of Music City`,
    },
  }
}

export default async function CreatorProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const creator = await getCreatorByHandle(handle)
  
  if (!creator) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Creator Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {creator.avatarUrl ? (
                <img
                  src={creator.avatarUrl}
                  alt={creator.displayName}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-gray-100"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-brand-red/10 to-brand-blue/10 flex items-center justify-center ring-4 ring-gray-100">
                  <User className="h-12 w-12 text-gray-500" />
                </div>
              )}
            </div>

            {/* Creator Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {creator.displayName}
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">
                    @{creator.instagramHandle}
                  </p>
                  {creator.bio && (
                    <p className="text-gray-700 mt-3 max-w-2xl">
                      {creator.bio}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button asChild className="bg-brand-red hover:bg-brand-red/90">
                    <Link 
                      href={creator.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="h-4 w-4 mr-2" />
                      Follow on Instagram
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-red">
                    {creator._count.articles}
                  </div>
                  <div className="text-sm text-gray-600">Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-blue">
                    {new Date(creator.createdAt).getFullYear()}
                  </div>
                  <div className="text-sm text-gray-600">Joined</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Articles by {creator.displayName}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FileText className="h-4 w-4" />
              <span>{creator._count.articles} article{creator._count.articles !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {creator.articles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {creator.articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={{
                    ...article,
                    creator: {
                      displayName: creator.displayName,
                      instagramHandle: creator.instagramHandle,
                      avatarUrl: creator.avatarUrl,
                    },
                  }}
                  showCreator={false} // Don't show creator since we're on their profile
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
                  {creator.displayName} hasn't published any articles yet. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Back to Creators */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/creators">
              ← Back to All Creators
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
