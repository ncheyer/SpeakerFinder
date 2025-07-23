import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find the Perfect Keynote Speaker
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover world-class speakers across all topics. Professional speakers with minimum fees starting at $10,000.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
            <Link href="/speakers">
              <Button variant="outline" size="lg">
                Browse Speakers
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Expert Speakers</CardTitle>
              <CardDescription>
                Access to top-tier speakers across all industries and topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                From technology and business to wellness and innovation, find speakers who are experts in their field.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Specialists</CardTitle>
              <CardDescription>
                AI and machine learning experts in our speaker network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Discover leading AI researchers, ML practitioners, and technology futurists all in one place.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Premium Quality</CardTitle>
              <CardDescription>
                Professional speakers with $10K+ speaking fees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                All our speakers meet high standards for expertise, presentation skills, and professionalism.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to start planning your event?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Create an account to organize your projects and build speaker wishlists for your events.
          </p>
          <Link href="/auth">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Create Your Account
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
