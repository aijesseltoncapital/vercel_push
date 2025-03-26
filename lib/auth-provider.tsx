"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string
  email: string
  name: string
  role: "admin" | "investor"
  onboardingComplete: boolean
  kycStatus: "not_submitted" | "pending" | "approved" | "rejected"
  investmentStatus?: "not_started" | "reviewing" | "agreement_signed" | "payment_pending" | "completed"
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (inviteToken: string, name: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Mock authentication for demo purposes
  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Protected routes logic
  useEffect(() => {
    if (!loading) {
      const publicPaths = ["/", "/login", "/signup", "/invite"]
      const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith("/invite/"))

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
      }
    }
  }, [user, loading, pathname, router])

  const login = async (email: string, password: string) => {
    setLoading(true)

    // Mock login - in a real app, this would be an API call
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock users for demo
      let mockUser: User | null = null

      if (email === "admin@example.com" && password === "password") {
        mockUser = {
          id: "1",
          email: "admin@example.com",
          name: "Admin User",
          role: "admin",
          onboardingComplete: true,
          kycStatus: "approved",
        }
      } else if (email === "investor@example.com" && password === "password") {
        mockUser = {
          id: "2",
          email: "investor@example.com",
          name: "Investor User",
          role: "investor",
          onboardingComplete: true,
          kycStatus: "approved", // This investor has KYC approval
          investmentStatus: "not_started",
        }
      } else if (email === "new-investor@example.com" && password === "password") {
        mockUser = {
          id: "3",
          email: "new-investor@example.com",
          name: "New Investor",
          role: "investor",
          onboardingComplete: true,
          kycStatus: "not_submitted", // This investor hasn't submitted KYC yet
          investmentStatus: "not_started",
        }
      } else {
        throw new Error("Invalid credentials")
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))

      if (mockUser.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/investor/project") // Updated to redirect to the new Project page
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (inviteToken: string, name: string, email: string, password: string) => {
    setLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, we would validate the invite token against the backend
      // For direct signup, we'll allow a special token value
      if (inviteToken !== "direct_signup" && !inviteToken) {
        throw new Error("Invalid invite token")
      }

      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name,
        role: "investor",
        onboardingComplete: false,
        kycStatus: "not_submitted", // New users start with KYC not submitted
        investmentStatus: "not_started",
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      router.push("/investor/project")
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, signup }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

