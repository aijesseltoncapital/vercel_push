"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { BankTransferUpload } from "./bank-transfer-upload"
import { CreditCardForm } from "./credit-card-form"
import { PaymentSummary } from "./payment-summary"
import { InfoIcon, AlertTriangle, ShieldCheck } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function InvestPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("creditCard")
  const [agreementSigned, setAgreementSigned] = useState(false)
  const [receiptUploaded, setReceiptUploaded] = useState(false)
  const [paymentAuthorized, setPaymentAuthorized] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get investment amount and payment plan from user object
  const investmentAmount = user?.investmentAmount || 5000
  const paymentPlan = user?.paymentOption || "full"

  // Check onboarding status on component mount
  useEffect(() => {
    if (user) {
      // Check if contracts are signed
      if (user.onboardingStatus.contract !== "signed") {
        toast({
          title: "Contract signing required",
          description: "You need to sign all contracts before proceeding to payment",
          variant: "destructive",
        })
        router.push("/investor/contracts")
      }

      // Check if payment option is selected
      if (!user.paymentOption) {
        toast({
          title: "Payment option required",
          description: "You need to select a payment option before proceeding to payment",
          variant: "destructive",
        })
        router.push("/investor/payment-options")
      }

      // Check if KYC is submitted
      if (user.onboardingStatus.kyc !== "submitted") {
        toast({
          title: "KYC approval required",
          description: "You need to complete KYC verification before investing",
          variant: "destructive",
        })
        router.push("/investor/kyc")
      }

      // Check if NDA is signed
      if (user.onboardingStatus.nda !== "signed") {
        toast({
          title: "NDA signing required",
          description: "You need to sign the NDA before investing",
          variant: "destructive",
        })
        router.push("/investor/nda")
      }
    }
  }, [user, toast, router])

  // Calculate the first and final payment dates
  const calculatePaymentDates = () => {
    const today = new Date()
    const firstPaymentDate = new Date(2025, 2, 21) // March 21, 2025
    const finalPaymentDate = new Date(2026, 1, 21) // February 21, 2026

    return {
      firstPaymentDate,
      finalPaymentDate,
    }
  }

  const { firstPaymentDate, finalPaymentDate } = calculatePaymentDates()

  const calculateMonthlyPayment = () => {
    if (paymentPlan === "full") return investmentAmount
    // For installment plan, divide by 12 and round to 2 decimal places
    return Math.round((investmentAmount / 12) * 100) / 100
  }

  const handleCompletePayment = () => {
    if (paymentPlan === "installment" && !paymentAuthorized) {
      toast({
        title: "Authorization required",
        description: "You must authorize the automatic payments to proceed",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // In a real app, this would process the payment
    setTimeout(() => {
      if (paymentMethod === "bankTransfer") {
        toast({
          title: "Investment completed",
          description:
            "Your investment has been processed successfully. We will verify the transaction shortly and notify you via email once it's confirmed.",
        })
      } else {
        toast({
          title: "Investment completed",
          description: "Your investment has been processed successfully",
        })
      }

      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push("/investor/dashboard")
      }, 2000)

      setIsSubmitting(false)
    }, 1500)
  }

  // If contracts are not signed, show a warning card
  if (user?.onboardingStatus.contract !== "signed") {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Complete Your Investment</h2>
        </div>

        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="bg-red-50 dark:bg-red-950/30">
            <CardTitle className="flex items-center text-red-800 dark:text-red-400">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Contract Signing Required
            </CardTitle>
            <CardDescription>You need to sign all contracts before you can complete your investment</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-muted-foreground">
              Before you can complete your investment, you need to sign the SAFE agreement. Please complete the contract
              signing process to proceed.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/investor/project")}>
              Back to Project
            </Button>
            <Link href="/investor/contracts">
              <Button>Sign Contracts</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // If payment option is not selected, redirect to payment options page
  if (!user?.paymentOption) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Complete Your Investment</h2>
        </div>

        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader className="bg-yellow-50 dark:bg-yellow-950/30">
            <CardTitle className="flex items-center text-yellow-800 dark:text-yellow-400">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Payment Option Required
            </CardTitle>
            <CardDescription>You need to select a payment option before completing your investment</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-muted-foreground">
              Before you can complete your investment, you need to select a payment option. Please select a payment
              option to proceed.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/investor/project")}>
              Back to Project
            </Button>
            <Link href="/investor/payment-options">
              <Button>Select Payment Option</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Complete Your Investment</h2>
      </div>

      {/* KYC submitted Banner */}
      <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-900 dark:text-green-400">
        <ShieldCheck className="h-4 w-4 mr-2" />
        <AlertDescription>
          Your identity has been verified and you are eligible to invest in this opportunity.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
          <CardDescription>Complete your investment by making a payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <PaymentSummary
              totalAmount={investmentAmount}
              paymentPlan={paymentPlan}
              monthlyAmount={calculateMonthlyPayment()}
              firstPaymentDate={firstPaymentDate}
              finalPaymentDate={finalPaymentDate}
              showDetails={true}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-base">Select Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              <div
                className={`flex items-center space-x-2 p-4 border rounded-md cursor-pointer transition-colors ${
                  paymentMethod === "creditCard" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
                onClick={() => setPaymentMethod("creditCard")}
              >
                <RadioGroupItem value="creditCard" id="creditCard" />
                <div className="grid gap-1.5">
                  <Label htmlFor="creditCard" className="font-medium cursor-pointer">
                    Credit Card
                  </Label>
                  <p className="text-sm text-muted-foreground">Pay securely using your credit or debit card</p>
                </div>
              </div>
              <div
                className={`flex items-center space-x-2 p-4 border rounded-md cursor-pointer transition-colors ${
                  paymentMethod === "bankTransfer" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
                onClick={() => setPaymentMethod("bankTransfer")}
              >
                <RadioGroupItem value="bankTransfer" id="bankTransfer" />
                <div className="grid gap-1.5">
                  <Label htmlFor="bankTransfer" className="font-medium cursor-pointer">
                    Bank Transfer
                  </Label>
                  <p className="text-sm text-muted-foreground">Make a direct bank transfer to our account</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {paymentPlan === "installment" && (
            <Alert className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/50 dark:border-amber-900 dark:text-amber-400">
              <InfoIcon className="h-4 w-4 mr-2" />
              <AlertDescription>
                By proceeding, you authorize HR Monster to automatically charge this payment method for your monthly
                installments of SGD {calculateMonthlyPayment().toLocaleString()} on the 21st of each month for the next
                12 months.
              </AlertDescription>
            </Alert>
          )}

          {paymentMethod === "creditCard" && (
            <CreditCardForm
              amount={investmentAmount}
              isInstallment={paymentPlan === "installment"}
              onPaymentComplete={() => {
                toast({
                  title: "Payment successful",
                  description: "Your payment has been processed successfully",
                })
                // In a real app, this would update the payment status
                setTimeout(() => {
                  router.push("/investor/dashboard")
                }, 1000)
              }}
            />
          )}

          {paymentMethod === "bankTransfer" && (
            <div className="space-y-4">
              {!receiptUploaded ? (
                <BankTransferUpload
                  investmentAmount={paymentPlan === "installment" ? calculateMonthlyPayment() : investmentAmount}
                  referenceNumber={`INV-${user?.id}`}
                  onUploadComplete={() => setReceiptUploaded(true)}
                />
              ) : (
                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Bank Transfer Receipt Uploaded</h3>
                  <p className="text-sm mb-2">Your receipt has been uploaded and is pending approval.</p>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">Bank Name:</span>
                      <span>First National Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Account Name:</span>
                      <span>HR Monster, Inc.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Account Number:</span>
                      <span>1234567890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Routing Number:</span>
                      <span>987654321</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Reference:</span>
                      <span>INV-{user?.id}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {paymentPlan === "installment" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="payment-authorization"
                checked={paymentAuthorized}
                onCheckedChange={(checked) => setPaymentAuthorized(checked === true)}
              />
              <label
                htmlFor="payment-authorization"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I authorize HR Monster to automatically charge my payment method for monthly installments
              </label>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between w-full">
          <Button
            variant="outline"
            onClick={() => router.push("/investor/contracts")}
            className="text-xs sm:text-sm w-full sm:w-auto"
          >
            Back to Contracts
          </Button>
          <Button
            onClick={handleCompletePayment}
            disabled={
              (paymentPlan === "installment" && !paymentAuthorized) ||
              (paymentMethod === "bankTransfer" && !receiptUploaded) ||
              isSubmitting
            }
            className="text-xs sm:text-sm w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <span className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
                Processing...
              </>
            ) : (
              "Complete Investment"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
