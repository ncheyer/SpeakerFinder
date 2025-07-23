"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to SpeakerFinder
          </h1>
          <p className="text-gray-600">
            {isSignUp 
              ? "Create your account to start finding speakers" 
              : "Sign in to manage your speaker events"
            }
          </p>
        </div>
        
        <div className="flex justify-center">
          {isSignUp ? (
            <SignUpForm onToggleMode={toggleMode} />
          ) : (
            <LoginForm onToggleMode={toggleMode} />
          )}
        </div>
      </div>
    </div>
  );
}