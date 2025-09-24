import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl

  // Only guard these paths
  const pathname = url.pathname
  const requiresAuth = pathname.startsWith('/profile') || pathname.startsWith('/admin') || pathname.startsWith('/bookmarks') || pathname.startsWith('/settings')
  if (!requiresAuth) return NextResponse.next()

  // Create a Supabase server client bound to request cookies
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session, redirect to home and optionally pass redirect back URL
  if (!session) {
    const redirect = new URL('/', req.url)
    redirect.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirect)
  }

  // For /admin, enforce role admin via a lightweight profile fetch
  if (pathname.startsWith('/admin')) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, id, username')
      .eq('id', session.user.id)
      .single()

    console.log('🔒 Middleware Check:', {
      pathname,
      userId: session.user.id,
      profile,
      profileError,
      hasProfile: !!profile,
      role: profile?.role
    })

    if (profileError) {
      console.error('🔒 Profile fetch error:', profileError)
      // If profile doesn't exist, redirect to profile page to create one
      return NextResponse.redirect(new URL('/profile?error=profile_not_found', req.url))
    }

    // Check for temporary admin bypass (for testing)
    const url = new URL(req.url)
    const bypass = url.searchParams.get('bypass') === 'admin'

    if (!profile || (profile.role !== 'admin' && !bypass)) {
      console.log('🔒 Access denied - redirecting to home', {
        hasProfile: !!profile,
        role: profile?.role,
        bypass
      })
      return NextResponse.redirect(new URL('/?blocked=true&path=' + pathname, req.url))
    }

    // If using bypass, show warning in console
    if (bypass) {
      console.log('⚠️ TEMPORARY ADMIN BYPASS ACTIVE - Remove ?bypass=admin for production!')
    }
  }

  return res
}

export const config = {
  matcher: ['/profile', '/profile/:path*', '/admin', '/admin/:path*', '/bookmarks', '/settings'],
}


