import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Auth paths that should be accessible without authentication
  const authPaths = ["/login", "/register", "/forgot-password"]

  // Check if the current path is an auth path
  const isAuthPath = authPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + "/"),
  )

  // Check if user is authenticated (has auth cookie)
  const isAuthenticated = request.cookies.has("auth")

  // If user is on an auth page but already authenticated, redirect to dashboard
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If user is not on an auth page and not authenticated, redirect to login
  if (!isAuthPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Otherwise, continue with the request
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

