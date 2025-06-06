"use client"

import { CardFooter } from "@/components/ui/card"
// Make sure useRef is imported if you keep it, though likely not needed now
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// Import updateUserOnboardingStatus from your auth provider
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
  // Destructure updateUserOnboardingStatus along with others
  const { user, fetchOnboardingStatus, updateUserOnboardingStatus } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasRead, setHasRead] = useState(false)
  const [signingUrl, setSigningUrl] = useState<string | null>(null)
  const [showSigningDialog, setShowSigningDialog] = useState(false)
  // State to track if we should check status on window focus
  const [isWaitingForSignature, setIsWaitingForSignature] = useState(false)

  // --- Simplified Status Check Function (runs on focus) ---
  const checkAndUpdateStatusOnFocus = async () => {
    // Only proceed if we expect a signature check and user exists and NDA isn't already signed locally
    if (!isWaitingForSignature || !user?.email || user.onboardingStatus.nda === "signed") {
      // console.log("Skipping focus check:", {isWaitingForSignature, userExists: !!user?.email, isSigned: user?.onboardingStatus.nda === 'signed'});
      return
    }

    console.log("Window focused, checking NDA status...")
    // You could set a loading indicator specifically for this check if desired
    // setLoadingStatusCheck(true);

    try {
      const result = await fetchOnboardingStatus(user.email)

      if (result.success && result.onboardingStatus?.nda === "signed") {
        console.log("NDA signed detected on focus!")
        setIsWaitingForSignature(false) // Stop checking on subsequent focuses

        toast({
          title: "Agreement signed successfully",
          description: "Your NDA has been recorded.",
          duration: 5000, // Give user time to see it
        })

        // Update local context state immediately if the function is available
        if (updateUserOnboardingStatus && result.onboardingStatus) {
          updateUserOnboardingStatus({ nda: "signed" })
        } else {
          // Fallback if updateUserOnboardingStatus isn't available or didn't update context correctly
          console.warn("updateUserOnboardingStatus not available or did not run, relying on redirect/refresh.")
        }

        // Redirect after a short delay to allow user to see the toast
        // Note: The useEffect checking user.onboardingStatus.nda might trigger redirect even sooner
        setTimeout(() => {
          // Check again if already signed locally before pushing, might be redundant due to useEffect
          if (user?.onboardingStatus.nda !== "signed") {
            router.push("/investor/project") // Or next step in onboarding
          }
          // Alternatively, just refresh to be sure:
          // router.refresh();
        }, 1500)
      } else {
        console.log("NDA not signed yet or status check failed on focus.")
        // Optionally notify user if check fails but we were expecting signature
        // toast({ title: "Signature Pending", description: "Signature status not yet confirmed. Please ensure you completed the signing process.", variant: "default" });
      }
    } catch (error) {
      console.error("Error checking onboarding status on focus:", error)
      toast({
        title: "Error Checking Status",
        description: "Could not verify signature status.",
        variant: "destructive",
      })
    } finally {
      // setLoadingStatusCheck(false);
    }
  }

  // --- useEffect for Focus Listener ---
  useEffect(() => {
    // Define the handler inside useEffect or ensure dependencies are correct if defined outside
    const handler = () => checkAndUpdateStatusOnFocus()

    if (isWaitingForSignature) {
      console.log("Adding focus listener.")
      window.addEventListener("focus", handler)
    } else {
      // Ensure listener is removed if we are no longer waiting
      window.removeEventListener("focus", handler)
    }

    // Cleanup function: remove listener when component unmounts or isWaitingForSignature becomes false
    return () => {
      // console.log("Cleanup: Removing focus listener.");
      window.removeEventListener("focus", handler)
    }
    // Dependencies: Re-run when waiting status changes, or potentially when user details impacting the check change.
    // Make sure checkAndUpdateStatusOnFocus has stable dependencies or is included here if it relies on props/state.
  }, [isWaitingForSignature, user?.email, user?.onboardingStatus.nda])

  // Check if KYC is completed (existing useEffect)
  useEffect(() => {
    if (user && user.onboardingStatus.kyc !== "submitted") {
      toast({
        title: "KYC verification required",
        description: "You need to complete KYC verification before signing the NDA",
        variant: "destructive",
      })
      router.push("/investor/kyc")
    }
  }, [user, router, toast])

  // If NDA is already signed, redirect (existing useEffect)
  useEffect(() => {
    // Check user exists before accessing properties
    if (user && user.onboardingStatus.nda === "signed") {
      console.log("NDA already signed, redirecting...")
      // Optional: Cancel waiting state if somehow active
      if (isWaitingForSignature) setIsWaitingForSignature(false)
      router.push("/investor/project")
    }
  }, [user, router, isWaitingForSignature]) // Add isWaitingForSignature to deps if it should cancel wait on redirect

  // --- prepareDocumentForSigning (existing function - unchanged) ---
  async function prepareDocumentForSigning() {
    const formData = new FormData()
    formData.append("recipient_name", user?.name || "")
    formData.append("recipient_email", user?.email || "")
    formData.append("doc_type", "NDA")
    return formData
  }

  // --- initiateExternalSigning (Modified to set waiting flag) ---
  async function initiateExternalSigning() {
    // Reset waiting flag initially in case of retry
    setIsWaitingForSignature(false)
    try {
      const formData = await prepareDocumentForSigning()
      toast({
        title: "Signing initiated",
        description: "Please wait while we prepare the signing process.",
      })

      const response = await fetch("https://api.fundcrane.com/create-sign-url", {
        method: "POST",
        body: formData,
        mode: "cors" /* credentials? */,
        credentials: "include",
      }).catch((error) => {
        console.error("Error initiating signing process (fetch catch):", error)
        // Provide a mock ONLY if necessary for demo/dev when API down
        // return { ok: true, json: () => Promise.resolve({ url: "#" }) };
        throw new Error("Network error during signing initiation.") // Re-throw
      })

      if (!response.ok) {
        let errorMsg = "Failed to initiate signing process."
        try {
          const errorData = await response.json()
          errorMsg = errorData.message || errorMsg
        } catch (e) {
          /* ignore json parsing error */
        }
        throw new Error(errorMsg)
      }

      const data = await response.json()
      const receivedSigningUrl = data.url

      if (!receivedSigningUrl) {
        throw new Error("Signing service did not return a valid URL.")
      }

      console.log("Received signing URL:", receivedSigningUrl)
      setSigningUrl(receivedSigningUrl)
      setShowSigningDialog(true)
      // *** Start waiting for focus events ***
      setIsWaitingForSignature(true)
    } catch (error) {
      console.error("Error in initiateExternalSigning:", error)
      // Ensure flag is reset on any error
      setIsWaitingForSignature(false)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to initiate signing process. Please try again.",
        variant: "destructive",
      })
      // Re-throw if needed by caller, or handle fully here
      // throw error;
    }
  }

  // --- handleSignNDA (calls initiateExternalSigning - unchanged) ---
  const handleSignNDA = async () => {
    if (!hasRead) {
      toast({
        /* ... confirmation required toast ... */
      })
      return
    }
    setIsSubmitting(true)
    try {
      await initiateExternalSigning()
      // If initiateExternalSigning throws, catch block below handles it
    } catch (error) {
      // Error already logged and toasted in initiateExternalSigning's catch block
      console.error("NDA signing process failed:", error)
      // No additional toast needed here unless initiateExternalSigning doesn't toast/re-throws
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- Return JSX ---
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* ... Page Header ... */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Non-Disclosure Agreement</h2>
      </div>

      {/* ... Info Alert ... */}
      <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-400">
        <Info className="h-4 w-4 mr-2" />
        <AlertDescription>
          Before accessing confidential project information, you must sign this Non-Disclosure Agreement (NDA). Please
          read the document carefully before signing.
        </AlertDescription>
      </Alert>

      {/* ... Card ... */}
      <Card>
        <CardHeader>
          <CardTitle>Non-Disclosure Agreement</CardTitle>
          <CardDescription>Please read the following agreement carefully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ... Iframe ... */}
          <div className="border rounded-md p-4 h-96 overflow-y-auto bg-muted/30">
            <iframe
              src={`https://docs.google.com/gview?url=https://legal-doc-storage.tos-ap-southeast-1.bytepluses.com/Investor_DataRoom_NDA.docx&embedded=true`}
              width="100%"
              height="570px" // Consider adjusting height or making parent flexible
              className="border"
              title="NDA Document Viewer" // Add title for accessibility
            ></iframe>
          </div>
          {/* ... Checkbox ... */}
          <div className="flex items-center space-x-2">
            <Checkbox id="hasRead" checked={hasRead} onCheckedChange={(checked) => setHasRead(checked === true)} />
            <Label htmlFor="hasRead">I have read and agree to the terms of the Non-Disclosure Agreement</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/investor/kyc")} disabled={isSubmitting}>
            Back
          </Button>
          {/* Update button text/state if waiting */}
          <Button onClick={handleSignNDA} disabled={isSubmitting || isWaitingForSignature}>
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
                Preparing...
              </>
            ) : isWaitingForSignature ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
                Awaiting Signature...
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

      {/* --- Signing URL Dialog (onClick simplified) --- */}
      <Dialog
        open={showSigningDialog}
        onOpenChange={(open) => {
          setShowSigningDialog(open)
          // If dialog is closed manually, stop waiting for focus check
          if (!open && isWaitingForSignature) {
            console.log("Dialog closed, cancelling focus wait.")
            setIsWaitingForSignature(false)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Ready for Signature</DialogTitle>
            <DialogDescription>
              Your document is ready. Click below to open the secure signing page in a new tab. Return to this tab after
              signing to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <Button
              onClick={() => {
                if (!signingUrl) return
                window.open(signingUrl, "_blank", "noopener,noreferrer") // Add security attributes

                // *** REMOVED setTimeout logic ***

                // Inform user what to do next
                toast({
                  title: "Signing page opened",
                  description: "Please complete the signing process in the new tab and then return here.",
                  duration: 7000, // Longer duration
                })

                // Optional: Close dialog after opening link, or let user close it
                // setShowSigningDialog(false);
              }}
            >
              Open Signing Page
            </Button>
          </div>
          <DialogFooter>
            {/* Close button already handled by onOpenChange */}
            <Button variant="outline" onClick={() => setShowSigningDialog(false)}>
              Cancel / Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
