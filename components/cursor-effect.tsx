"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

export function CursorEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")
  const [isBrowser, setIsBrowser] = useState(false)
  // Adicionar uma ref para rastrear se o componente está montado
  const isMounted = useRef(false)

  useEffect(() => {
    setIsBrowser(true)
    isMounted.current = true

    // Função para lidar com o movimento do mouse
    const mouseMove = (e: MouseEvent) => {
      if (isMounted.current) {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        })
      }
    }

    // Função para lidar com o hover
    const handleMouseOver = (e: MouseEvent) => {
      if (!isMounted.current) return

      const target = e.target as HTMLElement

      if (target.tagName === "A" || target.tagName === "BUTTON" || target.closest('[data-cursor="pointer"]')) {
        setCursorVariant("hover")
      } else {
        setCursorVariant("default")
      }
    }

    // Adicionar event listeners apenas no lado do cliente
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", mouseMove)
      window.addEventListener("mouseover", handleMouseOver)
    }

    return () => {
      isMounted.current = false
      // Remover event listeners na desmontagem
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", mouseMove)
        window.removeEventListener("mouseover", handleMouseOver)
      }
    }
  }, []) // Dependência vazia para executar apenas uma vez na montagem

  // Não renderizar no servidor ou se não estiver no navegador
  if (!isBrowser) return null

  const variants = {
    default: {
      x: mousePosition.x,
      y: mousePosition.y,
      height: 20,
      width: 20,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      transition: {
        type: "spring",
        mass: 0.1,
        stiffness: 800,
        damping: 30,
      },
    },
    hover: {
      x: mousePosition.x,
      y: mousePosition.y,
      height: 40,
      width: 40,
      backgroundColor: "rgba(120, 41, 230, 0.5)",
      transition: {
        type: "spring",
        mass: 0.1,
        stiffness: 800,
        damping: 30,
      },
    },
  }

  const followerVariants = {
    default: {
      x: mousePosition.x,
      y: mousePosition.y,
      transition: {
        type: "spring",
        mass: 0.3,
        stiffness: 200,
        damping: 25,
      },
    },
  }

  return (
    <>
      <motion.div className="custom-cursor hidden md:block" variants={variants} animate={cursorVariant} />
      <motion.div className="cursor-follower hidden md:block" variants={followerVariants} animate="default" />
    </>
  )
}
