"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface DynamicTextProps {
  prefix?: string
  phrases: string[]
  interval?: number
  className?: string
}

export function DynamicText({ prefix = "", phrases, interval = 4000, className = "" }: DynamicTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (phrases.length <= 1) return

    const intervalId = setInterval(() => {
      setIsVisible(false)

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length)
        setIsVisible(true)
      }, 500) // Wait for exit animation to complete
    }, interval)

    return () => clearInterval(intervalId)
  }, [phrases.length, interval])

  if (phrases.length === 0) return null

  return (
    <div className={`overflow-hidden ${className}`}>
      {prefix && <span className="font-sans">{prefix}</span>}
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="font-sans"
          >
            {phrases[currentIndex]}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
