'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Photo {
  src: string
  no: string
}

interface Props {
  photos: Photo[]
  /** Auto-advance interval in ms. Default 10s. Set 0 to disable timer. */
  intervalMs?: number
  /** Outer wrapper className — passes through the grid col-span/row-span tokens from HOME_PHOTOS. */
  className?: string
}

/**
 * Photo 1 (top-left, largest) on the homepage Photographs section.
 *
 * Behavior (desktop only — md breakpoint, ≥768px):
 *  - Auto-advances through the supplied photo pool every `intervalMs` ms (default 10s).
 *  - Clicking advances immediately and resets the timer.
 *  - Cross-fades between photos over 400ms via CSS opacity transition (all photos
 *    render stacked; only the active one has opacity 1).
 *
 * Mobile (<md): renders photo[0] as a static image. No timer, click is a no-op.
 *
 * Pool note: by design (per operator Q&A 2026-05-21), the same `HOME_PHOTOS` array
 * is used for both the cycling Photo 1 and the static Photos 2–6. ~17% of the time
 * the cycling photo will visually match one of the static slots. Accepted tradeoff
 * pending more assets in `/public/MSizzle-website-photos/`.
 */
export function CyclingPhoto({ photos, intervalMs = 10000, className }: Props) {
  const [idx, setIdx] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)

  // Detect desktop breakpoint (matches Tailwind's md = 768px). Listen for resizes
  // so a mid-session viewport change correctly enables/disables cycling.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Auto-advance. Depends on idx so click-to-advance correctly resets the 10s timer
  // (each render schedules a fresh timeout; previous one is cleaned up).
  useEffect(() => {
    if (!isDesktop || intervalMs <= 0 || photos.length <= 1) return
    const t = setTimeout(() => {
      setIdx((i) => (i + 1) % photos.length)
    }, intervalMs)
    return () => clearTimeout(t)
  }, [idx, isDesktop, intervalMs, photos.length])

  const advance = () => {
    if (!isDesktop || photos.length <= 1) return
    setIdx((i) => (i + 1) % photos.length)
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={advance}
        className="relative block h-full w-full overflow-hidden md:cursor-pointer"
        aria-label={
          isDesktop && photos.length > 1
            ? `Photograph No. ${photos[idx].no}. Click to advance.`
            : `Photograph No. ${photos[idx].no}`
        }
      >
        {photos.map((p, i) => (
          <Image
            key={p.src}
            src={p.src}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 50vw"
            priority={i === 0}
            className={`object-cover saturate-[0.92] transition-opacity duration-[400ms] ease-in-out ${
              i === idx ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <span className="pointer-events-none absolute left-3.5 bottom-3 text-[10px] font-bold uppercase tracking-[0.2em] text-paper mix-blend-difference">
          No. {photos[idx].no}
        </span>
      </button>
    </div>
  )
}
