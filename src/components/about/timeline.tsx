'use client'

import { useState } from 'react'
import { GraduationCap, Briefcase, Rocket, Award, MapPin, X as CloseIcon, type LucideIcon } from 'lucide-react'

export interface TimelineEvent {
  id: string
  year: string
  date: string
  title: string
  subtitle: string
  icon: 'education' | 'work' | 'project' | 'award' | 'location'
  description: string
  location?: string
  url?: string
}

const ICON_MAP: Record<TimelineEvent['icon'], LucideIcon> = {
  education: GraduationCap,
  work: Briefcase,
  project: Rocket,
  award: Award,
  location: MapPin,
}

const ICON_COLOR: Record<TimelineEvent['icon'], string> = {
  education: 'bg-[var(--accent)]',
  work: 'bg-[var(--accent-warm)]',
  project: 'bg-[var(--gold)]',
  award: 'bg-[var(--accent)]',
  location: 'bg-[var(--fg-muted)]',
}

interface TimelineProps {
  events: TimelineEvent[]
}

export function Timeline({ events }: TimelineProps) {
  const [selected, setSelected] = useState<TimelineEvent | null>(null)

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-2 bottom-2 w-px bg-[var(--border)]" />

      <ul className="space-y-6">
        {events.map((event) => {
          const Icon = ICON_MAP[event.icon]
          return (
            <li key={event.id} className="relative pl-12">
              {/* Icon dot */}
              <button
                onClick={() => setSelected(event)}
                className={`absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full ${ICON_COLOR[event.icon]} text-white shadow-md transition-transform duration-200 hover:scale-110 hover:shadow-lg`}
                aria-label={`View details for ${event.title}`}
              >
                <Icon size={18} />
              </button>

              {/* Inline summary */}
              <button
                onClick={() => setSelected(event)}
                className="group block text-left"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
                  {event.date}
                </div>
                <h3 className="mt-0.5 text-base font-semibold group-hover:text-[var(--accent)]">
                  {event.title}
                </h3>
                <p className="text-sm text-[var(--fg-muted)]">{event.subtitle}</p>
              </button>
            </li>
          )
        })}
      </ul>

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

            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${ICON_COLOR[selected.icon]} text-white`}>
              {(() => {
                const Icon = ICON_MAP[selected.icon]
                return <Icon size={20} />
              })()}
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

            {selected.url && (
              <a
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center text-sm font-semibold text-[var(--accent)] hover:underline"
              >
                Learn more &rarr;
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
