"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InstallmentPlanProps {
  totalAmount: number
  monthlyAmount: number
  totalInstallments: number
  remainingInstallments: number
  payments: Array<{
    date: string
    amount: number
    status: "paid" | "due" | "upcoming"
    receiptUrl?: string
  }>
}

export function InstallmentPlan({
  totalAmount,
  monthlyAmount,
  totalInstallments,
  remainingInstallments,
  payments,
}: InstallmentPlanProps) {
  const { toast } = useToast()

  const handleDownloadReceipt = (url: string) => {
    toast({
      title: "Downloading receipt",
      description: "The receipt is being downloaded",
    })
  }

  const completedPercentage = ((totalInstallments - remainingInstallments) / totalInstallments) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Installment Payment Plan</CardTitle>
        <CardDescription>
          {remainingInstallments > 0
            ? `${totalInstallments - remainingInstallments} of ${totalInstallments} payments completed`
            : "All payments completed"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Investment</p>
            <p className="text-xl font-bold">${totalAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Monthly Payment</p>
            <p className="text-xl font-bold">${monthlyAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Payment Progress</span>
            <span>{completedPercentage.toFixed(0)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${completedPercentage}%` }}></div>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-sm font-medium text-left">Payment Date</th>
                <th className="px-4 py-2 text-sm font-medium text-right">Amount</th>
                <th className="px-4 py-2 text-sm font-medium text-center">Status</th>
                <th className="px-4 py-2 text-sm font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((payment, index) => (
                <tr key={index} className={payment.status === "due" ? "bg-yellow-50/50 dark:bg-yellow-950/20" : ""}>
                  <td className="px-4 py-2 text-sm">{payment.date}</td>
                  <td className="px-4 py-2 text-sm text-right">${payment.amount.toLocaleString()}</td>
                  <td className="px-4 py-2 text-center">
                    {payment.status === "paid" && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Paid
                      </Badge>
                    )}
                    {payment.status === "due" && (
                      <Badge variant="outline" className="text-yellow-800 dark:text-yellow-300">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Due
                      </Badge>
                    )}
                    {payment.status === "upcoming" && <Badge variant="outline">Upcoming</Badge>}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {payment.status === "paid" && payment.receiptUrl && (
                      <Button variant="ghost" size="sm" onClick={() => handleDownloadReceipt(payment.receiptUrl!)}>
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download receipt</span>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

