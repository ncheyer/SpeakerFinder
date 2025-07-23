"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DatabaseService, type SpeakerWithTestimonials } from "@/lib/database";

export default function AdminPage() {
  const [speakers, setSpeakers] = useState<SpeakerWithTestimonials[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSpeaker, setNewSpeaker] = useState({
    name: "",
    title: "",
    bio: "",
    expertise: "",
    speaking_topics: "",
    fee: "10000",
    location: "",
    years_experience: "0",
    languages: "English",
    website: "",
    linkedin: "",
    twitter: "",
    instagram: ""
  });

  useEffect(() => {
    loadSpeakers();
  }, []);

  const loadSpeakers = async () => {
    setLoading(true);
    const speakersData = await DatabaseService.getAllSpeakers();
    setSpeakers(speakersData);
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setNewSpeaker(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const speakerData = {
      name: newSpeaker.name,
      title: newSpeaker.title,
      bio: newSpeaker.bio,
      expertise: newSpeaker.expertise.split(',').map(s => s.trim()).filter(Boolean),
      speaking_topics: newSpeaker.speaking_topics.split(',').map(s => s.trim()).filter(Boolean),
      fee: parseInt(newSpeaker.fee),
      location: newSpeaker.location,
      years_experience: parseInt(newSpeaker.years_experience),
      languages: newSpeaker.languages.split(',').map(s => s.trim()).filter(Boolean),
      website: newSpeaker.website || null,
      linkedin: newSpeaker.linkedin || null,
      twitter: newSpeaker.twitter || null,
      instagram: newSpeaker.instagram || null
    };

    const result = await DatabaseService.createSpeaker(speakerData);
    
    if (result) {
      setShowAddForm(false);
      setNewSpeaker({
        name: "",
        title: "",
        bio: "",
        expertise: "",
        speaking_topics: "",
        fee: "10000",
        location: "",
        years_experience: "0",
        languages: "English",
        website: "",
        linkedin: "",
        twitter: "",
        instagram: ""
      });
      loadSpeakers();
      alert("Speaker added successfully!");
    } else {
      alert("Error adding speaker. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this speaker?")) {
      const success = await DatabaseService.deleteSpeaker(id);
      if (success) {
        loadSpeakers();
        alert("Speaker deleted successfully!");
      } else {
        alert("Error deleting speaker. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Speaker Management</h1>
            <p className="text-lg text-gray-600">Manage your speaker database</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {showAddForm ? "Cancel" : "Add New Speaker"}
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Speaker</CardTitle>
              <CardDescription>Enter speaker information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={newSpeaker.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newSpeaker.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    value={newSpeaker.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expertise">Expertise (comma-separated) *</Label>
                    <Input
                      id="expertise"
                      value={newSpeaker.expertise}
                      onChange={(e) => handleInputChange("expertise", e.target.value)}
                      placeholder="Technology, AI, Innovation"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="speaking_topics">Speaking Topics (comma-separated) *</Label>
                    <Input
                      id="speaking_topics"
                      value={newSpeaker.speaking_topics}
                      onChange={(e) => handleInputChange("speaking_topics", e.target.value)}
                      placeholder="Future of AI, Digital Transformation"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="fee">Speaking Fee (USD) *</Label>
                    <Input
                      id="fee"
                      type="number"
                      min="10000"
                      value={newSpeaker.fee}
                      onChange={(e) => handleInputChange("fee", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={newSpeaker.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="San Francisco, CA"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="years_experience">Years Experience *</Label>
                    <Input
                      id="years_experience"
                      type="number"
                      min="0"
                      value={newSpeaker.years_experience}
                      onChange={(e) => handleInputChange("years_experience", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="languages">Languages (comma-separated)</Label>
                  <Input
                    id="languages"
                    value={newSpeaker.languages}
                    onChange={(e) => handleInputChange("languages", e.target.value)}
                    placeholder="English, Spanish, French"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={newSpeaker.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      value={newSpeaker.linkedin}
                      onChange={(e) => handleInputChange("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Add Speaker
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {speakers.map((speaker) => (
            <Card key={speaker.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{speaker.name}</CardTitle>
                    <CardDescription>{speaker.title}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(speaker.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{speaker.bio}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {speaker.expertise.map((exp) => (
                        <Badge key={exp} variant="secondary" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm">
                    <p><strong>Fee:</strong> ${speaker.fee.toLocaleString()}</p>
                    <p><strong>Location:</strong> {speaker.location}</p>
                    <p><strong>Experience:</strong> {speaker.years_experience} years</p>
                    <p><strong>Languages:</strong> {speaker.languages.join(', ')}</p>
                    <p><strong>Testimonials:</strong> {speaker.testimonials.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {speakers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 mb-4">No speakers found.</p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add First Speaker
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}