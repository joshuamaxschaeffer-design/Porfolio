'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * DragCarousel — the exact native-scroll + JS mouse-drag-with-flick-momentum +
 * jump-pills carousel used on the Panda (RewardsPlatformSection) and Baserate
 * (ChallengeSection) case studies, extracted so the Capabilities page reuses the
 * identical interaction instead of a bespoke one.
 *
 * - Touch scrolls natively (snap-x); mouse gets 1:1 drag + flick momentum.
 * - A JS-measured trailing spacer stops the LAST card's left edge at the rail.
 * - Optional jump-pills below; `active` tracks the card nearest the left edge.
 */
export function DragCarousel({
  items,
  labels,
  gapClass = 'gap-6',
  dark = false,
  pills = true,
}: {
  items: ReactNode[]
  labels?: string[]
  gapClass?: string
  dark?: boolean
  pills?: boolean
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [spacerW, setSpacerW] = useState(0)

  // full-bleed rail aligned to the editorial container (br-container pattern)
  const RAIL_PAD = 'calc(max(1.5rem, (100vw - 1443px) / 2 + 5rem))'

  const drag = useRef({
    down: false,
    moved: false,
    startX: 0,
    startScroll: 0,
    targetScroll: 0,
    samples: [] as { x: number; t: number }[],
  })
  const momentumRaf = useRef<number | null>(null)
  const dragRaf = useRef<number | null>(null)

  const stopMomentum = useCallback(() => {
    if (momentumRaf.current != null) {
      cancelAnimationFrame(momentumRaf.current)
      momentumRaf.current = null
    }
  }, [])

  const startMomentum = useCallback(
    (v0: number) => {
      const el = trackRef.current
      if (!el) return
      stopMomentum()
      let v = v0
      let last = performance.now()
      const DECAY = 0.0025
      const MIN_V = 0.015
      const stepFn = (now: number) => {
        const dt = Math.min(40, now - last)
        last = now
        el.scrollLeft -= v * dt
        v *= Math.exp(-DECAY * dt)
        const atEdge = el.scrollLeft <= 0 || el.scrollLeft >= el.scrollWidth - el.clientWidth - 1
        if (Math.abs(v) < MIN_V || atEdge) {
          momentumRaf.current = null
          return
        }
        momentumRaf.current = requestAnimationFrame(stepFn)
      }
      momentumRaf.current = requestAnimationFrame(stepFn)
    },
    [stopMomentum],
  )

  const updateActive = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0
    const children = Array.from(el.querySelectorAll<HTMLElement>('[data-card]'))
    let nearest = 0
    let best = Infinity
    children.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - (el.scrollLeft + padLeft))
      if (d < best) {
        best = d
        nearest = i
      }
    })
    setActive(nearest)
  }, [])

  const measureSpacer = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const cards = el.querySelectorAll<HTMLElement>('[data-card]')
    const last = cards[cards.length - 1]
    if (!last) return
    const cs = getComputedStyle(el)
    const padLeft = parseFloat(cs.paddingLeft) || 0
    const padRight = parseFloat(cs.paddingRight) || 0
    const gap = parseFloat(cs.columnGap) || 0
    const w = el.clientWidth - last.offsetWidth - gap - padLeft - padRight
    setSpacerW(Math.max(0, Math.round(w)))
  }, [])

  useEffect(() => {
    updateActive()
    measureSpacer()
    const el = trackRef.current
    if (!el) return
    const onResize = () => {
      measureSpacer()
      updateActive()
    }
    el.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', onResize)
    const t = window.setTimeout(measureSpacer, 250)
    return () => {
      el.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(t)
    }
  }, [updateActive, measureSpacer])

  useEffect(() => () => stopMomentum(), [stopMomentum])
  useEffect(
    () => () => {
      if (dragRaf.current != null) cancelAnimationFrame(dragRaf.current)
    },
    [],
  )

  const scrollToCard = useCallback((i: number) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelectorAll<HTMLElement>('[data-card]')[i]
    if (!card) return
    const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0
    el.scrollTo({ left: card.offsetLeft - padLeft, behavior: 'smooth' })
  }, [])

  const dragTick = useCallback(() => {
    const el = trackRef.current
    if (el && drag.current.down) {
      el.scrollLeft = drag.current.targetScroll
      dragRaf.current = requestAnimationFrame(dragTick)
    } else {
      dragRaf.current = null
    }
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current
    if (!el) return
    if (e.pointerType !== 'mouse') return
    stopMomentum()
    const now = performance.now()
    drag.current = {
      down: true,
      moved: false,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      targetScroll: el.scrollLeft,
      samples: [{ x: e.clientX, t: now }],
    }
    el.setPointerCapture(e.pointerId)
    if (dragRaf.current == null) dragRaf.current = requestAnimationFrame(dragTick)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 4) drag.current.moved = true
    drag.current.targetScroll = drag.current.startScroll - dx
    const now = performance.now()
    const s = drag.current.samples
    s.push({ x: e.clientX, t: now })
    while (s.length > 2 && now - s[0].t > 120) s.shift()
  }
  const endDrag = (e: React.PointerEvent) => {
    const el = trackRef.current
    if (el) {
      try {
        el.releasePointerCapture(e.pointerId)
      } catch {}
    }
    const wasDown = drag.current.down
    drag.current.down = false
    if (dragRaf.current != null) {
      cancelAnimationFrame(dragRaf.current)
      dragRaf.current = null
    }
    if (wasDown && el) {
      const s = drag.current.samples
      const now = performance.now()
      const first = s[0]
      const last = s[s.length - 1]
      const dt = last.t - first.t
      const vx = dt > 0 ? (last.x - first.x) / dt : 0
      if (now - last.t < 90 && Math.abs(vx) > 0.05) startMomentum(vx)
    }
  }

  const gold = dark ? 'var(--br-gold-soft)' : 'var(--br-gold)'

  return (
    <div className="mt-2 relative left-1/2 right-1/2 -mx-[50vw] w-screen">
      <div
        ref={trackRef}
        className={`br-noscrollbar flex cursor-grab snap-x snap-mandatory ${gapClass} overflow-x-auto overscroll-x-contain pb-2 select-none active:cursor-grabbing lg:snap-none`}
        style={{ paddingInline: RAIL_PAD, scrollPaddingInline: RAIL_PAD, touchAction: 'pan-x pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {items.map((m, i) => (
          <div key={i} data-card className="shrink-0 snap-start lg:snap-align-none">
            {m}
          </div>
        ))}
        <div aria-hidden className="shrink-0" style={{ width: spacerW }} />
      </div>

      {pills && labels && labels.length > 0 && (
        <div
          className="br-noscrollbar mx-auto mt-6 flex max-w-[1443px] gap-2 overflow-x-auto px-6 md:px-20"
          style={{ touchAction: 'pan-x pan-y' }}
        >
          {labels.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => scrollToCard(i)}
              aria-current={i === active}
              className={`br-data shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[12px] uppercase tracking-[0.04em] transition-colors ${
                i === active
                  ? 'border-transparent font-medium'
                  : dark
                    ? 'border-white/30 text-white/70 hover:border-white/60 hover:text-white'
                    : 'border-[var(--br-line)] text-[var(--br-muted-2)] hover:border-[var(--br-ink)] hover:text-[var(--br-ink)]'
              }`}
              style={i === active ? { backgroundColor: gold, color: dark ? '#0b1020' : '#fff' } : undefined}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
