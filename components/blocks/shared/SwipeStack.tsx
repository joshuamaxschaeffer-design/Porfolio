'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * SwipeStack
 * ==========
 * A stack of up to 5 screen images presented as an overlapping deck. The top
 * card is fully visible; the others peek behind it, offset + scaled, so the
 * stack reads as "more screens behind this one."
 *
 * Interaction
 * -----------
 * - DESKTOP: hover-to-scrub. Moving the cursor left→right across the component
 *   sweeps the active card from first→last (a fast way to flip through the set).
 *   Optional `pills` render above the deck; hovering a pill jumps to that card.
 * - MOBILE / touch: swipe left/right to advance, with a draggable feel and
 *   snap. Dots below show position.
 *
 * Sizing
 * ------
 * - `frame="phone"` (default): each card holds a portrait phone screen at a
 *   fixed 9:19.5 ratio; the whole component is bounded by `maxW`.
 * - `frame="fill"`: the deck fills its parent's HEIGHT (good for desktop-height
 *   layouts placed beside a tall column); cards use object-contain so any
 *   aspect (kiosk, desktop, tablet) sits cleanly without cropping.
 *
 * Perf / a11y
 * -----------
 * - Pure CSS transforms (translate/scale/opacity) — GPU-composited, no layout
 *   thrash. Honors prefers-reduced-motion (no transition; arrows/dots still
 *   work). Keyboard: left/right arrows when focused.
 */

export interface StackScreen {
  src: string
  alt?: string
}

export interface SwipeStackProps {
  screens: StackScreen[] // up to 5 used
  /** Optional labels shown as hover-swap pills above the deck (1 per screen). */
  pills?: string[]
  frame?: 'phone' | 'fill'
  /** Max width for the phone frame. Default 320. */
  maxW?: number
  /** Accent for the active pill + dots. Default brand gold. */
  accent?: string
  /** Tone: on dark sections set dark so chrome reads. */
  dark?: boolean
  /** Aspect ratio for `fill` cards as `w / h`. Default 4/3 (desktop/kiosk). */
  fillRatio?: number
  className?: string
}

const MAX = 5

export function SwipeStack({
  screens,
  pills,
  frame = 'phone',
  maxW = 320,
  accent,
  dark = false,
  fillRatio = 4 / 3,
  className = '',
}: SwipeStackProps) {
  const cards = screens.slice(0, MAX)
  const n = cards.length
  const [active, setActive] = useState(0)
  const [reduce, setReduce] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const gold = accent ?? (dark ? 'var(--br-gold-soft)' : 'var(--br-gold)')

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const clamp = useCallback((i: number) => Math.max(0, Math.min(n - 1, i)), [n])

  // Desktop hover-scrub: cursor X across the component → active index.
  const onMove = useCallback(
    (e: React.MouseEvent) => {
      // ignore on touch (touch handlers drive it there)
      if (window.matchMedia('(hover: none)').matches) return
      const el = wrapRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const t = (e.clientX - r.left) / r.width
      setActive(clamp(Math.round(t * (n - 1))))
    },
    [clamp, n],
  )

  // Touch swipe.
  const touch = useRef<{ x: number; i: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, i: active }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touch.current) return
    const dx = e.touches[0].clientX - touch.current.x
    const step = Math.round(-dx / 60)
    setActive(clamp(touch.current.i + step))
  }
  const onTouchEnd = () => {
    touch.current = null
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') setActive((i) => clamp(i + 1))
    if (e.key === 'ArrowLeft') setActive((i) => clamp(i - 1))
  }

  if (n === 0) return null

  const ease = reduce ? 'none' : 'transform 420ms cubic-bezier(0.22,1,0.36,1), opacity 420ms ease'

  return (
    <div className={className}>
      {/* Hover-swap pills */}
      {pills && pills.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {pills.slice(0, n).map((p, i) => {
            const on = i === active
            return (
              <button
                key={p}
                type="button"
                onMouseEnter={() => !window.matchMedia('(hover: none)').matches && setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={on}
                className={`br-data rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.06em] transition-colors ${
                  on
                    ? 'text-[var(--br-ink)]'
                    : dark
                      ? 'border-white/15 text-white/55 hover:text-white/80'
                      : 'border-[var(--br-line)] text-[var(--br-muted-2)] hover:text-[var(--br-ink)]'
                }`}
                style={
                  on
                    ? { borderColor: gold, color: dark ? '#fff' : 'var(--br-ink)', background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' }
                    : undefined
                }
              >
                {p}
              </button>
            )
          })}
        </div>
      )}

      {/* The deck */}
      <div
        ref={wrapRef}
        role="group"
        aria-roledescription="screen carousel"
        aria-label="Swipe or hover to flip through screens"
        tabIndex={0}
        onMouseMove={onMove}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onKeyDown={onKey}
        className={`relative mx-auto outline-none ${frame === 'phone' ? '' : 'h-full w-full'}`}
        style={
          frame === 'phone'
            ? { width: '100%', maxWidth: maxW, aspectRatio: '9 / 19.5', cursor: 'ew-resize' }
            : { aspectRatio: String(fillRatio), cursor: 'ew-resize' }
        }
      >
        {cards.map((c, i) => {
          // distance from active determines depth behind the top card
          const d = i - active
          const behind = d > 0 ? d : 0 // cards before active collapse under the deck
          const isActive = i === active
          // stack the upcoming cards behind+right; past cards fade under
          const tx = d <= 0 ? d * 6 : Math.min(behind, 3) * 22
          const ty = d <= 0 ? 0 : Math.min(behind, 3) * 10
          const scale = d <= 0 ? 1 : 1 - Math.min(behind, 3) * 0.05
          const op = d < 0 ? 0 : 1
          const z = MAX - Math.abs(d)
          return (
            <div
              key={c.src}
              className={`absolute inset-0 overflow-hidden rounded-[20px] border bg-white ${
                dark ? 'border-white/10' : 'border-[var(--br-line)]'
              }`}
              style={{
                transform: `translate(${tx}%, ${ty}px) scale(${scale})`,
                opacity: op,
                zIndex: z,
                transition: ease,
                boxShadow: isActive
                  ? '0 24px 60px rgba(7,14,44,0.22)'
                  : '0 12px 30px rgba(7,14,44,0.12)',
                transformOrigin: 'center left',
              }}
              aria-hidden={!isActive}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.src}
                alt={c.alt ?? ''}
                draggable={false}
                className={`h-full w-full ${frame === 'phone' ? 'object-cover object-top' : 'object-contain'}`}
                loading="lazy"
              />
            </div>
          )
        })}
      </div>

      {/* Dots */}
      {n > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {cards.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show screen ${i + 1}`}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === active ? 22 : 8,
                background: i === active ? gold : dark ? 'rgba(255,255,255,0.25)' : 'rgba(7,14,44,0.18)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
