"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExpandableSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  sectionId: string
  className?: string
}

export function ExpandableSection({
  title,
  children,
  defaultExpanded = true,
  sectionId,
  className,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div
      className={cn("mb-6", className)}
      data-section={sectionId}
      id={sectionId} // Add an ID to make scrolling to the section more reliable
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 text-left font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg"
      >
        <h3 className="text-lg">{title}</h3>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {isExpanded && <div className="py-4">{children}</div>}
    </div>
  )
}
