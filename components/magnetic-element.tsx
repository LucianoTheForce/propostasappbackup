"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"

// Adicione uma propriedade para controlar o efeito de brilho
interface MagneticElementProps {
  children: React.ReactNode
  className?: string
  strength?: number
  radius?: number
  dragStrength?: number
  glowEffect?: boolean
  onClick?: () => void
}

export function MagneticElement({
  children,
  className = "",
  strength = 30,
  radius = 400,
  dragStrength = 0.3,
  glowEffect = false,
  onClick,
}: MagneticElementProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)

    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect()
      setSize({ width, height })
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !isBrowser) return

    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()

    const centerX = left + width / 2
    const centerY = top + height / 2

    const distanceX = clientX - centerX
    const distanceY = clientY - centerY
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

    // Only apply magnetic effect within radius
    if (distance < radius) {
      const magneticX = (distanceX / radius) * strength
      const magneticY = (distanceY / radius) * strength

      setPosition({ x: magneticX, y: magneticY })
    } else {
      // Gradually return to center when outside radius
      setPosition({
        x: position.x * dragStrength,
        y: position.y * dragStrength,
      })
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    // Animate back to center
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      className={`magnetic-element ${glowEffect ? "price-glow" : ""} ${className}`}
      animate={{
        x: position.x,
        y: position.y,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      onMouseMove={isBrowser ? handleMouseMove : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
