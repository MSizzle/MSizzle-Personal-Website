'use client'

import { useState } from 'react'
import { MapPin, X as CloseIcon } from 'lucide-react'
import type { TimelineEvent } from './timeline'

interface EventVisual {
  emoji: string
  logo?: string
}

interface HorizontalTimelineProps {
  events: TimelineEvent[]
  visuals: Record<string, EventVisual>
}

// Each event gets a position along the landscape and a vertical offset
// relative to the baseline. Scenery features are drawn behind them.
const POSITIONS: Record<string, { x: number; y: number }> = {
  elevate: { x: 6, y: 50 },
  'global-platinum': { x: 15, y: 30 },
  orbit: { x: 24, y: 15 },
  teton: { x: 33, y: 5 }, // Teton peak
  sustany: { x: 44, y: 75 }, // by the pond
  'georgetown-ventures': { x: 54, y: 55 },
  inari: { x: 64, y: 65 },
  leerink: { x: 73, y: 35 },
  e2b4: { x: 84, y: 45 },
  prometheus: { x: 94, y: 25 }, // temple on the hill
}

export function HorizontalTimeline({ events, visuals }: HorizontalTimelineProps) {
  const [selected, setSelected] = useState<TimelineEvent | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const ordered = [...events].reverse()

  const renderLogo = (event: TimelineEvent) => {
    const visual = visuals[event.id] ?? { emoji: '📍' }
    const showLogo = visual.logo && !imageErrors[event.id]
    if (showLogo) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={visual.logo}
          alt={event.title}
          className="max-h-12 max-w-12 object-contain"
          onError={() => setImageErrors((e) => ({ ...e, [event.id]: true }))}
        />
      )
    }
    return <span className="text-2xl">{visual.emoji}</span>
  }

  return (
    <div className="relative">
      {/* Scrollable landscape */}
      <div className="overflow-x-auto pb-2">
        <div className="relative min-w-[1200px]">
          {/* Minimalist SVG landscape — single color shapes */}
          <svg
            viewBox="0 0 1200 420"
            className="block h-[420px] w-full"
            preserveAspectRatio="xMidYMax meet"
          >
            {/* Baseline */}
            <line
              x1="0"
              y1="360"
              x2="1200"
              y2="360"
              stroke="var(--border)"
              strokeWidth="1"
            />

            {/* Distant mountain range (outline only, very minimalist) */}
            <path
              d="M 0 360 L 80 300 L 140 330 L 220 250 L 300 310 L 400 220 L 500 300 L 600 340 L 720 260 L 820 310 L 920 280 L 1020 320 L 1100 290 L 1200 330 L 1200 360 Z"
              fill="#007EA7"
              fillOpacity="0.08"
              stroke="#007EA7"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Snow caps — simple white triangles */}
            <polygon points="216,258 220,250 224,258" fill="#007EA7" fillOpacity="0.3" />
            <polygon points="396,228 400,220 404,228" fill="#007EA7" fillOpacity="0.3" />
            <polygon points="716,268 720,260 724,268" fill="#007EA7" fillOpacity="0.3" />

            {/* Pond — single color ellipse */}
            <ellipse
              cx="528"
              cy="345"
              rx="70"
              ry="7"
              fill="#007EA7"
              fillOpacity="0.25"
            />

            {/* Sun (minimalist circle outline) */}
            <circle
              cx="1080"
              cy="80"
              r="18"
              fill="none"
              stroke="#FFBA49"
              strokeWidth="2"
            />

            {/* A few minimal trees (just triangles) */}
            {[680, 860, 1000].map((x, i) => (
              <polygon
                key={i}
                points={`${x},355 ${x - 6},365 ${x + 6},365`}
                fill="#007EA7"
                fillOpacity="0.4"
              />
            ))}
          </svg>

          {/* Logos positioned absolutely over the scene */}
          {ordered.map((event) => {
            const pos = POSITIONS[event.id] ?? { x: 50, y: 50 }
            const isHovered = hovered === event.id
            return (
              <button
                key={event.id}
                onClick={() => setSelected(event)}
                onMouseEnter={() => setHovered(event.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(event.id)}
                onBlur={() => setHovered(null)}
                className="group absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `translate(-50%, -50%) scale(${isHovered ? 1.6 : 1})`,
                  zIndex: isHovered ? 10 : 1,
                }}
                aria-label={event.title}
              >
                <div className="flex h-12 w-12 items-center justify-center">
                  {renderLogo(event)}
                </div>

                {/* Label appears on hover */}
                <div
                  className={`absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--bg)] px-2 py-1 text-[10px] font-semibold shadow-md transition-opacity duration-200 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {event.subtitle} · {event.year}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-[var(--fg-muted)]">
        Hover to see details, click to learn more.
      </p>

      {/* Modal popup */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 text-[var(--fg-muted)] hover:text-foreground"
              aria-label="Close"
            >
              <CloseIcon size={18} />
            </button>

            <div className="flex h-16 w-16 items-center justify-center">
              {renderLogo(selected)}
            </div>

            <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
              {selected.date}
            </div>
            <h3 className="mt-1 text-xl font-bold tracking-tight">{selected.title}</h3>
            <p className="text-sm text-[var(--fg-muted)]">{selected.subtitle}</p>

            {selected.location && (
              <div className="mt-3 flex items-center gap-1 text-xs text-[var(--fg-muted)]">
                <MapPin size={12} />
                {selected.location}
              </div>
            )}

            <p className="mt-4 text-sm leading-relaxed">{selected.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}
