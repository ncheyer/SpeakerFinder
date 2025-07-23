"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AISpeakersPage() {
  const router = useRouter();

  const handleBrowseAISpeakers = () => {
    router.push('/speakers?topic=ai');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-3xl text-blue-600 mb-4">
              🤖 AI & Machine Learning Speakers
            </CardTitle>
            <CardDescription className="text-lg">
              Discover our collection of AI and machine learning experts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI Speaker Expertise
              </h3>
              <p className="text-gray-700 mb-4">
                Browse our curated collection of AI and ML speakers:
              </p>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Leading AI researchers and practitioners</li>
                <li>• Machine learning experts</li>
                <li>• Tech industry AI leaders</li>
                <li>• Specialized AI ethics speakers</li>
                <li>• Emerging technology futurists</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleBrowseAISpeakers}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Browse AI Speakers
            </Button>
            
            <p className="text-sm text-gray-500">
              All our AI speakers are part of our main speaker database with premium $10K+ fees.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}