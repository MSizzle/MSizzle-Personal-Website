'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const OPTIONS = [
  { label: 'Blog', value: 'blog' },
  { label: 'Business', value: 'business' },
  { label: 'Personal', value: 'personal' },
  { label: 'Monty', value: 'monty' },
]

export function VisitSurvey() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('visit-survey-done')) return
    const timer = setTimeout(() => setShow(true), 30000)
    return () => clearTimeout(timer)
  }, [])

  function handleClick(value: string) {
    sessionStorage.setItem('visit-survey-done', 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex items-end gap-0">
        {/* Survey card */}
        <div className="mx-4 sm:mx-0 w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-lg">
          <h3 className="text-lg font-semibold">What brought you here?</h3>
          <div className="mt-4 flex flex-col gap-2">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                data-umami-event="visit-reason"
                data-umami-event-reason={opt.value}
                onClick={() => handleClick(opt.value)}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-left text-sm font-medium transition-colors hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5"
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              sessionStorage.setItem('visit-survey-done', 'true')
              setShow(false)
            }}
            className="mt-3 w-full text-center text-xs text-[var(--fg-muted)] hover:text-foreground"
          >
            Skip
          </button>
        </div>

        {/* Pixel art Monty pointing at the survey */}
        <div className="hidden sm:block -ml-4 mb-4">
          <Image
            src="/monty-pixel-art.png"
            alt="Pixel art Monty pointing"
            width={200}
            height={350}
            className="drop-shadow-lg -scale-x-100"
            priority
          />
        </div>
      </div>
    </div>
  )
}
