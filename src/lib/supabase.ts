// Browser-safe Supabase constants (no next/headers import here)
import { createBrowserClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export const SUPABASE_URL = 'https://ftkpqjcwsuvrbaoexcxz.supabase.co'
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0a3BxamN3c3V2cmJhb2V4Y3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTU2MjQsImV4cCI6MjA5NTczMTYyNH0.AlzI9AtVjN_eOQjCCAnF79pjWDa8MzR1SgCHS54go6k'
export const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0a3BxamN3c3V2cmJhb2V4Y3h6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDE1NTYyNCwiZXhwIjoyMDk1NzMxNjI0fQ.0BIcvCAcl3KCQdKOZ53iDfRbaVteoxxSVRYsBbW34JU'

export function createBrowserSupabase() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

export function createMiddlewareSupabase(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })
  return { supabase, response }
}
