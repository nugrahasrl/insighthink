"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollPosition = window.scrollY
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight

      const progress = (scrollPosition / totalHeight) * 100
      setProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener("scroll", updateProgress)
    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return <Progress value={progress} className="fixed top-0 left-0 right-0 h-1 rounded-none z-50" />
}

