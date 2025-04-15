"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, CheckCircle, XCircle, Upload, Download, ArrowLeft } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { InstallmentPlan } from "../components/installment-plan"

export default function InvestorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [paymentApprovalOpen, setPaymentApprovalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  // Mock data for the investor
  const investor = {
    id: Number.parseInt(id as string),
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    investmentAmount: 50000,
    status: "Payment Pending",
    date: "2023-05-10",
    kycStatus: "Verified",
    documents: [
      { id: 1, name: "SAFE Agreement", status: "Signed", date: "2023-05-10" },
      { id: 2, name: "Bank Transfer Receipt", status: "Uploaded", date: "2023-05-11" },
      { id: 3, name: "ID Verification", status: "Verified", date: "2023-05-09" },
    ],
    kyc: {
      idVerified: true,
      addressVerified: true,
      accreditationVerified: true,
      verificationDate: "2023-05-09",
      verificationMethod: "Manual Review",
      notes: "All documents verified and approved.",
    },
    bankTransfer: {
      amount: 50000,
      date: "2023-05-11",
      reference: "INV-123456",
      status: "Pending Approval",
      receiptUrl: "#",
    },
  }

  const handleApprovePayment = () => {
    toast({
      title: "Payment approved",
      description: `Payment of $${investor.bankTransfer.amount.toLocaleString()} has been approved for ${investor.name}`,
    })
    setPaymentApprovalOpen(false)
  }

  const handleRejectPayment = () => {
    if (!rejectionReason) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Payment rejected",
      description: `Payment for ${investor.name} has been rejected`,
    })
    setPaymentApprovalOpen(false)
  }

  const handleDownloadDocument = (documentId: number) => {
    toast({
      title: "Download started",
      description: "The document is being downloaded",
    })
  }

  // Update the getStatusBadge function to be consistent with our changes
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
      case "Approved":
      case "Completed":
      case "Signed":
        return <Badge variant={status === "Completed" ? "default" : "secondary"}>{status}</Badge>
      case "Rejected":
      case "Failed":
        return <Badge variant="destructive">{status}</Badge>
      case "Pending":
      case "Pending Approval":
      case "Uploaded":
        return <Badge variant="secondary">{status}</Badge>
      case "SAFE_UNSIGNED":
      case "Unsigned":
        return (
          <Badge
            variant="outline"
            className="text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-800"
          >
            {status === "SAFE_UNSIGNED" ? "SAFE unsigned" : "Unsigned"}
          </Badge>
        )
      case "Not Started":
        return (
          <Badge variant="outline" className="text-gray-500">
            Not Started
          </Badge>
        )
      default:
        return <Badge variant={status === "Completed" ? "default" : "secondary"}>{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Investor Details</h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Investor Information</CardTitle>
            <CardDescription>Personal and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p>{investor.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{investor.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p>{investor.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Investment Amount</p>
                <p>${investor.investmentAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={investor.status === "Completed" ? "default" : "secondary"}>{investor.status}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">KYC Status</p>
                <Badge variant={investor.kycStatus === "Verified" ? "default" : "secondary"}>
                  {investor.kycStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {investor.bankTransfer && investor.bankTransfer.status === "Pending Approval" && (
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardHeader className="bg-yellow-50 dark:bg-yellow-950/50">
              <CardTitle className="flex items-center text-yellow-800 dark:text-yellow-400">
                <Upload className="mr-2 h-5 w-5" />
                Payment Approval Required
              </CardTitle>
              <CardDescription>Bank transfer payment is pending your approval</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p>${investor.bankTransfer.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{investor.bankTransfer.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reference</p>
                  <p>{investor.bankTransfer.reference}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleDownloadDocument(2)}>
                <Download className="mr-2 h-4 w-4" />
                View Receipt
              </Button>
              <Dialog open={paymentApprovalOpen} onOpenChange={setPaymentApprovalOpen}>
                <DialogTrigger asChild>
                  <Button>Review Payment</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Payment Approval</DialogTitle>
                    <DialogDescription>
                      Review and approve or reject the bank transfer payment of $
                      {investor.bankTransfer.amount.toLocaleString()}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
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
            </CardFooter>
          </Card>
        )}
      </div>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
          <TabsTrigger value="payment-plan">Payment Plan</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investor Documents</CardTitle>
              <CardDescription>View and download investor documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investor.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{document.name}</p>
                        <p className="text-sm text-muted-foreground">Uploaded on {document.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(document.status)}
                      <Button variant="outline" size="sm" onClick={() => handleDownloadDocument(document.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>KYC Verification</CardTitle>
              <CardDescription>Know Your Customer verification details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">ID Verification</p>
                  <div className="flex items-center">
                    {investor.kyc.idVerified ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span>{investor.kyc.idVerified ? "Verified" : "Not Verified"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Address Verification</p>
                  <div className="flex items-center">
                    {investor.kyc.addressVerified ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span>{investor.kyc.addressVerified ? "Verified" : "Not Verified"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Accreditation Verification</p>
                  <div className="flex items-center">
                    {investor.kyc.accreditationVerified ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span>{investor.kyc.accreditationVerified ? "Verified" : "Not Verified"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Verification Date</p>
                  <p>{investor.kyc.verificationDate}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Verification Method</p>
                <p>{investor.kyc.verificationMethod}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-sm">{investor.kyc.notes}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-plan" className="space-y-4">
          <InstallmentPlan
            totalAmount={50000}
            monthlyAmount={4167}
            totalInstallments={12}
            remainingInstallments={8}
            payments={[
              { date: "January 15, 2023", amount: 4167, status: "paid", receiptUrl: "#" },
              { date: "February 15, 2023", amount: 4167, status: "paid", receiptUrl: "#" },
              { date: "March 15, 2023", amount: 4167, status: "paid", receiptUrl: "#" },
              { date: "April 15, 2023", amount: 4167, status: "paid", receiptUrl: "#" },
              { date: "May 15, 2023", amount: 4167, status: "due" },
              { date: "June 15, 2023", amount: 4167, status: "upcoming" },
              { date: "July 15, 2023", amount: 4167, status: "upcoming" },
              { date: "August 15, 2023", amount: 4167, status: "upcoming" },
              { date: "September 15, 2023", amount: 4167, status: "upcoming" },
              { date: "October 15, 2023", amount: 4167, status: "upcoming" },
              { date: "November 15, 2023", amount: 4167, status: "upcoming" },
              { date: "December 15, 2023", amount: 4167, status: "upcoming" },
            ]}
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent activity for this investor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-primary pl-4 pb-4">
                  <p className="font-medium">Bank Transfer Receipt Uploaded</p>
                  <p className="text-sm text-muted-foreground">May 11, 2023 at 2:34 PM</p>
                </div>
                <div className="border-l-2 border-primary pl-4 pb-4">
                  <p className="font-medium">SAFE Agreement Signed</p>
                  <p className="text-sm text-muted-foreground">May 10, 2023 at 11:15 AM</p>
                </div>
                <div className="border-l-2 border-primary pl-4 pb-4">
                  <p className="font-medium">KYC Verification Completed</p>
                  <p className="text-sm text-muted-foreground">May 9, 2023 at 3:45 PM</p>
                </div>
                <div className="border-l-2 border-primary pl-4 pb-4">
                  <p className="font-medium">Account Created</p>
                  <p className="text-sm text-muted-foreground">May 8, 2023 at 10:20 AM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
