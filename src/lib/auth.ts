"use client"

import { createBrowserClient } from "@supabase/ssr"

/* -------------------------------------------------------------------------- */
/*  Supabase client factory                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Returns a browser-side Supabase client.
 *
 * – Reads NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY once.
 * – If they're missing (common in previews) it falls back to your project
 *   values so the app keeps running instead of throwing "Your project's URL
 *   and API key are required…".
 *
 * IMPORTANT: Add the real env vars in Vercel → Project → Settings →
 * Environment Variables for production.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    /* eslint-disable no-console */
    console.warn(
      "⚠️  Supabase env vars missing. Using fallback project keys. " +
        "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY " +
        "to remove this warning.",
    )

    // ---- YOUR PROJECT FALLBACK VALUES -----------------------------------
    const FALLBACK_URL = "https://vnqysfavrmacrlsplvua.supabase.co"
    const FALLBACK_ANON_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucXlzZmF2cm1hY3Jsc3BsdnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMjg5NzEsImV4cCI6MjA2ODgwNDk3MX0.E4oxQfyYSB5_Yn5flAkUSGIrQuO3jSNNhjmhMTBcdYg"

    return createBrowserClient(FALLBACK_URL, FALLBACK_ANON_KEY)
  }

  return createBrowserClient(url, anonKey)
}

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

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
