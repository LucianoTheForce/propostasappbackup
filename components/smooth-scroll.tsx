"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
// import { ScrollToPlugin } from "gsap/ScrollToPlugin"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface SmoothScrollProps {
  children: React.ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip on server-side rendering
    if (typeof window === "undefined") return

    // Store the original scroll position
    let scrollY = window.scrollY

    // Setup smooth scrolling
    const setupSmoothScroll = () => {
      const scrollContainer = scrollContainerRef.current
      if (!scrollContainer) return

      // Create a timeline for each section
      const sections = document.querySelectorAll("section")

      sections.forEach((section) => {
        // Create scroll trigger for each section
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom-=100",
          end: "bottom top+=100",
          toggleClass: { targets: section, className: "active" },
          onEnter: () => {
            gsap.to(section, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              overwrite: "auto",
            })
          },
          onLeaveBack: () => {
            gsap.to(section, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              overwrite: "auto",
            })
          },
        })
      })

      // Smooth scroll to section when clicking navigation
      const navLinks = document.querySelectorAll("[data-scroll-to]")

      navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault()
          const targetId = link.getAttribute("data-scroll-to")
          if (!targetId) return

          const targetElement = document.getElementById(targetId)
          if (!targetElement) return

          // Usar scrollIntoView nativo para maior compatibilidade
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" })
        })
      })
    }

    // Initialize smooth scroll
    setupSmoothScroll()

    // Add scroll listener for parallax effects
    const handleScroll = () => {
      // Calculate scroll direction and speed
      const newScrollY = window.scrollY
      const scrollDirection = newScrollY > scrollY ? 1 : -1
      const scrollSpeed = Math.abs(newScrollY - scrollY)

      // Update scroll position
      scrollY = newScrollY

      // Apply parallax effect to elements with data-parallax attribute
      const parallaxElements = document.querySelectorAll("[data-parallax]")
      parallaxElements.forEach((element) => {
        const speed = Number.parseFloat(element.getAttribute("data-parallax") || "0.1")
        const yOffset = scrollDirection * scrollSpeed * speed

        gsap.to(element, {
          y: `+=${yOffset}`,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        })
      })
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div ref={scrollContainerRef} className="smooth-scroll-container">
      {children}
    </div>
  )
}
