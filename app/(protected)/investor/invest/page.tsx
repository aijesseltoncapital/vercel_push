"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { BankTransferUpload } from "./bank-transfer-upload"
import { CreditCardForm } from "./credit-card-form"
import { PaymentSummary } from "./payment-summary"
import { InfoIcon, AlertTriangle, ShieldCheck } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function InvestPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [investmentAmount, setInvestmentAmount] = useState(25000)
  const [paymentMethod, setPaymentMethod] = useState("creditCard")
  const [paymentPlan, setPaymentPlan] = useState("full")
  const [agreementSigned, setAgreementSigned] = useState(false)
  const [receiptUploaded, setReceiptUploaded] = useState(false)
  const [paymentAuthorized, setPaymentAuthorized] = useState(false)

  // Check KYC status on component mount
  useEffect(() => {
    if (user && user.kycStatus !== "approved") {
      toast({
        title: "KYC approval required",
        description: "You need to complete KYC verification before investing",
        variant: "destructive",
      })
    }
  }, [user, toast])

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
    // For installment plan, use the fixed amount from the image
    return 2083.33
  }

  const handleContinue = () => {
    // Prevent proceeding if KYC is not approved
    if (user?.kycStatus !== "approved") {
      toast({
        title: "KYC approval required",
        description: "You need to complete KYC verification before investing",
        variant: "destructive",
      })
      return
    }

    if (step === 1) {
      if (investmentAmount < 25000) {
        toast({
          title: "Invalid amount",
          description: "Minimum investment amount is $25,000",
          variant: "destructive",
        })
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!agreementSigned) {
        toast({
          title: "Agreement required",
          description: "You must sign the SAFE agreement to proceed",
          variant: "destructive",
        })
        return
      }
      setStep(3)
    } else if (step === 3) {
      if (paymentPlan === "installment" && !paymentAuthorized) {
        toast({
          title: "Authorization required",
          description: "You must authorize the automatic payments to proceed",
          variant: "destructive",
        })
        return
      }

      // In a real app, this would process the payment
      toast({
        title: "Investment submitted",
        description: "Your investment has been submitted successfully",
      })
      // Redirect to project page after a delay
      setTimeout(() => {
        window.location.href = "/investor/project"
      }, 2000)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // If KYC is not approved, show a warning card
  if (user?.kycStatus !== "approved") {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Invest in Tech Startup XYZ</h2>
        </div>

        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="bg-red-50 dark:bg-red-950/30">
            <CardTitle className="flex items-center text-red-800 dark:text-red-400">
              <AlertTriangle className="mr-2 h-5 w-5" />
              KYC Verification Required
            </CardTitle>
            <CardDescription>
              You need to complete KYC verification before you can invest in this opportunity
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-muted-foreground">
              {user?.kycStatus === "not_submitted" && (
                <>
                  You haven't submitted your KYC documents yet. Please complete the verification process to proceed with
                  your investment.
                </>
              )}
              {user?.kycStatus === "pending" && (
                <>
                  Your KYC documents are currently under review. Please wait for approval before proceeding with your
                  investment.
                </>
              )}
              {user?.kycStatus === "rejected" && (
                <>Your KYC verification was rejected. Please review the feedback and resubmit your documents.</>
              )}
            </p>

            <Alert className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/50 dark:border-amber-900 dark:text-amber-400">
              <InfoIcon className="h-4 w-4 mr-2" />
              <AlertDescription>
                KYC (Know Your Customer) verification is required by regulations to prevent fraud and ensure compliance
                with securities laws.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/investor/project")}>
              Back to Project
            </Button>
            <Link href="/investor/kyc">
              <Button>
                {user?.kycStatus === "not_submitted" && "Submit KYC Documents"}
                {user?.kycStatus === "pending" && "Check KYC Status"}
                {user?.kycStatus === "rejected" && "Resubmit KYC Documents"}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Invest in Tech Startup XYZ</h2>
      </div>

      {/* KYC Approved Banner */}
      <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-900 dark:text-green-400">
        <ShieldCheck className="h-4 w-4 mr-2" />
        <AlertTitle>KYC Verification Approved</AlertTitle>
        <AlertDescription>
          Your identity has been verified and you are eligible to invest in this opportunity.
        </AlertDescription>
      </Alert>

      <div className="flex items-center space-x-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? "bg-primary text-primary-foreground" : "border border-input"}`}
        >
          1
        </div>
        <Separator className="w-8" />
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? "bg-primary text-primary-foreground" : "border border-input"}`}
        >
          2
        </div>
        <Separator className="w-8" />
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? "bg-primary text-primary-foreground" : "border border-input"}`}
        >
          3
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
            <CardDescription>Specify your investment amount</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="investment-amount">SAFE Investment Amount (Minimum $25,000)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="investment-amount"
                  type="number"
                  className="pl-8"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  min={25000}
                  step={1000}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="payment-plan">Payment Plan</Label>
              <RadioGroup value={paymentPlan} onValueChange={setPaymentPlan} className="space-y-3">
                <div
                  className={`flex items-center space-x-2 p-4 border rounded-md cursor-pointer transition-colors ${
                    paymentPlan === "full" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setPaymentPlan("full")}
                >
                  <RadioGroupItem value="full" id="full-payment" />
                  <div className="grid gap-1">
                    <Label htmlFor="full-payment" className="font-medium cursor-pointer">
                      Full Payment
                    </Label>
                    <p className="text-sm text-muted-foreground">Pay the entire investment amount at once</p>
                  </div>
                </div>
                <div
                  className={`flex items-center space-x-2 p-4 border rounded-md cursor-pointer transition-colors ${
                    paymentPlan === "installment" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setPaymentPlan("installment")}
                >
                  <RadioGroupItem value="installment" id="installment-payment" />
                  <div className="grid gap-1">
                    <Label htmlFor="installment-payment" className="font-medium cursor-pointer">
                      12-Month Installment Plan
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Spread your investment over 12 monthly payments of ${calculateMonthlyPayment().toLocaleString()}{" "}
                      each
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <PaymentSummary
              totalAmount={investmentAmount}
              paymentPlan={paymentPlan}
              monthlyAmount={calculateMonthlyPayment()}
              firstPaymentDate={firstPaymentDate}
              finalPaymentDate={finalPaymentDate}
              showDetails={paymentPlan === "installment"} // Always show details when installment is selected
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/investor/project")}>
              Cancel
            </Button>
            <Button onClick={handleContinue}>Continue</Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Sign SAFE Agreement</CardTitle>
            <CardDescription>Review and sign the Simple Agreement for Future Equity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border rounded-md p-4 h-96 overflow-y-auto bg-muted/30">
              <h3 className="font-bold text-center mb-4">SIMPLE AGREEMENT FOR FUTURE EQUITY</h3>
              <p className="mb-2">
                THIS CERTIFIES THAT in exchange for the payment by [INVESTOR NAME] (the "Investor") of $
                {investmentAmount.toLocaleString()} (the "Purchase Amount") on or about [DATE], Tech Startup XYZ, Inc.,
                a Delaware corporation (the "Company"), issues to the Investor the right to certain shares of the
                Company's Capital Stock, subject to the terms set forth below.
              </p>

              <p className="mb-2">1. Events</p>
              <p className="mb-2 pl-4">
                (a) Equity Financing. If there is an Equity Financing before the termination of this Safe, on the
                initial closing of such Equity Financing, this Safe will automatically convert into the number of shares
                of Safe Preferred Stock equal to the Purchase Amount divided by the Conversion Price.
              </p>
              <p className="mb-2 pl-4">
                (b) Liquidity Event. If there is a Liquidity Event before the termination of this Safe, this Safe will
                automatically be entitled to receive a portion of Proceeds, due and payable to the Investor immediately
                prior to, or concurrent with, the consummation of such Liquidity Event.
              </p>

              <p className="mb-2">2. Definitions</p>
              <p className="mb-2 pl-4">
                "Conversion Price" means the either: (1) the Safe Price or (2) the Discount Price, whichever calculation
                results in a greater number of shares of Safe Preferred Stock.
              </p>
              <p className="mb-2 pl-4">
                "Discount Price" means the price per share of the Standard Preferred Stock sold in the Equity Financing
                multiplied by the Discount Rate.
              </p>
              <p className="mb-2 pl-4">"Discount Rate" means 80%.</p>
              <p className="mb-2 pl-4">"Valuation Cap" means $15,000,000.</p>

              <p className="mb-2">3. Company Representations</p>
              <p className="mb-2 pl-4">
                (a) The Company is a corporation duly organized, validly existing and in good standing under the laws of
                its state of incorporation, and has the power and authority to own, lease and operate its properties and
                carry on its business as now conducted.
              </p>
              <p className="mb-2 pl-4">
                (b) The execution, delivery and performance by the Company of this Safe is within the power of the
                Company and has been duly authorized by all necessary actions on the part of the Company.
              </p>

              <p className="mb-2">4. Investor Representations</p>
              <p className="mb-2 pl-4">
                (a) The Investor has full legal capacity, power and authority to execute and deliver this Safe and to
                perform its obligations hereunder.
              </p>
              <p className="mb-2 pl-4">
                (b) The Investor is an accredited investor as defined in Rule 501(a) of Regulation D under the
                Securities Act, and acknowledges and agrees that if not an accredited investor at the time of an Equity
                Financing, the Company may void this Safe and return the Purchase Amount.
              </p>

              <p className="mt-4 text-center">[Additional terms and conditions...]</p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreement"
                checked={agreementSigned}
                onCheckedChange={(checked) => setAgreementSigned(checked === true)}
              />
              <label
                htmlFor="agreement"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I have read and agree to the terms of the SAFE agreement
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleContinue}>Continue</Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
            <CardDescription>Complete your investment by making a payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                  By proceeding, you authorize Tech Startup XYZ to automatically charge this payment method for your
                  monthly installments of ${calculateMonthlyPayment().toLocaleString()} on the 21st of each month for
                  the next 12 months.
                </AlertDescription>
              </Alert>
            )}

            {paymentMethod === "creditCard" && (
              <CreditCardForm
                initialAmount={investmentAmount}
                isInstallment={paymentPlan === "installment"}
                onPaymentComplete={(paymentDetails) => {
                  toast({
                    title: "Payment successful",
                    description: `First payment of $${paymentDetails.monthlyPayment.toLocaleString()} processed`,
                  })
                  // Optionally send payment details to your backend for further processing
                  setTimeout(() => {
                    window.location.href = "/investor/project"
                  }, 1000)
                }}
                onPaymentError={(errorMessage) => {
                  toast({
                    title: "Payment Failed",
                    description: errorMessage,
                    variant: "destructive"
                  })
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
                        <span>Tech Startup XYZ, Inc.</span>
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
                  I authorize Tech Startup XYZ to automatically charge my payment method for monthly installments
                </label>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleContinue}>Complete Investment</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

