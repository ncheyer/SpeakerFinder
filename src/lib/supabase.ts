import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vnqysfavrmacrlsplvua.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucXlzZmF2cm1hY3Jsc3BsdnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMjg5NzEsImV4cCI6MjA2ODgwNDk3MX0.E4oxQfyYSB5_Yn5flAkUSGIrQuO3jSNNhjmhMTBcdYg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      speakers: {
        Row: {
          id: string
          name: string
          title: string
          bio: string
          expertise: string[]
          speaking_topics: string[]
          fee: number
          location: string
          availability: string[]
          profile_image: string | null
          video_url: string | null
          years_experience: number
          languages: string[]
          website: string | null
          linkedin: string | null
          twitter: string | null
          instagram: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          title: string
          bio: string
          expertise: string[]
          speaking_topics: string[]
          fee: number
          location: string
          availability?: string[]
          profile_image?: string | null
          video_url?: string | null
          years_experience: number
          languages: string[]
          website?: string | null
          linkedin?: string | null
          twitter?: string | null
          instagram?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string
          bio?: string
          expertise?: string[]
          speaking_topics?: string[]
          fee?: number
          location?: string
          availability?: string[]
          profile_image?: string | null
          video_url?: string | null
          years_experience?: number
          languages?: string[]
          website?: string | null
          linkedin?: string | null
          twitter?: string | null
          instagram?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          speaker_id: string
          client_name: string
          client_company: string
          content: string
          rating: number
          event_type: string
          created_at: string
        }
        Insert: {
          id?: string
          speaker_id: string
          client_name: string
          client_company: string
          content: string
          rating: number
          event_type: string
          created_at?: string
        }
        Update: {
          id?: string
          speaker_id?: string
          client_name?: string
          client_company?: string
          content?: string
          rating?: number
          event_type?: string
          created_at?: string
        }
      }
      qualification_requests: {
        Row: {
          id: string
          organization_name: string
          contact_email: string
          contact_phone: string | null
          event_type: string
          industry: string
          audience_size: string
          budget: number
          event_date: string
          location: string
          topic_areas: string[]
          additional_requirements: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_name: string
          contact_email: string
          contact_phone?: string | null
          event_type: string
          industry: string
          audience_size: string
          budget: number
          event_date: string
          location: string
          topic_areas: string[]
          additional_requirements?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_name?: string
          contact_email?: string
          contact_phone?: string | null
          event_type?: string
          industry?: string
          audience_size?: string
          budget?: number
          event_date?: string
          location?: string
          topic_areas?: string[]
          additional_requirements?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}