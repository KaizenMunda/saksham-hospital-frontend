import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Refresh session
  await supabase.auth.getSession()
  
  return res
}

// Specify which paths this middleware should run on
export const config = {
  matcher: [
    // Protect dashboard routes
    '/dashboard/:path*',
  ],
} 