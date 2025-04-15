"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PaymentOptionsPage() {
  const { user, updatePaymentOption } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [paymentOption, setPaymentOption] = useState<"full" | "installment">("full")
  const [investmentAmount, setInvestmentAmount] = useState(5000)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if NDA is signed
  if (user?.onboardingStatus.nda !== "signed") {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader className="bg-yellow-50 dark:bg-yellow-950/30">
            <CardTitle className="flex items-center text-yellow-800 dark:text-yellow-400">
              <AlertCircle className="mr-2 h-5 w-5" />
              NDA Signing Required
            </CardTitle>
            <CardDescription>You need to sign the NDA before selecting payment options</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Before you can select payment options, you need to complete the NDA signing process.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/investor/nda")}>Go to NDA Signing</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    if (paymentOption === "full") return investmentAmount
    // For installment plan, divide by 12 and round to 2 decimal places
    return Math.round((investmentAmount / 12) * 100) / 100
  }

  const handleContinue = async () => {
    if (investmentAmount < 5000) {
      toast({
        title: "Invalid amount",
        description: "Minimum investment amount is SGD 5,000",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Update user payment option
      await updatePaymentOption(paymentOption, investmentAmount)

      toast({
        title: "Payment option selected",
        description: "Your payment option has been saved",
      })

      // Redirect to contracts page
      router.push("/investor/contracts")
    } catch (error) {
      console.error("Error saving payment option:", error)
      toast({
        title: "Error",
        description: "There was an error saving your payment option",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Select Payment Option</h2>
      </div>

      <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-400">
        <Info className="h-4 w-4 mr-2" />
        <AlertDescription>
          Please select your preferred payment option for your investment in HR Monster.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Investment Details</CardTitle>
          <CardDescription>Specify your investment amount and payment plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="investment-amount">SAFE Investment Amount (Minimum SGD 5,000)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">SGD</span>
              <Input
                id="investment-amount"
                type="number"
                className="pl-14"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                min={5000}
                step={1000}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="payment-plan">Payment Plan</Label>
            <RadioGroup
              value={paymentOption}
              onValueChange={(value: "full" | "installment") => setPaymentOption(value)}
              className="space-y-3"
            >
              <div
                className={`flex items-center space-x-2 p-4 border rounded-md cursor-pointer transition-colors ${
                  paymentOption === "full" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
                onClick={() => setPaymentOption("full")}
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
                  paymentOption === "installment" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
                onClick={() => setPaymentOption("installment")}
              >
                <RadioGroupItem value="installment" id="installment-payment" />
                <div className="grid gap-1">
                  <Label htmlFor="installment-payment" className="font-medium cursor-pointer">
                    12-Month Installment Plan
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Spread your investment over 12 monthly payments of SGD {calculateMonthlyPayment().toLocaleString()}{" "}
                    each
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Investment Summary</h3>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-muted-foreground">Total SAFE Investment:</div>
              <div className="text-right font-medium">SGD {investmentAmount.toLocaleString()}</div>

              {paymentOption === "installment" && (
                <>
                  <div className="text-muted-foreground">Payment Structure:</div>
                  <div className="text-right">12 monthly payments</div>

                  <div className="text-muted-foreground">Monthly Payment Amount:</div>
                  <div className="text-right font-medium">SGD {calculateMonthlyPayment().toLocaleString()}</div>

                  <div className="text-muted-foreground">First Payment Date:</div>
                  <div className="text-right">March 21, 2025</div>

                  <div className="text-muted-foreground">Final Payment Date:</div>
                  <div className="text-right">February 21, 2026</div>
                </>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/investor/project")}>
            Back to Project
          </Button>
          <Button onClick={handleContinue} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
                Processing...
              </>
            ) : (
              "Continue to Contract"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
