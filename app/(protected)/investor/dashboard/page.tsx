"use client"

import { useAuth } from "@/lib/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Upload, CheckCircle, Clock, AlertTriangle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

export default function InvestorDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()

  // Mock investment data
  const investmentData = {
    safeInvestment: {
      amountInvested: 25000,
      status: "confirmed", // "pending" | "confirmed"
      date: "March 21, 2025",
      agreementUrl: "#",
      paymentMethod: "Credit Card",
      paymentPlan: "Installment", // "Full" | "Installment"
      installmentsRemaining: 10,
      totalInstallments: 12,
    },
    tokenBalance: {
      tokensPurchased: 25000,
      tokenValue: 25000, // in SGD
      tokenPrice: 1, // in SGD
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
      kycStatus: user?.onboardingStatus.kyc || "not_submitted",
      idUploaded: user?.onboardingStatus.kyc !== "not_submitted",
    },
  }

  const handleDownloadDocument = (documentName: string) => {
    toast({
      title: "Download started",
      description: `${documentName} is being downloaded`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
      case "signed":
      case "available":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="mr-1 h-3 w-3" />
            {status === "confirmed" ? "Confirmed" : status === "signed" ? "Signed" : "Available"}
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Stats Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              SGD {investmentData.safeInvestment.amountInvested.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Invested on {investmentData.safeInvestment.date}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Token Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {investmentData.tokenBalance.tokensPurchased.toLocaleString()} Tokens
            </div>
            <p className="text-xs text-muted-foreground">
              Value: SGD {investmentData.tokenBalance.tokenValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">KYC Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {user?.onboardingStatus.kyc === "submitted" ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Verified
                </Badge>
              ) : user?.onboardingStatus.kyc === "pending" ? (
                <Badge variant="outline" className="text-yellow-800 dark:text-yellow-300">
                  <Clock className="mr-1 h-3 w-3" />
                  Pending
                </Badge>
              ) : user?.onboardingStatus.kyc === "rejected" ? (
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
              {user?.onboardingStatus.kyc !== "submitted" && (
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
            {/* SAFE Investment Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">SAFE Investment Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Amount Invested</h4>
                    <p className="text-2xl font-bold">
                      SGD {investmentData.safeInvestment.amountInvested.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <div className="flex items-center mt-1">{getStatusBadge(investmentData.safeInvestment.status)}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {investmentData.safeInvestment.paymentPlan === "Installment" && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Installment Progress</h4>
                      <div className="flex justify-between text-xs">
                        <span>
                          {investmentData.safeInvestment.totalInstallments -
                            investmentData.safeInvestment.installmentsRemaining}{" "}
                          of {investmentData.safeInvestment.totalInstallments} payments
                        </span>
                        <span>
                          {Math.round(
                            ((investmentData.safeInvestment.totalInstallments -
                              investmentData.safeInvestment.installmentsRemaining) /
                              investmentData.safeInvestment.totalInstallments) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          ((investmentData.safeInvestment.totalInstallments -
                            investmentData.safeInvestment.installmentsRemaining) /
                            investmentData.safeInvestment.totalInstallments) *
                          100
                        }
                      />
                      <p className="text-xs text-muted-foreground">Next payment: April 21, 2025</p>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDownloadDocument("SAFE Agreement")}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Agreement
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Token Balance */}
              <h3 className="text-lg font-medium mb-4">Token Balance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Tokens Purchased</h4>
                  <p className="text-2xl font-bold">{investmentData.tokenBalance.tokensPurchased.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Token Value</h4>
                  <p className="text-2xl font-bold">SGD {investmentData.tokenBalance.tokenValue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    Current price: SGD {investmentData.tokenBalance.tokenPrice.toFixed(2)} per token
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Documents Section */}
              <h3 className="text-lg font-medium mb-4">Documents</h3>
              <div className="space-y-4">
                {investmentData.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{document.name}</p>
                        <p className="text-sm text-muted-foreground">Date: {document.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(document.status)}
                      <Button variant="outline" size="sm" onClick={() => handleDownloadDocument(document.name)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Profile & Identity Verification */}
              <h3 className="text-lg font-medium mb-4">Profile & Identity Verification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">KYC Status</h4>
                    <div className="flex items-center mt-1">
                      {user?.onboardingStatus.kyc === "submitted" ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      ) : user?.onboardingStatus.kyc === "pending" ? (
                        <Badge variant="outline" className="text-yellow-800 dark:text-yellow-300">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      ) : user?.onboardingStatus.kyc === "rejected" ? (
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
                        {user?.onboardingStatus.kyc === "submitted"
                          ? "View KYC Details"
                          : user?.onboardingStatus.kyc === "pending"
                            ? "Check KYC Status"
                            : user?.onboardingStatus.kyc === "rejected"
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
