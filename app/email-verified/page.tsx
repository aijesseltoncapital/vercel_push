"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function EmailVerifiedPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [userEmail, setUserEmail] = useState("your email") // fallback value

  useEffect(() => {
    // Get the email from localStorage
    const email = localStorage.getItem("pendingVerificationEmail")
    if (email) {
      setUserEmail(email)
    }

    // Show toast notification
    toast({
      title: "Email verified successfully",
      description: "Your account is now active.",
      variant: "success",
    })

    // Clean up localStorage
    localStorage.removeItem("pendingVerificationEmail")
  }, [toast])

  const handleReturnToLogin = () => {
    router.push("/login")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Email Verified!</CardTitle>
          <CardDescription className="text-center">
            Your email address <span className="font-medium">{userEmail}</span> has been successfully verified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
            <p className="text-sm">
              Your account is now active and you can access all features of the platform. Please log in to continue.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm">What happens next?</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Log in to your account</li>
              <li>Complete your investor profile</li>
              <li>Submit your KYC documents</li>
              <li>Start exploring investment opportunities</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button onClick={handleReturnToLogin} className="w-full" size="lg">
            Return to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
