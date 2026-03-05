import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Vérification des accès par rôle
    if (pathname.startsWith('/dashboard/parent') && token?.role !== 'PARENT') {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    if (pathname.startsWith('/dashboard/teacher') && token?.role !== 'TEACHER') {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    if (pathname.startsWith('/dashboard/ngo') && token?.role !== 'NGO') {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    if (pathname.startsWith('/dashboard/admin') && token?.role !== 'ORGANIZATION') {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    '/dashboard/parent/:path*',
    '/dashboard/teacher/:path*',
    '/dashboard/school/:path*',
    '/dashboard/ngo/:path*',
    '/dashboard/admin/:path*'
  ]
}
