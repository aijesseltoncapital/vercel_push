import { ShieldCheck, AlertTriangle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface KycStatusIndicatorProps {
  status: "not_submitted" | "pending" | "approved" | "rejected"
  showLabel?: boolean
  className?: string
}

export function KycStatusIndicator({ status, showLabel = true, className = "" }: KycStatusIndicatorProps) {
  switch (status) {
    case "approved":
      return (
        <Badge
          className={`bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 flex items-center ${className}`}
        >
          <ShieldCheck className="h-3 w-3 mr-1" />
          {showLabel && "KYC Verified"}
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className={`text-yellow-800 dark:text-yellow-300 flex items-center ${className}`}>
          <Clock className="h-3 w-3 mr-1" />
          {showLabel && "KYC Pending"}
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="destructive" className={`flex items-center ${className}`}>
          <AlertTriangle className="h-3 w-3 mr-1" />
          {showLabel && "KYC Rejected"}
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className={`text-muted-foreground flex items-center ${className}`}>
          <AlertTriangle className="h-3 w-3 mr-1" />
          {showLabel && "KYC Required"}
        </Badge>
      )
  }
}

