import { createBrowserClient } from '@supabase/ssr'

// Client-side Supabase client
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type AuthUser = {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
  }
}

export type UserProfile = {
  id: string
  email: string | null
  full_name: string | null
  company: string | null
  title: string | null
  phone: string | null
  created_at: string
  updated_at: string
}