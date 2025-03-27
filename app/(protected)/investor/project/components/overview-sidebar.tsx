"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface OverviewSidebarProps {
  className?: string
}

export function OverviewSidebar({ className }: OverviewSidebarProps) {
  const [activeSection, setActiveSection] = useState("about")

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]")
      const scrollPosition = window.scrollY + 100 // Offset for header

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop
        const sectionHeight = (section as HTMLElement).offsetHeight
        const sectionId = section.getAttribute("data-section")

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight && sectionId) {
          setActiveSection(sectionId)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = document.querySelector(`[data-section="${sectionId}"]`)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  const navItems = [
    { id: "about", label: "About Us" },
    { id: "problem", label: "Problem" },
    { id: "solution", label: "Solution" },
    { id: "traction", label: "Traction" },
    { id: "customers", label: "Customers" },
    { id: "goals", label: "Strategic Goals" },
    { id: "team", label: "Team" },
    { id: "partnerships", label: "Partnerships" },
    { id: "finance", label: "Finance" },
    { id: "attachments", label: "Attachments" },
  ]

  return (
    <nav className={cn("sticky top-32 space-y-1", className)}>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className={cn(
            "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
            activeSection === item.id
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}

