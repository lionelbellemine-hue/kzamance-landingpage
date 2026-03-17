"use client"

import { useEffect, useState } from "react"

// Configurable opening date — Europe/Paris timezone (UTC+2 on April 1st 2026)
const OPENING_DATE = new Date("2026-04-01T00:00:00+02:00")

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const now = new Date()
  const diff = OPENING_DATE.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

interface CountdownProps {
  onOpeningReached?: () => void
}

export function Countdown({ onOpeningReached }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft())
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const initial = getTimeLeft()
    const alreadyOpen =
      initial.days === 0 &&
      initial.hours === 0 &&
      initial.minutes === 0 &&
      initial.seconds === 0

    if (alreadyOpen) {
      setIsOpen(true)
      onOpeningReached?.()
      return
    }

    const interval = setInterval(() => {
      const t = getTimeLeft()
      setTimeLeft(t)

      if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
        setIsOpen(true)
        onOpeningReached?.()
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [onOpeningReached])

  if (!mounted) {
    // SSR-safe placeholder to avoid hydration mismatch
    return <div className="h-32" aria-hidden="true" />
  }

  if (isOpen) {
    return (
      <div
        className="flex flex-col items-center gap-5 animate-in fade-in slide-in-from-bottom-4 duration-700"
        role="status"
        aria-live="polite"
        aria-label="Le site est maintenant ouvert"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-5 py-2 text-sm font-medium">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
          Ouvert maintenant
        </div>
        <a
          href="#"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-8 py-4 text-base font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 shadow-lg shadow-primary/20"
        >
          Découvrir K-zamance
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    )
  }

  const units = [
    { value: timeLeft.days, label: "Jours" },
    { value: timeLeft.hours, label: "Heures" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Secondes" },
  ]

  return (
    <div
      role="timer"
      aria-label={`Ouverture dans ${timeLeft.days} jours, ${timeLeft.hours} heures, ${timeLeft.minutes} minutes et ${timeLeft.seconds} secondes`}
      aria-live="off"
    >
      <div className="flex items-center justify-center gap-3 md:gap-5">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-3 md:gap-5">
            <div className="flex flex-col items-center">
              <div className="relative bg-card border border-border rounded-2xl w-16 h-16 md:w-24 md:h-24 flex items-center justify-center shadow-sm overflow-hidden">
                {/* Subtle top fade */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <span
                  className="text-2xl md:text-4xl font-semibold text-foreground tabular-nums leading-none"
                  aria-hidden="true"
                >
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
              <span className="mt-2 text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-widest">
                {unit.label}
              </span>
            </div>
            {/* Separator dots — not after last item */}
            {i < units.length - 1 && (
              <div className="flex flex-col gap-1.5 mb-5" aria-hidden="true">
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
