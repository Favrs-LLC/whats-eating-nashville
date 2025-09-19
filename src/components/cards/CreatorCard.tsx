import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Instagram, User, FileText } from 'lucide-react'

interface CreatorCardProps {
  creator: {
    id: string
    displayName: string
    instagramHandle: string
    instagramUrl: string
    avatarUrl?: string | null
    bio?: string | null
    articleCount?: number
    primaryCuisines?: string[]
  }
  className?: string
  showBio?: boolean
  showArticleCount?: boolean
}

export default function CreatorCard({ 
  creator, 
  className = "",
  showBio = true,
  showArticleCount = true
}: CreatorCardProps) {
  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${className}`}>
      <CardHeader className="text-center pb-3">
        {/* Avatar */}
        <div className="flex justify-center mb-3">
          {creator.avatarUrl ? (
            <img
              src={creator.avatarUrl}
              alt={creator.displayName}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-brand-red/20 transition-all"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-red/10 to-brand-blue/10 flex items-center justify-center ring-2 ring-gray-100 group-hover:ring-brand-red/20 transition-all">
              <User className="h-8 w-8 text-gray-500" />
            </div>
          )}
        </div>

        {/* Creator name and handle */}
        <CardTitle className="text-lg group-hover:text-brand-red transition-colors">
          <Link href={`/creators/${creator.instagramHandle}`}>
            {creator.displayName}
          </Link>
        </CardTitle>
        
        <CardDescription className="text-sm">
          @{creator.instagramHandle}
        </CardDescription>

        {/* Primary cuisines */}
        {creator.primaryCuisines && creator.primaryCuisines.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {creator.primaryCuisines.slice(0, 3).map((cuisine) => (
              <Badge key={cuisine} variant="secondary" className="text-xs">
                {cuisine}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Bio */}
          {showBio && creator.bio && (
            <p className="text-sm text-gray-600 text-center line-clamp-3">
              {creator.bio}
            </p>
          )}

          {/* Stats */}
          {showArticleCount && creator.articleCount !== undefined && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <FileText className="h-4 w-4" />
              <span>
                {creator.articleCount} article{creator.articleCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/creators/${creator.instagramHandle}`}>
                View Profile
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="px-3">
              <Link 
                href={creator.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View Instagram profile"
              >
                <Instagram className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
