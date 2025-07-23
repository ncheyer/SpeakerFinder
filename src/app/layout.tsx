import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpeakerFinder - Find the Perfect Keynote Speaker",
  description: "Discover and book world-class keynote speakers for your events. Browse speakers across all topics with minimum budgets starting at $10,000.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <h1 className="text-2xl font-bold text-blue-600">SpeakerFinder</h1>
                <div className="hidden md:flex space-x-4">
                  <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
                  <Link href="/speakers" className="text-gray-600 hover:text-gray-900">Find Speakers</Link>
                  <Link href="/qualification" className="text-gray-600 hover:text-gray-900">Get Started</Link>
                  <Link href="/apply" className="text-gray-600 hover:text-gray-900">Apply as Speaker</Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
