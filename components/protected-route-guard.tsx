"use client"

import { useAuth } from "@/lib/auth-provider"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import type React from "react"

export function ProtectedRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }

    if (user) {
      // Onboarding flow redirects for investor
      if (user.role === "investor" && !user.onboardingComplete) {
        // If user is on a protected page but hasn't completed onboarding
        if (
          pathname.startsWith("/investor/") &&
          !pathname.startsWith("/investor/kyc") &&
          !pathname.startsWith("/investor/nda")
        ) {
          // Check onboarding status and redirect accordingly
          if (user.onboardingStatus.kyc !== "submitted") {
            router.push("/investor/kyc")
          } else if (user.onboardingStatus.nda !== "signed") {
            router.push("/investor/nda")
          }
        }
      }
    }
  }, [loading, user, router, pathname])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
