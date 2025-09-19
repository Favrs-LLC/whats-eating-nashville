import PlaceCard from "@/components/cards/PlaceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Filter } from "lucide-react";

// Mock data - will be replaced with real API calls
const places = [
  {
    id: '1',
    googlePlaceId: 'ChIJ_example_princes',
    name: "Prince's Hot Chicken",
    address: '5814 Nolensville Pike, Nashville, TN 37211',
    neighborhood: 'Nolensville Pike',
    cuisines: ['Hot Chicken', 'Southern'],
    avgRating: 4.5,
    reviewCount: 2190,
    articleCount: 3,
    mapsUrl: 'https://maps.google.com/?cid=123456789'
  },
  {
    id: '2',
    googlePlaceId: 'ChIJ_example_hattie',
    name: "Hattie B's Hot Chicken",
    address: '112 19th Ave S, Nashville, TN 37203',
    neighborhood: 'Midtown',
    cuisines: ['Hot Chicken', 'Southern'],
    avgRating: 4.3,
    reviewCount: 3456,
    articleCount: 2,
    mapsUrl: 'https://maps.google.com/?cid=987654321'
  },
  {
    id: '3',
    googlePlaceId: 'ChIJ_example_monell',
    name: "Monell's Dining & Catering",
    address: '1235 6th Ave N, Nashville, TN 37208',
    neighborhood: 'Germantown',
    cuisines: ['Southern', 'Meat & Three'],
    avgRating: 4.2,
    reviewCount: 1890,
    articleCount: 1,
    mapsUrl: 'https://maps.google.com/?cid=456789123'
  },
  {
    id: '4',
    googlePlaceId: 'ChIJ_example_etch',
    name: "Etch Restaurant",
    address: '303 Demonbreun St, Nashville, TN 37201',
    neighborhood: 'Downtown',
    cuisines: ['Fine Dining', 'American', 'Seafood'],
    avgRating: 4.4,
    reviewCount: 1234,
    articleCount: 2,
    mapsUrl: 'https://maps.google.com/?cid=111222333'
  },
  {
    id: '5',
    googlePlaceId: 'ChIJ_example_pancake',
    name: "Pancake Pantry",
    address: '1796 21st Ave S, Nashville, TN 37212',
    neighborhood: 'Hillsboro Village',
    cuisines: ['Brunch', 'American', 'Breakfast'],
    avgRating: 4.1,
    reviewCount: 2567,
    articleCount: 1,
    mapsUrl: 'https://maps.google.com/?cid=444555666'
  },
  {
    id: '6',
    googlePlaceId: 'ChIJ_example_rolf',
    name: "Rolf and Daughters",
    address: '700 Taylor St, Nashville, TN 37208',
    neighborhood: 'Germantown',
    cuisines: ['Italian', 'Fine Dining', 'Pasta'],
    avgRating: 4.6,
    reviewCount: 987,
    articleCount: 2,
    mapsUrl: 'https://maps.google.com/?cid=777888999'
  }
];

const neighborhoods = [
  'Downtown', 'East Nashville', 'Midtown', 'The Gulch', '12 South', 'Germantown',
  'Hillsboro Village', 'Music Row', 'SoBro', 'West End'
];

const cuisines = [
  'Hot Chicken', 'BBQ', 'Southern', 'Fine Dining', 'Italian', 'Mexican', 
  'Tacos', 'Pizza', 'Sushi', 'Brunch', 'Coffee', 'Dessert'
];

// Enable ISR with 30-minute revalidation
export const revalidate = 1800

export default function PlacesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-full">
              <MapPin className="w-8 h-8 text-brand-blue" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Nashville Food Spots
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            From legendary hot chicken joints to hidden neighborhood gems, 
            explore the restaurants and eateries that make Nashville's food scene special.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search restaurants, cuisines, or neighborhoods..."
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
                  <Badge key={neighborhood} variant="outline" className="cursor-pointer hover:bg-brand-blue hover:text-white">
                    {neighborhood}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Cuisines</h3>
              <div className="flex flex-wrap gap-2">
                {cuisines.map((cuisine) => (
                  <Badge key={cuisine} variant="outline" className="cursor-pointer hover:bg-brand-blue hover:text-white">
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-blue">{places.length}</div>
              <div className="text-sm text-gray-600">Featured Places</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-blue">{neighborhoods.length}</div>
              <div className="text-sm text-gray-600">Neighborhoods</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-blue">{cuisines.length}</div>
              <div className="text-sm text-gray-600">Cuisine Types</div>
            </div>
          </div>
        </div>

        {/* Places Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Places
          </Button>
        </div>
      </div>
    </div>
  );
}
