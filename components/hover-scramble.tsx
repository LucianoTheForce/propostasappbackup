"use client"

import { useState, useRef, useEffect } from "react"

interface HoverScrambleProps {
  text: string
  className?: string
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
}

export function HoverScramble({ text, className = "", tag = "span" }: HoverScrambleProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [displayText, setDisplayText] = useState(text)
  const chars = "!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const animationRef = useRef<number | null>(null)

  const scrambleText = () => {
    let iterations = 0
    const maxIterations = 10

    const scramble = () => {
      if (iterations >= maxIterations) {
        setDisplayText(text)
        animationRef.current = null
        return
      }

      const scrambledText = text
        .split("")
        .map((char, index) => {
          // Keep spaces and special characters
          if (char === " " || char === "." || char === "," || char === ":" || char === ";") {
            return char
          }

          // Gradually reveal original characters as iterations increase
          const revealThreshold = (iterations / maxIterations) * text.length
          if (index < revealThreshold) {
            return char
          }

          // Otherwise return a random character
          return chars[Math.floor(Math.random() * chars.length)]
        })
        .join("")

      setDisplayText(scrambledText)
      iterations++

      animationRef.current = requestAnimationFrame(scramble)
    }

    scramble()
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const handleMouseEnter = () => {
    setIsHovering(true)
    scrambleText()

  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      setDisplayText(text)
    }
  }

  const Tag = tag

  return (
    <Tag
      className={`hover-scramble ${tag.startsWith("h") ? "block" : ""} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </Tag>
  )
}
