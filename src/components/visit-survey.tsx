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
      <div className="relative w-full max-w-md overflow-visible border border-[var(--border)] bg-[var(--bg)] px-8 py-8 shadow-lg">
        {/* Heading — editorial uppercase */}
        <h3 className="text-sm font-semibold uppercase tracking-widest">
          What brought you here?
        </h3>

        {/* Options */}
        <div className="mt-5 flex flex-col gap-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              data-umami-event="visit-reason"
              data-umami-event-reason={opt.value}
              onClick={() => handleClick(opt.value)}
              className="border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-left text-sm font-normal tracking-wide transition-opacity hover:opacity-60"
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
          className="mt-4 w-full text-center text-xs uppercase tracking-widest opacity-40 transition-opacity hover:opacity-80"
        >
          Skip
        </button>

        {/* Pixel art Monty — vertically centered, right of card */}
        <div className="pointer-events-none absolute -right-80 top-1/2 hidden -translate-y-1/2 sm:block">
          <Image
            src="/monty-pixel-body.png"
            alt="Pixel art Monty saying hey friend"
            width={480}
            height={660}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}
