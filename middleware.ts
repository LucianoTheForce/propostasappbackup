// TEMPORARILY DISABLED FOR DEVELOPMENT
// Uncomment the code below to enable authentication

/*
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Custom logic can go here
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Protect all routes except public proposal views
        const pathname = req.nextUrl.pathname
        
        // Allow public access to individual proposals (not edit mode)
        if (pathname.match(/^\/proposals\/[^\/]+$/) && !pathname.includes('/edit')) {
          return true
        }
        
        // All other routes require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
    '/dashboard/:path*',
    '/proposals/new',
    '/proposals/:slug/edit',
  ],
}
*/

// Temporary bypass - no authentication required
export default function middleware() {
  // Allow all requests
}

export const config = {
  matcher: []
}