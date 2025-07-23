import { createClient } from '@/lib/auth'
import type { 
  Project, 
  ProjectInsert, 
  ProjectUpdate,
  SpeakerWishlist,
  SpeakerWishlistInsert,
  SpeakerWishlistUpdate,
  SpeakerWishlistWithSpeaker
} from '@/lib/types/project'

export class ProjectService {
  private static supabase = createClient()

  // Project CRUD operations
  static async getUserProjects(userId: string): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return []
    }

    return data || []
  }

  static async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      return null
    }

    return data
  }

  static async createProject(project: ProjectInsert): Promise<Project | null> {
    const { data, error } = await this.supabase
      .from('projects')
      .insert(project)
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return null
    }

    return data
  }

  static async updateProject(id: string, updates: ProjectUpdate): Promise<Project | null> {
    const { data, error } = await this.supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error)
      return null
    }

    return data
  }

  static async deleteProject(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project:', error)
      return false
    }

    return true
  }

  // Speaker Wishlist operations
  static async getProjectWishlist(projectId: string): Promise<SpeakerWishlistWithSpeaker[]> {
    const { data, error } = await this.supabase
      .from('speaker_wishlists')
      .select(`
        *,
        speaker:speakers(
          id,
          name,
          title,
          bio,
          expertise,
          fee,
          location,
          profile_image,
          video_url
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching wishlist:', error)
      return []
    }

    return data as SpeakerWishlistWithSpeaker[] || []
  }

  static async addSpeakerToWishlist(wishlistItem: SpeakerWishlistInsert): Promise<SpeakerWishlist | null> {
    const { data, error } = await this.supabase
      .from('speaker_wishlists')
      .insert(wishlistItem)
      .select()
      .single()

    if (error) {
      console.error('Error adding speaker to wishlist:', error)
      return null
    }

    return data
  }

  static async updateWishlistItem(id: string, updates: SpeakerWishlistUpdate): Promise<SpeakerWishlist | null> {
    const { data, error } = await this.supabase
      .from('speaker_wishlists')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating wishlist item:', error)
      return null
    }

    return data
  }

  static async removeSpeakerFromWishlist(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('speaker_wishlists')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error removing speaker from wishlist:', error)
      return false
    }

    return true
  }

  static async isSpeakerInWishlist(projectId: string, speakerId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('speaker_wishlists')
      .select('id')
      .eq('project_id', projectId)
      .eq('speaker_id', speakerId)
      .single()

    return !error && !!data
  }

  // Analytics and stats
  static async getProjectStats(userId: string) {
    const [projectsResult, wishlistResult] = await Promise.all([
      this.supabase
        .from('projects')
        .select('status', { count: 'exact' })
        .eq('user_id', userId),
      this.supabase
        .from('speaker_wishlists')
        .select('status, projects!inner(user_id)', { count: 'exact' })
        .eq('projects.user_id', userId)
    ])

    const projectStats = {
      total: projectsResult.count || 0,
      planning: 0,
      active: 0,
      completed: 0,
      cancelled: 0
    }

    if (projectsResult.data) {
      projectsResult.data.forEach((project: { status: string }) => {
        projectStats[project.status as keyof typeof projectStats]++
      })
    }

    const wishlistStats = {
      total: wishlistResult.count || 0,
      interested: 0,
      contacted: 0,
      proposed: 0,
      confirmed: 0,
      declined: 0
    }

    if (wishlistResult.data) {
      wishlistResult.data.forEach((item: { status: string }) => {
        wishlistStats[item.status as keyof typeof wishlistStats]++
      })
    }

    return {
      projects: projectStats,
      speakers: wishlistStats
    }
  }
}