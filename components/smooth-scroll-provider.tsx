"use client"

import type React from "react"

import { useEffect, useRef, useState, createContext, useContext } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"

interface SmoothScrollContextType {
  scrollYProgress: any
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  scrollYProgress: null,
})

export const useSmoothScroll = () => useContext(SmoothScrollContext)

interface SmoothScrollProviderProps {
  children: React.ReactNode
  strength?: number
}

export function SmoothScrollProvider({ children, strength = 0.1 }: SmoothScrollProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)
  const { scrollYProgress } = useScroll()
  const [isBrowser, setIsBrowser] = useState(false)

  // Set isBrowser to true once component mounts
  useEffect(() => {
    setIsBrowser(true)
  }, [])

  useEffect(() => {
    // Garantir que o overflow não esteja sendo bloqueado
    if (isBrowser) {
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
    }
  }, [isBrowser])

  const smoothScrollY = useSpring(scrollYProgress, {
    damping: 50,
    stiffness: 400,
    mass: 0.5,
  })

  // Update body height to match content
  useEffect(() => {
    if (!isBrowser) return

    const updateHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.scrollHeight
        setContentHeight(height)
        // Não modificamos a altura do body para evitar espaços em branco
      }
    }

    updateHeight()

    // Update on resize
    window.addEventListener("resize", updateHeight)

    // Update when content changes
    const observer = new MutationObserver(updateHeight)
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      })
    }

    return () => {
      window.removeEventListener("resize", updateHeight)
      observer.disconnect()
    }
  }, [isBrowser])

  // Transform scroll progress to pixels
  const y = useTransform(smoothScrollY, [0, 1], [0, -contentHeight + (isBrowser ? window.innerHeight : 0)])

  // If not in browser, render children directly
  if (!isBrowser) {
    return <>{children}</>
  }

  return (
    <SmoothScrollContext.Provider value={{ scrollYProgress: smoothScrollY }}>
      <div style={{ position: "relative", width: "100%" }}>
        <motion.div ref={containerRef} style={{ y, position: "relative", width: "100%" }}>
          {children}
        </motion.div>
      </div>
    </SmoothScrollContext.Provider>
  )
}
