'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  /** How much to translate (px). Default 24. */
  distance?: number
  /** Delay in ms. */
  delay?: number
  /** Duration in seconds. Default 0.6. */
  duration?: number
  /** Percentage of element that must be in view before revealing (0–1). */
  amount?: number
  /** When true, re-runs every time it enters view; otherwise just once. */
  repeat?: boolean
  className?: string
}

/**
 * Scroll-reveal wrapper — fades + translates a child into view.
 *
 * IMPORTANT: this uses a NATIVE IntersectionObserver, not Motion's
 * `whileInView`. Motion's viewport detection is unreliable under Lenis
 * smooth-scroll (the scroll position it samples is frozen), which left stacked
 * reveals stuck at fractional opacity. The observer guarantees the element
 * always lands at its final state. A safety timer also force-reveals after
 * mount so nothing can get permanently stuck (e.g. backgrounded tabs).
 * Honors prefers-reduced-motion.
 */
export function Reveal({
  children,
  direction = 'up',
  distance = 24,
  delay = 0,
  duration = 0.6,
  amount = 0.15,
  repeat = false,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduce(true)
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          if (!repeat) io.disconnect()
        } else if (repeat) {
          setShown(false)
        }
      },
      { threshold: amount, rootMargin: '0px 0px -80px 0px' },
    )
    io.observe(el)
    // safety: never let anything stay invisible
    const t = setTimeout(() => setShown(true), 1200)
    return () => {
      io.disconnect()
      clearTimeout(t)
    }
  }, [amount, repeat])

  const offset =
    direction === 'up'
      ? `translateY(${distance}px)`
      : direction === 'down'
        ? `translateY(-${distance}px)`
        : direction === 'left'
          ? `translateX(${distance}px)`
          : direction === 'right'
            ? `translateX(-${distance}px)`
            : 'none'

  if (reduce || direction === 'none') return <div className={className}>{children}</div>

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : offset,
        transition: `opacity ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
