"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Upload, CheckCircle, Clock, FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function KYCPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null)
  const [addressDocumentFile, setAddressDocumentFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [activeStep, setActiveStep] = useState(1)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!idDocumentFile || !addressDocumentFile || !selfieFile) {
      toast({
        title: "Missing documents",
        description: "Please upload all required documents",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setActiveStep(2) // Show that we're moving to verification step

    try {
      // Simulate API call to upload documents
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update user in localStorage to simulate backend update
      if (user) {
        const updatedUser = {
          ...user,
          kycStatus: "pending",
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))

        setActiveStep(3) // Show completion step

        // Force a page reload to update the user context after a short delay
        setTimeout(() => {
          window.location.href = "/investor/project"
        }, 1500)
      }

      toast({
        title: "Documents submitted",
        description: "Your KYC documents have been submitted for review",
      })
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your documents",
        variant: "destructive",
      })
      setActiveStep(1) // Reset to first step on error
    } finally {
      setIsUploading(false)
    }
  }

  const getStatusBadge = () => {
    switch (user?.kycStatus) {
      case "approved":
        return (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span>Approved</span>
          </div>
        )
      case "pending":
        return (
          <div className="flex items-center text-yellow-600 dark:text-yellow-400">
            <Clock className="h-4 w-4 mr-2" />
            <span>Pending Review</span>
          </div>
        )
      case "rejected":
        return (
          <div className="flex items-center text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>Rejected</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center text-muted-foreground">
            <FileText className="h-4 w-4 mr-2" />
            <span>Not Submitted</span>
          </div>
        )
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">KYC Verification</h2>
        <div>{getStatusBadge()}</div>
      </div>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="help">Help</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          {user?.kycStatus === "approved" ? (
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="bg-green-50 dark:bg-green-950/30">
                <CardTitle className="flex items-center text-green-800 dark:text-green-400">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  KYC Verification Approved
                </CardTitle>
                <CardDescription>Your identity has been verified and you are eligible to invest</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  Your KYC verification has been approved. You can now proceed with investing in opportunities on our
                  platform.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => router.push("/investor/project")}>View Investment Opportunities</Button>
              </CardFooter>
            </Card>
          ) : user?.kycStatus === "pending" ? (
            <Card className="border-yellow-200 dark:border-yellow-800">
              <CardHeader className="bg-yellow-50 dark:bg-yellow-950/30">
                <CardTitle className="flex items-center text-yellow-800 dark:text-yellow-400">
                  <Clock className="mr-2 h-5 w-5" />
                  KYC Verification Pending
                </CardTitle>
                <CardDescription>Your documents are being reviewed by our team</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  Your KYC documents have been submitted and are currently under review. This process typically takes
                  1-2 business days. You will be notified once the verification is complete.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => router.push("/investor/project")}>
                  Back to Project
                </Button>
              </CardFooter>
            </Card>
          ) : user?.kycStatus === "rejected" ? (
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader className="bg-red-50 dark:bg-red-950/30">
                <CardTitle className="flex items-center text-red-800 dark:text-red-400">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  KYC Verification Rejected
                </CardTitle>
                <CardDescription>Your verification was not approved</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">
                  Unfortunately, your KYC verification was rejected for the following reason:
                </p>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    The documents provided were unclear or did not match the information provided.
                  </AlertDescription>
                </Alert>
                <p className="text-muted-foreground mt-4">
                  Please resubmit your documents ensuring they are clear, valid, and match the information you provided.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/investor/project")}>
                  Back to Project
                </Button>
                <Button onClick={() => window.location.reload()}>Resubmit Documents</Button>
              </CardFooter>
            </Card>
          ) : (
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Submit KYC Documents</CardTitle>
                  <CardDescription>Please provide the following documents to verify your identity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress indicator */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${activeStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                        >
                          1
                        </div>
                        <span className={activeStep >= 1 ? "font-medium" : "text-muted-foreground"}>
                          Upload Documents
                        </span>
                      </div>
                      <Separator className="w-8 sm:w-16" />
                      <div className="flex items-center">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${activeStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                        >
                          2
                        </div>
                        <span className={activeStep >= 2 ? "font-medium" : "text-muted-foreground"}>Verification</span>
                      </div>
                      <Separator className="w-8 sm:w-16" />
                      <div className="flex items-center">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${activeStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                        >
                          3
                        </div>
                        <span className={activeStep >= 3 ? "font-medium" : "text-muted-foreground"}>Complete</span>
                      </div>
                    </div>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-400">
                    <FileText className="h-4 w-4 mr-2" />
                    <AlertDescription>
                      All documents must be clear, in color, and show the full document. Acceptable formats are JPG,
                      PNG, or PDF.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="id-document">Government-Issued ID (Passport, Driver's License, etc.)</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="id-document"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileChange(e, setIdDocumentFile)}
                        required
                      />
                      {idDocumentFile && (
                        <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>{idDocumentFile.name}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload a clear photo of your government-issued ID
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="address-document">Proof of Address (Utility Bill, Bank Statement, etc.)</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="address-document"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileChange(e, setAddressDocumentFile)}
                        required
                      />
                      {addressDocumentFile && (
                        <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>{addressDocumentFile.name}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Document must be less than 3 months old and show your full name and address
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="selfie">Selfie with ID Document</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="selfie"
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, setSelfieFile)}
                        required
                      />
                      {selfieFile && (
                        <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>{selfieFile.name}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Hold your ID next to your face in the photo</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/investor/project")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Submit Documents
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>Current status of your KYC verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span>{getStatusBadge()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Submitted Date:</span>
                  <span>{user?.kycStatus !== "not_submitted" ? "March 21, 2025" : "Not submitted yet"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Estimated Completion:</span>
                  <span>{user?.kycStatus === "pending" ? "March 23, 2025" : "N/A"}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Verification Steps</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 ${user?.kycStatus !== "not_submitted" ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
                    >
                      {user?.kycStatus !== "not_submitted" ? <CheckCircle className="h-4 w-4" /> : "1"}
                    </div>
                    <span className={user?.kycStatus !== "not_submitted" ? "text-green-600 dark:text-green-400" : ""}>
                      Document Submission
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 ${user?.kycStatus === "pending" || user?.kycStatus === "approved" || user?.kycStatus === "rejected" ? "bg-yellow-100 text-yellow-600" : "bg-muted text-muted-foreground"}`}
                    >
                      {user?.kycStatus === "approved" ? <CheckCircle className="h-4 w-4" /> : "2"}
                    </div>
                    <span
                      className={
                        user?.kycStatus === "pending"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : user?.kycStatus === "approved" || user?.kycStatus === "rejected"
                            ? "text-green-600 dark:text-green-400"
                            : ""
                      }
                    >
                      Document Review
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 ${user?.kycStatus === "approved" ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
                    >
                      {user?.kycStatus === "approved" ? <CheckCircle className="h-4 w-4" /> : "3"}
                    </div>
                    <span className={user?.kycStatus === "approved" ? "text-green-600 dark:text-green-400" : ""}>
                      Verification Complete
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>KYC Verification Help</CardTitle>
              <CardDescription>Frequently asked questions about KYC verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">What is KYC verification?</h3>
                <p className="text-muted-foreground">
                  KYC (Know Your Customer) verification is a process that helps us verify the identity of our users.
                  This is required by regulations to prevent fraud and ensure compliance with securities laws.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Why do I need to complete KYC verification?</h3>
                <p className="text-muted-foreground">
                  KYC verification is required for all investors on our platform. This helps us comply with anti-money
                  laundering (AML) regulations and ensures that only eligible investors can participate in our
                  offerings.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">What documents do I need to provide?</h3>
                <p className="text-muted-foreground">You will need to provide:</p>
                <ul className="list-disc pl-5 text-muted-foreground">
                  <li>A government-issued ID (passport, driver's license, etc.)</li>
                  <li>Proof of address (utility bill, bank statement, etc.)</li>
                  <li>A selfie with your ID document</li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">How long does the verification process take?</h3>
                <p className="text-muted-foreground">
                  The verification process typically takes 1-2 business days. You will be notified once the verification
                  is complete.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

