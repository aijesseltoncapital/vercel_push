import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with platform name */}
      <header className="w-full border-b bg-background shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-bold text-xl">FundCrane</h1>
          <nav className="flex gap-4">
            <Link href="/about" className="text-sm font-medium hover:underline">
              About
            </Link>
            <Link href="/features" className="text-sm font-medium hover:underline">
              Features
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Raise Capital on Your Terms</h1>

        <p className="text-xl text-muted-foreground mb-6 max-w-3xl">
          FundCrane helps startups and businesses raise capital through private investment portals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
          <Link href="/signup" className="w-full">
            <Button size="lg" className="w-full">
              Get Started
            </Button>
          </Link>
          <Link href="/hrmonster" className="w-full">
            <Button size="lg" variant="outline" className="w-full">
              HR Monster Demo
            </Button>
          </Link>
        </div>
      </main>

      <footer className="w-full border-t bg-background p-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FundCrane. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
