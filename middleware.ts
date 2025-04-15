import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle invite token links
  if (pathname.startsWith("/invite/")) {
    const token = pathname.split("/").pop()

    // Create a new URL for the redirect
    const signupUrl = new URL("/signup", request.url)

    // Add the token as a query parameter
    signupUrl.searchParams.set("token", token || "")

    // Create a response that redirects to the signup page
    const response = NextResponse.redirect(signupUrl)

    // Store the invite token in a cookie (replicating the logic from app/invite/[token]/page.tsx)
    response.cookies.set("invite_token", token || "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      sameSite: "strict",
    })

    return response
  }

  // Handle email verification links
  if (pathname.startsWith("/verify-email/")) {
    const token = pathname.split("/").pop()

    // In a real implementation, you would validate the token here or in the API
    // For now, we'll just redirect to the email-verified page

    // Create a new response that redirects to the email-verified page
    const response = NextResponse.redirect(new URL("/email-verified", request.url))

    return response
  }

  // Handle logout requests that need server-side cookie clearing
  if (pathname === "/api/logout") {
    const response = NextResponse.redirect(new URL("/login", request.url))

    // Clear all authentication cookies
    response.cookies.set("invite_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expire immediately
      path: "/",
      sameSite: "strict",
    })

    // Clear any other auth cookies your application might use
    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
      sameSite: "strict",
    })

    response.cookies.set("session_id", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
      sameSite: "strict",
    })

    return response
  }

  return NextResponse.next()
}

// Update the matcher to include the logout API route
export const config = {
  matcher: ["/invite/:token*", "/verify-email/:token*", "/api/logout"],
}
