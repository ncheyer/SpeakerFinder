"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DatabaseService } from "@/lib/database";

interface SpeakerApplication {
  name: string;
  title: string;
  bio: string;
  expertise: string;
  speaking_topics: string;
  fee: string;
  location: string;
  years_experience: string;
  languages: string;
  website: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  video_url: string;
  sample_topics: string;
  previous_engagements: string;
}

const EXPERTISE_OPTIONS = [
  "Technology", "AI & Machine Learning", "Leadership", "Innovation", 
  "Digital Transformation", "Wellness", "Sustainability", "Finance",
  "Marketing", "Sales", "HR & People", "Entrepreneurship", "Healthcare",
  "Education", "Science", "Politics", "Sports", "Entertainment"
];

export default function ApplyPage() {
  const [formData, setFormData] = useState<SpeakerApplication>({
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
    instagram: "",
    video_url: "",
    sample_topics: "",
    previous_engagements: ""
  });

  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof SpeakerApplication, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleExpertiseToggle = (expertise: string) => {
    const newExpertise = selectedExpertise.includes(expertise)
      ? selectedExpertise.filter(e => e !== expertise)
      : [...selectedExpertise, expertise];
    
    setSelectedExpertise(newExpertise);
    setFormData(prev => ({ ...prev, expertise: newExpertise.join(', ') }));
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.title.trim()) newErrors.title = "Professional title is required";
    if (!formData.bio.trim()) newErrors.bio = "Bio is required";
    if (formData.bio.length < 100) newErrors.bio = "Bio must be at least 100 characters";
    if (selectedExpertise.length === 0) newErrors.expertise = "Please select at least one area of expertise";
    if (!formData.speaking_topics.trim()) newErrors.speaking_topics = "Speaking topics are required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    
    const fee = parseInt(formData.fee);
    if (!fee || fee < 10000) newErrors.fee = "Minimum speaking fee is $10,000";
    
    const experience = parseInt(formData.years_experience);
    if (experience < 0) newErrors.years_experience = "Years of experience cannot be negative";
    
    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = "Website must be a valid URL";
    }
    
    if (formData.linkedin && !formData.linkedin.includes('linkedin.com')) {
      newErrors.linkedin = "Please enter a valid LinkedIn URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const speakerData = {
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        expertise: selectedExpertise,
        speaking_topics: formData.speaking_topics.split(',').map(s => s.trim()).filter(Boolean),
        fee: parseInt(formData.fee),
        location: formData.location,
        years_experience: parseInt(formData.years_experience),
        languages: formData.languages.split(',').map(s => s.trim()).filter(Boolean),
        website: formData.website || null,
        linkedin: formData.linkedin || null,
        twitter: formData.twitter || null,
        instagram: formData.instagram || null,
        video_url: formData.video_url || null
      };

      const result = await DatabaseService.createSpeaker(speakerData);

      if (result) {
        alert("Thank you for your application! We'll review your submission and get back to you within 5-7 business days.");
        // Reset form
        setFormData({
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
          instagram: "",
          video_url: "",
          sample_topics: "",
          previous_engagements: ""
        });
        setSelectedExpertise([]);
      } else {
        alert("There was an error submitting your application. Please try again or contact support.");
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert("There was an error submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Apply to Be a Speaker
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our network of world-class keynote speakers. We work with professionals 
              who command speaking fees of $10,000 or more and have demonstrated expertise in their field.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Speaker Application</CardTitle>
              <CardDescription>
                Please provide detailed information about your speaking experience and expertise.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Professional Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., Technology Futurist, Leadership Expert"
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio * (minimum 100 characters)</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Describe your background, achievements, and what makes you an exceptional speaker..."
                    className={`min-h-32 ${errors.bio ? "border-red-500" : ""}`}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.bio.length}/100 characters minimum
                  </p>
                  {errors.bio && <p className="text-sm text-red-500 mt-1">{errors.bio}</p>}
                </div>

                <div>
                  <Label>Areas of Expertise * (Select all that apply)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {EXPERTISE_OPTIONS.map((expertise) => (
                      <Badge
                        key={expertise}
                        variant={selectedExpertise.includes(expertise) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleExpertiseToggle(expertise)}
                      >
                        {expertise}
                      </Badge>
                    ))}
                  </div>
                  {errors.expertise && <p className="text-sm text-red-500 mt-1">{errors.expertise}</p>}
                </div>

                <div>
                  <Label htmlFor="speaking_topics">Speaking Topics * (comma-separated)</Label>
                  <Textarea
                    id="speaking_topics"
                    value={formData.speaking_topics}
                    onChange={(e) => handleInputChange("speaking_topics", e.target.value)}
                    placeholder="e.g., The Future of AI, Digital Transformation Strategies, Leadership in Crisis"
                    className={errors.speaking_topics ? "border-red-500" : ""}
                  />
                  {errors.speaking_topics && <p className="text-sm text-red-500 mt-1">{errors.speaking_topics}</p>}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="fee">Speaking Fee (USD) *</Label>
                    <Input
                      id="fee"
                      type="number"
                      min="10000"
                      value={formData.fee}
                      onChange={(e) => handleInputChange("fee", e.target.value)}
                      className={errors.fee ? "border-red-500" : ""}
                    />
                    <p className="text-sm text-gray-500 mt-1">Minimum $10,000</p>
                    {errors.fee && <p className="text-sm text-red-500 mt-1">{errors.fee}</p>}
                  </div>

                  <div>
                    <Label htmlFor="location">Primary Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="City, State/Country"
                      className={errors.location ? "border-red-500" : ""}
                    />
                    {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
                  </div>

                  <div>
                    <Label htmlFor="years_experience">Years of Speaking Experience *</Label>
                    <Input
                      id="years_experience"
                      type="number"
                      min="0"
                      value={formData.years_experience}
                      onChange={(e) => handleInputChange("years_experience", e.target.value)}
                      className={errors.years_experience ? "border-red-500" : ""}
                    />
                    {errors.years_experience && <p className="text-sm text-red-500 mt-1">{errors.years_experience}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="languages">Languages (comma-separated)</Label>
                  <Input
                    id="languages"
                    value={formData.languages}
                    onChange={(e) => handleInputChange("languages", e.target.value)}
                    placeholder="English, Spanish, French"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className={errors.website ? "border-red-500" : ""}
                    />
                    {errors.website && <p className="text-sm text-red-500 mt-1">{errors.website}</p>}
                  </div>

                  <div>
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className={errors.linkedin ? "border-red-500" : ""}
                    />
                    {errors.linkedin && <p className="text-sm text-red-500 mt-1">{errors.linkedin}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="twitter">Twitter/X (optional)</Label>
                    <Input
                      id="twitter"
                      value={formData.twitter}
                      onChange={(e) => handleInputChange("twitter", e.target.value)}
                      placeholder="https://twitter.com/yourusername"
                    />
                  </div>

                  <div>
                    <Label htmlFor="video_url">Speaker Demo Video URL (optional)</Label>
                    <Input
                      id="video_url"
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => handleInputChange("video_url", e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="previous_engagements">Previous Speaking Engagements (optional)</Label>
                  <Textarea
                    id="previous_engagements"
                    value={formData.previous_engagements}
                    onChange={(e) => handleInputChange("previous_engagements", e.target.value)}
                    placeholder="List notable conferences, events, or organizations where you've spoken..."
                  />
                </div>

                <div className="pt-6 border-t">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting Application..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Questions about the application process? Contact us at{" "}
              <a href="mailto:speakers@speakerfinder.com" className="text-blue-600 hover:underline">
                speakers@speakerfinder.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
