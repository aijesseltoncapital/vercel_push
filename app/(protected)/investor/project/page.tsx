"use client"

import { useAuth } from "@/lib/auth-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DocumentViewer } from "@/components/document-viewer"
import { ExpandableSection } from "./components/expandable-section"
import { FaqSection } from "./components/faq-section"
import { AlertCircle } from "lucide-react"
import Image from "next/image"
import { FundraisingFormatCard } from "@/components/fundraising-format-card"
import { OverviewSidebar } from "./components/overview-sidebar"
import { useEffect, useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ProjectPage() {
  const { user, fetchInvestmentAmount, updateInvestmentAmount, fetchOnboardingStatus, updateUserOnboardingStatus } =
    useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [investmentAmount, setInvestmentAmount] = useState<number | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Fetch investment amount on component mount
  useEffect(() => {
    const getInvestmentAmount = async () => {
      if (user && user.email) {
        setIsLoading(true)
        try {
          console.log("Fetching investment amount for:", user.email)
          const result = await fetchInvestmentAmount(user.email)
          console.log("Fetch result:", result)

          if (result.success && result.investmentAmount !== undefined) {
            // Set local state for immediate UI update
            setInvestmentAmount(result.investmentAmount)
            console.log("Setting investment amount to:", result.investmentAmount)

            // Update global user state
            updateInvestmentAmount(result.investmentAmount)
          }
        } catch (error) {
          console.error("Failed to fetch investment amount:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    getInvestmentAmount()
  }, [user, fetchInvestmentAmount, updateInvestmentAmount])

  // Use either the local state or user state for rendering
  const currentInvestmentAmount = investmentAmount ?? user?.investmentAmount ?? 0
  console.log("Current investment amount for rendering:", currentInvestmentAmount)

  // Mock data for the investor dashboard
  const investmentData = {
    projectName: "Tech Startup XYZ",
    invested: 0,
    documents: [],
    status: user?.onboardingStatus.investment || "not_started",
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

  const navItems = [
    { id: "about", label: "About Us" },
    { id: "problem", label: "Problem" },
    { id: "solution", label: "Solution" },
    { id: "market-overview", label: "Market Overview" },
    { id: "goals", label: "Strategic Goals" },
    { id: "team", label: "Team" },
    { id: "traction", label: "Track record" },
    { id: "partnerships", label: "Partnerships" },
    { id: "finance", label: "Finance" },
    { id: "attachments", label: "Attachments" },
  ]

  const handleInvestMore = useCallback(async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "User email not found.",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData()
    formData.append("email", user.email)

    try {
      const response = await fetch(
        "https://api.fundcrane.com/investors/reinvest-webhook",
        {
          method: "POST",
          body: formData,
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to trigger reinvestment process")
      }

      // Fetch and update onboarding status
      const onboardingResult = await fetchOnboardingStatus(user.email)
      if (onboardingResult.success && onboardingResult.onboardingStatus) {
        updateUserOnboardingStatus(onboardingResult.onboardingStatus)
      } else {
        toast({
          title: "Error",
          description: onboardingResult.error || "Failed to fetch onboarding status.",
          variant: "destructive",
        })
      }

      router.push("/investor/payment-options")
    } catch (error: any) {
      console.error("Reinvestment error:", error)
      toast({
        title: "Reinvestment failed",
        description: error.message || "There was an error initiating the reinvestment process.",
        variant: "destructive",
      })
    }
  }, [user, toast, router, fetchOnboardingStatus, updateUserOnboardingStatus])

  return (
    <div className="flex-1 container mx-auto max-w-7xl px-4 pb-12 pt-20">
      {/* Hero Section - Restructured */}
      {/* Startup Information - Full width */}
      <div className="w-full mb-10">
        <div className="flex gap-3 mb-4 mt-4">
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">Payroll</span>
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">SaaS</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold">HR Monster</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Monster HR is an AI-driven platform that redefines payroll and HR efficiency, automating complex tasks,
          ensuring compliance accuracy, and delivering powerful cost savings with effortless integration
        </p>
        <a
          href="https://www.hr.monster"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-4 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
        >
          Visit Us
        </a>
      </div>

      {/* Image and Investment Info - Equal width */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Banner Image */}
        <div className="w-full lg:w-[70%] relative rounded-lg overflow-hidden">
          <Image
            src="https://i.postimg.cc/s2977jJJ/HR-Monster.png"
            alt="HR Monster hero banner"
            className="object-cover"
            width={1200}
            height={800}
            priority
          />
        </div>

        {/* Investment Info Panel */}
        <div className="w-full lg:w-[30%] bg-white rounded-lg shadow-md p-6 border border-gray-100 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Investment Details</h2>

          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-gray-600 font-medium">Round</span>
              <span className="font-semibold">Pre-seed</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-gray-600 font-medium">Valuation</span>
              <span className="font-semibold">SGD 5,000,000</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-gray-600 font-medium">Funding amount</span>
              <span className="font-semibold">SGD 500,000</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-gray-600 font-medium">Deadline</span>
              <span className="font-semibold">Rolling Close</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-gray-600 font-medium">Instrument</span>
              <span className="font-semibold">SAFE</span>
            </div>

            <div className="flex justify-between items-center pb-3">
              <span className="text-gray-600 font-medium">Minimum ticket</span>
              <div className="flex items-center">
                <span className="font-semibold mr-2">SGD 5,000</span>
                <div className="relative group">
                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold cursor-help">
                    i
                  </div>
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-black text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Minimum ticket size per investor
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {user?.onboardingStatus.nda === "signed" ? (
              <Link href="/investor/payment-options">
                <Button className="w-full">{currentInvestmentAmount > 0 ? "Invest More" : "Invest Now"}</Button>
              </Link>
            ) : (
              <Link href="/investor/nda">
                <Button className="w-full">Sign NDA to Invest</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Thank you panel - Positioned beneath hero banner and investment detail card */}
      {currentInvestmentAmount > 0 && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 text-lg mb-2">Thank you for your investment!</h4>
          <p className="text-green-700 mb-3">
            Your current investment:{" "}
            <span className="font-semibold">SGD {currentInvestmentAmount.toLocaleString()}</span>
          </p>
          <p className="text-green-700 mb-4">
            You can still invest more if you'd like to increase your stake in HR Monster.
          </p>
          <Button
            variant="outline"
            className="bg-white border-green-300 text-green-700 hover:bg-green-100"
            onClick={handleInvestMore}
          >
            Invest More
          </Button>
        </div>
      )}

      {/* Main content grid - Kickstarter Style */}
      <div className="grid grid-cols-1 gap-8">
        {/* Main content area - full width */}
        <div className="w-full">
          {/* KYC Status Alert - Styled like Kickstarter's alerts */}
          {user?.onboardingStatus.kyc !== "submitted" && (
            <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800">KYC Verification Required</h3>
                <p className="text-sm text-amber-700 mt-1">
                  {user?.onboardingStatus.kyc === "not_submitted"
                    ? "You need to complete KYC verification before investing. Please visit the KYC page to get started."
                    : user?.onboardingStatus.kyc === "pending"
                      ? "Your KYC verification is pending. You'll be notified once it's submitted."
                      : user?.onboardingStatus.kyc === "rejected"
                        ? "Your KYC verification was rejected. Please visit the KYC page to resubmit."
                        : "You need to complete KYC verification before investing. Please visit the KYC page to get started."}
                </p>
                <div className="mt-3">
                  <Link href="/investor/kyc">
                    <Button variant="outline" size="sm" className="bg-white">
                      {user?.onboardingStatus.kyc === "not_submitted" && "Complete KYC"}
                      {user?.onboardingStatus.kyc === "pending" && "Check KYC Status"}
                      {user?.onboardingStatus.kyc === "rejected" && "Resubmit KYC"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Tabs - Kickstarter Style */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full grid grid-cols-5 h-auto p-0 bg-transparent border-b rounded-none mb-6 sticky top-[80px] z-40 bg-background">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none bg-transparent h-12"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="fundraising"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none bg-transparent h-12"
              >
                Fundraising
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
                <div className="hidden md:block md:w-1/6">
                  <OverviewSidebar navItems={navItems} />
                </div>

                {/* Main content */}
                <div className="md:w-5/6 space-y-6">
                  <ExpandableSection title="About Us" sectionId="about">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Monster HR is an AI-driven HRIS and payroll platform created by Pascal Henry, a proven founder
                        and innovator behind successful HR startups such as HReasily, Business HR Asia (CIMB) and Smart
                        HR (HSBC). We are reimagining the HR the software world with AI — Building it better - cheaper,
                        faster, smarter
                      </p>
                    </div>
                  </ExpandableSection>

                  <ExpandableSection title="Problem" sectionId="problem">
                    <div className="flex flex-col items-center space-y-8 pt-4">
                      <div
                        className="w-full bg-muted rounded-lg overflow-hidden relative"
                        style={{ paddingBottom: "56.25%" }}
                      >
                        <Image
                          src="https://i.postimg.cc/pTFzrgY1/problem.png"
                          alt="Problem Visualization"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div
                        className="w-full bg-muted rounded-lg overflow-hidden relative"
                        style={{ paddingBottom: "56.25%" }}
                      >
                        <Image
                          src="https://i.postimg.cc/xjbGsbHV/image-2025-03-28-110846163.png"
                          alt="Problem Visualization 2"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div
                        className="w-full bg-muted rounded-lg overflow-hidden relative"
                        style={{ paddingBottom: "56.25%" }}
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/problem_3.jpg"
                          alt="Problem Visualization 3"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </ExpandableSection>

                  <ExpandableSection title="Solution" sectionId="solution">
                    <div className="space-y-6">
                      <div className="space-y-8">
                        <div
                          className="w-full bg-muted rounded-lg overflow-hidden relative"
                          style={{ paddingBottom: "56.25%" }}
                        >
                          <Image
                            src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/5.png"
                            alt="HR Monster Solution Overview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div
                          className="w-full bg-muted rounded-lg overflow-hidden relative"
                          style={{ paddingBottom: "56.25%" }}
                        >
                          <Image
                            src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/6.png"
                            alt="HR Monster Platform Features"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div
                          className="w-full bg-muted rounded-lg overflow-hidden relative"
                          style={{ paddingBottom: "56.25%" }}
                        >
                          <Image
                            src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/7.png"
                            alt="HR Monster Platform Architecture"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div
                          className="w-full bg-muted rounded-lg overflow-hidden relative"
                          style={{ paddingBottom: "56.25%" }}
                        >
                          <Image
                            src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/13.png"
                            alt="HR Monster Integration Capabilities"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div
                          className="w-full bg-muted rounded-lg overflow-hidden relative"
                          style={{ paddingBottom: "56.25%" }}
                        >
                          <Image
                            src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/14.png"
                            alt="HR Monster Analytics Dashboard"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div
                          className="w-full bg-muted rounded-lg overflow-hidden relative"
                          style={{ paddingBottom: "56.25%" }}
                        >
                          <Image
                            src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/15.png"
                            alt="HR Monster Implementation Timeline"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <div className="mt-8">
                        <h4 className="text-lg font-medium mb-4">Business Model</h4>
                        <div
                          className="w-full bg-muted rounded-lg overflow-hidden relative"
                          style={{ paddingBottom: "56.25%" }}
                        >
                          <Image
                            src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/16.png"
                            alt="HR Monster Business Model"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </ExpandableSection>

                  <ExpandableSection title="Market Overview" sectionId="market-overview">
                    <div className="space-y-6">
                      <p className="text-muted-foreground">
                        Our market analysis shows the size and growth potential of the HR and payroll software market:
                      </p>
                      <div className="space-y-8">
                        <div
                          className="w-full bg-muted rounded-lg overflow-hidden relative"
                          style={{ paddingBottom: "56.25%" }}
                        >
                          <Image
                            src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/8.png"
                            alt="Market Size Analysis"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div
                          className="w-full bg-muted rounded-lg overflow-hidden relative"
                          style={{ paddingBottom: "56.25%" }}
                        >
                          <Image
                            src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/9.png"
                            alt="Market Positioning"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </ExpandableSection>

                  <ExpandableSection title="Strategic Goals" sectionId="goals">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">Our strategic roadmap for the next 12 months:</p>

                      <div className="mt-8">
                        <div
                          className="w-full bg-muted rounded-lg overflow-hidden relative"
                          style={{ paddingBottom: "56.25%" }}
                        >
                          <Image
                            src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/18.png"
                            alt="Strategic Roadmap"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </ExpandableSection>

                  <ExpandableSection title="Team" sectionId="team">
                    <div className="space-y-8">
                      {/* Founder information */}
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-32 h-32 rounded-full bg-muted flex-shrink-0 overflow-hidden relative">
                          <Image
                            src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/Pascal-Light-crop-750x503.png"
                            alt="Pascal Henry"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-medium">Pascal Henry</h3>
                          <p className="text-sm text-muted-foreground">Founder & CEO</p>
                          <div className="space-y-4 mt-3">
                            <p className="text-sm text-muted-foreground">
                              Pascal Henry is an accomplished entrepreneur and visionary with 15 years of expertise in
                              revolutionising HR technology. A driving force behind industry-leading ventures such as
                              HReasily, Business HR Asia (partnered with CIMB), and Smart HR (in collaboration with
                              HSBC), he has consistently delivered transformative solutions for the modern workforce.
                            </p>
                            <p className="text-sm text-muted-foreground">
                              With a career rooted in building three HR tech platforms through conventional
                              methodologies, Pascal possesses unparalleled insight into the sector's challenges, cost
                              and opportunities. This foundational experience uniquely equips him to harness AI as a
                              catalyst for redefining HR innovation. Bridging legacy systems with cutting-edge
                              technology, he is pioneering the next generation of intelligent, affordable & scalable HR
                              solutions—setting a new standard for efficiency, adaptability, and human-centric design in
                              workplace management.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Team image placeholder */}
                      <div
                        className="w-full bg-muted rounded-lg overflow-hidden relative"
                        style={{ paddingBottom: "56.25%" }}
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/10.png"
                          alt="HR Monster Team"
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Partnerships image moved here */}
                      <div
                        className="w-full bg-muted rounded-lg overflow-hidden relative"
                        style={{ paddingBottom: "56.25%" }}
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/partnerships.jpg"
                          alt="Partnerships"
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Video grid - 2 videos in row 1, 3 videos in row 2 */}
                      <div className="mt-8 space-y-6">
                        {/* Row 1 - 2 videos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Video 1 */}
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <iframe
                              width="100%"
                              height="100%"
                              src="https://www.youtube.com/embed/s2AMcpwvC1M"
                              title="Pascal Henry Interview"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          </div>

                          {/* Video 2 */}
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <iframe
                              width="100%"
                              height="100%"
                              src="https://www.youtube.com/embed/ndLIZ5U-ohg"
                              title="HR Monster Demo"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          </div>
                        </div>

                        {/* Row 2 - 3 videos */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Video 3 */}
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <iframe
                              width="100%"
                              height="100%"
                              src="https://www.youtube.com/embed/V49AJhtKME8"
                              title="Product Walkthrough"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          </div>

                          {/* Video 4 */}
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <iframe
                              width="100%"
                              height="100%"
                              src="https://www.youtube.com/embed/EyyNJJVkzR4"
                              title="Quick Feature Demo"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          </div>

                          {/* Video 5 */}
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <iframe
                              width="100%"
                              height="100%"
                              src="https://www.youtube.com/embed/V0QdkSzMx6A"
                              title="Additional Feature Demo"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ExpandableSection>

                  <ExpandableSection title="Track record" sectionId="traction">
                    <div
                      className="w-full bg-muted rounded-lg overflow-hidden relative"
                      style={{ paddingBottom: "56.25%" }}
                    >
                      <Image
                        src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/traction.jpg"
                        alt="Track record"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </ExpandableSection>

                  <ExpandableSection title="Partnerships" sectionId="partnerships">
                    <div className="space-y-8">
                      <div
                        className="w-full bg-muted rounded-lg overflow-hidden relative"
                        style={{ paddingBottom: "56.25%" }}
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/17.png"
                          alt="Strategic Partnerships"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </ExpandableSection>

                  <ExpandableSection title="Finance" sectionId="finance">
                    <div className="space-y-8">
                      <div
                        className="w-full bg-muted rounded-lg overflow-hidden relative"
                        style={{ paddingBottom: "56.25%" }}
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/19_1.png"
                          alt="Financial Projections"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div
                        className="w-full bg-muted rounded-lg overflow-hidden relative"
                        style={{ paddingBottom: "56.25%" }}
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/aijesseltoncapital/static@main/20.png"
                          alt="Funding Allocation"
                          fill
                          className="object-cover"
                        />
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

            <TabsContent value="fundraising" className="mt-0">
              <div className="max-w-3xl mx-auto">
                <FundraisingFormatCard />
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
                      <li>Round: Pre-seed</li>
                      <li>Valuation: SGD 5,000,000</li>
                      <li>Funding Amount: SGD 500,000</li>
                      <li>Deadline: Rolling Close</li>
                      <li>Instrument: SAFE</li>
                      <li>Minimum Investment: SGD 5,000</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Important Disclosures</h3>
                    <p className="text-muted-foreground mt-2">
                      This investment opportunity is only available to accredited investors. The SAFE (Simple Agreement
                      for Future Equity) is a legally binding contract that provides rights to future equity in the
                      company legally binding contract that provides rights to future equity in the company.
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
                    <div>
                      <h3 className="font-medium">Funding Round Announcement</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        We're thrilled to announce our new funding round to accelerate growth and product development.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">April 1, 2025</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
