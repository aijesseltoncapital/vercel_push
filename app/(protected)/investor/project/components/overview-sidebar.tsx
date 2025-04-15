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
      const scrollPosition = window.scrollY + 150 // Increased offset for better detection

      // Find the section that is currently most visible in the viewport
      let currentSection = ""
      let maxVisibility = 0

      sections.forEach((section) => {
        const sectionEl = section as HTMLElement
        const sectionTop = sectionEl.offsetTop
        const sectionHeight = sectionEl.offsetHeight
        const sectionId = section.getAttribute("data-section")

        // Calculate how much of the section is visible
        const sectionBottom = sectionTop + sectionHeight
        const visibleTop = Math.max(scrollPosition, sectionTop)
        const visibleBottom = Math.min(scrollPosition + window.innerHeight, sectionBottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)

        // If this section has more visible area than previous max, it becomes the active section
        if (visibleHeight > maxVisibility && sectionId) {
          maxVisibility = visibleHeight
          currentSection = sectionId
        }
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
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
      const offsetY = 100 // Adjust this value to your desired offset (e.g., header height)
      const sectionTop = (section as HTMLElement).getBoundingClientRect().top + window.pageYOffset

      // Set active section immediately when clicked
      setActiveSection(sectionId)

      window.scrollTo({
        top: sectionTop - offsetY,
        behavior: "smooth",
      })
    }
  }

  const navItems = [
    { id: "about", label: "About Us" },
    { id: "problem", label: "Problem" },
    { id: "solution", label: "Solution" },
    { id: "market-overview", label: "Market Overview" },
    { id: "goals", label: "Strategic Goals" },
    { id: "team", label: "Team" },
    { id: "traction", label: "Track record" },
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
