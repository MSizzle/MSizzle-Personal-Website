'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { m, AnimatePresence, useReducedMotion } from 'motion/react'

const OPTIONS = [
  { label: 'X', value: 'x' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Monty Monthly', value: 'monty-monthly' },
  { label: 'Prometheus', value: 'prometheus' },
  { label: 'Actually In Person / Monty', value: 'in-person' },
  { label: 'Other', value: 'other' },
]

type WidgetState = 'hidden' | 'bubble' | 'open' | 'thankyou'

export function VisitSurvey() {
  const [widgetState, setWidgetState] = useState<WidgetState>('hidden')
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (sessionStorage.getItem('visit-survey-done')) return
    let openTimer: ReturnType<typeof setTimeout> | undefined
    const timer = setTimeout(() => {
      setWidgetState('bubble')
      // On desktop, auto-open after a brief pause so the user sees the bubble
      // arrive. On mobile the full survey is intrusive, so it stays a small
      // tappable bubble until the user opts to open it.
      const isDesktop = window.matchMedia('(min-width: 640px)').matches
      if (isDesktop) {
        openTimer = setTimeout(() => {
          setWidgetState('open')
        }, 600)
      }
    }, 30000)
    return () => {
      clearTimeout(timer)
      if (openTimer) clearTimeout(openTimer)
    }
  }, [])

  function handleOptionClick() {
    sessionStorage.setItem('visit-survey-done', 'true')
    setWidgetState('thankyou')
    setTimeout(() => {
      setWidgetState('hidden')
    }, 2000)
  }

  function handleClose() {
    sessionStorage.setItem('visit-survey-done', 'true')
    setWidgetState('hidden')
  }

  const bubbleMotion = prefersReducedMotion
    ? {}
    : {
        initial: { y: 100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
      }

  const windowMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.95 },
        transition: { duration: 0.3, ease: 'easeOut' as const },
      }

  const messageMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.15, duration: 0.25, ease: 'easeOut' as const },
      }

  if (widgetState === 'hidden') return null

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-0">
      {/* Large pixel-art Monty, above the box */}
      <AnimatePresence>
        {(widgetState === 'open' || widgetState === 'thankyou') && (
          <m.div
            key="monty-avatar"
            className="pointer-events-none relative -mb-2 hidden sm:block"
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: 20 },
                  transition: { duration: 0.3, ease: 'easeOut' as const },
                })}
          >
            <Image
              src="/monty-pixel-body.png"
              alt="Pixel art Monty"
              width={405}
              height={558}
              className="h-auto w-64 object-contain sm:w-[405px]"
              style={{ height: "auto" }}
              priority
            />
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(widgetState === 'open' || widgetState === 'thankyou') && (
          <m.div
            key="chat-window"
            {...windowMotion}
            className="w-64 border border-[var(--border)] bg-[var(--bg)] shadow-lg sm:w-80"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2">
              <span className="text-xs font-semibold uppercase tracking-widest opacity-60">
                Monty
              </span>
              <button
                onClick={handleClose}
                aria-label="Close survey"
                className="flex h-6 w-6 items-center justify-center opacity-40 transition-opacity hover:opacity-80"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M1 1L11 11M11 1L1 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Message area */}
            <div className="p-4">
              {widgetState === 'open' && (
                <m.div key="question" {...messageMotion}>
                  <p className="text-sm leading-relaxed">
                    Thanks for checking out my site! What brought you here?
                  </p>

                  {/* Vertical stacked option buttons */}
                  <div className="mt-4 flex flex-col gap-2">
                    {OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        data-umami-event={`visit-reason-${opt.value}`}
                        onClick={handleOptionClick}
                        className="w-full cursor-pointer border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-left text-sm font-medium tracking-wide transition-opacity hover:opacity-60"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </m.div>
              )}

              {widgetState === 'thankyou' && (
                <m.div key="thankyou" {...messageMotion}>
                  <p className="text-sm leading-relaxed">
                    Awesome, welcome! Enjoy exploring.
                  </p>
                </m.div>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Chat bubble trigger (visible briefly before auto-opening) */}
      {widgetState === 'bubble' && (
        <m.button
          key="bubble"
          {...bubbleMotion}
          onClick={() => setWidgetState('open')}
          aria-label="Open survey"
          className="flex h-14 w-14 items-center justify-center border border-[var(--border)] bg-[var(--bg)] shadow-lg transition-opacity hover:opacity-80"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </m.button>
      )}
    </div>
  )
}
