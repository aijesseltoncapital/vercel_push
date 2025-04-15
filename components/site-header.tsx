"use client"

import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/lib/auth-provider"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-[100] w-full border-b bg-background shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center">
          <Link href="/" className="font-bold text-xl">
            HR Monster
          </Link>
          <StepNav className="ml-8" />
        </div>
        <div className="flex items-center space-x-6">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}

// Update the StepNav component to have independent highlighting for each step

function StepNav({ className }: { className?: string }) {
  const { user } = useAuth()
  const pathname = usePathname()
  const isInvestor = user?.role === "investor"
  const isAdmin = user?.role === "admin"
  const { toast } = useToast()

  // If admin, show the original MainNav
  if (isAdmin) {
    return <MainNav className={className} />
  }

  // If not investor or no user, return nothing
  if (!isInvestor || !user) {
    return null
  }

  // Hide step navigation on the dashboard page
  if (pathname === "/investor/dashboard") {
    return null
  }

  // Determine current step based on pathname and onboarding status
  const currentStep = pathname.includes("/kyc")
    ? 1
    : pathname.includes("/nda")
      ? 2
      : pathname.includes("/project")
        ? 3
        : pathname.includes("/payment-options")
          ? 4
          : pathname.includes("/contracts")
            ? 5
            : pathname.includes("/invest")
              ? 6
              : 0 // Default to 0 if none match

  // Determine completed steps based on onboarding status
  const kycCompleted = user.onboardingStatus.kyc === "submitted"
  const ndaCompleted = user.onboardingStatus.nda === "signed"
  const paymentOptionSelected = !!user.paymentOption
  const contractsCompleted = user.onboardingStatus.contract === "signed"

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex items-center">
        {/* Step 1: KYC */}
        <Link
          href="/investor/kyc"
          className={cn(
            "flex flex-col items-center",
            currentStep === 1 ? "text-primary" : kycCompleted ? "text-green-500" : "text-muted-foreground",
          )}
          onClick={(e) => {
            if (!kycCompleted) {
              e.preventDefault()
              toast({
                title: "KYC verification required",
                description: "You must complete KYC verification before signing the NDA",
                variant: "destructive",
              })
            }
          }}
        >
          <div className="relative">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center border-2",
                currentStep === 1
                  ? "border-primary bg-primary/10"
                  : kycCompleted
                    ? "border-green-500 bg-green-100"
                    : "border-muted-foreground",
              )}
            >
              {kycCompleted ? <CheckCircle className="h-4 w-4" /> : <span className="text-sm font-medium">1</span>}
            </div>
          </div>
          <span className="text-xs mt-1">KYC</span>
        </Link>

        {/* Connector line */}
        <div className={cn("w-8 h-0.5 mx-1", kycCompleted ? "bg-green-500" : "bg-muted")} />

        {/* Step 2: NDA */}
        <Link
          href="/investor/nda"
          className={cn(
            "flex flex-col items-center",
            currentStep === 2 ? "text-primary" : ndaCompleted ? "text-green-500" : "text-muted-foreground",
          )}
          onClick={(e) => {
            if (!ndaCompleted) {
              e.preventDefault()
              toast({
                title: "NDA signing required",
                description: "You must sign the NDA before viewing project details",
                variant: "destructive",
              })
            }
          }}
        >
          <div className="relative">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center border-2",
                currentStep === 2
                  ? "border-primary bg-primary/10"
                  : ndaCompleted
                    ? "border-green-500 bg-green-100"
                    : "border-muted-foreground",
              )}
            >
              {ndaCompleted ? <CheckCircle className="h-4 w-4" /> : <span className="text-sm font-medium">2</span>}
            </div>
          </div>
          <span className="text-xs mt-1">NDA</span>
        </Link>

        {/* Connector line */}
        <div className={cn("w-8 h-0.5 mx-1", ndaCompleted ? "bg-green-500" : "bg-muted")} />

        {/* Step 3: Project */}
        <Link
          href="/investor/project"
          className={cn("flex flex-col items-center", currentStep === 3 ? "text-primary" : "text-muted-foreground")}
          onClick={(e) => {
            if (!ndaCompleted) {
              e.preventDefault()
              toast({
                title: "NDA signing required",
                description: "You must sign the NDA before viewing project details",
                variant: "destructive",
              })
            }
          }}
        >
          <div className="relative">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center border-2",
                currentStep === 3 ? "border-primary bg-primary/10" : "border-muted-foreground",
              )}
            >
              <span className={cn("text-sm font-medium", currentStep === 3 ? "text-primary" : "text-muted-foreground")}>
                3
              </span>
            </div>
          </div>
          <span className="text-xs mt-1">Project</span>
        </Link>

        {/* Connector line */}
        <div className={cn("w-8 h-0.5 mx-1", "bg-muted")} />

        {/* Step 4: Payment Options */}
        <Link
          href="/investor/payment-options"
          className={cn(
            "flex flex-col items-center",
            currentStep === 4 ? "text-primary" : paymentOptionSelected ? "text-green-500" : "text-muted-foreground",
          )}
          onClick={(e) => {
            if (!ndaCompleted) {
              e.preventDefault()
              toast({
                title: "NDA signing required",
                description: "You must sign the NDA before selecting payment options",
                variant: "destructive",
              })
            }
          }}
        >
          <div className="relative">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center border-2",
                currentStep === 4
                  ? "border-primary bg-primary/10"
                  : paymentOptionSelected
                    ? "border-green-500 bg-green-100"
                    : "border-muted-foreground",
              )}
            >
              {paymentOptionSelected ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <span className="text-sm font-medium">4</span>
              )}
            </div>
          </div>
          <span className="text-xs mt-1">Options</span>
        </Link>

        {/* Connector line */}
        <div className={cn("w-8 h-0.5 mx-1", paymentOptionSelected ? "bg-green-500" : "bg-muted")} />

        {/* Step 5: Contracts */}
        <Link
          href="/investor/contracts"
          className={cn(
            "flex flex-col items-center",
            currentStep === 5 ? "text-primary" : contractsCompleted ? "text-green-500" : "text-muted-foreground",
          )}
          onClick={(e) => {
            if (!paymentOptionSelected) {
              e.preventDefault()
              toast({
                title: "Payment option required",
                description: "You must select a payment option before proceeding to contracts",
                variant: "destructive",
              })
            }
          }}
        >
          <div className="relative">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center border-2",
                currentStep === 5
                  ? "border-primary bg-primary/10"
                  : contractsCompleted
                    ? "border-green-500 bg-green-100"
                    : "border-muted-foreground",
              )}
            >
              {contractsCompleted ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <span className="text-sm font-medium">5</span>
              )}
            </div>
          </div>
          <span className="text-xs mt-1">Contracts</span>
        </Link>

        {/* Connector line */}
        <div className="w-8 h-0.5 mx-1 bg-muted" />

        {/* Step 6: Invest/Payment */}
        <Link
          href="/investor/invest"
          className={cn("flex flex-col items-center", currentStep === 6 ? "text-primary" : "text-muted-foreground")}
          onClick={(e) => {
            if (!contractsCompleted) {
              e.preventDefault()
              toast({
                title: "Contract signing required",
                description: "You must sign all contracts before proceeding to payment",
                variant: "destructive",
              })
            }
          }}
        >
          <div className="relative">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center border-2",
                currentStep === 6 ? "border-primary bg-primary/10" : "border-muted-foreground",
              )}
            >
              <span className={cn("text-sm font-medium", currentStep === 6 ? "text-primary" : "text-muted-foreground")}>
                6
              </span>
            </div>
            {!contractsCompleted && <div className="absolute -top-1 -right-1 h-3 w-3 bg-amber-500 rounded-full"></div>}
          </div>
          <span className="text-xs mt-1">Payment</span>
        </Link>
      </div>
    </div>
  )
}
