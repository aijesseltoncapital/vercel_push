"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { FileText, CheckCircle, AlertCircle, Download, Eye, Pen, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define contract type interface
interface Contract {
  id: number
  name: string
  description: string
  status: string
  date: string
  type: string
  required: boolean
  documentUrl: string
}

// Update User interface to explicitly include investor_id
interface User {
  name?: string
  email?: string
  investor_id?: string | number
  id?: string | number // The user ID from the auth system
  role?: string
  onboardingStatus?: {
    kyc: string
    nda: string
    contract: string
    investment: string
  }
  onboardingComplete?: boolean
  paymentOption?: string
}

export default function ContractsPage() {
  const { user, updateUserOnboardingStatus } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [signatureOpen, setSignatureOpen] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  const [signingUrl, setSigningUrl] = useState<string | null>(null)
  const [showSigningDialog, setShowSigningDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedDocuments, setGeneratedDocuments] = useState<Record<string, string>>({})
  const [investorId, setInvestorId] = useState<string | number | null>(null)
  const [isWaitingForSignature, setIsWaitingForSignature] = useState(false)

  // Get the typed user
  const typedUser = user as User | undefined
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  // Check contract signing status periodically when waiting for signature
  useEffect(() => {
    if (!isWaitingForSignature || !typedUser?.email) return

    console.log("Starting to check for contract signing status...")

    // Function to check signing status
    const checkSigningStatus = async () => {
      try {
        // Fetch the latest user data to check contract status
        const formData = new FormData()
        formData.append("email", typedUser.email!)

        const response = await fetch(`${API_URL}/investors/onboarding_status`, {
          method: "POST",
          credentials: "include",
          body: formData,
        })

        if (!response.ok) {
          console.error("Failed to fetch updated onboarding status")
          return
        }

        const data = await response.json()
        console.log("Received updated onboarding status:", data)

        // If contract is now signed in the database
        if (data.onboardingStatus?.contract === "signed") {
          console.log("Contract is now signed! Updating UI...")

          // Stop polling
          setIsWaitingForSignature(false)

          // Update local user state
          updateUserOnboardingStatus({ contract: "signed" })

          // Update the contracts list to show as signed
          setContracts((prev) =>
            prev.map((contract) => ({
              ...contract,
              status: "signed",
              date: new Date().toLocaleDateString(),
            })),
          )

          toast({
            title: "Contract signed successfully",
            description: "You can now proceed to the investment step",
          })

          // Navigate to the next step after a short delay
          setTimeout(() => {
            router.push("/investor/invest")
          }, 2000)
        }
      } catch (error) {
        console.error("Error checking signing status:", error)
      }
    }

    // Perform an initial check right away
    checkSigningStatus()

    // Set up periodic checking with a shorter interval (2 seconds)
    const intervalId = setInterval(checkSigningStatus, 2000)

    // Clean up interval when component unmounts or status changes
    return () => clearInterval(intervalId)
  }, [isWaitingForSignature, typedUser?.email, updateUserOnboardingStatus, API_URL, router])

  // Add another effect to check status when the page gets focus
  useEffect(() => {
    if (!isWaitingForSignature) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isWaitingForSignature) {
        console.log("Page gained focus, checking signing status...")
        // Force a refresh to get the latest data
        router.refresh()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isWaitingForSignature, router])

  // Fetch investor ID from API if not available in user object
  useEffect(() => {
    const fetchInvestorId = async () => {
      if (typedUser?.email && !investorId && typedUser?.id) {
        try {
          console.log("Attempting to fetch investor ID for user:", typedUser.id)

          // Use the standard investor API with the user_query parameter
          const response = await fetch(`${API_URL}/investors/${typedUser.id}?user_query=true`, {
            method: "GET",
            credentials: "include",
          })

          if (!response.ok) {
            console.error("Failed to fetch investor data:", await response.text())
            return
          }

          const data = await response.json()
          if (data.data && data.data.id) {
            console.log("Retrieved investor ID from API:", data.data.id)
            setInvestorId(data.data.id)
          }
        } catch (error) {
          console.error("Error fetching investor ID:", error)
        }
      } else if (typedUser?.investor_id) {
        console.log("Using investor_id from user object:", typedUser.investor_id)
        setInvestorId(typedUser.investor_id)
      }
    }

    fetchInvestorId()
  }, [typedUser?.email, typedUser?.investor_id, typedUser?.id, investorId])

  // Default contracts
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: 1,
      name: "Non-Disclosure Agreement (NDA)",
      description: "Confidentiality agreement to protect sensitive information",
      status: "unsigned",
      date: "",
      type: "NDA",
      required: true,
      documentUrl: "",
    },
    {
      id: 2,
      name: "Investment Agreement",
      description: "SAFE (Simple Agreement for Future Equity) investment terms",
      status: "unsigned",
      date: "",
      type: "SAFE",
      required: true,
      documentUrl: "",
    },
  ])

  // Check if payment option is selected
  useEffect(() => {
    if (user && !user.paymentOption) {
      toast({
        title: "Payment option required",
        description: "You need to select a payment option before accessing contracts",
        variant: "destructive",
      })
      router.push("/investor/payment-options")
    } else if (user && user.paymentOption) {
      // Update contracts based on payment option
      const updatedContracts = getContracts()
      if (updatedContracts.length > 0) {
        setContracts(updatedContracts)
      }
    }
  }, [user, toast, router])

  // Check contract status on initial page load
  useEffect(() => {
    // Only run on initial render and if we have a user
    if (!typedUser?.email) return

    const checkInitialStatus = async () => {
      try {
        console.log("Checking initial contract status on page load")

        // Fetch the latest user data to check contract status
        const formData = new FormData()
        formData.append("email", typedUser.email!)

        const response = await fetch(`${API_URL}/investors/onboarding_status`, {
          method: "POST",
          credentials: "include",
          body: formData,
        })

        if (!response.ok) {
          console.error("Failed to fetch initial onboarding status")
          return
        }

        const data = await response.json()
        console.log("Initial contract status:", data.onboardingStatus?.contract)

        // If contract is already signed, ensure our UI reflects this
        if (data.onboardingStatus?.contract === "signed") {
          // Make sure we're not showing "waiting for signature" if it's already signed
          setIsWaitingForSignature(false)

          // Update contracts to show as signed if they're not already
          setContracts((prev) =>
            prev.map((contract) => ({
              ...contract,
              status: "signed",
              date: new Date().toLocaleDateString(),
            })),
          )
        }
      } catch (error) {
        console.error("Error checking initial status:", error)
      }
    }

    checkInitialStatus()
  }, [typedUser?.email, API_URL])

  // Monitor payment option changes and clear cached documents
  useEffect(() => {
    // Store the current payment option in a ref to detect actual changes
    const currentPaymentOption = user?.paymentOption

    // If payment option is defined, clear cached documents to ensure fresh generation
    if (currentPaymentOption && Object.keys(generatedDocuments).length > 0) {
      console.log("Payment option detected or changed to:", currentPaymentOption)
      console.log("Clearing cached generated documents")

      // Clear the generated documents cache
      setGeneratedDocuments({})

      // This ensures documents will be freshly generated when viewed or signed
      setContracts((prev) =>
        prev.map((contract) => ({
          ...contract,
          documentUrl: "", // Reset document URLs
        })),
      )
    }
  }, [user?.paymentOption]) // Only run when paymentOption changes

  // Get contracts based on payment option
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
          documentUrl: "",
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
          type: "INSTALLMENT",
          required: true,
          documentUrl: "",
        },
      ]
    }
  }

  // Generate document when needed
  const generateDocument = async (contractType: string): Promise<string | null> => {
    setIsLoading(true)

    // Debug the actual user ID value
    console.log("Current user data:", typedUser)
    console.log("Investor ID from user object:", typedUser?.investor_id)
    console.log("Resolved investor ID:", investorId)
    console.log("Current payment option:", user?.paymentOption)

    // Use the correct investor ID, either from state or user object
    const resolvedInvestorId = investorId || typedUser?.investor_id || typedUser?.id

    if (!resolvedInvestorId) {
      toast({
        title: "Authentication Error",
        description: "Your investor ID could not be determined. Please log out and log in again.",
        variant: "destructive",
      })
      setIsLoading(false)
      return null
    }

    try {
      // Check if we already have a cached document for this contract type
      const cachedUrl = generatedDocuments[contractType]
      if (cachedUrl) {
        console.log(`Using cached document URL for ${contractType} with payment option ${user?.paymentOption}`)
      } else {
        console.log(`Generating new document for ${contractType} with payment option ${user?.paymentOption}`)
      }

      // Convert SAFE_INSTALLMENT to INSTALLMENT for backward compatibility
      let updatedContractType = contractType
      if (contractType === "SAFE_INSTALLMENT") {
        console.log("Converting SAFE_INSTALLMENT to INSTALLMENT for backend compatibility")
        updatedContractType = "INSTALLMENT"
      }

      // Call the external API endpoint instead of the local Next.js API route
      const response = await fetch(`${API_URL}/investors/${resolvedInvestorId}/generate-agreement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document_type: updatedContractType,
          payment_option: user?.paymentOption || "full", // Include payment option explicitly
        }),
        credentials: "include", // Include cookies for auth
        mode: "cors",
      })

      if (!response.ok) {
        let errorMessage = "Unknown error"
        try {
          // Try to parse error as JSON
          const errorData = await response.json()
          errorMessage = errorData.error || JSON.stringify(errorData)
          console.error("Error response from API:", errorData)
        } catch (parseError) {
          // If not JSON, get as text
          const errorText = await response.text()
          errorMessage = errorText
          console.error("Error response from API (text):", errorText)
        }

        toast({
          title: "Document generation failed",
          description: `Could not generate document. ${response.status < 500 ? errorMessage : "Server error, please try again later."}`,
          variant: "destructive",
        })

        throw new Error(`Failed to generate document: ${response.status} ${errorMessage}`)
      }

      const data = await response.json()
      console.log("Document generated successfully:", data)

      // Store the generated document URL
      setGeneratedDocuments((prev) => ({
        ...prev,
        [contractType]: data.data.document_url,
      }))

      // Update the contract with the new document URL
      setContracts((prev) =>
        prev.map((contract) =>
          contract.type === contractType ? { ...contract, documentUrl: data.data.document_url } : contract,
        ),
      )

      toast({
        title: "Document Generated",
        description: `${contractType} document has been successfully generated.`,
      })

      return data.data.document_url
    } catch (error) {
      console.error("Error generating document:", error)
      toast({
        title: "Error",
        description: "Failed to generate document. Please try again later.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  async function prepareDocumentForSigning(contract: Contract) {
    // If document hasn't been generated yet, generate it first
    if (!contract.documentUrl && !generatedDocuments[contract.type]) {
      const docUrl = await generateDocument(contract.type)
      if (!docUrl) return null
    }

    // Be sure to use the most recent document URL
    const documentUrl = contract.documentUrl || generatedDocuments[contract.type]

    // Double-check that we have a valid document URL
    if (!documentUrl) {
      console.error("No document URL available for signing:", contract.type)
      toast({
        title: "Document Error",
        description: "Unable to find document URL for signing. Please try generating the document again.",
        variant: "destructive",
      })
      return null
    }

    console.log(`Preparing document for signing with document URL: ${documentUrl}`)

    // Log the investor data for debugging
    console.log("Preparing document for signing with user:", typedUser)

    // Use the same fallback approach as in generateDocument
    const resolvedInvestorId = investorId || typedUser?.investor_id || typedUser?.id
    console.log("Using investor ID:", resolvedInvestorId)

    // Convert SAFE_INSTALLMENT to INSTALLMENT for backward compatibility
    let docType = contract.type
    if (docType === "SAFE_INSTALLMENT") {
      console.log("Converting SAFE_INSTALLMENT to INSTALLMENT for signing")
      docType = "INSTALLMENT"
    }

    const formData = new FormData()
    // Add to FormData
    formData.append("recipient_name", typedUser?.name || "")
    formData.append("recipient_email", typedUser?.email || "")
    formData.append("doc_type", docType)
    formData.append("doc_url", documentUrl)
    formData.append("investor_id", String(resolvedInvestorId || ""))

    // Log FormData entries properly
    console.log("FormData contents:")
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`)
    }

    return formData
  }

  async function initiateExternalSigning(contract: Contract) {
    try {
      // Prepare the FormData with all required inputs
      const formData = await prepareDocumentForSigning(contract)
      if (!formData) {
        console.error("Failed to prepare document for signing")
        return
      }

      // Log what we're sending to the API
      console.log("Initiating signing with data:", {
        recipient_name: formData.get("recipient_name"),
        recipient_email: formData.get("recipient_email"),
        doc_type: formData.get("doc_type"),
        investor_id: formData.get("investor_id"),
        // Don't log the full URL for security
        doc_url_provided: !!formData.get("doc_url"),
      })

      // You might want to update the UI to indicate the signing process has been initiated
      toast({
        title: "Signing initiated",
        description: "Please wait 8s-12s for the system to set up the signing process",
      })

      // Call your signing API with the correct URL and proper FormData handling
      const response = await fetch("https://api.fundcrane.com/create-sign-url", {
        method: "POST",
        // Don't stringify FormData - send it directly
        body: formData,
        mode: "cors",
        credentials: "include",
      })

      // Check the response status and log helpful information
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Signing API error (${response.status}):`, errorText)
        throw new Error(`Failed to initiate signing process: ${response.status} ${errorText}`)
      }

      // Get the signing URL from the response
      const data = await response.json()
      console.log("Received API response:", data)

      if (!data.url) {
        console.error("No signing URL returned from API:", data)
        throw new Error("API response missing signing URL")
      }

      const signingUrl = data.url
      console.log("Received signing URL:", signingUrl)

      // Store the URL and show a dialog
      setSigningUrl(data.url)
      setShowSigningDialog(true)

      // Set isWaitingForSignature to true to begin polling for signature status
      console.log("Setting up signature status polling...")
      setIsWaitingForSignature(true)
    } catch (error) {
      console.error("Error initiating signing process:", error)
      toast({
        title: "Error",
        description: "Failed to initiate signing process. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleViewContract = async (contract: Contract) => {
    console.log("Viewing contract with current payment option:", user?.paymentOption)

    // If document hasn't been generated yet, generate it first
    if (!contract.documentUrl && !generatedDocuments[contract.type]) {
      setIsLoading(true)
      try {
        console.log("No document URL available, generating new document")
        const docUrl = await generateDocument(contract.type)
        if (!docUrl) {
          console.error("Failed to generate document for viewing")
          toast({
            title: "Document Error",
            description: "Could not generate the document for viewing. Please try again.",
            variant: "destructive",
          })
          return
        }

        const documentUrl = docUrl || generatedDocuments[contract.type]
        console.log("Successfully generated document with URL:", documentUrl)

        // Update the contract with the current URL to ensure it's available when the dialog opens
        setSelectedContract({
          ...contract,
          documentUrl: documentUrl,
        })
      } catch (error) {
        console.error("Error in document generation for viewing:", error)
        // Error is already handled and displayed in generateDocument
        return
      } finally {
        setIsLoading(false)
      }
    } else {
      const documentUrl = contract.documentUrl || generatedDocuments[contract.type]
      console.log("Using existing document URL:", documentUrl, "for payment option:", user?.paymentOption)

      // Update the contract with the current URL to ensure it's available when the dialog opens
      setSelectedContract({
        ...contract,
        documentUrl: documentUrl,
      })
    }

    // Set a short timeout to ensure state is updated before showing the dialog
    // This helps with the PDF loading issues
    setTimeout(() => {
      setPreviewOpen(true)

      // After dialog opens, force refresh the iframe content
      setTimeout(() => {
        const iframe = document.querySelector(".pdf-viewer iframe") as HTMLIFrameElement
        if (iframe && iframe.src) {
          console.log("Refreshing iframe content")
          const currentSrc = iframe.src
          iframe.src = "about:blank"
          setTimeout(() => {
            iframe.src = currentSrc
          }, 50)
        } else {
          console.log("PDF iframe not found, may still be initializing")
        }
      }, 300)
    }, 100)

    // Log additional info about the dialog opening
    console.log("Preview dialog opened with contract:", {
      name: contract.name,
      type: contract.type,
      url: contract.documentUrl || generatedDocuments[contract.type],
    })
  }

  const handleSignContract = async (contract: Contract) => {
    // Log the investor ID to debug
    console.log("Signing contract with investor ID:", investorId || typedUser?.investor_id)
    console.log("Generating fresh document for signing with payment option:", user?.paymentOption)

    // Always regenerate the document to ensure we have the latest version
    // This is critical when payment option has changed
    setIsLoading(true)

    // Clear any cached document URL for this contract type to force fresh generation
    if (generatedDocuments[contract.type]) {
      console.log(`Clearing cached document for ${contract.type} to ensure fresh generation`)
      setGeneratedDocuments((prev) => {
        const updated = { ...prev }
        delete updated[contract.type]
        return updated
      })
    }

    console.log("Forcing fresh document generation for signing...")
    const docUrl = await generateDocument(contract.type)
    setIsLoading(false)

    if (!docUrl) {
      console.error("Failed to generate document for signing")
      toast({
        title: "Document Error",
        description: "Failed to generate the latest document for signing. Please try again.",
        variant: "destructive",
      })
      return
    }

    console.log("Successfully generated document with URL:", docUrl)

    // Update the contract with the new URL (should already be done in generateDocument)
    const updatedContract = {
      ...contract,
      documentUrl: docUrl,
    }

    // Now initiate the signing process with the updated contract
    initiateExternalSigning(updatedContract)
  }

  const handleDownload = async (contract: Contract) => {
    // If document hasn't been generated yet, generate it first
    if (!contract.documentUrl && !generatedDocuments[contract.type]) {
      setIsLoading(true)
      const docUrl = await generateDocument(contract.type)
      setIsLoading(false)
      if (!docUrl) return
    }

    const documentUrl = contract.documentUrl || generatedDocuments[contract.type]

    toast({
      title: "Download started",
      description: `${contract.name} is being downloaded`,
    })

    // Create an anchor element and trigger download
    const link = document.createElement("a")
    link.href = documentUrl
    link.download = `${contract.type}_${Date.now()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
    setContracts(
      contracts.map((contract) => {
        if (contract.id === selectedContract?.id) {
          return {
            ...contract,
            status: "signed",
            date: new Date().toLocaleDateString(),
          }
        }
        return contract
      }),
    )

    setSignatureOpen(false)
    setSignature(null)
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
              ? "All contracts have been signed. You can now proceed to the investment step."
              : "Please review and sign all required contracts before proceeding to the investment step."}
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
              <a href="/investor/invest">Proceed to Investment</a>
            </Button>
          </CardFooter>
        )}
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Contracts</TabsTrigger>
          <TabsTrigger value="unsigned">Unsigned</TabsTrigger>
          <TabsTrigger value="signed">Signed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Required Contracts</CardTitle>
              <CardDescription>Documents that require your signature before investing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{contract.name}</p>
                        <p className="text-sm text-muted-foreground">{contract.description}</p>
                        {isWaitingForSignature && contract.status === "unsigned" && (
                          <p className="text-xs flex items-center text-amber-600 mt-1">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Waiting for signature completion...
                          </p>
                        )}
                        {contract.status === "signed" && (
                          <p className="text-xs text-muted-foreground mt-1">Signed on {contract.date}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
                      <div className="mb-1 sm:mb-0">{getStatusBadge(contract.status)}</div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewContract(contract)}
                          disabled={isLoading}
                          className="w-full sm:w-auto"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4 mr-2" />
                          )}
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(contract)}
                          disabled={isLoading}
                          className="w-full sm:w-auto"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          Download
                        </Button>
                        {contract.status !== "signed" && (
                          <Button
                            size="sm"
                            onClick={() => handleSignContract(contract)}
                            disabled={isLoading}
                            className="w-full sm:w-auto"
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Pen className="h-4 w-4 mr-2" />
                            )}
                            Sign
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unsigned" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unsigned Contracts</CardTitle>
              <CardDescription>Documents that still require your signature</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts.filter((c) => c.status === "unsigned").length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">All contracts have been signed!</p>
                ) : (
                  contracts
                    .filter((c) => c.status === "unsigned")
                    .map((contract) => (
                      <div
                        key={contract.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{contract.name}</p>
                            <p className="text-sm text-muted-foreground">{contract.description}</p>
                            {isWaitingForSignature && (
                              <p className="text-xs flex items-center text-amber-600 mt-1">
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Waiting for signature completion...
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
                          <div className="mb-1 sm:mb-0">{getStatusBadge(contract.status)}</div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewContract(contract)}
                              disabled={isLoading}
                              className="w-full sm:w-auto"
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Eye className="h-4 w-4 mr-2" />
                              )}
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(contract)}
                              disabled={isLoading}
                              className="w-full sm:w-auto"
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4 mr-2" />
                              )}
                              Download
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSignContract(contract)}
                              disabled={isLoading}
                              className="w-full sm:w-auto"
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Pen className="h-4 w-4 mr-2" />
                              )}
                              Sign
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Signed Contracts</CardTitle>
              <CardDescription>Documents you have already signed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts.filter((c) => c.status === "signed").length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">No signed contracts yet</p>
                ) : (
                  contracts
                    .filter((c) => c.status === "signed")
                    .map((contract) => (
                      <div
                        key={contract.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{contract.name}</p>
                            <p className="text-sm text-muted-foreground">{contract.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">Signed on {contract.date}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
                          <div className="mb-1 sm:mb-0">{getStatusBadge(contract.status)}</div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewContract(contract)}
                              disabled={isLoading}
                              className="w-full sm:w-auto"
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Eye className="h-4 w-4 mr-2" />
                              )}
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(contract)}
                              disabled={isLoading}
                              className="w-full sm:w-auto"
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4 mr-2" />
                              )}
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contract Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[80vw] w-[80vw]">
          <DialogHeader>
            <DialogTitle>{selectedContract?.name}</DialogTitle>
            <DialogDescription>{selectedContract?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="w-full h-[75vh] relative overflow-hidden">
              {/* Document Viewer for the generated PDF */}
              <div
                className="bg-white mx-auto my-4 p-4 shadow-sm"
                style={{ width: "100%", height: "calc(70vh - 2rem)", overflow: "auto" }}
              >
                {selectedContract?.documentUrl ? (
                  <>
                    {/* Only show the document URL in development mode */}
                    {process.env.NODE_ENV === "development" && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Document URL: <span className="break-all">{selectedContract.documentUrl}</span>
                      </p>
                    )}
                    <div className="relative w-full h-full pdf-viewer">
                      {/* First try iframe with direct PDF as it's more reliable */}
                      <iframe
                        src={selectedContract.documentUrl}
                        width="100%"
                        height="100%"
                        className="border border-solid border-slate-200 rounded-md w-full"
                        style={{ minHeight: "600px" }}
                        onLoad={(e) => {
                          console.log("PDF loaded successfully via iframe")
                          // Add a class to help with styling
                          e.currentTarget.classList.add("pdf-loaded")
                        }}
                        onError={(e) => {
                          console.error("Failed to load PDF directly via iframe")
                          e.currentTarget.style.display = "none"
                          // Try fallback
                          const fallback = document.getElementById("pdf-fallback")
                          if (fallback) fallback.style.display = "block"
                        }}
                      />

                      {/* Fallback to Google Docs viewer if direct PDF doesn't work */}
                      <iframe
                        id="pdf-fallback"
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedContract.documentUrl)}&embedded=true`}
                        width="100%"
                        height="100%"
                        className="border border-solid border-slate-200 rounded-md w-full hidden"
                        style={{ minHeight: "600px" }}
                        onLoad={(e) => console.log("Google Docs viewer loaded")}
                        onError={(e) => {
                          console.error("Failed to load with Google Docs viewer", e)
                          e.currentTarget.style.display = "none"

                          // Show the fallback message
                          const fallbackMsg = document.getElementById("pdf-fallback-msg")
                          if (fallbackMsg) fallbackMsg.style.display = "block"
                        }}
                      />

                      {/* Final fallback message */}
                      <p id="pdf-fallback-msg" className="text-center mt-4 hidden">
                        Unable to display the document. Please use the download button to view it offline.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p>Document not available. Please generate the document first.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => selectedContract && handleDownload(selectedContract)}
              disabled={isLoading || !selectedContract}
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              Download
            </Button>
            {selectedContract?.status !== "signed" && (
              <Button
                onClick={() => {
                  setPreviewOpen(false)
                  if (selectedContract) handleSignContract(selectedContract)
                }}
                disabled={isLoading || !selectedContract}
              >
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Pen className="h-4 w-4 mr-2" />}
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
      <Dialog
        open={showSigningDialog}
        onOpenChange={(open) => {
          setShowSigningDialog(open)
          // When dialog is closed, make sure we're still polling for signature status
          if (!open && signingUrl) {
            console.log("Dialog closed, continuing to check for signature status")
            setIsWaitingForSignature(true)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Ready for Signature</DialogTitle>
            <DialogDescription>
              Your document is ready to be signed. Click below to open the signing page. The system will automatically
              detect when you complete the signing process.
            </DialogDescription>
            {signingUrl && (
              <div className="mt-2 text-xs text-muted-foreground break-all">
                <span>URL: {signingUrl}</span>
              </div>
            )}
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <Button
              onClick={() => {
                if (signingUrl) {
                  console.log("Opening signing URL in new tab:", signingUrl)
                  window.open(signingUrl, "_blank")

                  // Update UI to show we're waiting for signature
                  setIsWaitingForSignature(true)

                  // Toast to inform user we're monitoring the status
                  toast({
                    title: "Signing page opened",
                    description: "Complete the signing process. The system will automatically update when finished.",
                  })

                  // If the window doesn't open, provide a fallback
                  toast({
                    title: "Signing page opened",
                    description: "If the signing page didn't open, check your pop-up blocker settings.",
                  })
                }
                setShowSigningDialog(false)
              }}
            >
              Open Signing Page
            </Button>

            {signingUrl && (
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(signingUrl)
                  toast({
                    title: "URL Copied",
                    description: "Signing URL copied to clipboard",
                  })
                }}
              >
                Copy URL to Clipboard
              </Button>
            )}
          </div>
          <DialogFooter>
            {isWaitingForSignature && (
              <div className="flex items-center mr-auto text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Checking for signature status...</span>
              </div>
            )}
            <Button variant="outline" onClick={() => setShowSigningDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
