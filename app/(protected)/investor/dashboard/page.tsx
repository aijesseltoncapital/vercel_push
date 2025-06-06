"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, CheckCircle, Clock, AlertTriangle, ExternalLink, Eye, Download } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

// Update User interface to explicitly include investor_id
interface User {
  name?: string
  email?: string
  investor_id?: string | number
  id?: string | number // The user ID from the auth system
  role?: string
  onboardingStatus?: {
    kyc?: string // Use string instead of specific literals to avoid type errors
    nda?: string
    contract?: string
    investment?: string
  }
  onboardingComplete?: boolean
  paymentOption?: string
}

// Define document interface
interface InvestorDocument {
  id: string | number
  name: string
  type?: string
  category?: string
  description?: string
  date?: string
  status?: string
  document_id?: string // UUID for Signwell API
  file_size?: number
  version?: string
  investor_id?: string | number
  user_id?: string | number
  view_url?: string
  download_url?: string
  file_url?: string
}

// Define investor data interface
interface InvestorData {
  id?: string | number
  name?: string
  first_name?: string
  last_name?: string
  email?: string
  kyc_status?: string
  payment_status?: string
  payment_plan?: string
  remaining_payments?: number
  investment_amount?: number
  status?: string
  created_at?: string
  updated_at?: string
}

export default function InvestorDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [investorId, setInvestorId] = useState<string | number | null>(null)
  const [investorData, setInvestorData] = useState<InvestorData | null>(null)
  const [documents, setDocuments] = useState<InvestorDocument[]>([])
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:4242"

  // Get the typed user
  const typedUser = user as User | undefined

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
            setInvestorData(data.data)
          }
        } catch (error) {
          console.error("Error fetching investor ID:", error)
        }
      } else if (typedUser?.investor_id) {
        console.log("Using investor_id from user object:", typedUser.investor_id)
        setInvestorId(typedUser.investor_id)
        // Fetch investor data using the investor_id
        fetchInvestorDetails(typedUser.investor_id)
      }
    }

    const fetchInvestorDetails = async (id: string | number) => {
      try {
        const response = await fetch(`${API_URL}/investors/${id}`, {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) {
          console.error("Failed to fetch investor details:", await response.text())
          return
        }

        const data = await response.json()
        if (data.data) {
          console.log("Retrieved investor details:", data.data)
          setInvestorData(data.data)
        }
      } catch (error) {
        console.error("Error fetching investor details:", error)
      }
    }

    fetchInvestorId()
  }, [typedUser?.email, typedUser?.investor_id, typedUser?.id, investorId, API_URL])

  // Fetch documents when user ID is available
  useEffect(() => {
    const fetchDocuments = async () => {
      if (typedUser?.id) {
        setIsLoadingDocuments(true)
        try {
          console.log("Fetching documents for user:", typedUser.id)

          // Use user_id instead of investor_id
          const response = await fetch(`${API_URL}/documents?user_id=${typedUser.id}`, {
            method: "GET",
            credentials: "include",
          })

          if (!response.ok) {
            console.error("Failed to fetch documents:", await response.text())
            toast({
              title: "Error",
              description: "Could not load your documents. Please try again later.",
              variant: "destructive",
            })
            return
          }

          const data = await response.json()
          console.log("Retrieved documents:", data)
          setDocuments(data)
        } catch (error) {
          console.error("Error fetching documents:", error)
          toast({
            title: "Error",
            description: "Could not load your documents. Please try again later.",
            variant: "destructive",
          })
        } finally {
          setIsLoadingDocuments(false)
        }
      }
    }

    fetchDocuments()
  }, [typedUser?.id, API_URL, toast])

  // Handle document download
  const handleDownload = async (document: InvestorDocument) => {
    if (!document.download_url && !document.file_url) {
      toast({
        title: "Error",
        description: "Document URL not available",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoadingDocuments(true)

      // Use the document download URL directly if available, otherwise use file URL
      const documentUrl = document.download_url || document.file_url

      // Open the document in a new tab for viewing/downloading
      window.open(documentUrl, "_blank")
    } catch (error) {
      console.error("Error accessing document:", error)
      toast({
        title: "Access Failed",
        description: "Could not access the document. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingDocuments(false)
    }
  }

  // Mock investment data
  const investmentData = {
    safeInvestment: {
      amountInvested: investorData?.investment_amount || 0,
      status: "confirmed", // "pending" | "confirmed"
      date: "March 21, 2025",
      agreementUrl: "#",
      paymentMethod: "Credit Card",
      paymentPlan: "Installment", // "Full" | "Installment"
      installmentsRemaining: 10,
      totalInstallments: 12,
    },
    documents: [
      {
        id: 1,
        name: "SAFE Note Agreement",
        type: "legal",
        date: "March 21, 2025",
        status: "signed",
        url: "#",
      },
      {
        id: 2,
        name: "Payment Receipt",
        type: "payment",
        date: "March 21, 2025",
        status: "available",
        url: "#",
      },
      {
        id: 3,
        name: "Token Purchase Invoice",
        type: "invoice",
        date: "March 21, 2025",
        status: "available",
        url: "#",
      },
    ],
    profile: {
      kycStatus: user?.onboardingStatus?.kyc || "not_submitted",
      idUploaded: user?.onboardingStatus?.kyc !== "not_submitted",
    },
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
      case "signed":
      case "available":
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="mr-1 h-3 w-3" />
            {status === "confirmed"
              ? "Confirmed"
              : status === "signed"
                ? "Signed"
                : status === "verified"
                  ? "Verified"
                  : "Available"}
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-800 dark:text-yellow-300">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Investor Dashboard</h2>
        <Button asChild>
          <Link href="/investor/project">View Project</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {/* Quick Stats Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SGD {investorData?.investment_amount?.toLocaleString() || "0"}</div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-muted-foreground">Status: {investorData?.payment_status || "Pending"}</p>
              {investorData?.payment_status === "complete" ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Completed
                </Badge>
              ) : (
                <Badge variant="outline" className="text-yellow-800 dark:text-yellow-300">
                  <Clock className="mr-1 h-3 w-3" />
                  In Progress
                </Badge>
              )}
            </div>

            {/* Always show Installment progress bar */}
            <div className="mt-3 space-y-1">
              <h4 className="text-sm font-medium">Payment Progress</h4>
              {investorData?.payment_plan === "installment" && investorData?.remaining_payments !== undefined ? (
                <>
                  <div className="flex justify-between text-xs">
                    <span>
                      {investorData.remaining_payments > 0
                        ? `${investorData.remaining_payments} payments remaining`
                        : "All payments completed"}
                    </span>
                    <span>
                      {Math.round(
                        (1 - (investorData.remaining_payments > 0 ? investorData.remaining_payments / 12 : 0)) * 100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={Math.round(
                      (1 - (investorData.remaining_payments > 0 ? investorData.remaining_payments / 12 : 0)) * 100,
                    )}
                    className="h-3"
                  />
                  {investorData.remaining_payments > 0 && (
                    <p className="text-xs text-muted-foreground">Next payment due soon</p>
                  )}
                </>
              ) : investorData?.payment_status === "complete" ? (
                <>
                  <div className="flex justify-between text-xs">
                    <span>Payment completed</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="h-3" />
                </>
              ) : (
                <>
                  <div className="flex justify-between text-xs">
                    <span>Payment pending</span>
                    <span>0%</span>
                  </div>
                  <Progress value={0} className="h-3" />
                  <p className="text-xs text-muted-foreground">Payment not started</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">KYC Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {user?.onboardingStatus?.kyc === "submitted" ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Verified
                </Badge>
              ) : (user?.onboardingStatus?.kyc as string) === "pending" ? (
                <Badge variant="outline" className="text-yellow-800 dark:text-yellow-300">
                  <Clock className="mr-1 h-3 w-3" />
                  Pending
                </Badge>
              ) : (user?.onboardingStatus?.kyc as string) === "rejected" ? (
                <Badge variant="destructive">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Rejected
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Not Submitted
                </Badge>
              )}
              {user?.onboardingStatus?.kyc !== "submitted" && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/investor/kyc">Complete KYC</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="space-y-4">
        <CardHeader>
          <CardTitle>My Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div
              className="flex flex-col md:flex-row items-center gap-6 p-6 bg-card shadow-sm rounded-lg cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => {
                const details = document.getElementById("investment-details")
                if (details) {
                  details.classList.toggle("hidden")
                }
              }}
            >
              <div className="w-24 h-24 rounded-lg bg-primary/10 overflow-hidden flex-shrink-0 shadow-sm">
                <img
                  src="https://i.postimg.cc/s2977jJJ/HR-Monster.png"
                  alt="HR Monster Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-1">HR Monster</h3>
                <p className="text-sm text-muted-foreground">AI-driven payroll and HR platform</p>
                <div className="flex gap-2 mt-2 justify-center md:justify-start">
                  <Badge className="bg-primary/10 text-primary text-xs">Payroll</Badge>
                  <Badge className="bg-primary/10 text-primary text-xs">SaaS</Badge>
                </div>
              </div>
              <div className="ml-auto hidden md:flex items-center text-muted-foreground">
                <span className="text-sm mr-2">View details</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </div>
            </div>
          </div>

          <div id="investment-details" className="hidden space-y-6">
            {/* Investment Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Investment Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Amount Invested</h4>
                    <p className="text-2xl font-bold">SGD {investorData?.investment_amount?.toLocaleString() || "0"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <div className="flex items-center mt-1">
                      {investorData?.payment_status === "complete" ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Completed
                        </Badge>
                      ) : investorData?.payment_status === "pending" ? (
                        <Badge variant="outline" className="text-yellow-800 dark:text-yellow-300">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="outline">{investorData?.payment_status || "Processing"}</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {investorData?.payment_plan === "installment" && investorData?.remaining_payments !== undefined && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Installment Progress</h4>
                      <div className="flex justify-between text-xs">
                        <span>
                          {investorData.remaining_payments > 0
                            ? `${investorData.remaining_payments} payments remaining`
                            : "All payments completed"}
                        </span>
                        {investorData.remaining_payments > 0 && (
                          <span>{Math.round((1 - investorData.remaining_payments / 12) * 100)}%</span>
                        )}
                      </div>
                      <Progress
                        value={
                          investorData.remaining_payments > 0
                            ? Math.round((1 - investorData.remaining_payments / 12) * 100)
                            : 100
                        }
                      />
                      {investorData.remaining_payments > 0 && (
                        <p className="text-xs text-muted-foreground">Next payment due soon</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Documents Section */}
              <h3 className="text-lg font-medium mb-4">Documents</h3>
              <div className="space-y-4">
                {isLoadingDocuments ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : documents && documents.length > 0 ? (
                  documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex items-start sm:items-center">
                        <FileText className="h-5 w-5 mr-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0">
                          {" "}
                          {/* This ensures text truncation works properly */}
                          <p className="font-medium truncate max-w-[200px] sm:max-w-[300px]">{document.name}</p>
                          <p className="text-sm text-muted-foreground">Date: {document.date || "N/A"}</p>
                          {document.description && (
                            <p className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
                              Description: {document.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
                        <div className="mb-1 sm:mb-0">{getStatusBadge(document.status || "available")}</div>
                        <div className="flex flex-wrap gap-2">
                          {(document.view_url || document.file_url) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                window.open(document.view_url || document.file_url, "_blank")
                              }}
                              className="w-full sm:w-auto"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          )}
                          {(document.download_url || document.file_url) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                handleDownload(document)
                              }}
                              className="w-full sm:w-auto"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 border rounded-lg text-muted-foreground">
                    <p>No documents available</p>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              {/* Profile & Identity Verification */}
              <h3 className="text-lg font-medium mb-4">Profile & Identity Verification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">KYC Status</h4>
                    <div className="flex items-center mt-1">
                      {user?.onboardingStatus?.kyc === "submitted" ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (user?.onboardingStatus?.kyc as string) === "pending" ? (
                        <Badge variant="outline" className="text-yellow-800 dark:text-yellow-300">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      ) : (user?.onboardingStatus?.kyc as string) === "rejected" ? (
                        <Badge variant="destructive">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Rejected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Not Submitted
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">ID Verification</h4>
                    {investmentData.profile.idUploaded ? (
                      <div className="flex items-center mt-1">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          ID Uploaded
                        </Badge>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No ID documents uploaded</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button asChild className="w-full">
                      <Link href="/investor/kyc">
                        <Upload className="mr-2 h-4 w-4" />
                        {user?.onboardingStatus?.kyc === "submitted"
                          ? "View KYC Details"
                          : (user?.onboardingStatus?.kyc as string) === "pending"
                            ? "Check KYC Status"
                            : (user?.onboardingStatus?.kyc as string) === "rejected"
                              ? "Resubmit KYC"
                              : "Complete KYC Verification"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* External Resources */}
              <h3 className="text-lg font-medium mb-4">Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/investor/project">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Project Details
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/investor/contracts">
                    <FileText className="mr-2 h-4 w-4" />
                    View Contracts
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="https://www.hr.monster" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit HR Monster Website
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
