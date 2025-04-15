import { CalendarIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface PaymentSummaryProps {
  totalAmount: number
  paymentPlan: string
  monthlyAmount: number
  firstPaymentDate: Date
  finalPaymentDate: Date
  showDetails?: boolean
}

export function PaymentSummary({
  totalAmount,
  paymentPlan,
  monthlyAmount,
  firstPaymentDate,
  finalPaymentDate,
  showDetails = false,
}: PaymentSummaryProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Investment Summary</h3>
        <div className="grid grid-cols-2 gap-y-2">
          <div className="text-muted-foreground">Total SAFE Investment:</div>
          <div className="text-right font-medium">${totalAmount.toLocaleString()}</div>

          {paymentPlan === "installment" && (
            <>
              <div className="text-muted-foreground">Payment Structure:</div>
              <div className="text-right">12 monthly payments</div>

              <div className="text-muted-foreground">Monthly Payment Amount:</div>
              <div className="text-right font-medium">${monthlyAmount.toLocaleString()}</div>

              <div className="text-muted-foreground">First Payment Date:</div>
              <div className="text-right">{formatDate(firstPaymentDate)}</div>

              <div className="text-muted-foreground">Final Payment Date:</div>
              <div className="text-right">{formatDate(finalPaymentDate)}</div>
            </>
          )}
        </div>
      </div>

      {paymentPlan === "installment" && (
        <div className="space-y-4">
          {showDetails && (
            <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-900 dark:text-blue-400">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <div className="space-y-2">
                <AlertTitle>Payment Schedule Information</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">By selecting the 12-month payment plan, you agree to:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Make 12 equal monthly payments of ${monthlyAmount.toLocaleString()}</li>
                    <li>Automatic payments will be processed on the 21st of each month</li>
                    <li>
                      Payments will occur from {formatDate(firstPaymentDate)} to {formatDate(finalPaymentDate)}
                    </li>
                    <li>Your SAFE agreement becomes effective after all payments are completed</li>
                    <li>Early payment options are available with no additional fees</li>
                  </ul>
                </AlertDescription>
              </div>
            </Alert>
          )}
        </div>
      )}
    </div>
  )
}
