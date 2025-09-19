import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, ExternalLink, User } from 'lucide-react'

interface ArticleCardProps {
  article: {
    id: string
    slug: string
    title: string
    excerpt?: string
    publishedAt: Date
    sourcePostUrl: string
    creator: {
      displayName: string
      instagramHandle: string
      avatarUrl?: string
    }
    place: {
      name: string
      neighborhood?: string | null
      cuisines: string[]
    }
  }
  showCreator?: boolean
  showPlace?: boolean
  className?: string
}

export default function ArticleCard({ 
  article, 
  showCreator = true, 
  showPlace = true,
  className = ""
}: ArticleCardProps) {
  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${className}`}>
      <CardHeader className="pb-3">
        {/* Meta information */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={article.publishedAt.toISOString()}>
              {article.publishedAt.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          </div>
          {article.place.neighborhood && (
            <Badge variant="secondary" className="text-xs">
              {article.place.neighborhood}
            </Badge>
          )}
        </div>

        {/* Article title */}
        <CardTitle className="line-clamp-2 group-hover:text-brand-red transition-colors">
          <Link href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </CardTitle>

        {/* Article excerpt */}
        {article.excerpt && (
          <CardDescription className="line-clamp-3 text-gray-600">
            {article.excerpt}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Creator info */}
          {showCreator && (
            <div className="flex items-center gap-3">
              {article.creator.avatarUrl ? (
                <img
                  src={article.creator.avatarUrl}
                  alt={article.creator.displayName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/creators/${article.creator.instagramHandle}`}
                  className="text-sm font-medium text-gray-900 hover:text-brand-red transition-colors"
                >
                  {article.creator.displayName}
                </Link>
                <p className="text-xs text-gray-500">
                  @{article.creator.instagramHandle}
                </p>
              </div>
            </div>
          )}

          {/* Place info */}
          {showPlace && (
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {article.place.name}
                </h4>
                {article.place.cuisines.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {article.place.cuisines.slice(0, 2).map((cuisine) => (
                      <Badge key={cuisine} variant="outline" className="text-xs">
                        {cuisine}
                      </Badge>
                    ))}
                    {article.place.cuisines.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.place.cuisines.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              {/* Source link */}
              <Link
                href={article.sourcePostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-red transition-colors ml-2"
                title="View original Instagram post"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
