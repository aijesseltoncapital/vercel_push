"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function HRMonsterHome() {
  const { toast } = useToast()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with platform name */}
      <header className="w-full border-b bg-background shadow-sm p-4">
        <div className="container mx-auto">
          <h1 className="font-bold text-xl">Fundcrane</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Welcome to HR Monster Private Investment Portal
        </h1>

        <p className="text-xl text-muted-foreground mb-6 max-w-3xl">
          You're invited to participate in our exclusive fundraising round for our HR software solution.
        </p>

        <p className="text-lg mb-8 max-w-3xl">
          This platform is designed for our selected investors to learn more about the project, review the terms of
          investment, and complete their SAFE Note commitment securely online.
        </p>

        <div className="w-full max-w-md">
          <Link href="/auth/login" className="w-full">
            <Button size="lg" className="w-full">
              Invest in SAFE Note
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
