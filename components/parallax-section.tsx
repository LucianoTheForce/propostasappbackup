"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxSectionProps {
  children: React.ReactNode
  speed?: number
  className?: string
  direction?: "up" | "down"
  overflow?: "visible" | "hidden"
}

export function ParallaxSection({
  children,
  speed = 0.2,
  className = "",
  direction = "up",
  overflow = "hidden",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Calculate parallax effect based on direction
  const factor = direction === "up" ? -1 : 1
  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed * factor])

  // If not in browser, render children directly
  if (!isBrowser) {
    return <div className={`relative ${overflow === "hidden" ? "overflow-hidden" : ""} ${className}`}>{children}</div>
  }

  return (
    <div ref={ref} className={`relative ${overflow === "hidden" ? "overflow-hidden" : ""} ${className}`}>
      <motion.div style={{ y }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  )
}
