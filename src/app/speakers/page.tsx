"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { DatabaseService, type SpeakerWithTestimonials } from "@/lib/database";

export default function SpeakersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [speakers, setSpeakers] = useState<SpeakerWithTestimonials[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpeakers();
  }, [searchTerm, topicFilter, budgetFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSpeakers = async () => {
    setLoading(true);
    
    const filters: {
      search?: string;
      expertise?: string[];
      minBudget?: number;
      maxBudget?: number;
    } = {};
    
    if (searchTerm) filters.search = searchTerm;
    if (topicFilter) filters.expertise = [topicFilter];
    
    if (budgetFilter) {
      if (budgetFilter === "10k-15k") {
        filters.minBudget = 10000;
        filters.maxBudget = 15000;
      } else if (budgetFilter === "15k-25k") {
        filters.minBudget = 15000;
        filters.maxBudget = 25000;
      } else if (budgetFilter === "25k+") {
        filters.minBudget = 25000;
      }
    }
    
    const speakersData = await DatabaseService.searchSpeakers(filters);
    setSpeakers(speakersData);
    setLoading(false);
  };

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

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {speakers.map((speaker) => (
            <Card key={speaker.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={speaker.profile_image || "/api/placeholder/100/100"} alt={speaker.name} />
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
                  {speaker.video_url && (
                    <Button variant="ghost" size="sm">📹</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
            
            {speakers.length === 0 && !loading && (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-gray-500 mb-4">No speakers found matching your criteria.</p>
                <Button onClick={() => {setSearchTerm(""); setTopicFilter(""); setBudgetFilter("");}}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
