import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  const { data: { session } } = await supabase.auth.getSession()

  const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
                     req.nextUrl.pathname.startsWith('/signup')

  const isPublicPage = req.nextUrl.pathname === '/' ||
                       req.nextUrl.pathname.startsWith('/pricing')

  if (isPublicPage) return res

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export default proxy

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/campaigns/:path*',
    '/templates/:path*',
    '/login',
    '/signup',
    '/pricing'
  ]
}
