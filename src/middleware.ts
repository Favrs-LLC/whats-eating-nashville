import { NextRequest, NextResponse } from 'next/server'
import { verifyBasicAuth } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Check if user is authenticated
    const isAuthenticated = verifyBasicAuth(request)
    
    if (!isAuthenticated) {
      // Return basic auth challenge
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
