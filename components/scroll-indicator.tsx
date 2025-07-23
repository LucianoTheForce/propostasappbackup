"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import gsap from "gsap"

export function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress (0 to 1)
      const scrollTop = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollTop / scrollHeight

      setScrollProgress(progress)

      // Hide indicator when scrolled past intro section
      const introSection = document.getElementById("intro")
      if (introSection) {
        const introBottom = introSection.offsetTop + introSection.offsetHeight
        if (scrollTop > introBottom - window.innerHeight / 2) {
          gsap.to(".scroll-indicator", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.inOut",
          })
        } else {
          gsap.to(".scroll-indicator", {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.inOut",
          })
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Verificar se estamos na seção intro para usar cores diferentes
  const isIntroSection = scrollProgress < 0.1
  const textColorClass = isIntroSection ? "text-black/50" : "text-white/50"
  const gradientClass = isIntroSection
    ? "bg-gradient-to-b from-black/50 to-transparent"
    : "bg-gradient-to-b from-white/50 to-transparent"

  return (
    <div className="fixed bottom-10 left-0 right-0 flex flex-col items-center justify-center z-50 scroll-indicator pointer-events-none">
      <div className={`text-xs uppercase tracking-widest ${textColorClass} mb-2`}>Scroll</div>
      <ChevronDown className={`h-6 w-6 ${textColorClass} animate-bounce`} />
      <div className={`w-[1px] h-12 ${gradientClass} mt-2`}></div>
    </div>
  )
}
