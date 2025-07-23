"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface RotatingTextProps {
  words: string[]
  className?: string
  interval?: number
  textColor?: string
}

export function RotatingText({
  words = [],
  className = "",
  interval = 3000,
  textColor = "currentColor",
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (words.length <= 1) return

    const intervalId = setInterval(() => {
      setIsVisible(false)

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length)
        setIsVisible(true)
      }, 500) // Wait for exit animation to complete
    }, interval)

    return () => clearInterval(intervalId)
  }, [words.length, interval])

  if (words.length === 0) return null

  return (
    <div className={`overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ color: textColor }}
          >
            {words[currentIndex]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
