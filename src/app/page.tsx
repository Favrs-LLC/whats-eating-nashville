import { Button } from "@/components/ui/button";
import ArticleCard from "@/components/cards/ArticleCard";
import CreatorCard from "@/components/cards/CreatorCard";
import PlaceCard from "@/components/cards/PlaceCard";
import Link from "next/link";

// Mock data for now - will be replaced with real data from database
const featuredArticles = [
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
  {
    id: '3',
    slug: 'monells-family-style-tradition',
    title: "Monell's: Family Style Tradition",
    excerpt: "Where strangers become family over shared plates of Southern comfort.",
    publishedAt: new Date('2024-01-10'),
    sourcePostUrl: 'https://www.instagram.com/p/example3/',
    creator: { 
      displayName: 'Music City Foodie', 
      instagramHandle: 'musiccityfoodie',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    place: { 
      name: "Monell's Dining & Catering", 
      neighborhood: 'Germantown',
      cuisines: ['Southern', 'Meat & Three']
    }
  }
];

const featuredCreators = [
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
  }
];

const featuredPlaces = [
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
  }
];

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-red/10 to-brand-blue/10 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Discover Nashville's
              <span className="text-brand-red"> Food Scene</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Experience Music City through the eyes of local food creators. From hot chicken joints to hidden gems, 
              we uncover the stories behind Nashville's incredible culinary landscape.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-brand-red hover:bg-brand-red/90">
                <Link href="/places">Explore Spots</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/creators">Meet Creators</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Latest Stories
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Fresh takes on Nashville's food scene from our community of creators
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/articles">View All Articles</Link>
          </Button>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Meet Our Creators
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            The passionate food enthusiasts sharing Nashville's culinary stories
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/creators">View All Creators</Link>
          </Button>
        </div>
      </section>

      {/* Featured Places */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Popular Spots
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            The most talked-about restaurants and eateries in Nashville
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/places">Browse All Spots</Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-blue py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to explore?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Dive into Nashville's food scene and discover your next favorite spot
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" variant="secondary">
                <Link href="/places">Browse All Spots</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-white hover:text-blue-100">
                <Link href="/map">View Map</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}