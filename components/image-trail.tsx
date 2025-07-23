"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useSpring } from "framer-motion"
import { useMousePosition } from "@/hooks/use-mouse-position"

interface ImageTrailProps {
  images: string[]
  quantity?: number
  className?: string
}

export function ImageTrail({ images, quantity = 10, className = "" }: ImageTrailProps) {
  const mousePosition = useMousePosition()
  const mouseXSpring = useSpring(mousePosition.x)
  const mouseYSpring = useSpring(mousePosition.y)
  const [isActive, setIsActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerBounds, setContainerBounds] = useState({ left: 0, top: 0, width: 0, height: 0 })
  const isMounted = useRef(false)

  // Atualizar as dimensões do container quando o componente montar ou a janela for redimensionada
  useEffect(() => {
    isMounted.current = true

    const updateBounds = () => {
      if (!isMounted.current || !containerRef.current) return

      const bounds = containerRef.current.getBoundingClientRect()
      setContainerBounds({
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
      })
    }

    updateBounds()

    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateBounds)
      window.addEventListener("scroll", updateBounds)
    }

    return () => {
      isMounted.current = false
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", updateBounds)
        window.removeEventListener("scroll", updateBounds)
      }
    }
  }, [])

  // Verificar se o mouse está dentro do container
  useEffect(() => {
    if (!isMounted.current) return

    const checkIfActive = () => {
      if (!isMounted.current) return

      if (
        mousePosition.x >= containerBounds.left &&
        mousePosition.x <= containerBounds.left + containerBounds.width &&
        mousePosition.y >= containerBounds.top &&
        mousePosition.y <= containerBounds.top + containerBounds.height
      ) {
        setIsActive(true)
      } else {
        setIsActive(false)
      }
    }

    checkIfActive()

    return () => {
      // Cleanup
    }
  }, [mousePosition.x, mousePosition.y, containerBounds])

  // Garantir que temos imagens para exibir
  const safeImages = images && images.length > 0 ? images : ["/placeholder.svg"]

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Imagens que seguem o mouse */}
      {Array.from({ length: quantity }).map((_, i) => {
        // Calcular o atraso com base no índice
        const delay = i * 0.05

        // Selecionar uma imagem aleatória do array
        const randomImage = safeImages[Math.floor(Math.random() * safeImages.length)]

        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: mouseXSpring,
              top: mouseYSpring,
              x: `-50%`,
              y: `-50%`,
              opacity: isActive ? 0.7 : 0,
              scale: isActive ? 1 : 0.3,
              zIndex: quantity - i,
              filter: "contrast(1.1) saturate(1.1)",
              mixBlendMode: "multiply",
            }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
              mass: 0.5 + i * 0.1,
              delay: delay,
            }}
          >
            <motion.div
              initial={{ rotate: 0, scale: 0.8 }}
              animate={{
                rotate: Math.random() * 30 - 15,
                scale: 0.8 + Math.random() * 0.4,
              }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 200,
                mass: 0.8,
                delay: delay,
              }}
            >
              <img
                src={randomImage || "/placeholder.svg"}
                alt={`Project ${i}`}
                className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-lg shadow-lg"
                style={{
                  transform: `rotate(${Math.random() * 20 - 10}deg)`,
                }}
              />
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
