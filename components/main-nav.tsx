"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-provider"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  const isAdmin = user?.role === "admin"
  const isInvestor = user?.role === "investor"

  const adminRoutes = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      active: pathname === "/admin/dashboard",
    },
    {
      href: "/admin/investors",
      label: "Investors",
      active: pathname === "/admin/investors" || pathname.startsWith("/admin/investors/"),
    },
    {
      href: "/admin/documents",
      label: "Documents",
      active: pathname === "/admin/documents",
    },
    {
      href: "/admin/invites",
      label: "Invites",
      active: pathname === "/admin/invites",
    },
    {
      href: "/admin/settings",
      label: "Settings",
      active: pathname === "/admin/settings",
    },
  ]

  const investorRoutes = [
    {
      href: "/investor/project",
      label: "Project",
      active: pathname === "/investor/project",
    },
    {
      href: "/investor/invest",
      label: "Invest",
      active: pathname === "/investor/invest",
    },
    {
      href: "/investor/kyc",
      label: "KYC Verification",
      active: pathname === "/investor/kyc",
    },
    {
      href: "/investor/documents",
      label: "Documents",
      active: pathname === "/investor/documents",
    },
  ]

  const routes = isAdmin ? adminRoutes : isInvestor ? investorRoutes : []

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}

