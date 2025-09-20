import { Button } from "@/components/ui/button";
import Link from "next/link";

// Simple home page for testing
export default function SimpleHome() {
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

      {/* Simple content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nashville Food Platform
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            The application is working! Database connection verified.
          </p>
          <div className="mt-8 flex items-center justify-center gap-x-6">
            <Button asChild variant="outline" size="lg">
              <Link href="/api/public/creators">Test API</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/admin">Admin Panel</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
