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

export function HorizontalTimeline({ events, visuals }: HorizontalTimelineProps) {
  const [selected, setSelected] = useState<TimelineEvent | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

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
          className={size === 'sm' ? 'max-h-10 max-w-10 object-contain' : 'max-h-14 max-w-14 object-contain'}
          onError={() => setImageErrors((e) => ({ ...e, [event.id]: true }))}
        />
      )
    }
    return <span className={size === 'sm' ? 'text-2xl' : 'text-4xl'}>{visual.emoji}</span>
  }

  return (
    <div className="relative">
      <div className="overflow-x-auto pb-2">
        <div className="relative min-w-[1200px] pt-6 pb-16">
          {/* Simple horizontal line */}
          <div className="absolute left-0 right-0 top-[60px] h-px bg-[var(--border)]" />

          <div className="relative flex justify-between px-8">
            {ordered.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelected(event)}
                className="group relative flex flex-col items-center"
                aria-label={event.title}
              >
                {/* Year */}
                <span className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
                  {event.year}
                </span>

                {/* Logo circle */}
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] bg-white p-2 transition-all duration-200 group-hover:scale-110 group-hover:border-[var(--accent)]">
                  {renderIcon(event, 'sm')}
                </div>

                {/* Dot on the line (behind the circle, but the circle sits on it) */}
                <div className="absolute top-[60px] h-2 w-2 -translate-y-1/2 rounded-full bg-[var(--accent)]" />

                {/* Label */}
                <span className="mt-3 max-w-[100px] text-center text-[11px] font-semibold leading-tight text-[var(--fg)] group-hover:text-[var(--accent)]">
                  {event.subtitle}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

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

            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-[var(--border)] bg-white p-2">
              {renderIcon(selected, 'lg')}
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
