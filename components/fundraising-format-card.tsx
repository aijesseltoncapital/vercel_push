import { CardContent } from "@/components/ui/card"
import { CardDescription } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
export function FundraisingFormatCard() {
  return (
    <Card className="flex flex-col text-sm border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Fundraising Format</CardTitle>
        <CardDescription>Details about the investment structure</CardDescription>
      </CardHeader>

      {/* Content area */}
      <CardContent className="space-y-6 px-0">
        <div className="flex items-center gap-3 pb-4 border-b">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-primary"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium">SAFE Note</h3>
            <p className="text-sm text-muted-foreground">Simple Agreement for Future Equity</p>
          </div>
        </div>

        <div>
          <p className="text-sm mb-4">
            A SAFE (Simple Agreement for Future Equity) is an investment instrument that provides rights to the investor
            for future equity in the company without determining a specific price per share at the time of the initial
            investment.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h4 className="text-sm font-medium">Round</h4>
            <p className="text-base">Pre-seed</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Valuation</h4>
            <p className="text-base">SGD 5,000,000</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Funding Amount</h4>
            <p className="text-base">SGD 500,000</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Deadline</h4>
            <p className="text-base">Rolling Close</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Instrument</h4>
            <p className="text-base">SAFE</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Minimum Ticket</h4>
            <p className="text-base">SGD 5,000</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Discount Rate</h4>
            <p className="text-base">N/A</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Pro-rata Rights</h4>
            <p className="text-base">N/A</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
