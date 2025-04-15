"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function VerifyEmailPage({ params }: { params: { token: string } }) {
  const [isVerifying, setIsVerifying] = useState(true)
  const router = useRouter()
  const { token } = params

  useEffect(() => {
    async function verifyEmail() {
      try {
        // In a real implementation, you would make an API call to verify the email
        // For now, we'll simulate a verification process
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Redirect to verified page
        router.push("/email-verified")
      } catch (error) {
        // Handle error
        router.push("/verification-failed")
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Verifying Your Email</CardTitle>
          <CardDescription>Please wait while we verify your email address.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  )
}
