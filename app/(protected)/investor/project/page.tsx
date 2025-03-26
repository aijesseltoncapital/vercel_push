"use client"

import { useAuth } from "@/lib/auth-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PaymentSchedule } from "../invest/payment-schedule"
import Link from "next/link"
import { FundraisingFormatCard } from "@/components/fundraising-format-card"
import { KycStatusIndicator } from "@/components/kyc-status-indicator"
import { DocumentViewer } from "@/components/document-viewer"

export default function ProjectPage() {
  const { user } = useAuth()

  // Mock data for the investor dashboard
  const investmentData = {
    projectName: "Tech Startup XYZ",
    invested: 0,
    documents: [],
    status: user?.investmentStatus || "not_started",
    projectProgress: 45, // percentage of funding goal reached
    totalRaised: 450000,
    goal: 1000000,
  }

  // Mock data for project documents
  const projectDocuments = [
    {
      id: 1,
      name: "Pitch Deck",
      type: "presentation",
      description: "Company overview and investment opportunity",
      uploadDate: "2023-05-01",
      size: "3.5 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
    {
      id: 2,
      name: "Financial Projections",
      type: "spreadsheet",
      description: "3-year financial forecast",
      uploadDate: "2023-05-02",
      size: "1.2 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
    {
      id: 4,
      name: "Team Bios",
      type: "document",
      description: "Leadership team backgrounds and experience",
      uploadDate: "2023-05-04",
      size: "0.8 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
    {
      id: 5,
      name: "Market Analysis",
      type: "document",
      description: "Detailed market research and competitive analysis",
      uploadDate: "2023-05-05",
      size: "4.2 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
  ]

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 container mx-auto max-w-7xl">
      {/* Project title and invest button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Tech Startup XYZ</h2>
        <Link href="/investor/invest">
          <Button>Invest Now</Button>
        </Link>
      </div>

      {/* Top row with three cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Ready to Invest card */}
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Ready to Invest?</CardTitle>
            <CardDescription>Learn about the opportunity and start your investment journey</CardDescription>
          </CardHeader>
          <CardContent className="pb-4 flex-grow">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">KYC Status:</p>
                <KycStatusIndicator status={user?.kycStatus || "not_submitted"} />
              </div>
              <p className="text-muted-foreground">
                {user?.kycStatus === "approved"
                  ? "Your KYC verification is complete. You can now invest in this opportunity."
                  : user?.kycStatus === "pending"
                    ? "Your KYC verification is pending. You'll be notified once it's approved."
                    : user?.kycStatus === "rejected"
                      ? "Your KYC verification was rejected. Please visit the KYC page to resubmit."
                      : "You need to complete KYC verification before investing. Please visit the KYC page to get started."}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            {user?.kycStatus === "approved" ? (
              <Link href="/investor/invest">
                <Button variant="outline">Start Investing</Button>
              </Link>
            ) : (
              <Link href="/investor/kyc">
                <Button variant="outline">
                  {user?.kycStatus === "not_submitted" && "Complete KYC"}
                  {user?.kycStatus === "pending" && "Check KYC Status"}
                  {user?.kycStatus === "rejected" && "Resubmit KYC"}
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>

        {/* Fundraising Progress card */}
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Fundraising Progress</CardTitle>
            <CardDescription>Current status of the funding round</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Raised</span>
                <span className="text-sm font-medium">
                  ${investmentData.totalRaised.toLocaleString()} / ${investmentData.goal.toLocaleString()}
                </span>
              </div>
              <Progress value={investmentData.projectProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Important Dates card */}
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Important Dates</CardTitle>
            <CardDescription>Key dates for this investment round</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Round Opens</span>
                <span className="text-sm text-muted-foreground">May 1, 2023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Round Closes</span>
                <span className="text-sm text-muted-foreground">July 31, 2023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Expected Close Date</span>
                <span className="text-sm text-muted-foreground">August 15, 2023</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content area with tabs and sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-240px)]">
        {/* Main content - 8 columns */}
        <div className="lg:col-span-8 w-full flex flex-col">
          <Tabs defaultValue="presentation" className="w-full space-y-6 flex flex-col">
            <div className="sticky top-16 z-30 bg-background pb-1 pt-2">
              <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-1 bg-muted/30">
                <TabsTrigger value="presentation" className="py-2 px-3 text-center">
                  Presentation
                </TabsTrigger>
                <TabsTrigger value="overview" className="py-2 px-3 text-center">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="team" className="py-2 px-3 text-center">
                  Team
                </TabsTrigger>
                <TabsTrigger value="financials" className="py-2 px-3 text-center">
                  Financials
                </TabsTrigger>
                <TabsTrigger value="terms" className="py-2 px-3 text-center">
                  Terms
                </TabsTrigger>
                <TabsTrigger value="updates" className="py-2 px-3 text-center">
                  Updates
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="presentation"
              className="space-y-4 w-full overflow-y-auto tabs-content-scrollable"
              style={{ maxHeight: "calc(100vh - 180px)" }}
            >
              <Card className="w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Tech Startup XYZ Presentation</CardTitle>
                  <CardDescription>Investor deck and company overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Slide 1: Introduction */}
                  <div className="border rounded-lg p-6 bg-muted/30">
                    <h3 className="text-xl font-semibold text-center mb-4">Transforming Business Intelligence</h3>
                    <p className="text-center mb-4">
                      We're building the next generation of AI-powered analytics to help businesses make better
                      decisions.
                    </p>
                    <div className="flex justify-center">
                      <div className="w-3/4 h-48 bg-muted rounded-lg flex items-center justify-center">
                        [Company Logo & Vision Statement]
                      </div>
                    </div>
                  </div>

                  {/* Slide 2: The Problem */}
                  <div className="border rounded-lg p-6 bg-muted/30">
                    <h3 className="text-xl font-semibold text-center mb-4">The Problem</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <p>
                          <strong>Data Overload:</strong> Companies are drowning in data but starving for insights.
                        </p>
                        <p>
                          <strong>Siloed Systems:</strong> Existing solutions are fragmented and don't communicate with
                          each other.
                        </p>
                        <p>
                          <strong>Technical Barriers:</strong> Current tools require specialized knowledge to operate
                          effectively.
                        </p>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
                          [Problem Visualization]
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slide 3: Our Solution */}
                  <div className="border rounded-lg p-6 bg-muted/30">
                    <h3 className="text-xl font-semibold text-center mb-4">Our Solution</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-center">
                        <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
                          [Product Screenshot]
                        </div>
                      </div>
                      <div className="space-y-4">
                        <p>
                          <strong>Unified Platform:</strong> A single source of truth for all business data.
                        </p>
                        <p>
                          <strong>AI-Powered Insights:</strong> Automated analysis that surfaces actionable
                          intelligence.
                        </p>
                        <p>
                          <strong>Intuitive Interface:</strong> Designed for business users, not just data scientists.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Slide 4: Market Opportunity */}
                  <div className="border rounded-lg p-6 bg-muted/30">
                    <h3 className="text-xl font-semibold text-center mb-4">Market Opportunity</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <p>
                          <strong>$43B</strong> global business intelligence market by 2028
                        </p>
                        <p>
                          <strong>8.7%</strong> CAGR in the analytics sector
                        </p>
                        <p>
                          <strong>$5.2B</strong> addressable market for our specific solution
                        </p>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
                          [Market Growth Chart]
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slide 5: Competitive Advantage */}
                  <div className="border rounded-lg p-6 bg-muted/30">
                    <h3 className="text-xl font-semibold text-center mb-4">Our Competitive Advantage</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded p-4 text-center">
                        <h4 className="font-medium mb-2">Proprietary AI</h4>
                        <p className="text-sm text-muted-foreground">
                          Our algorithms deliver 3x more accurate insights than competitors
                        </p>
                      </div>
                      <div className="border rounded p-4 text-center">
                        <h4 className="font-medium mb-2">Integration Speed</h4>
                        <p className="text-sm text-muted-foreground">
                          Deploy in days, not months, with our no-code connectors
                        </p>
                      </div>
                      <div className="border rounded p-4 text-center">
                        <h4 className="font-medium mb-2">Scalable Architecture</h4>
                        <p className="text-sm text-muted-foreground">
                          Built to handle enterprise-scale data with minimal overhead
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Slide 6: Traction */}
                  <div className="border rounded-lg p-6 bg-muted/30">
                    <h3 className="text-xl font-semibold text-center mb-4">Our Traction</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">42</div>
                        <div className="text-sm text-muted-foreground">Enterprise Customers</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">$1.2M</div>
                        <div className="text-sm text-muted-foreground">Annual Recurring Revenue</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">120%</div>
                        <div className="text-sm text-muted-foreground">YoY Growth</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">87%</div>
                        <div className="text-sm text-muted-foreground">Customer Retention</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="overview"
              className="space-y-4 w-full overflow-y-auto tabs-content-scrollable"
              style={{ maxHeight: "calc(100vh - 180px)" }}
            >
              {/* Existing overview content */}
              <Card className="w-full">
                <CardHeader className="pb-4">
                  <CardTitle>Tech Startup XYZ</CardTitle>
                  <CardDescription>Revolutionizing the future of technology</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">About the Company</h3>
                    <p className="text-muted-foreground mt-2">
                      Tech Startup XYZ is developing cutting-edge technology that will transform how businesses operate.
                      Our platform leverages artificial intelligence and machine learning to provide unprecedented
                      insights and automation capabilities.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">The Problem</h3>
                    <p className="text-muted-foreground mt-2">
                      Businesses today struggle with inefficient processes and lack of actionable data. Current
                      solutions are fragmented, expensive, and difficult to implement, leaving many companies unable to
                      fully leverage their data and optimize operations.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Our Solution</h3>
                    <p className="text-muted-foreground mt-2">
                      Our platform provides an integrated solution that seamlessly connects with existing systems,
                      automatically analyzes data, and provides actionable insights. With our proprietary AI algorithms,
                      businesses can automate routine tasks, identify optimization opportunities, and make data-driven
                      decisions.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Market Opportunity</h3>
                    <p className="text-muted-foreground mt-2">
                      The global market for business intelligence and analytics software is projected to reach $43.03
                      billion by 2028, growing at a CAGR of 8.7%. Our addressable market within this space is estimated
                      at $5.2 billion, providing significant room for growth and expansion.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Add Document Viewer to Overview tab */}
              <DocumentViewer
                documents={projectDocuments}
                title="Project Documents"
                description="Access all project-related documents and materials"
              />
            </TabsContent>

            <TabsContent
              value="team"
              className="space-y-4 w-full overflow-y-auto tabs-content-scrollable"
              style={{ maxHeight: "calc(100vh - 180px)" }}
            >
              {/* Existing team content */}
              <Card className="w-full">
                <CardHeader className="pb-4">
                  <CardTitle>Leadership Team</CardTitle>
                  <CardDescription>Meet the visionaries behind Tech Startup XYZ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-2xl font-bold">JD</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Jane Doe</h3>
                      <p className="text-sm text-muted-foreground">CEO & Co-Founder</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Former VP of Product at Tech Giant, with 15+ years of experience in the industry. MBA from
                        Stanford University.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-2xl font-bold">JS</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">John Smith</h3>
                      <p className="text-sm text-muted-foreground">CTO & Co-Founder</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Previously led engineering teams at Top Tech Co. Expert in AI and machine learning. PhD in
                        Computer Science from MIT.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-2xl font-bold">AJ</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Alex Johnson</h3>
                      <p className="text-sm text-muted-foreground">CFO</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        20+ years of financial experience in tech startups and venture capital. Previously CFO at
                        Successful Startup Inc. and Partner at VC Firm.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="financials"
              className="space-y-4 w-full overflow-y-auto tabs-content-scrollable"
              style={{ maxHeight: "calc(100vh - 180px)" }}
            >
              {/* Financial projections content only */}
              <Card className="w-full">
                <CardHeader className="pb-4">
                  <CardTitle>Financial Projections</CardTitle>
                  <CardDescription>
                    3-year financial outlook based on current traction and market analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Financial Projections
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      Our 3-year financial projections based on current traction and market analysis.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Revenue & Growth Projections */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Revenue Projections</h4>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="text-left p-2 text-sm font-medium">Metric</th>
                                <th className="text-right p-2 text-sm font-medium">Year 1</th>
                                <th className="text-right p-2 text-sm font-medium">Year 2</th>
                                <th className="text-right p-2 text-sm font-medium">Year 3</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              <tr>
                                <td className="p-2 text-sm">Revenue</td>
                                <td className="p-2 text-sm text-right">$2.5M</td>
                                <td className="p-2 text-sm text-right">$6.8M</td>
                                <td className="p-2 text-sm text-right">$15.2M</td>
                              </tr>
                              <tr>
                                <td className="p-2 text-sm">YoY Growth</td>
                                <td className="p-2 text-sm text-right">-</td>
                                <td className="p-2 text-sm text-right">172%</td>
                                <td className="p-2 text-sm text-right">124%</td>
                              </tr>
                              <tr>
                                <td className="p-2 text-sm">Gross Margin</td>
                                <td className="p-2 text-sm text-right">68%</td>
                                <td className="p-2 text-sm text-right">72%</td>
                                <td className="p-2 text-sm text-right">75%</td>
                              </tr>
                              <tr>
                                <td className="p-2 text-sm">EBITDA</td>
                                <td className="p-2 text-sm text-right">-$1.8M</td>
                                <td className="p-2 text-sm text-right">-$0.5M</td>
                                <td className="p-2 text-sm text-right">$3.2M</td>
                              </tr>
                              <tr>
                                <td className="p-2 text-sm">EBITDA Margin</td>
                                <td className="p-2 text-sm text-right">-72%</td>
                                <td className="p-2 text-sm text-right">-7%</td>
                                <td className="p-2 text-sm text-right">21%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="h-48 bg-muted/50 rounded-lg mt-4 flex items-center justify-center">
                          [Revenue Growth Chart]
                        </div>
                      </div>

                      {/* Operational Projections */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Operational Projections</h4>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="text-left p-2 text-sm font-medium">Metric</th>
                                <th className="text-right p-2 text-sm font-medium">Year 1</th>
                                <th className="text-right p-2 text-sm font-medium">Year 2</th>
                                <th className="text-right p-2 text-sm font-medium">Year 3</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              <tr>
                                <td className="p-2 text-sm">Customers</td>
                                <td className="p-2 text-sm text-right">85</td>
                                <td className="p-2 text-sm text-right">210</td>
                                <td className="p-2 text-sm text-right">450</td>
                              </tr>
                              <tr>
                                <td className="p-2 text-sm">ARR per Customer</td>
                                <td className="p-2 text-sm text-right">$29,400</td>
                                <td className="p-2 text-sm text-right">$32,400</td>
                                <td className="p-2 text-sm text-right">$33,800</td>
                              </tr>
                              <tr>
                                <td className="p-2 text-sm">CAC</td>
                                <td className="p-2 text-sm text-right">$12,000</td>
                                <td className="p-2 text-sm text-right">$10,500</td>
                                <td className="p-2 text-sm text-right">$9,000</td>
                              </tr>
                              <tr>
                                <td className="p-2 text-sm">CAC Payback (months)</td>
                                <td className="p-2 text-sm text-right">14</td>
                                <td className="p-2 text-sm text-right">11</td>
                                <td className="p-2 text-sm text-right">9</td>
                              </tr>
                              <tr>
                                <td className="p-2 text-sm">Headcount</td>
                                <td className="p-2 text-sm text-right">28</td>
                                <td className="p-2 text-sm text-right">42</td>
                                <td className="p-2 text-sm text-right">65</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <h4 className="text-sm font-medium mt-4 mb-2">Key Projected KPIs</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Net Revenue Retention</span>
                            <span className="text-sm font-medium">115% → 125%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Gross Retention</span>
                            <span className="text-sm font-medium">85% → 92%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">LTV:CAC Ratio</span>
                            <span className="text-sm font-medium">2.5x → 4.2x</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Rule of 40 Score (Year 3)</span>
                            <span className="text-sm font-medium">145%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="terms"
              className="space-y-4 w-full overflow-y-auto tabs-content-scrollable"
              style={{ maxHeight: "calc(100vh - 180px)" }}
            >
              {/* Existing terms content */}
              <Card className="w-full">
                <CardHeader className="pb-4">
                  <CardTitle>Investment Terms</CardTitle>
                  <CardDescription>Details of the current funding round</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">SAFE Agreement Terms</h3>
                    <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                      <li>Valuation Cap: $15 million</li>
                      <li>Discount Rate: 20%</li>
                      <li>Minimum Investment: $25,000</li>
                      <li>Target Raise: $1,000,000</li>
                      <li>Pro-rata Rights: Yes</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Important Disclosures</h3>
                    <p className="text-muted-foreground mt-2">
                      This investment opportunity is only available to accredited investors. The SAFE (Simple Agreement
                      for Future Equity) is a legally binding contract that provides rights to future equity in the
                      company.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="updates"
              className="space-y-4 w-full overflow-y-auto tabs-content-scrollable"
              style={{ maxHeight: "calc(100vh - 180px)" }}
            >
              {/* Existing updates content */}
              <Card className="w-full">
                <CardHeader className="pb-4">
                  <CardTitle>Project Updates</CardTitle>
                  <CardDescription>Latest news and updates from Tech Startup XYZ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="font-medium">Q2 Progress Report</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        We're excited to share our Q2 progress, including new partnerships and product developments.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">June 15, 2023</p>
                    </div>
                    <div className="border-b pb-4">
                      <h3 className="font-medium">New Team Members</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        We've expanded our team with key hires in engineering and marketing.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">May 28, 2023</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Funding Round Announcement</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        We're thrilled to announce our new funding round to accelerate growth and product development.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">May 1, 2023</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right sidebar - 4 columns */}
        <div className="lg:col-span-4 space-y-6 h-fit">
          <FundraisingFormatCard />
        </div>
      </div>

      {/* Payment schedule for completed investments */}
      {user?.investmentStatus === "completed" && (
        <div className="mt-6">
          <PaymentSchedule
            totalAmount={25000}
            monthlyPayment={2083.33}
            remainingPayments={8}
            nextPaymentDate="March 21, 2025"
            paymentHistory={[
              { date: "March 21, 2025", amount: 2083.33, status: "pending" },
              { date: "April 21, 2025", amount: 2083.33, status: "upcoming" },
              { date: "May 21, 2025", amount: 2083.33, status: "upcoming" },
              { date: "June 21, 2025", amount: 2083.33, status: "upcoming" },
              { date: "July 21, 2025", amount: 2083.33, status: "upcoming" },
              { date: "August 21, 2025", amount: 2083.33, status: "upcoming" },
              { date: "September 21, 2025", amount: 2083.33, status: "upcoming" },
              { date: "October 21, 2025", amount: 2083.33, status: "upcoming" },
              { date: "November 21, 2025", amount: 2083.33, status: "upcoming" },
              { date: "December 21, 2025", amount: 2083.33, status: "upcoming" },
              { date: "January 21, 2026", amount: 2083.33, status: "upcoming" },
              { date: "February 21, 2026", amount: 2083.33, status: "upcoming" },
            ]}
          />
        </div>
      )}
    </div>
  )
}

