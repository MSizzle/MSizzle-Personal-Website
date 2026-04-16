'use client'

import { useState, useEffect } from 'react'

const TAGLINES = [
  'Building AI integrations and education at Prometheus.',
  'Founder. Builder. Writer.',
  'Shipping software, essays, and experiments.',
  'Tinkering with whatever is interesting.',
  'Always learning, always shipping.',
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
          className={`absolute inset-0 text-base opacity-75 transition-all duration-500 ${
            i === index
              ? 'translate-y-0 opacity-75'
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
