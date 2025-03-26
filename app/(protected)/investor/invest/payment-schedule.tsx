"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, AlertCircle, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentScheduleProps {
  totalAmount: number
  monthlyPayment: number
  remainingPayments: number
  nextPaymentDate: string
  paymentHistory: Array<{
    amount: number
    date: string
    status: "completed" | "pending" | "upcoming"
  }>
}

export function PaymentSchedule({
  totalAmount,
  monthlyPayment,
  remainingPayments,
  nextPaymentDate,
  paymentHistory,
}: PaymentScheduleProps) {
  const { toast } = useToast()

  const handleMakePayment = () => {
    toast({
      title: "Payment processing",
      description: "Your payment is being processed. You will receive a confirmation shortly.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="mr-1 h-3 w-3" />
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-800 dark:text-yellow-300">
            <AlertCircle className="mr-1 h-3 w-3" />
            Due Now
          </Badge>
        )
      default:
        return <Badge variant="outline">Upcoming</Badge>
    }
  }

  const paymentProgress = ((12 - remainingPayments) / 12) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Plan</CardTitle>
        <CardDescription>Your 12-month installment payment schedule</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Investment</p>
            <p className="text-2xl font-bold">${totalAmount.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Monthly Payment</p>
            <p className="text-2xl font-bold">${monthlyPayment.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Payment Progress:</span>
            <span>{12 - remainingPayments} of 12 payments</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${paymentProgress}%` }}></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">First Payment: March 21, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Final Payment: February 21, 2026</span>
          </div>
        </div>

        {remainingPayments > 0 && (
          <div className="p-4 border rounded-md bg-muted/50">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Next Payment Due</h4>
                <p className="text-sm text-muted-foreground">{nextPaymentDate}</p>
                <p className="font-medium mt-1">${monthlyPayment.toLocaleString()}</p>
              </div>
              <Button onClick={handleMakePayment}>Make Payment</Button>
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          <h4 className="font-medium">Payment History</h4>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted text-xs">
                <tr>
                  <th className="px-4 py-2 text-left">Payment Date</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paymentHistory.map((payment, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm">{payment.date}</td>
                    <td className="px-4 py-2 text-sm text-right">${payment.amount.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">{getStatusBadge(payment.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

