'use client'

import Image from 'next/image'

interface PhotoCarouselProps {
  photos: string[]
}

export function PhotoCarousel({ photos }: PhotoCarouselProps) {
  if (photos.length === 0) return null

  // Duplicate the list so the scroll loops seamlessly
  const doubled = [...photos, ...photos]

  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] py-4">
      <div className="flex w-max animate-scroll-left gap-4">
        {doubled.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative h-48 w-72 shrink-0 overflow-hidden rounded-lg sm:h-64 sm:w-96"
          >
            <Image
              src={src}
              alt={`Photo ${(i % photos.length) + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 288px, 384px"
              priority={i < 2}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
