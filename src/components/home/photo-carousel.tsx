'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface PhotoCarouselProps {
  photos: string[]
}

export function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (photos.length <= 1) return
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [photos.length])

  if (photos.length === 0) return null

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
      {photos.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`Photo ${i + 1}`}
          fill
          className={`object-cover transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="(max-width: 768px) 100vw, 896px"
          priority={i === 0}
        />
      ))}

      {/* Dots */}
      {photos.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
              }`}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
