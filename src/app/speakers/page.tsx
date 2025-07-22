"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const mockSpeakers = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    title: "Technology Futurist",
    expertise: ["Technology", "Innovation", "Digital Transformation"],
    fee: 15000,
    location: "San Francisco, CA",
    profileImage: "/api/placeholder/100/100",
    videoUrl: "https://example.com/video1",
    bio: "Leading expert in emerging technologies with 15+ years of experience."
  },
  {
    id: "2",
    name: "Marcus Johnson",
    title: "Leadership Expert",
    expertise: ["Leadership", "Management", "Team Building"],
    fee: 12000,
    location: "New York, NY",
    profileImage: "/api/placeholder/100/100",
    bio: "Fortune 500 leadership consultant and bestselling author."
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    title: "Wellness & Performance Coach",
    expertise: ["Wellness", "Mental Health", "Performance"],
    fee: 18000,
    location: "Los Angeles, CA",
    profileImage: "/api/placeholder/100/100",
    bio: "Olympic performance psychologist and wellness advocate."
  }
];

export default function SpeakersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");

  const filteredSpeakers = mockSpeakers.filter(speaker => {
    const matchesSearch = speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         speaker.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = !topicFilter || speaker.expertise.some(exp => 
      exp.toLowerCase().includes(topicFilter.toLowerCase()));
    const matchesBudget = !budgetFilter || 
      (budgetFilter === "10k-15k" && speaker.fee >= 10000 && speaker.fee <= 15000) ||
      (budgetFilter === "15k-25k" && speaker.fee > 15000 && speaker.fee <= 25000) ||
      (budgetFilter === "25k+" && speaker.fee > 25000);
    
    return matchesSearch && matchesTopic && matchesBudget;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Speakers</h1>
          <p className="text-lg text-gray-600">Browse our curated collection of world-class keynote speakers</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-4">
          <Input
            placeholder="Search speakers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={topicFilter} onValueChange={setTopicFilter}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Filter by topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Topics</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="leadership">Leadership</SelectItem>
              <SelectItem value="wellness">Wellness</SelectItem>
              <SelectItem value="innovation">Innovation</SelectItem>
            </SelectContent>
          </Select>
          <Select value={budgetFilter} onValueChange={setBudgetFilter}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Filter by budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Budgets</SelectItem>
              <SelectItem value="10k-15k">$10K - $15K</SelectItem>
              <SelectItem value="15k-25k">$15K - $25K</SelectItem>
              <SelectItem value="25k+">$25K+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpeakers.map((speaker) => (
            <Card key={speaker.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={speaker.profileImage} alt={speaker.name} />
                    <AvatarFallback>{speaker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{speaker.name}</CardTitle>
                    <CardDescription>{speaker.title}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{speaker.bio}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {speaker.expertise.map((topic) => (
                    <Badge key={topic} variant="secondary">{topic}</Badge>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">{speaker.location}</span>
                  <span className="font-semibold text-blue-600">${speaker.fee.toLocaleString()}+</span>
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/speakers/${speaker.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">View Profile</Button>
                  </Link>
                  {speaker.videoUrl && (
                    <Button variant="ghost" size="sm">📹</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSpeakers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 mb-4">No speakers found matching your criteria.</p>
            <Button onClick={() => {setSearchTerm(""); setTopicFilter(""); setBudgetFilter("");}}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}