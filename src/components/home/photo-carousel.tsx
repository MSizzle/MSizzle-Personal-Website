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
    <div className="relative overflow-hidden">
      <div className="flex w-max animate-scroll-left gap-4">
        {doubled.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative h-96 w-[36rem] shrink-0 overflow-hidden border border-[var(--border)] sm:h-[32rem] sm:w-[48rem]"
          >
            <Image
              src={src}
              alt={`Photo ${(i % photos.length) + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 576px, 768px"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
