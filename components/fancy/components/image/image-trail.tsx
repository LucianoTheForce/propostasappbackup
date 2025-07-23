"use client"

import React, { type ElementType, type HTMLAttributes, useEffect, useMemo, useRef } from "react"
import { useAnimate } from "framer-motion"
import { cn } from "@/lib/utils"

interface ImageTrailProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The content to be displayed
   */
  children: React.ReactNode

  /**
   * HTML Tag
   */
  as?: ElementType

  /**
   * How much distance in pixels the mouse has to travel to trigger of an element to appear.
   */
  threshold?: number

  /**
   * The intensity for the momentum movement after showing the element. The value will be clamped > 0 and <= 1.0. Defaults to 0.3.
   */
  intensity?: number

  /**
   * Animation Keyframes for defining the animation sequence. Example: { scale: [0, 1, 1, 0] }
   */
  keyframes?: any

  /**
   * Options for the animation/keyframes. Example: { duration: 1, times: [0, 0.1, 0.9, 1] }
   */
  keyframesOptions?: any

  /**
   * Animation keyframes for the x and y positions after showing the element. Describes how the element should try to arrive at the mouse position.
   */
  trailElementAnimationKeyframes?: {
    x?: any
    y?: any
  }

  /**
   * The number of times the children will be repeated. Defaults to 3.
   */
  repeatChildren?: number

  /**
   * The base zIndex for all elements. Defaults to 0.
   */
  baseZIndex?: number

  /**
   * Controls stacking order behavior.
   * - "new-on-top": newer elements stack above older ones (default)
   * - "old-on-top": older elements stay visually on top
   */
  zIndexDirection?: "new-on-top" | "old-on-top"
}

interface ImageTrailItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * HTML Tag
   */
  as?: ElementType

  /**
   * The content to be displayed
   */
  children: React.ReactNode
}

/**
 * Helper functions
 */
const MathUtils = {
  // linear interpolation
  lerp: (a: number, b: number, n: number) => (1 - n) * a + n * b,
  // distance between two points
  distance: (x1: number, y1: number, x2: number, y2: number) => Math.hypot(x2 - x1, y2 - y1),
}

const ImageTrail = ({
  className,
  as = "div",
  children,
  threshold = 100,
  intensity = 0.3,
  keyframes,
  keyframesOptions,
  repeatChildren = 3,
  trailElementAnimationKeyframes = {
    x: { duration: 1, type: "tween", ease: "easeOut" },
    y: { duration: 1, type: "tween", ease: "easeOut" },
  },
  baseZIndex = 0,
  zIndexDirection = "new-on-top",
  ...props
}: ImageTrailProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const allImages = useRef<NodeListOf<HTMLElement>>()
  const currentId = useRef(0)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const cachedMousePos = useRef({ x: 0, y: 0 })
  const zIndices = useRef<number[]>([])
  const [scope, animate] = useAnimate()

  const clampedIntensity = useMemo(() => Math.max(0.0001, Math.min(1, intensity)), [intensity])

  useEffect(() => {
    if (containerRef.current) {
      allImages.current = containerRef.current.querySelectorAll(".image-trail-item") as NodeListOf<HTMLElement>
      zIndices.current = Array.from({ length: allImages.current?.length || 0 }, (_, index) => index)
    }
  }, [containerRef, children, repeatChildren])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !allImages.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const mousePos = {
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top,
    }

    // Certifique-se de que as coordenadas estão dentro dos limites do contêiner
    if (mousePos.x < 0 || mousePos.x > containerRect.width || mousePos.y < 0 || mousePos.y > containerRect.height) {
      return
    }

    cachedMousePos.current.x = MathUtils.lerp(cachedMousePos.current.x || mousePos.x, mousePos.x, clampedIntensity)
    cachedMousePos.current.y = MathUtils.lerp(cachedMousePos.current.y || mousePos.y, mousePos.y, clampedIntensity)

    const distance = MathUtils.distance(mousePos.x, mousePos.y, lastMousePos.current.x, lastMousePos.current.y)

    if (distance > threshold && allImages.current) {
      const N = allImages.current.length
      const current = currentId.current

      if (zIndexDirection === "new-on-top") {
        // Shift others down, put current on top
        for (let i = 0; i < N; i++) {
          if (i !== current) {
            zIndices.current[i] -= 1
          }
        }
        zIndices.current[current] = N - 1
      } else {
        // Shift others up, put current at bottom
        for (let i = 0; i < N; i++) {
          if (i !== current) {
            zIndices.current[i] += 1
          }
        }
        zIndices.current[current] = 0
      }

      allImages.current[current].style.display = "block"
      allImages.current.forEach((img, index) => {
        img.style.zIndex = String(zIndices.current[index] + baseZIndex)
      })

      // Animate the current element
      const currentElement = allImages.current[currentId.current]

      animate(
        currentElement,
        {
          x: [cachedMousePos.current.x - currentElement.offsetWidth / 2, mousePos.x - currentElement.offsetWidth / 2],
          y: [cachedMousePos.current.y - currentElement.offsetHeight / 2, mousePos.y - currentElement.offsetHeight / 2],
          ...keyframes,
        },
        {
          ...trailElementAnimationKeyframes.x,
          ...trailElementAnimationKeyframes.y,
          ...keyframesOptions,
        },
      )

      currentId.current = (current + 1) % N
      lastMousePos.current = { x: mousePos.x, y: mousePos.y }
    }
  }

  // Adicione este useEffect após o useEffect existente
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        // Atualiza a posição do contêiner quando a página é rolada
        const containerRect = containerRef.current.getBoundingClientRect()
        // Reseta as posições do mouse quando o contêiner muda de posição
        lastMousePos.current = {
          x: lastMousePos.current.x,
          y: lastMousePos.current.y,
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const ElementTag = as as any

  return (
    <ElementTag
      ref={(el: HTMLDivElement) => {
        containerRef.current = el
        if (typeof scope === "function") {
          scope(el)
        }
      }}
      className={cn("h-full w-full relative", className)}
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        minHeight: "100%",
        width: "100%",
        ...props.style,
      }}
      {...props}
    >
      {Array.from({ length: repeatChildren }).map((_, index) => (
        <React.Fragment key={index}>{children}</React.Fragment>
      ))}
    </ElementTag>
  )
}

// Modifique a função ImageTrailItem para melhorar o tratamento de erros
export const ImageTrailItem = ({ className, children, as = "div", ...props }: ImageTrailItemProps) => {
  const ElementTag = as as any
  return (
    <ElementTag
      {...props}
      className={cn("absolute top-0 left-0 will-change-transform hidden", className, "image-trail-item")}
      style={{
        ...props.style,
        // Adicionar um z-index alto para garantir que os itens apareçam acima de outros elementos
        zIndex: 10,
      }}
    >
      {children}
    </ElementTag>
  )
}

export default ImageTrail
