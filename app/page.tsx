import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <main className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">HR Monster Private Investment Round</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
          Exclusive access to premium investment opportunities. By invitation only.
        </p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button size="lg" className="px-8">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="px-8">
              Create Account
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

