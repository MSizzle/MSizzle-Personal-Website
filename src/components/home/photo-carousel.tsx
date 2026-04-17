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
    <div className="relative overflow-hidden px-6">
      <div className="flex w-max animate-scroll-left gap-4">
        {doubled.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative h-72 w-[27rem] shrink-0 overflow-hidden sm:h-[24rem] sm:w-[36rem]"
          >
            <Image
              src={src}
              alt={`Photo ${(i % photos.length) + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 432px, 576px"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
