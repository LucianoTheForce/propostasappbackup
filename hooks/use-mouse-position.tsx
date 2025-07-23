"use client"

import { useState, useEffect, useRef } from "react"

interface MousePosition {
  x: number
  y: number
}

export function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  })
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    const updateMousePosition = (ev: MouseEvent) => {
      if (isMounted.current) {
        setMousePosition({ x: ev.clientX, y: ev.clientY })
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", updateMousePosition)
    }

    return () => {
      isMounted.current = false
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", updateMousePosition)
      }
    }
  }, [])

  return mousePosition
}
