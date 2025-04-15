"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Download, FileText, CheckCircle, XCircle, Upload, Eye, CreditCard } from "lucide-react"
import {
  fetchInvestors,
  fetchInvestorDetails,
  approveInvestorKYC,
  rejectInvestorKYC,
  approveInvestorPayment,
  rejectInvestorPayment,
  fetchInvestorDocuments,
} from "./action"

export default function InvestorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null)
  const [investors, setInvestors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const ITEMS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [scrollPosition, setScrollPosition] = useState(0)
  const tableRef = useRef<HTMLDivElement>(null)
  const [investorDocuments, setInvestorDocuments] = useState<any[]>([])
  const [loadingDocuments, setLoadingDocuments] = useState(false)

  const [paymentApprovalOpen, setPaymentApprovalOpen] = useState(false)
  const [documentPreviewOpen, setDocumentPreviewOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const { toast } = useToast()

  // Fetch investors from API
  useEffect(() => {
    async function loadInvestors() {
      try {
        setLoading(true)
        const result = await fetchInvestors(searchQuery, currentPage, ITEMS_PER_PAGE)

        if (result.error) {
          setError(result.error)
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else {
          setInvestors(result.data || [])
          setTotalPages(result.totalPages || 1)
          setError(null)
        }
      } catch (err) {
        console.error("Error loading investors:", err)
        setError("Failed to load investors data")
        toast({
          title: "Error",
          description: "Failed to load investors data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadInvestors()
  }, [toast, searchQuery, currentPage])

  // Use the API-provided paginated list rather than client-side filtering
  const paginatedInvestors = investors

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      VERIFIED: { label: "Verified", variant: "default" },
      PENDING: { label: "Pending", variant: "secondary" },
      REJECTED: { label: "Rejected", variant: "destructive" },
      COMPLETED: { label: "Completed", variant: "default" },
      SAFE_UNSIGNED: { label: "SAFE Unsigned", variant: "secondary" },
      PENDING_APPROVAL: { label: "Pending Approval", variant: "secondary" },
      FAILED: { label: "Failed", variant: "destructive" },
      NOT_STARTED: { label: "Not Started", variant: "outline" },
    }

    const statusInfo = statusMap[status] || { label: status, variant: "outline" }
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          statusInfo.variant === "default"
            ? "bg-green-100 text-green-800"
            : statusInfo.variant === "secondary"
              ? "bg-yellow-100 text-yellow-800"
              : statusInfo.variant === "destructive"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
        }`}
      >
        {statusInfo.label}
      </span>
    )
  }

  const handleExportData = () => {
    // TODO: Implement export functionality
    toast({
      title: "Export",
      description: "Export functionality coming soon",
    })
  }

  const handleApproveKYC = async () => {
    if (!selectedInvestor) return

    try {
      const result = await approveInvestorKYC(selectedInvestor.id)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "KYC Approved",
          description: `${selectedInvestor.name}'s KYC verification has been approved`,
        })

        // Refresh investor details
        const updatedDetails = await fetchInvestorDetails(selectedInvestor.id)
        if (updatedDetails.data) {
          setSelectedInvestor(updatedDetails.data)
        }
      }
    } catch (err) {
      console.error("Error approving KYC:", err)
      toast({
        title: "Error",
        description: "Failed to approve KYC",
        variant: "destructive",
      })
    }
  }

  const handleRejectKYC = async () => {
    if (!selectedInvestor || !rejectionReason) {
      toast({
        title: "Rejection reason required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await rejectInvestorKYC(selectedInvestor.id, rejectionReason)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "KYC Rejected",
          description: `${selectedInvestor.name}'s KYC verification has been rejected`,
        })

        // Refresh investor details
        const updatedDetails = await fetchInvestorDetails(selectedInvestor.id)
        if (updatedDetails.data) {
          setSelectedInvestor(updatedDetails.data)
        }

        setRejectionReason("")
      }
    } catch (err) {
      console.error("Error rejecting KYC:", err)
      toast({
        title: "Error",
        description: "Failed to reject KYC",
        variant: "destructive",
      })
    }
  }

  const handleApprovePayment = async () => {
    if (!selectedInvestor) return

    try {
      const result = await approveInvestorPayment(selectedInvestor.id)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Payment Approved",
          description: `Payment of $${selectedInvestor.investmentAmount?.toLocaleString() || "0"} has been approved for ${selectedInvestor.name}`,
        })

        // Refresh investor details
        const updatedDetails = await fetchInvestorDetails(selectedInvestor.id)
        if (updatedDetails.data) {
          setSelectedInvestor(updatedDetails.data)
        }

        setPaymentApprovalOpen(false)
      }
    } catch (err) {
      console.error("Error approving payment:", err)
      toast({
        title: "Error",
        description: "Failed to approve payment",
        variant: "destructive",
      })
    }
  }

  const handleRejectPayment = async () => {
    if (!selectedInvestor || !rejectionReason) {
      toast({
        title: "Rejection reason required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await rejectInvestorPayment(selectedInvestor.id, rejectionReason)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Payment Rejected",
          description: `Payment for ${selectedInvestor.name} has been rejected`,
        })

        // Refresh investor details
        const updatedDetails = await fetchInvestorDetails(selectedInvestor.id)
        if (updatedDetails.data) {
          setSelectedInvestor(updatedDetails.data)
        }

        setPaymentApprovalOpen(false)
        setRejectionReason("")
      }
    } catch (err) {
      console.error("Error rejecting payment:", err)
      toast({
        title: "Error",
        description: "Failed to reject payment",
        variant: "destructive",
      })
    }
  }

  const handleViewDocument = (document: any) => {
    console.log("Viewing document:", document)
    setSelectedDocument(document)
    setDocumentPreviewOpen(true)
  }

  // Add this function to determine document type
  const getDocumentViewComponent = (document: any) => {
    if (!document || !document.url) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Document preview not available</p>
        </div>
      )
    }

    const url = document.url
    const fileExt = url.split(".").pop()?.toLowerCase()

    // Handle PDFs
    if (fileExt === "pdf") {
      return (
        <div className="w-full h-[500px] overflow-hidden">
          <iframe
            src={`${url}#toolbar=1&navpanes=1`}
            className="w-full h-full border-0 rounded-lg"
            title={document.name}
          />
        </div>
      )
    }

    // Handle images
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExt)) {
      return (
        <div className="w-full max-h-[500px] overflow-auto flex items-center justify-center bg-muted/30 rounded-lg">
          <img src={url} alt={document.name} className="max-w-full max-h-[500px] object-contain" />
        </div>
      )
    }

    // For other file types, offer download and external view
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">This file type can't be previewed directly</p>
        <div className="flex space-x-4">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground h-10 px-4 py-2"
          >
            <Eye className="mr-2 h-4 w-4" />
            Open in new tab
          </a>
          <a
            href={url}
            download
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground h-10 px-4 py-2"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        </div>
      </div>
    )
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (tableRef.current) {
      tableRef.current.scrollTop = 0
    }
  }

  const handleInvestorClick = async (investor: any) => {
    try {
      const result = await fetchInvestorDetails(investor.id)
      if (result.data) {
        console.log("Investor details received:", result.data)
        setSelectedInvestor(result.data)

        // Fetch documents for the selected investor
        fetchDocumentsForInvestor(investor.id)
      } else if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error loading investor details:", err)
      toast({
        title: "Error",
        description: "Failed to load investor details",
        variant: "destructive",
      })
    }
  }

  // Add function to fetch documents for an investor
  const fetchDocumentsForInvestor = async (investorId: string) => {
    try {
      setLoadingDocuments(true)
      const result = await fetchInvestorDocuments(investorId)
      console.log("Documents API response:", result)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        console.log("Setting investor documents:", result.documents)
        setInvestorDocuments(result.documents || [])
      }
    } catch (err) {
      console.error("Error loading investor documents:", err)
      toast({
        title: "Error",
        description: "Failed to load investor documents",
        variant: "destructive",
      })
    } finally {
      setLoadingDocuments(false)
    }
  }

  // Helper function for safely accessing nested properties
  const safeGet = (obj: any, path: string, defaultValue: any = "") => {
    if (!obj) return defaultValue
    const keys = path.split(".")
    let result = obj
    for (const key of keys) {
      if (result === null || result === undefined || typeof result !== "object") {
        return defaultValue
      }
      result = result[key]
    }
    return result !== null && result !== undefined ? result : defaultValue
  }

  return (
    <div className="flex-1 p-8 pt-6">
      <div className="flex items-center justify-between mb-6 mt-20">
        <h2 className="text-3xl font-bold tracking-tight">Investors</h2>
        <Button onClick={handleExportData}>Export Data</Button>
      </div>
      <div className="flex gap-4 h-[calc(100vh-12rem)]">
        {/* Left Panel - Investors List */}
        <div className="w-[50%] flex flex-col">
          <div className="mb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search investors..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card className="flex-1 mb-2">
            <div className="h-[calc(100vh-20rem)] overflow-hidden">
              <div className="h-full overflow-auto" ref={tableRef}>
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead className="w-[25%]">Name</TableHead>
                      <TableHead className="w-[18%]">KYC Status</TableHead>
                      <TableHead className="w-[25%]">Payment</TableHead>
                      <TableHead className="w-[32%]">Plan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedInvestors.map((investor) => (
                      <TableRow
                        key={investor.id}
                        className={`cursor-pointer ${selectedInvestor?.id === investor.id ? "bg-muted" : ""}`}
                        onClick={() => handleInvestorClick(investor)}
                      >
                        <TableCell className="font-medium">{investor.name}</TableCell>
                        <TableCell>{getStatusBadge(investor.kycStatus)}</TableCell>
                        <TableCell>{getStatusBadge(investor.paymentStatus)}</TableCell>
                        <TableCell>
                          {investor.kycStatus === "REJECTED" ? (
                            <Badge
                              variant="destructive"
                              className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              KYC Rejected
                            </Badge>
                          ) : investor.paymentStatus === "NOT_STARTED" ? (
                            <Badge variant="outline" className="text-gray-500">
                              Not Started
                            </Badge>
                          ) : investor.paymentPlan === "INSTALLMENT" ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                            >
                              Installment ({investor.remainingPayments} left)
                            </Badge>
                          ) : (
                            <Badge variant="outline">Full Payment</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>

          {/* Enhanced pagination controls */}
          <Card className="p-3.5 mb-2">
            <div className="flex items-center justify-between">
              <Button
                variant="default"
                size="default"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="shadow-md hover:shadow-lg min-w-[100px] flex-shrink-0"
              >
                Previous
              </Button>
              <span className="text-base font-medium px-4 py-2 bg-muted rounded-md">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="default"
                size="default"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="shadow-md hover:shadow-lg min-w-[100px] flex-shrink-0"
              >
                Next
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Panel - Investor Details - aligned with left panel */}
        <div className="flex-1 flex flex-col">
          {selectedInvestor ? (
            <Card className="h-[calc(100vh-12rem-2px)] overflow-hidden">
              <div className="h-full overflow-auto pb-4">
                <CardHeader>
                  <CardTitle>{selectedInvestor.name}</CardTitle>
                  <CardDescription>
                    Created: {new Date(selectedInvestor.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="details" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                      <TabsTrigger value="verification">Verification</TabsTrigger>
                      <TabsTrigger value="payment">Payment</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>First Name</Label>
                          <Input
                            value={
                              safeGet(selectedInvestor, "firstName") ||
                              safeGet(selectedInvestor, "name", "").split(" ")[0]
                            }
                            readOnly
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input
                            value={
                              safeGet(selectedInvestor, "lastName") ||
                              safeGet(selectedInvestor, "name", "").split(" ")[1] ||
                              ""
                            }
                            readOnly
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input value={safeGet(selectedInvestor, "email")} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input value={safeGet(selectedInvestor, "phone")} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Date of Birth</Label>
                          <Input value={safeGet(selectedInvestor, "dateOfBirth")} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Address</Label>
                          <Input value={safeGet(selectedInvestor, "address")} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Investment Amount</Label>
                          <Input
                            value={
                              safeGet(selectedInvestor, "investmentAmount") > 0
                                ? `$${safeGet(selectedInvestor, "investmentAmount").toLocaleString()}`
                                : "N/A"
                            }
                            readOnly
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <div className="h-10 flex items-center">
                            {getStatusBadge(safeGet(selectedInvestor, "status"))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-4">
                      {loadingDocuments ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Loading documents...</p>
                        </div>
                      ) : investorDocuments.length > 0 ? (
                        <>
                          <div className="text-sm mb-2">Found {investorDocuments.length} document(s)</div>
                          {investorDocuments.map((doc: any) => {
                            return (
                              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center">
                                  <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">{doc.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Uploaded on {doc.date || doc.created_at || "N/A"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Type: {doc.document_type || doc.type || "Unknown"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  {getStatusBadge(doc.verification_status || doc.status || "PENDING")}
                                  <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">No documents uploaded yet</div>
                      )}
                    </TabsContent>

                    <TabsContent value="verification" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">KYC Status</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Current verification status: </span>
                              {getStatusBadge(
                                safeGet(selectedInvestor, "kycStatus") || safeGet(selectedInvestor, "status"),
                              )}
                            </div>
                          </div>
                          {safeGet(selectedInvestor, "status") === "PENDING" && (
                            <div className="flex flex-col space-y-2">
                              <Button onClick={handleApproveKYC} size="sm">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Approve KYC
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <XCircle className="mr-1 h-3 w-3" />
                                    Reject KYC
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reject KYC Verification</DialogTitle>
                                    <DialogDescription>
                                      Please provide a reason for rejecting this KYC verification.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <Textarea
                                      placeholder="Enter rejection reason..."
                                      value={rejectionReason}
                                      onChange={(e) => setRejectionReason(e.target.value)}
                                      className="min-h-[100px]"
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setRejectionReason("")}>
                                      Cancel
                                    </Button>
                                    <Button variant="destructive" onClick={handleRejectKYC}>
                                      Reject
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="font-medium">Verification Documents</h3>

                          {/* ID Documents */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">ID Verification</h4>
                            {safeGet(selectedInvestor, "documents", [])
                              .filter((doc: any) => doc.type === "ID")
                              .map((doc: any) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                                  <div className="flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <div>
                                      <p className="font-medium">{doc.name}</p>
                                      <p className="text-sm text-muted-foreground">Uploaded on {doc.date}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {getStatusBadge(doc.status)}
                                    <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View
                                    </Button>
                                  </div>
                                </div>
                              ))}

                            {!safeGet(selectedInvestor, "documents", []).some((doc: any) => doc.type === "ID") && (
                              <div className="text-sm text-muted-foreground">No ID documents uploaded</div>
                            )}
                          </div>

                          {/* Address Documents */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Address Verification</h4>
                            {safeGet(selectedInvestor, "documents", [])
                              .filter((doc: any) => doc.type === "ADDRESS")
                              .map((doc: any) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                                  <div className="flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <div>
                                      <p className="font-medium">{doc.name}</p>
                                      <p className="text-sm text-muted-foreground">Uploaded on {doc.date}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {getStatusBadge(doc.status)}
                                    <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View
                                    </Button>
                                  </div>
                                </div>
                              ))}

                            {!safeGet(selectedInvestor, "documents", []).some((doc: any) => doc.type === "ADDRESS") && (
                              <div className="text-sm text-muted-foreground">No address documents uploaded</div>
                            )}
                          </div>
                        </div>

                        {safeGet(selectedInvestor, "rejectionReason") && (
                          <div className="space-y-2 mt-4">
                            <Label>Rejection Reason</Label>
                            <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300">
                              {safeGet(selectedInvestor, "rejectionReason")}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="payment" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Payment Status</h3>
                            <p className="text-sm text-muted-foreground">
                              Current payment status: {getStatusBadge(safeGet(selectedInvestor, "paymentStatus"))}
                            </p>
                          </div>
                          {safeGet(selectedInvestor, "paymentStatus") === "PENDING_APPROVAL" && (
                            <div>
                              <Button size="sm" onClick={() => setPaymentApprovalOpen(true)}>
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Review Payment
                              </Button>
                            </div>
                          )}
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Investment Amount</Label>
                              <Input
                                value={
                                  safeGet(selectedInvestor, "investmentAmount") > 0
                                    ? `$${safeGet(selectedInvestor, "investmentAmount").toLocaleString()}`
                                    : "N/A"
                                }
                                readOnly
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Payment Method</Label>
                              <Input
                                value={
                                  safeGet(selectedInvestor, "documents", []).some(
                                    (doc: any) => doc.type === "PAYMENT" && doc.name.includes("Bank"),
                                  )
                                    ? "Bank Transfer"
                                    : safeGet(selectedInvestor, "documents", []).some(
                                          (doc: any) => doc.type === "PAYMENT" && doc.name.includes("Credit"),
                                        )
                                      ? "Credit Card"
                                      : "Not Selected"
                                }
                                readOnly
                              />
                            </div>
                          </div>

                          {/* Payment Documents */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Payment Documents</h4>
                            {safeGet(selectedInvestor, "documents", [])
                              .filter((doc: any) => doc.type === "PAYMENT")
                              .map((doc: any) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                                  <div className="flex items-center">
                                    {doc.name.includes("Bank") ? (
                                      <Upload className="h-5 w-5 mr-2 text-muted-foreground" />
                                    ) : (
                                      <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                                    )}
                                    <div>
                                      <p className="font-medium">{doc.name}</p>
                                      <p className="text-sm text-muted-foreground">Uploaded on {doc.date}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {getStatusBadge(doc.status)}
                                    <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View
                                    </Button>
                                  </div>
                                </div>
                              ))}

                            {!safeGet(selectedInvestor, "documents", []).some((doc: any) => doc.type === "PAYMENT") && (
                              <div className="text-sm text-muted-foreground">No payment documents uploaded</div>
                            )}
                          </div>

                          {/* SAFE Agreement */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">SAFE Agreement</h4>
                            {safeGet(selectedInvestor, "documents", [])
                              .filter((doc: any) => doc.type === "AGREEMENT")
                              .map((doc: any) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                                  <div className="flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <div>
                                      <p className="font-medium">{doc.name}</p>
                                      <p className="text-sm text-muted-foreground">Signed on {doc.date}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {getStatusBadge(doc.status)}
                                    <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Download className="h-4 w-4 mr-2" />
                                      Download
                                    </Button>
                                  </div>
                                </div>
                              ))}

                            {!safeGet(selectedInvestor, "documents", []).some(
                              (doc: any) => doc.type === "AGREEMENT",
                            ) && <div className="text-sm text-muted-foreground">No signed agreements</div>}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </div>
            </Card>
          ) : (
            <Card className="h-[calc(100vh-12rem-2px)] flex items-center justify-center text-muted-foreground">
              Select investor to view details
            </Card>
          )}
        </div>
      </div>
      <Dialog open={paymentApprovalOpen} onOpenChange={setPaymentApprovalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Approval</DialogTitle>
            <DialogDescription>
              Review and approve or reject the payment of $
              {safeGet(selectedInvestor, "investmentAmount")
                ? safeGet(selectedInvestor, "investmentAmount").toLocaleString()
                : "0"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Document</Label>
                {safeGet(selectedInvestor, "documents", [])
                  .filter((doc: any) => doc.type === "PAYMENT" && doc.status === "PENDING_APPROVAL")
                  .map((doc: any) => (
                    <div key={doc.id} className="border rounded-lg overflow-hidden">
                      <img
                        src={safeGet(doc, "url") || "/placeholder.svg"}
                        alt={safeGet(doc, "name")}
                        className="w-full h-auto max-h-[300px] object-contain"
                      />
                      <div className="p-2 bg-muted">
                        <p className="text-sm font-medium">{safeGet(doc, "name")}</p>
                        <p className="text-xs text-muted-foreground">Uploaded on {safeGet(doc, "date")}</p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Rejection Reason (required if rejecting)</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentApprovalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectPayment}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button onClick={handleApprovePayment}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={documentPreviewOpen} onOpenChange={setDocumentPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
            <DialogDescription>
              {selectedDocument?.document_type || selectedDocument?.type} uploaded on{" "}
              {selectedDocument?.date || selectedDocument?.created_at || "N/A"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">{getDocumentViewComponent(selectedDocument)}</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocumentPreviewOpen(false)}>
              Close
            </Button>
            {selectedDocument?.url && (
              <a
                href={selectedDocument.url}
                download
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground h-10 px-4 py-2"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
