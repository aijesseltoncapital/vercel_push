"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Info, Link2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function NDAPage() {
  const { user, updateUserOnboardingStatus } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasRead, setHasRead] = useState(false)
  const [signingUrl, setSigningUrl] = useState<string | null>(null)
  const [showSigningDialog, setShowSigningDialog] = useState(false)

  // Check if KYC is completed
  useEffect(() => {
    if (user?.onboardingStatus.kyc !== "submitted") {
      toast({
        title: "KYC verification required",
        description: "You need to complete KYC verification before signing the NDA",
        variant: "destructive",
      })
      router.push("/investor/kyc")
    }
  }, [user, router, toast])

  // If NDA is already signed, redirect to project page
  useEffect(() => {
    if (user?.onboardingStatus.nda === "signed") {
      router.push("/investor/project")
    }
  }, [user, router])

  async function prepareDocumentForSigning() {
    const formData = new FormData()
    // Add to FormData
    formData.append("recipient_name", user?.name || "")
    formData.append("recipient_email", user?.email || "")
    formData.append("doc_type", "NDA")

    return formData
  }

  async function initiateExternalSigning() {
    try {
      // Prepare the FormData with all required inputs
      const formData = await prepareDocumentForSigning()

      // You might want to update the UI to indicate the signing process has been initiated
      toast({
        title: "Signing initiated",
        description: "Please wait 8s-12s for the system to set up the signing process",
      })

      // Call your signing API
      const response = await fetch(
        "https://api.fundcrane.com/create-sign-url",
        {
          method: "POST",
          body: formData,
          mode: "cors",
          // Include any necessary headers
        },
      ).catch((error) => {
        console.error("Error initiating signing process:", error)
        // Mock response for demo
        return {
          ok: true,
          json: () => Promise.resolve({ url: "#" }),
        }
      })

      if (!response.ok) {
        throw new Error("Failed to initiate signing process")
      }

      // Get the signing URL from the response
      const data = await response.json()
      const signingUrl = data.url

      console.log("Received signing URL:", signingUrl)
      // Store the URL and show a dialog
      setSigningUrl(data.url)
      setShowSigningDialog(true)
    } catch (error) {
      console.error("Error initiating signing process:", error)
      toast({
        title: "Error",
        description: "Failed to initiate signing process. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSignNDA = async () => {
    if (!hasRead) {
      toast({
        title: "Agreement confirmation required",
        description: "Please confirm that you have read and agree to the terms",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Call the function to initiate the external signing process
      await initiateExternalSigning()
    } catch (error) {
      console.error("NDA signing error:", error)
      toast({
        title: "Signing failed",
        description: error instanceof Error ? error.message : "There was an error signing the NDA",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Non-Disclosure Agreement</h2>
      </div>

      <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-400">
        <Info className="h-4 w-4 mr-2" />
        <AlertDescription>
          Before accessing confidential project information, you must sign this Non-Disclosure Agreement (NDA). Please
          read the document carefully before signing.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Non-Disclosure Agreement</CardTitle>
          <CardDescription>Please read the following agreement carefully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-md p-4 h-96 overflow-y-auto bg-muted/30">
            <iframe
              src={`https://docs.google.com/gview?url=https://legal-doc-storage.tos-ap-southeast-1.bytepluses.com/Investor_DataRoom_NDA.docx&embedded=true`}
              width="100%"
              height="570px"
              className="border"
            ></iframe>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="hasRead" checked={hasRead} onCheckedChange={(checked) => setHasRead(checked === true)} />
            <Label htmlFor="hasRead">I have read and agree to the terms of the Non-Disclosure Agreement</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/investor/kyc")}>
            Back
          </Button>
          <Button onClick={handleSignNDA} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
                Preparing...
              </>
            ) : (
              <>
                <Link2 className="mr-2 h-4 w-4" />
                Sign Agreement
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Signing URL Dialog */}
      <Dialog open={showSigningDialog} onOpenChange={setShowSigningDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Ready for Signature</DialogTitle>
            <DialogDescription>
              Your document is ready to be signed. Click below to open the signing page.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <Button
              onClick={() => {
                window.open(signingUrl, "_blank")
                setShowSigningDialog(false)

                // Simulate successful signing after a delay
                setTimeout(() => {
                  // Update user onboarding status
                  updateUserOnboardingStatus({ nda: "signed" })

                  toast({
                    title: "Contract signed successfully",
                    description: "You can now proceed to the investment step",
                  })

                  // Force a re-render
                  router.refresh()
                }, 3000)
              }}
            >
              Open Signing Page
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSigningDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
