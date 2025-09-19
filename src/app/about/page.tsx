import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, MapPin, Instagram } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            About What's Eating Nashville
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            We're passionate about celebrating Nashville's incredible food scene through 
            the eyes of local creators and food enthusiasts who know it best.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="border-none shadow-lg">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 bg-brand-red/10 rounded-full">
                  <Heart className="w-8 h-8 text-brand-red" />
                </div>
              </div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
              <CardDescription className="text-lg mt-4">
                To showcase Nashville's vibrant culinary landscape by amplifying the voices 
                of passionate food creators and connecting food lovers with authentic experiences.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 leading-relaxed">
                From legendary hot chicken joints to hidden neighborhood gems, from food trucks 
                to fine dining, we believe every great meal has a story worth sharing. Our platform 
                brings together the creativity of local food influencers with the curiosity of 
                fellow food enthusiasts.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-brand-blue/10 rounded-full">
                    <Instagram className="w-6 h-6 text-brand-blue" />
                  </div>
                </div>
                <CardTitle className="text-lg">Creators Share</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Local food creators share their dining experiences through Instagram posts, 
                  capturing the essence of Nashville's food scene.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-brand-red/10 rounded-full">
                    <Users className="w-6 h-6 text-brand-red" />
                  </div>
                </div>
                <CardTitle className="text-lg">We Curate</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We transform these social media moments into detailed articles, 
                  preserving the stories and insights behind each dining experience.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-brand-blue/10 rounded-full">
                    <MapPin className="w-6 h-6 text-brand-blue" />
                  </div>
                </div>
                <CardTitle className="text-lg">You Discover</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Explore curated content organized by neighborhood, cuisine type, 
                  and creator to find your next favorite Nashville dining spot.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What We Value
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-red rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Authentic Voices</h3>
                <p className="text-gray-600">
                  We believe the best food recommendations come from real people with genuine passion, 
                  not corporate marketing.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-red rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Local Community</h3>
                <p className="text-gray-600">
                  Nashville's food scene is built by local chefs, restaurant owners, and food lovers. 
                  We celebrate and support this community.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-red rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Quality Content</h3>
                <p className="text-gray-600">
                  Every article is carefully curated to provide valuable insights, 
                  beautiful visuals, and practical information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Explore?
          </h2>
          <p className="text-gray-600 mb-8">
            Start discovering Nashville's incredible food scene today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-brand-red hover:bg-brand-red/90">
              <Link href="/places">Browse Places</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/creators">Meet Creators</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
