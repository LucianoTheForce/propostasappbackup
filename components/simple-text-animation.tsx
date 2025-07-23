"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"

interface SimpleTextAnimationProps {
  children: string
  className?: string
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div" | "span"
  delay?: number
  duration?: number
  type?: "fade" | "slide" | "reveal" | "typewriter" | "stagger"
  threshold?: number
  fontWeight?: "normal" | "bold" | "extrabold"
}

export function SimpleTextAnimation({
  children,
  className = "",
  tag: Tag = "div",
  delay = 0,
  duration = 1,
  type = "fade",
  threshold = 0.5,
  fontWeight = "normal",
}: SimpleTextAnimationProps) {
  const textRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!textRef.current || hasAnimated.current) return

    const element = textRef.current

    // Create observer to trigger animation when element is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            animateText()
            observer.unobserve(element)
          }
        })
      },
      { threshold },
    )

    observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [children, threshold, type])

  const animateText = () => {
    if (!textRef.current) return

    const element = textRef.current


    // Different animation types
    switch (type) {
      case "fade":
        gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration, delay, ease: "power2.out" })
        break

      case "slide":
        gsap.fromTo(element, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration, delay, ease: "power2.out" })
        break

      case "reveal":
        // Create a wrapper and mask for reveal effect
        element.style.overflow = "hidden"

        gsap.fromTo(element.firstChild, { y: "100%" }, { y: "0%", duration, delay, ease: "power2.out" })
        break

      case "typewriter":
        // Typewriter effect
        const text = element.textContent || ""
        element.textContent = ""

        const tl = gsap.timeline({ delay })

        for (let i = 0; i < text.length; i++) {
          tl.add(() => {
            element.textContent = text.substring(0, i + 1)

          }, i * 0.05)
        }
        break

      case "stagger":
        // Split text into spans for staggered animation
        const words = children.split(" ")
        element.innerHTML = ""

        words.forEach((word, index) => {
          const span = document.createElement("span")
          span.textContent = word
          span.style.display = "inline-block"
          span.style.opacity = "0"
          span.style.transform = "translateY(20px)"
          element.appendChild(span)

          // Add space after each word (except the last one)
          if (index < words.length - 1) {
            const space = document.createElement("span")
            space.innerHTML = "&nbsp;"
            space.style.display = "inline-block"
            element.appendChild(space)
          }
        })

        gsap.to(element.children, {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.8,
          delay,
          ease: "power2.out",
        })
        break
    }
  }

  // Apply font weight class
  const fontWeightClass =
    fontWeight === "bold" ? "font-bold" : fontWeight === "extrabold" ? "font-extrabold" : "font-normal"

  return (
    <Tag
      ref={textRef}
      className={`simple-text-animation ${fontWeightClass} ${className}`}
      style={{ whiteSpace: "pre-wrap" }}
    >
      {type === "reveal" ? <div>{children}</div> : children}
    </Tag>
  )
}
