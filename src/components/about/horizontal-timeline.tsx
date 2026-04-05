'use client'

import { useState } from 'react'
import { MapPin, X as CloseIcon } from 'lucide-react'
import type { TimelineEvent } from './timeline'

interface EventVisual {
  /** emoji fallback */
  emoji: string
  /** optional logo image path (e.g. /logos/prometheus.png) */
  logo?: string
}

interface HorizontalTimelineProps {
  events: TimelineEvent[]
  visuals: Record<string, EventVisual>
}

export function HorizontalTimeline({ events, visuals }: HorizontalTimelineProps) {
  const [selected, setSelected] = useState<TimelineEvent | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Events oldest → newest, left → right
  const ordered = [...events].reverse()

  const renderIcon = (event: TimelineEvent, size: 'sm' | 'lg') => {
    const visual = visuals[event.id] ?? { emoji: '📍' }
    const showLogo = visual.logo && !imageErrors[event.id]
    if (showLogo) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={visual.logo}
          alt={event.title}
          className={size === 'sm' ? 'h-8 w-8 object-contain' : 'h-12 w-12 object-contain'}
          onError={() => setImageErrors((e) => ({ ...e, [event.id]: true }))}
        />
      )
    }
    return <span className={size === 'sm' ? 'text-2xl' : 'text-4xl'}>{visual.emoji}</span>
  }

  return (
    <div className="relative">
      {/* Scrollable landscape */}
      <div className="overflow-x-auto pb-4">
        <div className="relative h-80 min-w-[1400px]">
          {/* SVG Landscape background */}
          <svg
            viewBox="0 0 1400 320"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#BFD7FF" />
                <stop offset="100%" stopColor="#F4FAFF" />
              </linearGradient>
              <linearGradient id="water" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#007EA7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#007EA7" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Sky */}
            <rect width="1400" height="240" fill="url(#sky)" />

            {/* Sun */}
            <circle cx="1250" cy="70" r="28" fill="#FFBA49" opacity="0.9" />

            {/* Far mountains with snow caps */}
            <path
              d="M0,200 L80,140 L140,170 L200,100 L260,150 L320,180 L400,120 L460,160 L520,190 L600,140 L680,170 L760,110 L820,150 L900,180 L1000,130 L1080,170 L1160,200 L1240,150 L1320,180 L1400,160 L1400,240 L0,240 Z"
              fill="#d0e0f0"
            />
            {/* Snow caps */}
            {[[180,115,200,100,220,115],[380,135,400,120,420,135],[740,125,760,110,780,125],[980,145,1000,130,1020,145]].map((p, i) => (
              <path
                key={i}
                d={`M${p[0]},${p[1]} L${p[2]},${p[3]} L${p[4]},${p[5]} L${p[4]-10},${p[5]+5} L${p[2]},${p[5]+3} L${p[0]+10},${p[5]+7} Z`}
                fill="white"
              />
            ))}

            {/* Near hills */}
            <path
              d="M0,220 Q100,190 200,210 T400,205 T600,215 T800,200 T1000,215 T1200,205 T1400,210 L1400,240 L0,240 Z"
              fill="#8bc58a"
              opacity="0.7"
            />

            {/* Ground */}
            <rect y="240" width="1400" height="50" fill="#a8d5a2" />

            {/* Water pond (middle) */}
            <ellipse cx="700" cy="282" rx="140" ry="16" fill="url(#water)" />
            {/* pond highlight */}
            <ellipse cx="680" cy="278" rx="40" ry="3" fill="white" opacity="0.5" />

            {/* Trees scattered */}
            {[120, 260, 380, 520, 620, 870, 960, 1080, 1200, 1320].map((x, i) => (
              <g key={i} transform={`translate(${x}, 225)`}>
                <polygon points="0,-16 -9,0 9,0" fill="#4a7c4e" />
                <polygon points="0,-11 -7,4 7,4" fill="#5a8c5e" />
                <rect x="-2" y="4" width="4" height="6" fill="#6b4423" />
              </g>
            ))}

            {/* A little deer near the pond */}
            <g transform="translate(560, 268)">
              <ellipse cx="0" cy="0" rx="6" ry="3" fill="#8b5a2b" />
              <rect x="-4" y="0" width="1.5" height="5" fill="#8b5a2b" />
              <rect x="3" y="0" width="1.5" height="5" fill="#8b5a2b" />
              <circle cx="6" cy="-2" r="2" fill="#8b5a2b" />
              <polygon points="5,-4 6,-6 7,-4" fill="#6b4423" />
            </g>

            {/* A bird in the sky */}
            <path d="M300,80 Q305,75 310,80 Q315,75 320,80" stroke="#333" strokeWidth="1.5" fill="none" />
            <path d="M900,60 Q905,55 910,60 Q915,55 920,60" stroke="#333" strokeWidth="1.5" fill="none" />

            {/* Path line */}
            <path
              d="M40,250 Q200,245 400,252 T800,248 T1200,253 T1380,250"
              stroke="#007EA7"
              strokeWidth="3"
              fill="none"
              strokeDasharray="6 4"
              opacity="0.6"
            />
          </svg>

          {/* Event markers */}
          {ordered.map((event, idx) => {
            const leftPercent = 5 + (90 * idx) / Math.max(1, ordered.length - 1)
            return (
              <button
                key={event.id}
                onClick={() => setSelected(event)}
                className="group absolute flex -translate-x-1/2 flex-col items-center"
                style={{ left: `${leftPercent}%`, top: '52%' }}
                aria-label={event.title}
              >
                <span className="mb-1 rounded-full bg-[var(--bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--fg-muted)] shadow-sm">
                  {event.year}
                </span>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-white shadow-lg transition-transform duration-200 group-hover:scale-125 group-hover:shadow-xl">
                  {renderIcon(event, 'sm')}
                </div>
                <span className="mt-2 max-w-[110px] text-center text-[11px] font-semibold leading-tight text-[var(--fg)] group-hover:text-[var(--accent)]">
                  {event.subtitle}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Hint */}
      <p className="mt-2 text-center text-xs text-[var(--fg-muted)] sm:hidden">
        Swipe to explore &rarr;
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

            <div>{renderIcon(selected, 'lg')}</div>

            <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
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
