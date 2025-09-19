import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Star, FileText, ExternalLink } from 'lucide-react'

interface PlaceCardProps {
  place: {
    id: string
    googlePlaceId: string
    name: string
    address?: string | null
    neighborhood?: string | null
    cuisines: string[]
    avgRating?: number | null
    reviewCount?: number | null
    mapsUrl?: string | null
    articleCount?: number
    coordinates?: {
      lat: number
      lng: number
    } | null
  }
  className?: string
  showAddress?: boolean
  showStats?: boolean
}

export default function PlaceCard({ 
  place, 
  className = "",
  showAddress = true,
  showStats = true
}: PlaceCardProps) {
  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${className}`}>
      <CardHeader className="pb-3">
        {/* Place name and neighborhood */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="line-clamp-2 group-hover:text-brand-red transition-colors">
              <Link href={`/places/${place.id}`}>
                {place.name}
              </Link>
            </CardTitle>
            {place.neighborhood && (
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {place.neighborhood}
              </CardDescription>
            )}
          </div>
          
          {/* Rating */}
          {place.avgRating && (
            <div className="flex items-center gap-1 text-sm font-medium text-amber-600 ml-2">
              <Star className="h-4 w-4 fill-current" />
              {place.avgRating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Address */}
        {showAddress && place.address && (
          <CardDescription className="text-sm text-gray-600 line-clamp-2">
            {place.address}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Cuisines */}
          {place.cuisines.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {place.cuisines.slice(0, 4).map((cuisine) => (
                <Badge key={cuisine} variant="secondary" className="text-xs">
                  {cuisine}
                </Badge>
              ))}
              {place.cuisines.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{place.cuisines.length - 4} more
                </Badge>
              )}
            </div>
          )}

          {/* Stats */}
          {showStats && (
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                {place.articleCount !== undefined && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{place.articleCount} review{place.articleCount !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {place.reviewCount && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{place.reviewCount.toLocaleString()} Google reviews</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/places/${place.id}`}>
                View Details
              </Link>
            </Button>
            {place.mapsUrl && (
              <Button asChild variant="ghost" size="sm" className="px-3">
                <Link 
                  href={place.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View on Google Maps"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
