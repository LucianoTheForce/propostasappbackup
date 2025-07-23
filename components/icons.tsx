"use client"

import type { ReactNode } from "react"

interface IconProps {
  type: "overview" | "deliverables" | "pricing" | "terms" | "contact"
  size?: number
  className?: string
}

export function Icon({ type, size = 24, className = "" }: IconProps) {
  const getIcon = (): ReactNode => {
    switch (type) {
      case "overview":
        // Square with a dot in the center
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        )

      case "deliverables":
        // Horizontal lines
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="1.5" />
            <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" />
            <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )

      case "pricing":
        // Circle with a line through it
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
            <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )

      case "terms":
        // Grid of 4 squares
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
            <rect x="13" y="4" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
            <rect x="4" y="13" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
            <rect x="13" y="13" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )

      case "contact":
        // Triangle
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L20 18H4L12 4Z" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )

      default:
        return null
    }
  }

  return <div className={`icon ${className}`}>{getIcon()}</div>
}
