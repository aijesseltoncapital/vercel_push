"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-provider"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, AlertTriangle, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export function UserNav() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

  // Get KYC status indicator
  const getKycStatusIndicator = () => {
    switch (user.onboardingStatus.kyc) {
      case "submitted":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 flex items-center">
            <ShieldCheck className="h-3 w-3 mr-1" />
            KYC Verified
          </Badge>
        )
      case "not_submitted":
        return (
          <Badge variant="outline" className="text-yellow-800 dark:text-yellow-300 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            KYC Not Submitted
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-800 dark:text-yellow-300 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            KYC Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            KYC Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            KYC Required
          </Badge>
        )
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-[110]" align="end" forceMount side="top">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            {user.role === "investor" && <div className="mt-2">{getKycStatusIndicator()}</div>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => (window.location.href = "/investor/dashboard")}>Dashboard</DropdownMenuItem>
          {user.role === "investor" && user.onboardingStatus.kyc !== "submitted" && (
            <DropdownMenuItem onClick={() => (window.location.href = "/investor/kyc")}>Complete KYC</DropdownMenuItem>
          )}
          {user.role !== "admin" && <DropdownMenuItem>Settings</DropdownMenuItem>}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            logout()
            router.push("/auth/login?logout=true")
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
