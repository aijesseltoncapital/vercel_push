"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type OnboardingStatus = {
  kyc: "not_submitted" | "submitted" | "rejected"
  nda: "not_signed" | "signed"
  contract: "not_signed" | "signed"
  investment: "not_started" | "reviewing" | "agreement_signed" | "pending" | "completed"
}

type User = {
  id: string
  email: string
  name: string
  role: "admin" | "investor"
  onboardingComplete: boolean
  onboardingStatus: OnboardingStatus
  paymentOption?: "full" | "installment"
  investmentAmount?: number
}

type AuthContextType = {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (inviteToken: string, name: string, email: string, password: string) => Promise<void>
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>
  updateUserOnboardingStatus: (status: Partial<OnboardingStatus>) => void
  updatePaymentOption: (option: "full" | "installment", amount: number) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Mock authentication for demo purposes
  useEffect(() => {
    // Check if user is stored in localStorage
    try {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user")
        if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
          try {
            setUser(JSON.parse(storedUser))
          } catch (e) {
            console.error("Failed to parse user from localStorage:", e)
            localStorage.removeItem("user") // Clear invalid data
          }
        }
      }
    } catch (e) {
      console.error("Error accessing localStorage:", e)
    }
    setLoading(false)
  }, [])

  // Protected routes logic
  useEffect(() => {
    if (!loading) {
      const publicPaths = [
        "/",
        "/login",
        "/signup",
        "/invite",
        "/forgot-password",
        "/reset-password",
        "/email-verification",
        "/email-verified",
        "/verify-email",
        "/verification-failed",
      ]
      const isPublicPath = publicPaths.some(
        (path) =>
          pathname === path ||
          pathname.startsWith("/invite/") ||
          pathname.startsWith("/reset-password/") ||
          pathname.startsWith("/verify-email/"),
      )

      if (!user && !isPublicPath) {
        router.push("/login")
      }

      if (user) {
        if (isPublicPath && pathname !== "/") {
          if (user.role === "admin") {
            router.push("/admin/dashboard")
          } else {
            router.push("/investor/project")
          }
        }

        // Redirect based on role
        if (pathname.startsWith("/admin") && user.role !== "admin") {
          router.push("/investor/project")
        }

        if (pathname.startsWith("/investor") && user.role !== "investor") {
          router.push("/admin/dashboard")
        }

        console.log(user.kycStatus)
        // Onboarding flow redirects for investor
        if (user.role === "investor" && !user.onboardingComplete) {
          // If user is on a protected page but hasn't completed onboarding
          if (
            pathname.startsWith("/investor/") &&
            !pathname.startsWith("/investor/kyc") &&
            !pathname.startsWith("/investor/nda")
          ) {
            // Check onboarding status and redirect accordingly
            if (user.onboardingStatus.kyc === "not_submitted") {
              router.push("/investor/kyc")
            } else if (user.onboardingStatus.nda === "not_signed") {
              router.push("/investor/nda")
            }
          }
        }
      }
    }
  }, [user, loading, pathname, router])

  // New function to fetch onboarding status from the API
  const fetchOnboardingStatus = async (email: string) => {
    try {
      // Create FormData with email
      const formData = new FormData()
      formData.append("email", email)

      // Add timeout to the fetch call
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1000) // 10 second timeout

      // Make API call to the onboarding status endpoint
      const response = await fetch(
        "https://api.fundcrane.com/investors/onboarding_status",
        {
          method: "POST",
          body: formData,
          credentials: "include",
          signal: controller.signal,
        },
      ).catch((err) => {
        console.error("Onboarding status fetch error:", err)
        throw new Error("Network error: Unable to connect to the server")
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch onboarding status")
      }

      const data = await response.json()
      console.log(data)

      // Return the onboarding status data
      return {
        success: true,
        onboardingStatus: data.onboardingStatus,
      }
    } catch (error: any) {
      console.error("Fetch onboarding status error:", error)
      return {
        success: false,
        error: error.message || "Failed to fetch onboarding status",
      }
    }
  }

  const updateUserOnboardingStatus = (status: Partial<OnboardingStatus>) => {
    if (user) {
      const updatedUser = {
        ...user,
        onboardingStatus: {
          ...user.onboardingStatus,
          ...status,
        },
        onboardingComplete: checkOnboardingComplete({
          ...user.onboardingStatus,
          ...status,
        }),
      }
      setUser(updatedUser)
      try {
        localStorage.setItem("user", JSON.stringify(updatedUser))
      } catch (e) {
        console.error("Failed to save user to localStorage:", e)
      }
    }
  }

  // Helper function to check if onboarding is complete
  const checkOnboardingComplete = (status: OnboardingStatus): boolean => {
    return status.kyc === "submitted" && status.nda === "signed" && status.contract === "signed"
  }

  const updatePaymentOption = async (option: "full" | "installment", amount: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        paymentOption: option,
        investmentAmount: amount,
      }
      setUser(updatedUser)
      try {
        localStorage.setItem("user", JSON.stringify(updatedUser))
      } catch (e) {
        console.error("Failed to save user to localStorage:", e)
      }
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    // First check if this is a mock user
    let mockUser: User | null = null

    if (email === "admin@example.com" && password === "password") {
      mockUser = {
        id: "1",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin",
        onboardingComplete: true,
        onboardingStatus: {
          kyc: "submitted",
          nda: "signed",
          contract: "signed",
          investment: "completed",
        },
      }
    } else if (email === "investor@example.com" && password === "password") {
      mockUser = {
        id: "2",
        email: "investor@example.com",
        name: "Investor User",
        role: "investor",
        onboardingComplete: true,
        onboardingStatus: {
          kyc: "submitted",
          nda: "signed",
          contract: "signed",
          investment: "not_started",
        },
      }
    } else if (email === "new-investor@example.com" && password === "password") {
      mockUser = {
        id: "3",
        email: "new-investor@example.com",
        name: "New Investor",
        role: "investor",
        onboardingComplete: false,
        onboardingStatus: {
          kyc: "not_submitted",
          nda: "not_signed",
          contract: "not_signed",
          investment: "not_started",
        },
      }
    }

    // If it's a mock user, use that directly
    if (mockUser) {
      setUser(mockUser)
      try {
        localStorage.setItem("user", JSON.stringify(mockUser))
      } catch (e) {
        console.error("Failed to save user to localStorage:", e)
      }

      if (mockUser.role === "admin") {
        router.push("/admin/dashboard")
      } else if (mockUser.onboardingComplete) {
        router.push("/investor/project")
      } else if (mockUser.onboardingStatus.kyc === "not_submitted") {
        router.push("/investor/kyc")
      } else if (mockUser.onboardingStatus.nda === "not_signed") {
        router.push("/investor/nda")
      } else {
        router.push("/investor/project")
      }
      setLoading(false)
      return
    }

    // Otherwise try the API call with proper error handling
    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      // Add timeout to the fetch call
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch("https://api.fundcrane.com/login", {
        method: "POST",
        body: formData,
        credentials: "include",
        signal: controller.signal,
      }).catch((err) => {
        throw new Error("Network error: Unable to connect to the server")
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }

      const data = await response.json()

      let apiUser: User | null = null // Declare once, outside the if/else

      if (data.role === "admin") {
        apiUser = {
          id: data.id || "admin-" + Date.now(),
          email: data.email || email,
          name: data.name || "Admin User",
          role: "admin",
          onboardingComplete: true,
          onboardingStatus: {
            kyc: "submitted",
            nda: "signed",
            contract: "signed",
            investment: "completed",
          },
        }
      } else {
        try {
          const query_response = await fetch(`https://api.fundcrane.com/investors/${data.id}?user_query=true`, {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
          }).catch((err) => {
            throw new Error("Network error: Unable to connect to the server")
          })

          if (!query_response.ok) {
            const errorData = await query_response.json()
            throw new Error(errorData.message || "Status query failed")
          }

          const investor_status = await query_response.json()

          apiUser = {
            id: data.id || "investor-" + Date.now(),
            email: data.email || email,
            name: data.name || email.split("@")[0],
            role: data.role || "investor",
            onboardingStatus: investor_status.data.test_onboarding_status,
            onboardingComplete:
              investor_status.data.test_onboarding_status.kyc === "submitted" &&
              investor_status.data.test_onboarding_status.nda === "signed" &&
              investor_status.data.test_onboarding_status.contract === "signed",
          }
        } catch (error) {
          // Fallback if the second API call fails
          apiUser = {
            id: data.id || "investor-" + Date.now(),
            email: data.email || email,
            name: data.name || email.split("@")[0],
            role: data.role || "investor",
            onboardingComplete: false,
            onboardingStatus: {
              kyc: "not_submitted",
              nda: "not_signed",
              contract: "not_signed",
              investment: "not_started",
            },
          }
        }
      }

      setUser(apiUser)
      try {
        localStorage.setItem("user", JSON.stringify(apiUser))
      } catch (e) {
        console.error("Failed to save user to localStorage:", e)
      }

      if (apiUser.role === "admin") {
        router.push("/admin/dashboard")
      } else if (apiUser.onboardingStatus.kyc === "not_submitted") {
        router.push("/investor/kyc")
      } else if (apiUser.onboardingStatus.nda === "not_signed") {
        router.push("/investor/nda")
      } else {
        router.push("/investor/project")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Invalid email or password")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (inviteToken: string, name: string, email: string, password: string) => {
    setLoading(true)

    try {
      const formData = new FormData()
      // Add to FormData
      formData.append("name", name)
      formData.append("email", email)
      formData.append("password", password)
      formData.append("inviteToken", inviteToken)

      // Replace the mock logic with your API call
      const response = await fetch("https://api.fundcrane.com/signup", {
        method: "POST",
        body: formData,
        credentials: "include",
      }).catch((error) => {
        console.error("Signup network error:", error)
        // Continue with mock signup even if API fails
        return { ok: false, json: () => Promise.resolve({ message: "API unavailable, using mock signup" }) }
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.log("Using mock signup flow")
        // Continue with mock signup flow
      }

      // Store the email for the verification page
      try {
        localStorage.setItem("pendingVerificationEmail", email)
      } catch (e) {
        console.error("Failed to save email to localStorage:", e)
      }

      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name,
        role: "investor",
        onboardingComplete: false,
        onboardingStatus: {
          kyc: "not_submitted",
          nda: "not_signed",
          contract: "not_signed",
          investment: "not_started",
        },
      }

      // Don't set the user yet since they need to verify email
      // setUser(newUser);
      // localStorage.setItem("user", JSON.stringify(newUser));

      // Redirect to email verification page instead of login
      router.push("/email-verification")
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true)

    try {
      // Validate email format
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return {
          success: false,
          message: "Please enter a valid email address.",
        }
      }

      // Create form data for the API call
      const formData = new FormData()
      formData.append("email", email)

      // Add timeout to the fetch call
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      // Make API call to the password reset endpoint
      const response = await fetch("https://api.fundcrane.com/forgot-password", {
        method: "POST",
        body: formData,
        credentials: "include",
        signal: controller.signal,
      }).catch((err) => {
        console.error("Forgot password network error:", err)
        // Return a mock response for demo purposes
        return {
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              message: "If an account with that email exists, a password reset link has been sent.",
            }),
        }
      })

      clearTimeout(timeoutId)

      // Parse the response
      const data = await response.json()

      // For security reasons, always return a success message even if the email doesn't exist
      // This prevents user enumeration attacks
      return {
        success: true,
        message: data.message || "If an account with that email exists, a password reset link has been sent.",
      }
    } catch (error: any) {
      console.error("Forgot password error:", error)

      // Return a generic error message
      return {
        success: false,
        message: "There was an error processing your request. Please try again later.",
      }
    } finally {
      setLoading(false)
    }
  }

  // Update the logout function to use the API route
  const logout = async () => {
    // Clear user state
    setUser(null)

    // Clear localStorage
    try {
      localStorage.removeItem("user")
      localStorage.removeItem("pendingVerificationEmail")
    } catch (e) {
      console.error("Failed to remove user data from localStorage:", e)
    }

    // Clear client-side cookies
    try {
      // Clear the invite token cookie
      document.cookie = "invite_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=strict"
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=strict"
      document.cookie = "session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=strict"

      // If you have secure cookies, include the secure flag
      if (window.location.protocol === "https:") {
        document.cookie = "invite_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=strict; Secure"
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=strict; Secure"
        document.cookie = "session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=strict; Secure"
      }
    } catch (e) {
      console.error("Failed to clear cookies:", e)
    }

    // Call our server-side logout API to clear httpOnly cookies
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // Include cookies in the request
      }).catch((error) => {
        console.error("API logout failed:", error)
      })

      // Also try the external API if it exists
      fetch("https://api.fundcrane.com/logout", {
        method: "POST",
        credentials: "include",
      }).catch((error) => {
        console.error("External API logout failed:", error)
      })
    } catch (e) {
      console.error("Failed to call logout API:", e)
    }

    // Redirect to login page with a logout parameter
    router.push("/login?logout=true")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        signup,
        forgotPassword,
        updateUserOnboardingStatus,
        updatePaymentOption,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
