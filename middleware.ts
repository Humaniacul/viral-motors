import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl

  // Only guard these paths
  const pathname = url.pathname
  const requiresAuth = pathname.startsWith('/profile') || pathname.startsWith('/admin')
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
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/profile', '/profile/:path*', '/admin', '/admin/:path*'],
}


