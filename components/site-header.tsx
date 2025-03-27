import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="font-bold text-xl mr-8 ml-6">
          HR Monster
        </Link>
        <MainNav className="mx-8" />
        <div className="ml-auto flex items-center space-x-6">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}

