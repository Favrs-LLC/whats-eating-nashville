import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock data for now - will be replaced with real data from database
const featuredArticles = [
  {
    id: '1',
    slug: 'princes-hot-chicken-line-worth-it',
    title: "Prince's Hot Chicken: The Line Was Worth It",
    excerpt: "A spicy pilgrimage on Nolensville Pike that delivers on every promise.",
    creator: { displayName: 'Nash Food Tours', instagramHandle: 'nashfoodtours' },
    place: { name: "Prince's Hot Chicken", neighborhood: 'Nolensville Pike' },
    publishedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    slug: 'hattie-bs-midtown-experience',
    title: "Hattie B's: The Midtown Experience",
    excerpt: "Tourist trap or Nashville staple? We dive into the hot chicken debate.",
    creator: { displayName: 'East Nash Bites', instagramHandle: 'eastnashbites' },
    place: { name: "Hattie B's Hot Chicken", neighborhood: 'Midtown' },
    publishedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    slug: 'monells-family-style-tradition',
    title: "Monell's: Family Style Tradition",
    excerpt: "Where strangers become family over shared plates of Southern comfort.",
    creator: { displayName: 'Music City Foodie', instagramHandle: 'musiccityfoodie' },
    place: { name: "Monell's Dining & Catering", neighborhood: 'Germantown' },
    publishedAt: new Date('2024-01-10')
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
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">
                    {article.place.neighborhood}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {article.publishedAt.toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="line-clamp-2">
                  <Link 
                    href={`/articles/${article.slug}`}
                    className="hover:text-brand-red transition-colors"
                  >
                    {article.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {article.creator.displayName}
                    </span>
                    <span className="text-sm text-gray-500">
                      @{article.creator.instagramHandle}
                    </span>
                  </div>
                  <Badge variant="outline">
                    {article.place.name}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/articles">View All Articles</Link>
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