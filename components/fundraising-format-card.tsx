import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FundraisingFormatCard() {
  return (
    <Card className="sticky top-16 flex flex-col">
      <CardHeader className="border-b pb-4">
        <CardTitle>Fundraising Format</CardTitle>
        <CardDescription>Details about the investment structure</CardDescription>
      </CardHeader>

      {/* Scrollable content area */}
      <div className="overflow-y-auto custom-scrollbar max-h-[calc(100vh-300px)]">
        <CardContent className="space-y-4 pt-4">
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
            <p className="text-sm mb-2">
              A SAFE (Simple Agreement for Future Equity) is an investment instrument that provides rights to the
              investor for future equity in the company without determining a specific price per share at the time of
              the initial investment.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Valuation Cap</h4>
              <p className="text-base">$15,000,000</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Discount Rate</h4>
              <p className="text-base">20%</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Minimum Investment</h4>
              <p className="text-base">$25,000</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Pro-rata Rights</h4>
              <p className="text-base">Yes</p>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-medium mb-1">Conversion Events</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Equity Financing: Converts at the lower of the valuation cap or discount rate</li>
              <li>• Liquidity Event: Investor can choose to cash out or convert to equity</li>
              <li>• Dissolution Event: Investor receives investment back before common stock</li>
            </ul>
          </div>

          <div className="pt-2">
            <Link href="/investor/documents">
              <Button variant="outline" size="sm" className="w-full">
                View SAFE Agreement Template
              </Button>
            </Link>
          </div>

          {/* Additional content to demonstrate scrolling */}
          <div className="pt-4 mt-2 border-t">
            <h4 className="text-sm font-medium mb-2">Key Benefits</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5 mr-2">
                  <span className="text-xs text-green-600">✓</span>
                </div>
                <span>Simple structure with minimal legal complexity</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5 mr-2">
                  <span className="text-xs text-green-600">✓</span>
                </div>
                <span>Delayed valuation until a priced equity round</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5 mr-2">
                  <span className="text-xs text-green-600">✓</span>
                </div>
                <span>Protection through valuation cap and discount</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5 mr-2">
                  <span className="text-xs text-green-600">✓</span>
                </div>
                <span>No debt or maturity date</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-2 border-t">
            <h4 className="text-sm font-medium mb-2">Investor Protections</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Our SAFE agreement includes several investor protections:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 mr-2">
                  <span className="text-xs text-blue-600">→</span>
                </div>
                <span>Pro-rata rights to maintain ownership percentage in future rounds</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 mr-2">
                  <span className="text-xs text-blue-600">→</span>
                </div>
                <span>Information rights to receive quarterly financial updates</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 mr-2">
                  <span className="text-xs text-blue-600">→</span>
                </div>
                <span>Most Favored Nation (MFN) clause for future SAFE issuances</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-2 border-t">
            <h4 className="text-sm font-medium mb-2">Fundraising FAQ</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">What happens if there's no future financing round?</p>
                <p className="text-sm text-muted-foreground">
                  If there's no future financing round, the SAFE will convert upon a liquidity event (acquisition or
                  IPO) or dissolution event.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Can I sell my SAFE to another investor?</p>
                <p className="text-sm text-muted-foreground">
                  SAFEs are generally not transferable without the company's consent, except to affiliates or for estate
                  planning purposes.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">What rights do I have as a SAFE holder?</p>
                <p className="text-sm text-muted-foreground">
                  SAFE holders typically don't have voting rights or other stockholder rights until the SAFE converts to
                  equity.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Fixed footer with CTA button */}
      <div className="mt-auto border-t p-4 bg-card">
        <Link href="/investor/invest">
          <Button className="w-full">Invest Now</Button>
        </Link>
      </div>
    </Card>
  )
}

