"use client"

import { useState } from "react"
import Image from "next/image"

interface BookCoverProps {
  imageUrl: string
  title: string
}

export function BookCover({ imageUrl, title }: BookCoverProps) {
  const [error, setError] = useState(false)
  const placeholderUrl = "/placeholder.svg?height=600&width=400"

  return (
    <div className="relative w-full h-full">
      <Image
        src={error ? placeholderUrl : imageUrl}
        alt={`Cover of ${title}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
        onError={() => setError(true)}
        priority
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <div className="text-center p-4">
            <p className="font-medium text-muted-foreground">{title}</p>
            <p className="text-sm text-muted-foreground/70">Cover not available</p>
          </div>
        </div>
      )}
    </div>
  )
}

