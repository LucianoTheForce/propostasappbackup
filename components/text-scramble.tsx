"use client"

import { useState, useEffect, useRef } from "react"

interface TextScrambleProps {
  text: string
  className?: string
}

export function TextScramble({ text, className = "" }: TextScrambleProps) {
  const [output, setOutput] = useState("")
  const chars = "!<>-_\\/[]{}—=+*^?#________"
  const frameRef = useRef(0)
  const queueRef = useRef<number[]>([])
  const frameRequestRef = useRef<number | null>(null)

  useEffect(() => {
    const currentText = ""
    const finalText = text
    let frame = 0
    const queue: number[] = []

    for (let i = 0, n = Math.max(finalText.length, currentText.length); i < n; i++) {
      const from = currentText[i] || ""
      const to = finalText[i] || ""
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      queue.push(start, end)
    }

    queueRef.current = queue

    const update = () => {
      let output = ""
      let complete = 0

      for (let i = 0, n = finalText.length; i < n; i++) {
        let char = finalText[i]
        const q = queueRef.current

        if (frame >= q[i * 2 + 1]) {
          complete++
          output += char
        } else if (frame >= q[i * 2]) {
          if (Math.random() < 0.28) {
            char = chars[Math.floor(Math.random() * chars.length)]
          }
          output += `<span class="text-primary">${char}</span>`
        } else {
          output += ""
        }
      }

      setOutput(output)

      if (complete === finalText.length) {
        if (frameRequestRef.current) {
          cancelAnimationFrame(frameRequestRef.current)
        }
        return
      }

      frame++
      frameRef.current = frame
      frameRequestRef.current = requestAnimationFrame(update)
    }

    frameRequestRef.current = requestAnimationFrame(update)

    return () => {
      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current)
      }
    }
  }, [text])

  return <span className={className} dangerouslySetInnerHTML={{ __html: output }} />
}
