export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  budget: number | null;
  audience_size: string | null;
  event_type: string | null;
  industry: string | null;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ProjectInsert {
  user_id: string;
  name: string;
  description?: string | null;
  event_date?: string | null;
  location?: string | null;
  budget?: number | null;
  audience_size?: string | null;
  event_type?: string | null;
  industry?: string | null;
  status?: 'planning' | 'active' | 'completed' | 'cancelled';
}

export interface ProjectUpdate {
  name?: string;
  description?: string | null;
  event_date?: string | null;
  location?: string | null;
  budget?: number | null;
  audience_size?: string | null;
  event_type?: string | null;
  industry?: string | null;
  status?: 'planning' | 'active' | 'completed' | 'cancelled';
}

export interface SpeakerWishlist {
  id: string;
  project_id: string;
  speaker_id: string;
  status: 'interested' | 'contacted' | 'proposed' | 'confirmed' | 'declined';
  notes: string | null;
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  updated_at: string;
}

export interface SpeakerWishlistInsert {
  project_id: string;
  speaker_id: string;
  status?: 'interested' | 'contacted' | 'proposed' | 'confirmed' | 'declined';
  notes?: string | null;
  priority?: 'high' | 'medium' | 'low';
}

export interface SpeakerWishlistUpdate {
  status?: 'interested' | 'contacted' | 'proposed' | 'confirmed' | 'declined';
  notes?: string | null;
  priority?: 'high' | 'medium' | 'low';
}

export interface SpeakerWishlistWithSpeaker extends SpeakerWishlist {
  speaker: {
    id: string;
    name: string;
    title: string;
    bio: string;
    expertise: string[];
    fee: number;
    location: string;
    profile_image: string | null;
    video_url: string | null;
  };
}