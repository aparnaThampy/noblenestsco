import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Only protect /admin routes
  if (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/noblenestsco/admin')) {
    const basicAuth = req.headers.get('authorization')
    const url = req.nextUrl

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      // Try to decode basic auth string
      try {
        const [user, pwd] = atob(authValue).split(':')

        // Valid username and password (using ADMIN_API_KEY as password)
        const validPassword = process.env.ADMIN_API_KEY || 'supersecret123'
        
        if (user === 'admin' && pwd === validPassword) {
          return NextResponse.next()
        }
      } catch (e) {
        console.error('Basic Auth Error', e)
      }
    }
    
    // Prompt for Basic Auth
    url.pathname = '/api/admin/unauthorized'
    return new NextResponse('Auth Required.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Admin Area"'
      }
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/noblenestsco/admin/:path*'],
}
