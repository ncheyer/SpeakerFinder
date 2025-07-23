"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DatabaseService } from "@/lib/database";

interface FormData {
  organizationName: string;
  contactEmail: string;
  contactPhone: string;
  eventType: string;
  industry: string;
  audienceSize: string;
  budget: string;
  eventDate: string;
  location: string;
  topicAreas: string[];
  additionalRequirements: string;
}

const TOPIC_OPTIONS = [
  "Technology", "AI & Machine Learning", "Leadership", "Innovation", 
  "Digital Transformation", "Wellness", "Sustainability", "Finance",
  "Marketing", "Sales", "HR & People", "Entrepreneurship"
];

const BUDGET_MIN = 10000;

export default function QualificationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    organizationName: "",
    contactEmail: "",
    contactPhone: "",
    eventType: "",
    industry: "",
    audienceSize: "",
    budget: "",
    eventDate: "",
    location: "",
    topicAreas: [],
    additionalRequirements: ""
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleTopicToggle = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topicAreas: prev.topicAreas.includes(topic)
        ? prev.topicAreas.filter(t => t !== topic)
        : [...prev.topicAreas, topic]
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};

    switch (step) {
      case 1:
        if (!formData.organizationName.trim()) newErrors.organizationName = "Organization name is required";
        if (!formData.contactEmail.trim()) newErrors.contactEmail = "Email is required";
        if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
          newErrors.contactEmail = "Please enter a valid email";
        }
        break;
      
      case 2:
        if (!formData.eventType) newErrors.eventType = "Event type is required";
        if (!formData.industry) newErrors.industry = "Industry is required";
        if (!formData.audienceSize) newErrors.audienceSize = "Audience size is required";
        break;
      
      case 3:
        if (!formData.budget) {
          newErrors.budget = "Budget is required";
        } else {
          const budgetNum = parseInt(formData.budget);
          if (budgetNum < BUDGET_MIN) {
            newErrors.budget = `Minimum budget is $${BUDGET_MIN.toLocaleString()}`;
          }
        }
        if (!formData.eventDate) newErrors.eventDate = "Event date is required";
        if (!formData.location.trim()) newErrors.location = "Event location is required";
        break;
      
      case 4:
        if (formData.topicAreas.length === 0) {
          newErrors.topicAreas = "Please select at least one topic area";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      // All speakers including AI are now handled in-app

      // Submit to database
      const requestData = {
        organization_name: formData.organizationName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone || null,
        event_type: formData.eventType,
        industry: formData.industry,
        audience_size: formData.audienceSize,
        budget: parseInt(formData.budget),
        event_date: formData.eventDate,
        location: formData.location,
        topic_areas: formData.topicAreas,
        additional_requirements: formData.additionalRequirements || null
      };

      const result = await DatabaseService.submitQualificationRequest(requestData);
      
      if (result) {
        alert("Thank you! We'll be in touch with speaker recommendations shortly.");
        // Reset form
        setFormData({
          organizationName: "",
          contactEmail: "",
          contactPhone: "",
          eventType: "",
          industry: "",
          audienceSize: "",
          budget: "",
          eventDate: "",
          location: "",
          topicAreas: [],
          additionalRequirements: ""
        });
        setCurrentStep(1);
      } else {
        alert("There was an error submitting your request. Please try again.");
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="orgName">Organization Name *</Label>
                <Input
                  id="orgName"
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange("organizationName", e.target.value)}
                  className={errors.organizationName ? "border-red-500" : ""}
                />
                {errors.organizationName && (
                  <p className="text-sm text-red-500 mt-1">{errors.organizationName}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">Contact Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  className={errors.contactEmail ? "border-red-500" : ""}
                />
                {errors.contactEmail && (
                  <p className="text-sm text-red-500 mt-1">{errors.contactEmail}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone">Contact Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Event Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="eventType">Event Type *</Label>
                <Select value={formData.eventType} onValueChange={(value) => handleInputChange("eventType", value)}>
                  <SelectTrigger className={errors.eventType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="corporate-event">Corporate Event</SelectItem>
                    <SelectItem value="summit">Summit</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.eventType && (
                  <p className="text-sm text-red-500 mt-1">{errors.eventType}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                  <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="nonprofit">Non-profit</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <p className="text-sm text-red-500 mt-1">{errors.industry}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="audienceSize">Expected Audience Size *</Label>
                <Select value={formData.audienceSize} onValueChange={(value) => handleInputChange("audienceSize", value)}>
                  <SelectTrigger className={errors.audienceSize ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select audience size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50-100">50-100</SelectItem>
                    <SelectItem value="100-250">100-250</SelectItem>
                    <SelectItem value="250-500">250-500</SelectItem>
                    <SelectItem value="500-1000">500-1000</SelectItem>
                    <SelectItem value="1000+">1000+</SelectItem>
                  </SelectContent>
                </Select>
                {errors.audienceSize && (
                  <p className="text-sm text-red-500 mt-1">{errors.audienceSize}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Budget & Logistics</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="budget">Speaker Budget (USD) *</Label>
                <Input
                  id="budget"
                  type="number"
                  min={BUDGET_MIN}
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  className={errors.budget ? "border-red-500" : ""}
                  placeholder={`Minimum $${BUDGET_MIN.toLocaleString()}`}
                />
                {errors.budget && (
                  <p className="text-sm text-red-500 mt-1">{errors.budget}</p>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  All our speakers have a minimum fee of ${BUDGET_MIN.toLocaleString()}
                </p>
              </div>
              
              <div>
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleInputChange("eventDate", e.target.value)}
                  className={errors.eventDate ? "border-red-500" : ""}
                />
                {errors.eventDate && (
                  <p className="text-sm text-red-500 mt-1">{errors.eventDate}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="location">Event Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className={errors.location ? "border-red-500" : ""}
                  placeholder="City, State/Country"
                />
                {errors.location && (
                  <p className="text-sm text-red-500 mt-1">{errors.location}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Topics & Requirements</h2>
            <div className="space-y-4">
              <div>
                <Label>Preferred Topics * (Select all that apply)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {TOPIC_OPTIONS.map((topic) => (
                    <Badge
                      key={topic}
                      variant={formData.topicAreas.includes(topic) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTopicToggle(topic)}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
                {errors.topicAreas && (
                  <p className="text-sm text-red-500 mt-1">{errors.topicAreas}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="requirements">Additional Requirements (Optional)</Label>
                <Textarea
                  id="requirements"
                  value={formData.additionalRequirements}
                  onChange={(e) => handleInputChange("additionalRequirements", e.target.value)}
                  placeholder="Any specific requirements, accessibility needs, or additional information..."
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Step {currentStep} of 4</span>
          <span className="text-sm text-gray-600">{Math.round((currentStep / 4) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Speaker Qualification Form</CardTitle>
          <CardDescription>
            Help us find the perfect speaker for your event
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <div className="ml-auto">
              {currentStep < 4 ? (
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  Submit Request
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}