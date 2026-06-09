'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { challenge as defaults, type ChallengeCard } from './data'
import { EdgeFadeBlur } from './EdgeFadeBlur'

interface ChallengeProps {
  heading?: string
  intro?: string
  cards?: ChallengeCard[]
}

// The problem images are all 1150px tall. Two widths: wide = 1920 (ratio ~1.67),
// narrow = 1204 (ratio ~1.047). Cards keep a fixed height and the real aspect
// ratio so nothing is cropped. `lg` = wide, everything else = narrow.
const CARD_RATIO: Record<ChallengeCard['span'], string> = {
  sm: 'aspect-[1204/1150]',
  md: 'aspect-[1204/1150]',
  lg: 'aspect-[1920/1150]',
}

export function ChallengeSection(props: ChallengeProps) {
  const heading = props.heading ?? defaults.heading
  const intro = props.intro ?? defaults.intro
  const cards = props.cards ?? defaults.cards

  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  // Drag-to-scroll (pointer) with flick momentum. Distinguishes a drag from a
  // click so card taps still work. We sample pointer velocity during the drag
  // and, on release, coast with exponential decay (mouse/trackpad only — touch
  // devices already get native inertial scrolling, so we don't double it).
  const drag = useRef({
    down: false,
    moved: false,
    startX: 0,
    startScroll: 0,
    targetScroll: 0, // where scrollLeft should be, set in pointermove
    pointerType: 'mouse' as string,
    // ring buffer of recent {x,t} samples for time-windowed release velocity
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

  const startMomentum = useCallback((v0: number) => {
    const el = trackRef.current
    if (!el) return
    stopMomentum()
    let v = v0 // px/ms
    let last = performance.now()
    // exponential decay; tuned so a firm flick coasts ~0.4–0.8s then eases out
    const DECAY = 0.0025 // higher = stops sooner
    const MIN_V = 0.015 // px/ms — below this we stop
    const step = (now: number) => {
      const dt = Math.min(40, now - last) // clamp to avoid huge jumps after a stall
      last = now
      el.scrollLeft -= v * dt
      // decay
      v *= Math.exp(-DECAY * dt)
      // stop if we've slowed enough or hit an edge
      const atEdge = el.scrollLeft <= 0 || el.scrollLeft >= el.scrollWidth - el.clientWidth - 1
      if (Math.abs(v) < MIN_V || atEdge) {
        momentumRaf.current = null
        return
      }
      momentumRaf.current = requestAnimationFrame(step)
    }
    momentumRaf.current = requestAnimationFrame(step)
  }, [stopMomentum])

  useEffect(() => () => stopMomentum(), [stopMomentum])

  const updateEdges = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
    // Track which card sits at the left content edge (the header's left margin)
    // for the pager. The track is left-padded, so the aligned card's offsetLeft
    // equals scrollLeft + paddingLeft — compare against that, not raw scrollLeft,
    // or the highlight is off by one.
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

  useEffect(() => {
    updateEdges()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)
    return () => {
      el.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
    }
  }, [updateEdges])

  // Scroll a card to the very left of the track so its left edge lines up with
  // the heading/intro above (the column's left gutter, which == the track's
  // left padding). offsetLeft already includes that padding, so subtract it.
  const scrollToCard = useCallback((i: number) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelectorAll<HTMLElement>('[data-card]')[i]
    if (!card) return
    const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0
    el.scrollTo({ left: card.offsetLeft - padLeft, behavior: 'smooth' })
  }, [])

  const step = useCallback(
    (dir: 1 | -1) => {
      const el = trackRef.current
      if (!el) return
      const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-card]'))
      const target = cards.find((c) =>
        dir === 1 ? c.offsetLeft > el.scrollLeft + 8 : c.offsetLeft >= el.scrollLeft + el.clientWidth - 8,
      )
      // Simpler + reliable: jump to neighbouring card index.
      const next = Math.min(Math.max(active + dir, 0), cards.length - 1)
      scrollToCard(next)
    },
    [active, scrollToCard],
  )

  // Per research (Nolan Lawson / Embla): writing scrollLeft on every pointermove
  // forces a synchronous layout per event and the events over-fire — that's the
  // jank. Instead we ONLY store the target scroll in pointermove (a number, no
  // DOM read/write), then apply it to scrollLeft ONCE per frame in this rAF
  // loop. Native scroll + the pager keep working (they read scrollLeft on the
  // scroll event). Release velocity is a ~90ms time-windowed average, not the
  // last two points, so flicks feel consistent.
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
    stopMomentum() // catching a coasting carousel stops it (grab the spinning wheel)
    const now = performance.now()
    drag.current = {
      down: true,
      moved: false,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      targetScroll: el.scrollLeft,
      pointerType: e.pointerType || 'mouse',
      samples: [{ x: e.clientX, t: now }],
    }
    el.setPointerCapture(e.pointerId)
    if (dragRaf.current == null) dragRaf.current = requestAnimationFrame(dragTick)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 4) drag.current.moved = true
    // store target only — no scrollLeft write here (rAF applies it)
    drag.current.targetScroll = drag.current.startScroll - dx
    // keep ~120ms of position samples for a stable release velocity
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
    // Flick momentum — mouse/trackpad only (touch has native inertia). Compute
    // velocity over the sampled window (px/ms), then coast.
    if (wasDown && el && drag.current.pointerType !== 'touch') {
      const s = drag.current.samples
      const now = performance.now()
      const first = s[0]
      const last = s[s.length - 1]
      const dt = last.t - first.t
      const vx = dt > 0 ? (last.x - first.x) / dt : 0
      const idle = now - last.t
      if (idle < 90 && Math.abs(vx) > 0.05) startMomentum(vx)
    }
  }

  useEffect(() => () => {
    if (dragRaf.current != null) cancelAnimationFrame(dragRaf.current)
  }, [])

  return (
    <section className="bg-[var(--br-bg-2)] py-20 md:py-[160px]">
      <div className="br-container">
        <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          {heading}
        </h2>
        <div className="mt-4 flex items-end justify-between gap-4">
          <p className="max-w-2xl text-lg text-[var(--br-muted)] md:text-[22px]">{intro}</p>
          <div className="hidden shrink-0 gap-2 md:flex">
            <ArrowBtn dir="left" disabled={!canLeft} onClick={() => step(-1)} />
            <ArrowBtn dir="right" disabled={!canRight} onClick={() => step(1)} />
          </div>
        </div>
      </div>

      {/* Draggable track, bleeds to both edges. On mobile it's a scroll-snap
          carousel (one ~88vw card per view with a peek); on desktop it stays a
          free drag track with flick momentum. EdgeFadeBlur dissolves the left &
          right edges into the grey section bg with a progressive blur. */}
      <EdgeFadeBlur bg="var(--br-bg-2)" className="mt-8">
        <div
          ref={trackRef}
          className="br-noscrollbar br-grab flex gap-5 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 pl-[max(1.5rem,calc((100vw-1443px)/2+5rem))] pr-6 select-none snap-x snap-mandatory lg:snap-none"
          style={{ touchAction: 'pan-y', scrollPaddingInline: '1.5rem' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {cards.map((card) => (
            <ChallengeCardView key={card.problem} card={card} dragRef={drag} />
          ))}
          {/* Trailing spacer so even the LAST card can scroll far enough left to
              align with the header (the browser clamps scrollLeft to
              scrollWidth-clientWidth; without runway the last cards stop short).
              An odd gap to the right of the last card is expected/fine. */}
          <div aria-hidden className="shrink-0" style={{ width: 'min(85vw, 1000px)' }} />
        </div>
      </EdgeFadeBlur>

      {/* Pager */}
      {/* Pager. Desktop: a wrapped row of plain text links. Mobile: swipeable
          PILLS that bleed off both edges — swipe to reach Problem 7; tap to jump
          the card carousel to that problem. */}
      <div className="br-container mt-6 hidden flex-wrap gap-x-5 gap-y-2 md:flex">
        {cards.map((card, i) => (
          <button
            key={card.problem}
            onClick={() => scrollToCard(i)}
            className={`text-xs transition-colors ${
              i === active ? 'font-medium text-[var(--br-ink)]' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Problem {card.problem}
          </button>
        ))}
      </div>
      <div
        className="br-noscrollbar mt-6 flex gap-2 overflow-x-auto pl-6 pr-6 md:hidden"
        style={{ touchAction: 'pan-x' }}
      >
        {cards.map((card, i) => (
          <button
            key={card.problem}
            onClick={() => scrollToCard(i)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
              i === active
                ? 'border-[var(--br-gold)] bg-[var(--br-gold)] font-medium text-white'
                : 'border-[var(--br-stroke)] bg-white text-neutral-500'
            }`}
          >
            Problem {card.problem}
          </button>
        ))}
      </div>
    </section>
  )
}

function ChallengeCardView({
  card,
  dragRef,
}: {
  card: ChallengeCard
  dragRef: React.MutableRefObject<{ moved: boolean }>
}) {
  // The image already contains its "Problem N" label and headline baked in,
  // so the card is just the image at its real aspect ratio (no overlay).
  return (
    <article
      data-card
      onClickCapture={(e) => {
        if (dragRef.current.moved) {
          e.stopPropagation()
          e.preventDefault()
        }
      }}
      className={`relative ${CARD_RATIO[card.span]} w-[88vw] max-w-[88vw] shrink-0 snap-start rounded-2xl bg-white lg:h-[600px] lg:w-auto lg:max-w-none`}
    >
      {/* image clipped to the radius in its own layer */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.image}
          alt={`Problem ${card.problem}`}
          draggable={false}
          className="pointer-events-none h-full w-full object-cover"
        />
      </div>
      {/* stroke is a border-only overlay (no content to bleed past the corner) */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-[var(--br-stroke)]" />
    </article>
  )
}

function ArrowBtn({
  dir,
  disabled,
  onClick,
}: {
  dir: 'left' | 'right'
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={dir === 'left' ? 'Previous' : 'Next'}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--br-line)] text-[var(--br-ink)] transition disabled:opacity-30 enabled:hover:bg-neutral-50"
    >
      <svg viewBox="0 0 24 24" className={`h-4 w-4 ${dir === 'left' ? 'rotate-180' : ''}`} fill="none">
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
