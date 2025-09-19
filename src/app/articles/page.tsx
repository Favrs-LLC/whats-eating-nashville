import ArticleCard from "@/components/cards/ArticleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

// Mock data - will be replaced with real API calls
const articles = [
  {
    id: '1',
    slug: 'princes-hot-chicken-line-worth-it',
    title: "Prince's Hot Chicken: The Line Was Worth It",
    excerpt: "A spicy pilgrimage on Nolensville Pike that delivers on every promise.",
    publishedAt: new Date('2024-01-15'),
    sourcePostUrl: 'https://www.instagram.com/p/example1/',
    creator: { 
      displayName: 'Nash Food Tours', 
      instagramHandle: 'nashfoodtours',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
    },
    place: { 
      name: "Prince's Hot Chicken", 
      neighborhood: 'Nolensville Pike',
      cuisines: ['Hot Chicken', 'Southern']
    }
  },
  {
    id: '2',
    slug: 'hattie-bs-midtown-experience',
    title: "Hattie B's: The Midtown Experience",
    excerpt: "Tourist trap or Nashville staple? We dive into the hot chicken debate.",
    publishedAt: new Date('2024-01-12'),
    sourcePostUrl: 'https://www.instagram.com/p/example2/',
    creator: { 
      displayName: 'East Nash Bites', 
      instagramHandle: 'eastnashbites',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a5?w=100&h=100&fit=crop&crop=face'
    },
    place: { 
      name: "Hattie B's Hot Chicken", 
      neighborhood: 'Midtown',
      cuisines: ['Hot Chicken', 'Southern']
    }
  },
  // Add more mock articles...
];

const neighborhoods = [
  'Downtown', 'East Nashville', 'Midtown', 'The Gulch', '12 South', 'Germantown'
];

const cuisines = [
  'Hot Chicken', 'BBQ', 'Southern', 'Tacos', 'Pizza', 'Coffee', 'Brunch'
];

// Enable ISR with 10-minute revalidation
export const revalidate = 600

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            All Articles
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Discover Nashville's food scene through the eyes of local creators
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles, places, or creators..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filter badges */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Neighborhoods</h3>
              <div className="flex flex-wrap gap-2">
                {neighborhoods.map((neighborhood) => (
                  <Badge key={neighborhood} variant="outline" className="cursor-pointer hover:bg-brand-red hover:text-white">
                    {neighborhood}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Cuisines</h3>
              <div className="flex flex-wrap gap-2">
                {cuisines.map((cuisine) => (
                  <Badge key={cuisine} variant="outline" className="cursor-pointer hover:bg-brand-red hover:text-white">
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  );
}
