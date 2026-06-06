import { type NextRequest, NextResponse } from 'next/server'
import { createMiddlewareSupabase } from '@/lib/supabase'

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/api/auth/callback',
  '/api/webhooks/stripe',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))

  const { supabase, response } = createMiddlewareSupabase(request)
  const { data: { user } } = await supabase.auth.getUser()

  if (!isPublic && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (user && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/app'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
