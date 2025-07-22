export interface Speaker {
  id: string;
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  speakingTopics: string[];
  fee: number;
  location: string;
  availability: string[];
  profileImage: string;
  videoUrl?: string;
  testimonials: Testimonial[];
  yearsExperience: number;
  languages: string[];
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientCompany: string;
  content: string;
  rating: number;
  eventType: string;
}

export interface QualificationForm {
  eventType: string;
  industry: string;
  audienceSize: number;
  budget: number;
  eventDate: Date;
  location: string;
  topicAreas: string[];
  additionalRequirements: string;
  organizationName: string;
  contactEmail: string;
  contactPhone?: string;
}

export interface FilterOptions {
  topics: string[];
  budgetMin: number;
  budgetMax: number;
  location: string[];
  expertise: string[];
  languages: string[];
}