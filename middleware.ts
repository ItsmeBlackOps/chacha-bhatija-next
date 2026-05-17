import { auth } from '@/auth'
import { NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/', '/book', '/login', '/api/auth']
const TERMINAL_ROUTES = ['/terminal']

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role as string | undefined

  const isPublic = PUBLIC_ROUTES.some((route) =>
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + '/')
  )

  const isTerminal = TERMINAL_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route)
  )

  // Allow public routes
  if (isPublic) return NextResponse.next()

  // Redirect unauthenticated to login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  // Role-based access for terminal
  if (isTerminal) {
    const managerRoutes = ['/terminal/impound', '/terminal/kits', '/terminal/staff', '/terminal/payments', '/terminal/reports']
    const ownerRoutes = ['/terminal/private', '/terminal/audit', '/terminal/settings']

    const isManagerRoute = managerRoutes.some((r) => nextUrl.pathname.startsWith(r))
    const isOwnerRoute = ownerRoutes.some((r) => nextUrl.pathname.startsWith(r))

    if (isOwnerRoute && userRole !== 'OWNER') {
      return NextResponse.redirect(new URL('/terminal/dashboard', nextUrl))
    }

    if (isManagerRoute && !['OWNER', 'MANAGER'].includes(userRole ?? '')) {
      return NextResponse.redirect(new URL('/terminal/dashboard', nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)'],
}
