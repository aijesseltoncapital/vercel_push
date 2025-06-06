"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [inviteToken, setInviteToken] = useState<string | null>(null)
  const [tokenSource, setTokenSource] = useState<string | null>(null)
  const { signup } = useAuth()
  const { toast } = useToast()

  // Get the invite token from cookies when the component mounts
  useEffect(() => {
    // Function to parse cookies
    const getCookieValue = (name: string): string | null => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(";").shift() || null
        return cookieValue
      }
      return null
    }

    // Try to get the token from the cookie
    const tokenFromCookie = getCookieValue("invite_token")

    if (tokenFromCookie) {
      setInviteToken(tokenFromCookie)
      setTokenSource("cookie")

      // Show a toast notification that we found a token
      toast({
        title: "Invitation detected",
        description: `Using invitation token: ${tokenFromCookie.substring(0, 8)}...`,
      })
    } else {
      // Check URL parameters as a fallback
      const urlParams = new URLSearchParams(window.location.search)
      const tokenFromUrl = urlParams.get("token")

      if (tokenFromUrl) {
        setInviteToken(tokenFromUrl)
        setTokenSource("url")

        toast({
          title: "Invitation detected",
          description: `Using invitation token from URL: ${tokenFromUrl.substring(0, 8)}...`,
        })
      }
    }
  }, [toast])

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePassword = (password: string) => {
    // Password must be at least 8 characters
    return password.length >= 8
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
        variant: "destructive",
      })
      return
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    if (!validatePassword(password)) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Store the email for verification page
      localStorage.setItem("pendingVerificationEmail", email)

      // Use the invite token if available, otherwise use direct_signup
      const tokenToUse = inviteToken || "direct_signup"
      await signup(tokenToUse, name, email, password)

      // Clear the invite token cookie after successful signup
      if (tokenSource === "cookie") {
        document.cookie = "invite_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      }

      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      })
      // Redirect is handled in the auth provider
    } catch (error) {
      console.error("Signup error:", error)
      toast({
        title: "Registration failed",
        description: "There was an error creating your account.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            {inviteToken
              ? "Complete your registration with your invitation"
              : "Enter your information to create an investor account"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {inviteToken && (
              <Alert>
                <AlertDescription>
                  You're signing up with an invitation token: {inviteToken.substring(0, 8)}...
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="At least 8 characters"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
