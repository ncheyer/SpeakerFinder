import { supabase } from './supabase'
import type { Database } from './supabase'

type Speaker = Database['public']['Tables']['speakers']['Row']
type SpeakerInsert = Database['public']['Tables']['speakers']['Insert']
type SpeakerUpdate = Database['public']['Tables']['speakers']['Update']
type Testimonial = Database['public']['Tables']['testimonials']['Row']
type QualificationRequest = Database['public']['Tables']['qualification_requests']['Row']
type QualificationRequestInsert = Database['public']['Tables']['qualification_requests']['Insert']

export interface SpeakerWithTestimonials extends Speaker {
  testimonials: Testimonial[]
}

export class DatabaseService {
  static async getAllSpeakers(): Promise<SpeakerWithTestimonials[]> {
    const { data: speakers, error: speakersError } = await supabase
      .from('speakers')
      .select('*')
      .order('name')

    if (speakersError) {
      console.error('Error fetching speakers:', speakersError)
      return []
    }

    const speakersWithTestimonials = await Promise.all(
      speakers.map(async (speaker) => {
        const { data: testimonials } = await supabase
          .from('testimonials')
          .select('*')
          .eq('speaker_id', speaker.id)
          .order('created_at', { ascending: false })

        return {
          ...speaker,
          testimonials: testimonials || []
        }
      })
    )

    return speakersWithTestimonials
  }

  static async getSpeakerById(id: string): Promise<SpeakerWithTestimonials | null> {
    const { data: speaker, error: speakerError } = await supabase
      .from('speakers')
      .select('*')
      .eq('id', id)
      .single()

    if (speakerError) {
      console.error('Error fetching speaker:', speakerError)
      return null
    }

    const { data: testimonials } = await supabase
      .from('testimonials')
      .select('*')
      .eq('speaker_id', id)
      .order('created_at', { ascending: false })

    return {
      ...speaker,
      testimonials: testimonials || []
    }
  }

  static async searchSpeakers(filters: {
    search?: string
    topics?: string[]
    minBudget?: number
    maxBudget?: number
    location?: string
    expertise?: string[]
  }): Promise<SpeakerWithTestimonials[]> {
    let query = supabase.from('speakers').select('*')

    // Apply filters
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,title.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`)
    }

    if (filters.minBudget) {
      query = query.gte('fee', filters.minBudget)
    }

    if (filters.maxBudget) {
      query = query.lte('fee', filters.maxBudget)
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    if (filters.topics && filters.topics.length > 0) {
      query = query.overlaps('speaking_topics', filters.topics)
    }

    if (filters.expertise && filters.expertise.length > 0) {
      query = query.overlaps('expertise', filters.expertise)
    }

    const { data: speakers, error } = await query.order('name')

    if (error) {
      console.error('Error searching speakers:', error)
      return []
    }

    // Get testimonials for each speaker
    const speakersWithTestimonials = await Promise.all(
      speakers.map(async (speaker) => {
        const { data: testimonials } = await supabase
          .from('testimonials')
          .select('*')
          .eq('speaker_id', speaker.id)
          .order('created_at', { ascending: false })

        return {
          ...speaker,
          testimonials: testimonials || []
        }
      })
    )

    return speakersWithTestimonials
  }

  static async createSpeaker(speaker: SpeakerInsert): Promise<Speaker | null> {
    const { data, error } = await supabase
      .from('speakers')
      .insert(speaker)
      .select()
      .single()

    if (error) {
      console.error('Error creating speaker:', error)
      return null
    }

    return data
  }

  static async updateSpeaker(id: string, updates: SpeakerUpdate): Promise<Speaker | null> {
    const { data, error } = await supabase
      .from('speakers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating speaker:', error)
      return null
    }

    return data
  }

  static async deleteSpeaker(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('speakers')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting speaker:', error)
      return false
    }

    return true
  }

  static async submitQualificationRequest(request: QualificationRequestInsert): Promise<QualificationRequest | null> {
    const { data, error } = await supabase
      .from('qualification_requests')
      .insert(request)
      .select()
      .single()

    if (error) {
      console.error('Error submitting qualification request:', error)
      return null
    }

    return data
  }

  static async getQualificationRequests(): Promise<QualificationRequest[]> {
    const { data, error } = await supabase
      .from('qualification_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching qualification requests:', error)
      return []
    }

    return data
  }

  static async addTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at'>): Promise<Testimonial | null> {
    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonial)
      .select()
      .single()

    if (error) {
      console.error('Error adding testimonial:', error)
      return null
    }

    return data
  }

  static async getSpeakerStats() {
    const { count: totalSpeakers } = await supabase
      .from('speakers')
      .select('*', { count: 'exact', head: true })

    const { count: totalRequests } = await supabase
      .from('qualification_requests')
      .select('*', { count: 'exact', head: true })

    const { data: avgFee } = await supabase
      .rpc('avg_speaker_fee')

    return {
      totalSpeakers: totalSpeakers || 0,
      totalRequests: totalRequests || 0,
      averageFee: avgFee || 0
    }
  }
}