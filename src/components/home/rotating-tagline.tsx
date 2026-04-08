'use client'

import { useState, useEffect } from 'react'

const TAGLINES = [
  'Building at the intersection of technology and finance.',
  'Georgetown grad, lifelong learner, always shipping.',
  'Investor by day, builder by night.',
  'Reading, writing, and tinkering in NYC.',
  'Making something new every week.',
]

export function RotatingTagline() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % TAGLINES.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-7 overflow-hidden">
      {TAGLINES.map((tagline, i) => (
        <p
          key={i}
          className={`absolute inset-0 text-base opacity-50 transition-all duration-500 ${
            i === index
              ? 'translate-y-0 opacity-50'
              : i < index
              ? '-translate-y-full opacity-0'
              : 'translate-y-full opacity-0'
          }`}
        >
          {tagline}
        </p>
      ))}
    </div>
  )
}
