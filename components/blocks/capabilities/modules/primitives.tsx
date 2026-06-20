'use client'

import { useEffect, useRef, useState } from 'react'
import { Reveal } from '../../../animation/Reveal'
import { BluePlaceholder, type BlueRatio } from '../BluePlaceholder'

/**
 * Shared building blocks for the Capabilities work modules.
 * Composable; each discipline file just arranges them. All visuals are
 * BluePlaceholder (FPO) for now. `dark` adapts every primitive for dark bands.
 */

/** Mini-case / module header: kicker + title + optional role + blurb. */
export function AnchorHeader({
  kicker,
  title,
  role,
  blurb,
  dark = false,
}: {
  kicker?: string
  title: string
  role?: string
  blurb?: string
  dark?: boolean
}) {
  return (
    <Reveal>
      <div className="mb-7 md:mb-9">
        {kicker && (
          <p className="br-data text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--br-gold)]">
            {kicker}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3
            className={`text-[22px] font-medium tracking-[-0.01em] md:text-[30px] ${
              dark ? 'text-white' : 'text-[var(--br-ink)]'
            }`}
          >
            {title}
          </h3>
          {role && (
            <span
              className={`br-data text-[12px] uppercase tracking-[0.08em] ${
                dark ? 'text-white/45' : 'text-[var(--br-muted-2)]'
              }`}
            >
              {role}
            </span>
          )}
        </div>
        {blurb && (
          <p
            className={`mt-3 max-w-[60ch] text-[15px] leading-normal md:text-base ${
              dark ? 'text-white/55' : 'text-[var(--br-muted)]'
            }`}
          >
            {blurb}
          </p>
        )}
      </div>
    </Reveal>
  )
}

/** Small caption under a placeholder. */
export function ModuleCaption({
  children,
  dark = false,
}: {
  children: React.ReactNode
  dark?: boolean
}) {
  return (
    <p
      className={`br-data mt-3 text-[11px] uppercase leading-snug tracking-[0.08em] ${
        dark ? 'text-white/40' : 'text-[var(--br-muted-2)]'
      }`}
    >
      {children}
    </p>
  )
}

/**
 * DragRail — a horizontally DRAGGABLE rail of FPO cards with momentum-ish feel
 * (pointer drag + native momentum scroll). Cursor shows grab/grabbing. Falls
 * back to touch scroll on mobile. This is the "browse the work" breadth rail.
 */
export function BlueRail({
  items,
  ratio = 'phone',
  dark = false,
}: {
  items: string[]
  ratio?: BlueRatio
  dark?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState(false)
  const state = useRef({ down: false, startX: 0, startScroll: 0, moved: false })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const down = (e: PointerEvent) => {
      state.current = { down: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false }
      setDrag(true)
    }
    const move = (e: PointerEvent) => {
      if (!state.current.down) return
      const dx = e.clientX - state.current.startX
      if (Math.abs(dx) > 4) state.current.moved = true
      el.scrollLeft = state.current.startScroll - dx
    }
    const up = () => {
      state.current.down = false
      setDrag(false)
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  const cardW =
    ratio === 'phone' || ratio === 'tall'
      ? 'w-[180px] md:w-[210px]'
      : ratio === 'wide' || ratio === 'video' || ratio === 'ultrawide'
        ? 'w-[300px] md:w-[380px]'
        : 'w-[240px] md:w-[280px]'

  return (
    <Reveal>
      <div
        ref={ref}
        className={`-mx-6 select-none overflow-x-auto px-6 pb-3 md:-mx-10 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          drag ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div className="flex gap-4 md:gap-5" style={{ width: 'max-content' }}>
          {items.map((label) => (
            <div key={label} className={`${cardW} shrink-0`}>
              <BluePlaceholder ratio={ratio} label={label} dark={dark} />
            </div>
          ))}
        </div>
      </div>
      <ModuleCaption dark={dark}>
        Drag → · {items.length} items (FPO — real screens drop in here)
      </ModuleCaption>
    </Reveal>
  )
}

/** Numbered flow as a row of FPO phone screens with arrows between them. */
export function BlueFlowRow({
  steps,
  caption,
  dark = false,
}: {
  steps: string[]
  caption?: string
  dark?: boolean
}) {
  return (
    <Reveal>
      <div className="-mx-6 overflow-x-auto px-6 pb-3 md:-mx-10 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-3 md:gap-4" style={{ width: 'max-content' }}>
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-3 md:gap-4">
              <div className="w-[150px] shrink-0 md:w-[180px]">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`br-data flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-[var(--br-gold)] ${
                      dark ? 'bg-white/10' : 'bg-[var(--br-bg-2)]'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`br-data text-[11px] uppercase tracking-[0.06em] ${
                      dark ? 'text-white/55' : 'text-[var(--br-muted)]'
                    }`}
                  >
                    {step}
                  </span>
                </div>
                <BluePlaceholder ratio="phone" dark={dark} />
              </div>
              {i < steps.length - 1 && (
                <span aria-hidden className={dark ? 'text-white/20' : 'text-[var(--br-line)]'}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      {caption && <ModuleCaption dark={dark}>{caption}</ModuleCaption>}
    </Reveal>
  )
}

/** A labelled grid of FPO boxes (brand boards, AD stills, etc.). */
export function BlueGrid({
  items,
  cols = 3,
  ratio = 'square',
  dark = false,
}: {
  items: string[]
  cols?: 2 | 3 | 4
  ratio?: BlueRatio
  dark?: boolean
}) {
  const colClass =
    cols === 2
      ? 'sm:grid-cols-2'
      : cols === 4
        ? 'grid-cols-2 md:grid-cols-4'
        : 'grid-cols-2 md:grid-cols-3'
  return (
    <Reveal>
      <div className={`grid gap-4 md:gap-5 ${colClass}`}>
        {items.map((label) => (
          <BluePlaceholder key={label} ratio={ratio} label={label} dark={dark} />
        ))}
      </div>
    </Reveal>
  )
}
