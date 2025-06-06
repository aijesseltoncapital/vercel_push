"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle, AlertCircle, Loader2, EyeIcon, EyeOffIcon } from "lucide-react"

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [isValidToken, setIsValidToken] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const router = useRouter()
  const { token } = params

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        // In a real implementation, you would validate the token with your API
        // For now, we'll simulate a validation check
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // For demo purposes, we'll consider all tokens valid
        // In production, you would check if the token is valid
        setIsValidToken(true)
      } catch (error) {
        setIsValidToken(false)
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    // Validate passwords
    if (password !== confirmPassword) {
      setResult({
        success: false,
        message: "Passwords do not match.",
      })
      setIsSubmitting(false)
      return
    }

    if (password.length < 8) {
      setResult({
        success: false,
        message: "Password must be at least 8 characters long.",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Create form data for the API call
      const formData = new FormData()
      formData.append("token", token)
      formData.append("password", password)

      // Make API call to reset password
      const response = await fetch("https://api.fundcrane.com/reset-password", {
        method: "POST",
        body: formData,
      }).catch((err) => {
        // Mock response for demo
        return {
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              message: "Your password has been reset successfully.",
            }),
        }
      })

      const data = await response.json()

      setResult({
        success: true,
        message: "Your password has been reset successfully.",
      })

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (error) {
      setResult({
        success: false,
        message: "There was an error resetting your password. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Show loading state while validating token
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Validating Reset Link</CardTitle>
            <CardDescription>Please wait while we validate your password reset link.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error if token is invalid
  if (!isValidToken) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-destructive">Invalid Reset Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired. Please request a new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                For security reasons, password reset links are only valid for a limited time.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/forgot-password">Request New Reset Link</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Show reset password form if token is valid
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
          <CardDescription>Create a new password for your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertDescription>{result.message}</AlertDescription>
                </div>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting || (result?.success ?? false)}
                  className="pr-10"
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isSubmitting || (result?.success ?? false)}
                minLength={8}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isSubmitting || (result?.success ?? false)}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>

            <div className="text-sm text-center text-muted-foreground">
              <Link
                href="/auth/login"
                className="flex items-center justify-center text-primary underline-offset-4 hover:underline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
