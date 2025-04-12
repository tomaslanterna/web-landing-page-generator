import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Check if the request is for the auth error page
  if (request.nextUrl.pathname.startsWith("/api/auth/error")) {
    // Redirect to our custom error page
    return NextResponse.redirect(new URL("/auth/error", request.url))
  }

  // Allow all other requests
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/(dashboard)/:path*", "/login", "/register", "/api/auth/error"],
}
