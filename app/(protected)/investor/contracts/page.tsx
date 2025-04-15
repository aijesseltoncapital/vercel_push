"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { FileText, CheckCircle, AlertCircle, Download, Eye, Pen } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ContractsPage() {
  const { user, updateUserOnboardingStatus } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [selectedContract, setSelectedContract] = useState<any>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [signatureOpen, setSignatureOpen] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  const [signingUrl, setSigningUrl] = useState<string | null>(null)
  const [showSigningDialog, setShowSigningDialog] = useState(false)

  // Check if payment option is selected
  useEffect(() => {
    if (user && !user.paymentOption) {
      toast({
        title: "Payment option required",
        description: "You need to select a payment option before accessing contracts",
        variant: "destructive",
      })
      router.push("/investor/payment-options")
    }
  }, [user, toast, router])

  // Mock data for contracts based on payment option
  const getContracts = () => {
    if (!user || !user.paymentOption) return []

    if (user.paymentOption === "full") {
      return [
        {
          id: 1,
          name: "SAFE Agreement - Full Payment",
          description: "Simple Agreement for Future Equity with one-time payment",
          status: user?.onboardingStatus.contract === "signed" ? "signed" : "unsigned",
          date: user?.onboardingStatus.contract === "signed" ? new Date().toLocaleDateString() : "",
          type: "SAFE",
          required: true,
        },
      ]
    } else {
      return [
        {
          id: 1,
          name: "SAFE Agreement - Installment Plan",
          description: "Simple Agreement for Future Equity with 12-month installment plan",
          status: user?.onboardingStatus.contract === "signed" ? "signed" : "unsigned",
          date: user?.onboardingStatus.contract === "signed" ? new Date().toLocaleDateString() : "",
          type: "SAFE_INSTALLMENT",
          required: true,
        },
      ]
    }
  }

  const contracts = getContracts()

  async function prepareDocumentForSigning(contract) {
    const formData = new FormData()
    // Add to FormData
    formData.append("recipient_name", user?.name || "")
    formData.append("recipient_email", user?.email || "")
    formData.append("doc_type", contract.type)

    return formData
  }

  async function initiateExternalSigning(contract) {
    try {
      // Prepare the FormData with all required inputs
      const formData = await prepareDocumentForSigning(contract)

      // You might want to update the UI to indicate the signing process has been initiated
      toast({
        title: "Signing initiated",
        description: "Please wait 8s-12s for the system to set up the signing process",
      })

      // Call your signing API
      const response = await fetch("https://api.fundcrane.com/create-sign-url", {
        method: "POST",
        body: formData,
        mode: "cors",
        // Include any necessary headers
      }).catch((error) => {
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

  const handleViewContract = (contract: any) => {
    setSelectedContract(contract)
    setPreviewOpen(true)
  }

  const handleSignContract = (contract: any) => {
    // setSelectedContract(contract)
    // setSignatureOpen(true)
    initiateExternalSigning(contract)
  }

  const handleDownload = (contract: any) => {
    toast({
      title: "Download started",
      description: `${contract.name} is being downloaded`,
    })

    // If it's the SAFE contract, download it from the specified URL
    if (contract.id === 1) {
      // Create an anchor element and trigger download
      const link = document.createElement("a")
      link.href = "https://legal-doc-storage.tos-ap-southeast-1.bytepluses.com/SAFE_MonsterHR.pdf"
      link.download = "SAFE_MonsterHR.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const clearSignature = () => {
    if (canvasRef) {
      const ctx = canvasRef.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height)
        setSignature(null)
      }
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef) return

    setIsDrawing(true)
    const canvas = canvasRef
    const rect = canvas.getBoundingClientRect()

    let clientX, clientY

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = clientX - rect.left
    const y = clientY - rect.top

    setLastPosition({ x, y })
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef) return

    const canvas = canvasRef
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()

    let clientX, clientY

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
      e.preventDefault() // Prevent scrolling when drawing
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = clientX - rect.left
    const y = clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(lastPosition.x, lastPosition.y)
    ctx.lineTo(x, y)
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.stroke()

    setLastPosition({ x, y })
  }

  const stopDrawing = () => {
    if (isDrawing && canvasRef) {
      setIsDrawing(false)
      setSignature(canvasRef.toDataURL())
    }
  }

  const submitSignature = () => {
    if (!signature) {
      toast({
        title: "Signature required",
        description: "Please sign the document before submitting",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would submit the signature to the server
    toast({
      title: "Contract signed",
      description: `${selectedContract?.name} has been signed successfully`,
    })

    // Update the contract status in our mock data
    contracts.forEach((contract) => {
      if (contract.id === selectedContract?.id) {
        contract.status = "signed"
        contract.date = new Date().toLocaleDateString()
      }
    })

    // Update user onboarding status
    updateUserOnboardingStatus({ contract: "signed" })

    setSignatureOpen(false)
    setSignature(null)

    // Redirect to invest page after a short delay
    setTimeout(() => {
      router.push("/investor/invest")
    }, 1500)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "signed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="mr-1 h-3 w-3" />
            Signed
          </Badge>
        )
      case "unsigned":
        return (
          <Badge variant="outline" className="text-amber-800 dark:text-amber-300">
            <AlertCircle className="mr-1 h-3 w-3" />
            Unsigned
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const allContractsSigned = contracts.every((contract) => contract.status === "signed")

  // If payment option is not selected, redirect to payment options page
  if (!user?.paymentOption) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader className="bg-yellow-50 dark:bg-yellow-950/30">
            <CardTitle className="flex items-center text-yellow-800 dark:text-yellow-400">
              <AlertCircle className="mr-2 h-5 w-5" />
              Payment Option Required
            </CardTitle>
            <CardDescription>You need to select a payment option before accessing contracts</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Before you can view and sign investment contracts, you need to select your preferred payment option.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/investor/payment-options")}>Go to Payment Options</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Contracts</h2>
      </div>

      {/* Progress indicator */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Contract Signing Progress</CardTitle>
          <CardDescription>
            {allContractsSigned
              ? "All contracts have been signed. You can now proceed to the payment step."
              : "Please review and sign all required contracts before proceeding to the payment step."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Completion:</span>
              <span>
                {contracts.filter((c) => c.status === "signed").length} of {contracts.length} contracts signed
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{
                  width: `${(contracts.filter((c) => c.status === "signed").length / contracts.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </CardContent>
        {allContractsSigned && (
          <CardFooter>
            <Button asChild className="w-full">
              <a href="/investor/invest">Proceed to Payment</a>
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Required Contracts</CardTitle>
          <CardDescription>Documents that require your signature before investing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contracts.map((contract) => (
              <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{contract.name}</p>
                    <p className="text-sm text-muted-foreground">{contract.description}</p>
                    {contract.status === "signed" && (
                      <p className="text-xs text-muted-foreground mt-1">Signed on {contract.date}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(contract.status)}
                  <Button variant="outline" size="sm" onClick={() => handleViewContract(contract)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownload(contract)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  {contract.status !== "signed" && (
                    <Button size="sm" onClick={() => handleSignContract(contract)}>
                      <Pen className="h-4 w-4 mr-2" />
                      Sign
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contract Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedContract?.name}</DialogTitle>
            <DialogDescription>{selectedContract?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div
              className="bg-white border rounded-md shadow-sm overflow-hidden"
              style={{ width: "100%", height: "70vh" }}
            >
              {/* A4 Paper Placeholder */}
              <div
                className="bg-white mx-auto my-4 p-8 shadow-sm"
                style={{ width: "210mm", height: "297mm", maxHeight: "calc(70vh - 2rem)", overflow: "auto" }}
              >
                {selectedContract?.id === 1 ? (
                  // SAFE Agreement Content
                  <div className="space-y-4">
                    <iframe
                      src={`https://docs.google.com/gview?url=https://legal-doc-storage.tos-ap-southeast-1.bytepluses.com/SAFE_MonsterHR.pdf&embedded=true`}
                      width="100%"
                      height="570px"
                      className="border"
                    ></iframe>
                  </div>
                ) : (
                  <div className="text-center py-8">No preview available</div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => handleDownload(selectedContract)}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            {selectedContract?.status !== "signed" && (
              <Button
                onClick={() => {
                  setPreviewOpen(false)
                  handleSignContract(selectedContract)
                }}
              >
                <Pen className="mr-2 h-4 w-4" />
                Sign Document
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Signature Dialog */}
      <Dialog open={signatureOpen} onOpenChange={setSignatureOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sign {selectedContract?.name}</DialogTitle>
            <DialogDescription>Please sign in the box below to complete the document</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-md p-4">
              <p className="text-sm text-center text-muted-foreground mb-4">
                By signing this document, you agree to all terms and conditions outlined in the {selectedContract?.name}
                .
              </p>
              <div className="bg-white border rounded-md overflow-hidden">
                <canvas
                  ref={(ref) => setCanvasRef(ref)}
                  width={600}
                  height={200}
                  className="w-full touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">Draw your signature above</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Signing as:</p>
                <p className="text-sm">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
              </div>
              <Button variant="outline" size="sm" onClick={clearSignature}>
                Clear Signature
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignatureOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitSignature}>Submit Signature</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  // Update the contract status
                  contracts.forEach((contract) => {
                    contract.status = "signed"
                    contract.date = new Date().toLocaleDateString()
                  })

                  // Update user onboarding status
                  updateUserOnboardingStatus({ contract: "signed" })

                  toast({
                    title: "Contract signed successfully",
                    description: "You can now proceed to the payment step",
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
