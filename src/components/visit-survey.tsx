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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-xs rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-lg">
        {/* Pixel art centered at top */}
        <div className="flex justify-center mb-4">
          <Image
            src="/monty-pixel-body.png"
            alt="Pixel art Monty"
            width={80}
            height={100}
            className="object-contain"
            priority
          />
        </div>

        <h3 className="text-center text-lg font-semibold">What brought you here?</h3>
        <div className="mt-3 flex flex-col gap-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              data-umami-event="visit-reason"
              data-umami-event-reason={opt.value}
              onClick={() => handleClick(opt.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2.5 text-center text-sm font-medium transition-colors hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5"
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
    </div>
  )
}
