import CreatorCard from "@/components/cards/CreatorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllCreators } from "@/lib/api";
import { Search, Users } from "lucide-react";

// Mock data - will be replaced with real API calls
const creators = [
  {
    id: '1',
    displayName: 'Nash Food Tours',
    instagramHandle: 'nashfoodtours',
    instagramUrl: 'https://instagram.com/nashfoodtours',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    bio: 'Exploring Nashville\'s incredible food scene one bite at a time! 🍴',
    articleCount: 12,
    primaryCuisines: ['Hot Chicken', 'BBQ', 'Southern']
  },
  {
    id: '2',
    displayName: 'East Nash Bites',
    instagramHandle: 'eastnashbites',
    instagramUrl: 'https://instagram.com/eastnashbites',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a5?w=100&h=100&fit=crop&crop=face',
    bio: 'Covering the best eats in East Nashville and beyond! 🌮',
    articleCount: 8,
    primaryCuisines: ['Tacos', 'Mexican', 'Coffee']
  },
  {
    id: '3',
    displayName: 'Music City Foodie',
    instagramHandle: 'musiccityfoodie',
    instagramUrl: 'https://instagram.com/musiccityfoodie',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    bio: 'Your guide to Nashville\'s hottest restaurants and hidden gems! 🔥',
    articleCount: 15,
    primaryCuisines: ['American', 'Italian', 'Brunch']
  },
  {
    id: '4',
    displayName: 'Downtown Dining',
    instagramHandle: 'downtowndining',
    instagramUrl: 'https://instagram.com/downtowndining',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    bio: 'Discovering the best bites in the heart of Music City 🏙️',
    articleCount: 6,
    primaryCuisines: ['Fine Dining', 'Cocktails', 'Seafood']
  },
  {
    id: '5',
    displayName: 'Sweet Tooth Nash',
    instagramHandle: 'sweettoothnash',
    instagramUrl: 'https://instagram.com/sweettoothnash',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    bio: 'Satisfying Nashville\'s sweet cravings one dessert at a time! 🍰',
    articleCount: 9,
    primaryCuisines: ['Dessert', 'Bakery', 'Coffee']
  },
  {
    id: '6',
    displayName: 'Taco Tuesday Nash',
    instagramHandle: 'tacotuesdaynash',
    instagramUrl: 'https://instagram.com/tacotuesdaynash',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    bio: 'Every day is taco day in Nashville! 🌮',
    articleCount: 11,
    primaryCuisines: ['Tacos', 'Mexican', 'Food Truck']
  }
];

// Enable ISR with 30-minute revalidation
export const revalidate = 1800

export default async function CreatorsPage() {
  const creators = await getAllCreators()
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-brand-red/10 rounded-full">
              <Users className="w-8 h-8 text-brand-red" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Meet The Creators
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            The passionate food enthusiasts who bring you the best of Nashville's culinary scene. 
            Follow their journeys and discover new favorites through their eyes.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search creators by name or handle..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-red">{creators.length}</div>
              <div className="text-sm text-gray-600">Active Creators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-red">
                0
              </div>
              <div className="text-sm text-gray-600">Total Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-red">25+</div>
              <div className="text-sm text-gray-600">Cuisines Covered</div>
            </div>
          </div>
        </div>

        {/* Creators Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <CreatorCard 
              key={creator.id} 
              creator={{
                ...creator,
                articleCount: 0,
              }} 
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Creators
          </Button>
        </div>
      </div>
    </div>
  );
}
