"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AISeakersPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "https://speakabout.ai";
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleRedirectNow = () => {
    window.location.href = "https://speakabout.ai";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-3xl text-blue-600 mb-4">
              🤖 AI Speaker Specialists
            </CardTitle>
            <CardDescription className="text-lg">
              You&apos;re looking for AI expertise! We&apos;re redirecting you to our specialized AI speaker platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                SpeakAbout.AI
              </h3>
              <p className="text-gray-700 mb-4">
                Our dedicated platform for AI and machine learning speakers features:
              </p>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Leading AI researchers and practitioners</li>
                <li>• Machine learning experts</li>
                <li>• Tech industry AI leaders</li>
                <li>• Specialized AI ethics speakers</li>
              </ul>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
              <span className="text-gray-600">Redirecting in 3 seconds...</span>
            </div>
            
            <Button 
              onClick={handleRedirectNow}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Go to SpeakAbout.AI Now →
            </Button>
            
            <p className="text-sm text-gray-500">
              If you&apos;re not automatically redirected, click the button above or visit{" "}
              <a 
                href="https://speakabout.ai" 
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                speakabout.ai
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}