"use client"

import { useState, useEffect, useRef } from "react"
import gsap from "gsap"

interface VideoBackgroundProps {
  videoId: string
  delay?: number
}

export function VideoBackground({ videoId, delay = 3 }: VideoBackgroundProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isBrowser, setIsBrowser] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsBrowser(true)

    // Show video after delay
    const timer = setTimeout(() => {
      setIsVisible(true)

      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 1,
          duration: 2,
          ease: "power2.inOut",
        })
      }
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [delay])

  // If not in browser, don't render
  if (!isBrowser) return null

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-full z-0 pointer-events-none ${isVisible ? "opacity-0" : "opacity-0 hidden"}`}
      style={{
        mixBlendMode: "overlay",
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      <div className="relative w-full h-full">
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
          allow="autoplay; fullscreen; picture-in-picture"
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          title="Background Video"
        ></iframe>
      </div>
    </div>
  )
}
