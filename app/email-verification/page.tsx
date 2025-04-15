"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function EmailVerificationPage() {
  const [userEmail, setUserEmail] = useState("your email") // fallback for SSR
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Only runs on the client
    const email = localStorage.getItem("pendingVerificationEmail")
    if (email) {
      setUserEmail(email)
    }
  }, [])

  const handleResendVerification = async () => {
    setIsResending(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      setResendSuccess(true)
      toast({
        title: "Verification email sent",
        description: `We've sent a new verification email to ${userEmail}`,
      })
    } catch (error) {
      toast({
        title: "Failed to resend verification email",
        description: "Please try again later or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  // Safe access inside the component since it's on the client
  const demoVerificationLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify-email/${Math.random().toString(36).substring(2, 15)}`
      : "#"

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Verify your email</CardTitle>
          <CardDescription className="text-center">
            We've sent a verification link to <span className="font-medium">{userEmail}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Please check your email and click the verification link to activate your account.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-medium text-sm">What to do next:</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Check your email inbox for a message from us</li>
              <li>Click the verification link in the email</li>
              <li>Once verified, you'll be able to access your account</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm">Can't find the email?</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Allow a few minutes for the email to arrive</li>
            </ul>
          </div>

          <div className="border border-dashed border-gray-300 p-3 rounded-md bg-gray-50">
            <p className="text-xs text-gray-500 mb-1">Demo: Verification link example</p>
            <a
              href={demoVerificationLink}
              className="text-xs text-blue-600 break-all hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {demoVerificationLink}
            </a>
          </div>

          {resendSuccess && (
            <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>A new verification email has been sent to your inbox.</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={handleResendVerification}
            variant="outline"
            className="w-full"
            disabled={isResending || resendSuccess}
          >
            {isResending ? "Sending..." : resendSuccess ? "Email sent" : "Resend verification email"}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            <Link href="/login" className="flex items-center justify-center text-primary hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
