// Browser-safe Supabase helpers — keys from env only, never hardcoded.
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ftkpqjcwsuvrbaoexcxz.supabase.co'

export function getAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
  return key
}

export function getServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  return key
}

function isLegacyJwtKey(key: string): boolean {
  return key.startsWith('eyJ')
}

/** Headers for service-role PostgREST / Auth Admin. apikey-only for sb_secret_. */
export function serviceRestHeaders(extra?: Record<string, string>): Record<string, string> {
  const key = getServiceRoleKey()
  const headers: Record<string, string> = { apikey: key, ...extra }
  if (isLegacyJwtKey(key)) headers.Authorization = `Bearer ${key}`
  return headers
}

export function createBrowserSupabase() {
  return createBrowserClient(SUPABASE_URL, getAnonKey())
}

export function createMiddlewareSupabase(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(SUPABASE_URL, getAnonKey(), {
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
