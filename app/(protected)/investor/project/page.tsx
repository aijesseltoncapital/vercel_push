"use client"

import { useAuth } from "@/lib/auth-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PaymentSchedule } from "../invest/payment-schedule"
import Link from "next/link"
import { DocumentViewer } from "@/components/document-viewer"
import { ExpandableSection } from "./components/expandable-section"
import { FaqSection } from "./components/faq-section"
import { AlertCircle } from "lucide-react"
import Image from "next/image"
import { FundraisingFormatCard } from "@/components/fundraising-format-card"
import { OverviewSidebar } from "./components/overview-sidebar"

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
    backers: 18,
    daysLeft: 42,
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
    <div className="flex-1 container mx-auto max-w-7xl px-4 pb-12">
      {/* Hero Section - Kickstarter Style */}
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8 mt-6">
        <Image
          src="https://i.postimg.cc/s2977jJJ/HR-Monster.png"
          alt="Tech Startup XYZ"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-8 text-white w-full">
            <h1 className="text-4xl font-bold mb-2">Tech Startup XYZ</h1>
            <p className="text-lg opacity-90 max-w-2xl">
              Cutting-edge technology that will transform how businesses operate through AI and machine learning.
            </p>
          </div>
        </div>
      </div>

      {/* Main content grid - Kickstarter Style */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main content area - 8 columns */}
        <div className="lg:col-span-8">
          {/* Project stats bar - Kickstarter Style */}
          <div className="mb-8">
            <div className="mb-4">
              <Progress value={investmentData.projectProgress} className="h-3 rounded-full" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-3xl font-bold">${investmentData.totalRaised.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm">of ${investmentData.goal.toLocaleString()} goal</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold">{investmentData.backers}</span>
                <span className="text-muted-foreground text-sm">investors</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold">{investmentData.daysLeft}</span>
                <span className="text-muted-foreground text-sm">days to go</span>
              </div>
            </div>
          </div>

          {/* KYC Status Alert - Styled like Kickstarter's alerts */}
          {user?.kycStatus !== "approved" && (
            <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800">KYC Verification Required</h3>
                <p className="text-sm text-amber-700 mt-1">
                  {user?.kycStatus === "pending"
                    ? "Your KYC verification is pending. You'll be notified once it's approved."
                    : user?.kycStatus === "rejected"
                      ? "Your KYC verification was rejected. Please visit the KYC page to resubmit."
                      : "You need to complete KYC verification before investing. Please visit the KYC page to get started."}
                </p>
                <div className="mt-3">
                  <Link href="/investor/kyc">
                    <Button variant="outline" size="sm" className="bg-white">
                      {user?.kycStatus === "not_submitted" && "Complete KYC"}
                      {user?.kycStatus === "pending" && "Check KYC Status"}
                      {user?.kycStatus === "rejected" && "Resubmit KYC"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Tabs - Kickstarter Style */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full grid grid-cols-4 h-auto p-0 bg-transparent border-b rounded-none mb-6 sticky top-[64px] z-40 bg-background">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none bg-transparent h-12"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="faq"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none bg-transparent h-12"
              >
                FAQ
              </TabsTrigger>
              <TabsTrigger
                value="terms"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none bg-transparent h-12"
              >
                Terms
              </TabsTrigger>
              <TabsTrigger
                value="updates"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none bg-transparent h-12"
              >
                Updates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <div className="flex flex-col md:flex-row md:gap-6">
                {/* Sidebar navigation - Kickstarter style */}
                <div className="hidden md:block md:w-1/4">
                  <OverviewSidebar />
                </div>

                {/* Main content */}
                <div className="md:w-3/4 space-y-6">
                  <ExpandableSection title="About Us" sectionId="about">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Tech Startup XYZ is developing cutting-edge technology that will transform how businesses
                        operate. Our platform leverages artificial intelligence and machine learning to provide
                        unprecedented insights and automation capabilities.
                      </p>
                      <div className="flex justify-center">
                        <div className="w-3/4 h-48 bg-muted rounded-lg flex items-center justify-center">
                          [Company Logo & Vision Statement]
                        </div>
                      </div>
                    </div>
                  </ExpandableSection>

                  <ExpandableSection title="Problem" sectionId="problem">
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
                  </ExpandableSection>

                  <ExpandableSection title="Solution" sectionId="solution">
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
                  </ExpandableSection>

                  <ExpandableSection title="Traction" sectionId="traction">
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
                  </ExpandableSection>

                  <ExpandableSection title="Customers" sectionId="customers">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Our platform is trusted by leading companies across various industries:
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="h-20 bg-muted rounded-lg flex items-center justify-center">
                          [Customer Logo 1]
                        </div>
                        <div className="h-20 bg-muted rounded-lg flex items-center justify-center">
                          [Customer Logo 2]
                        </div>
                        <div className="h-20 bg-muted rounded-lg flex items-center justify-center">
                          [Customer Logo 3]
                        </div>
                        <div className="h-20 bg-muted rounded-lg flex items-center justify-center">
                          [Customer Logo 4]
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">Customer Testimonials:</p>
                        <blockquote className="border-l-4 pl-4 italic text-muted-foreground">
                          "Tech Startup XYZ has transformed how we analyze our business data, leading to a 30% increase
                          in operational efficiency."
                          <footer className="text-sm mt-1">— CTO, Enterprise Customer</footer>
                        </blockquote>
                      </div>
                    </div>
                  </ExpandableSection>

                  <ExpandableSection title="Strategic Goals" sectionId="goals">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">Our strategic roadmap for the next 24 months:</p>
                      <div className="space-y-4">
                        <div className="border-l-2 border-primary pl-4">
                          <h4 className="font-medium">Q3-Q4 2023</h4>
                          <p className="text-sm text-muted-foreground">
                            Launch advanced analytics module and expand sales team to target enterprise customers.
                          </p>
                        </div>
                        <div className="border-l-2 border-primary pl-4">
                          <h4 className="font-medium">Q1-Q2 2024</h4>
                          <p className="text-sm text-muted-foreground">
                            Release API ecosystem for third-party integrations and enter European market.
                          </p>
                        </div>
                        <div className="border-l-2 border-primary pl-4">
                          <h4 className="font-medium">Q3-Q4 2024</h4>
                          <p className="text-sm text-muted-foreground">
                            Launch industry-specific solutions and prepare for Series A funding round.
                          </p>
                        </div>
                      </div>
                    </div>
                  </ExpandableSection>

                  <ExpandableSection title="Team" sectionId="team">
                    <div className="space-y-6">
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
                    </div>
                  </ExpandableSection>

                  <ExpandableSection title="Partnerships" sectionId="partnerships">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        We've established strategic partnerships to accelerate our growth and enhance our product
                        offerings:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium">Technology Partners</h4>
                          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <li>• Cloud Infrastructure Provider - Premium Partner</li>
                            <li>• AI Research Institute - Research Collaboration</li>
                            <li>• Enterprise Software Company - Integration Partner</li>
                          </ul>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium">Distribution Partners</h4>
                          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <li>• Global Consulting Firm - Implementation Partner</li>
                            <li>• Industry Association - Preferred Vendor</li>
                            <li>• Regional Resellers - Channel Partners</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </ExpandableSection>

                  <ExpandableSection title="Finance" sectionId="finance">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Key Projected KPIs</h4>
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
                          <div className="h-48 bg-muted/50 rounded-lg mt-4 flex items-center justify-center">
                            [Revenue Growth Chart]
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Use of Funds</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div className="border rounded-lg p-3">
                            <div className="text-lg font-bold">40%</div>
                            <div className="text-xs text-muted-foreground">Product Development</div>
                          </div>
                          <div className="border rounded-lg p-3">
                            <div className="text-lg font-bold">30%</div>
                            <div className="text-xs text-muted-foreground">Sales & Marketing</div>
                          </div>
                          <div className="border rounded-lg p-3">
                            <div className="text-lg font-bold">20%</div>
                            <div className="text-xs text-muted-foreground">Team Expansion</div>
                          </div>
                          <div className="border rounded-lg p-3">
                            <div className="text-lg font-bold">10%</div>
                            <div className="text-xs text-muted-foreground">Operations</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ExpandableSection>

                  <ExpandableSection title="Attachments" sectionId="attachments">
                    <DocumentViewer
                      documents={projectDocuments}
                      title="Project Documents"
                      description="Access all project-related documents and materials"
                    />
                  </ExpandableSection>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="mt-0">
              <FaqSection />
            </TabsContent>

            <TabsContent value="terms" className="mt-0">
              <Card className="w-full border-0 shadow-none">
                <CardHeader className="px-0">
                  <CardTitle>Investment Terms</CardTitle>
                  <CardDescription>Details of the current funding round</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-0">
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

            <TabsContent value="updates" className="mt-0">
              <Card className="w-full border-0 shadow-none">
                <CardHeader className="px-0">
                  <CardTitle>Project Updates</CardTitle>
                  <CardDescription>Latest news and updates from Tech Startup XYZ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-0">
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

        {/* Right sidebar - Fundraising Format */}
        <div className="lg:col-span-4 space-y-6">
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

