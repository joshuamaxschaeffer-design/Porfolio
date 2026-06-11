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

// Cards with a dedicated mobile crop use its near-square ratio below lg so the
// portrait image isn't letterboxed inside the wide desktop frame. (1806x1725)
const MOBILE_CARD_RATIO = 'aspect-[1806/1725]'

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
  // and, on release, coast with exponential decay. JS owns the horizontal
  // gesture for BOTH mouse and touch (touch-action: pan-y on the track), so
  // desktop and mobile get the identical 1:1 follow + coast-and-slow feel.
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
    // Flick momentum for ALL pointer types: velocity over the sampled window
    // (px/ms), then coast with exponential decay.
    if (wasDown && el) {
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
    <section id="challenge" className="bg-[var(--br-bg-2)] py-20 md:py-[160px]">
      <div className="br-container">
        <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          2. {heading}
        </h2>
        <div className="mt-4 flex items-end justify-between gap-4">
          <p className="max-w-2xl text-lg text-[var(--br-muted)] md:text-[22px]">{intro}</p>
          <div className="hidden shrink-0 gap-2 md:flex">
            <ArrowBtn dir="left" disabled={!canLeft} onClick={() => step(-1)} />
            <ArrowBtn dir="right" disabled={!canRight} onClick={() => step(1)} />
          </div>
        </div>
      </div>

      {/* Draggable track, bleeds to both edges — md+ ONLY. (Mobile gets the
          one-at-a-time swipe stack below; the track's edge fade was also why
          the next card looked BLANK while swiping on a phone — an 88vw card's
          peek sat entirely inside the 200px fade wash.) Free 1:1 drag with
          flick momentum. No scroll-snap and no scroll-smooth — CSS smooth
          behavior animates every programmatic scrollLeft write, so it fought
          the rAF drag/momentum loops and made dragging feel mushy; snap then
          yanked the coast. touch-action: pan-y hands horizontal gestures to
          JS while vertical swipes still scroll the page. */}
      <EdgeFadeBlur bg="var(--br-bg-2)" className="mt-8 hidden md:block">
        <div
          ref={trackRef}
          className="br-noscrollbar br-grab flex gap-5 overflow-x-auto overscroll-x-contain pb-2 pl-[max(1.5rem,calc((100vw-1443px)/2+5rem))] pr-6 select-none"
          style={{ touchAction: 'pan-y' }}
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
      {/* Mobile: one-card-at-a-time swipe stack (own pills inside) */}
      <ChallengeStack cards={cards} />
    </section>
  )
}

/* ------------------------------------------------------------------------
 * ChallengeStack — MOBILE (<md) replacement for the scroll track.
 *
 * A deck of cards: the top card follows the finger 1:1; release past the
 * threshold (or a flick) sends it off-screen in the swipe direction and it
 * loops to the BACK of the deck — EITHER direction advances to the same next
 * card. While dragging, the card underneath is fully visible (every card
 * stays mounted, so its image is decoded long before it surfaces — no blank
 * card behind the one you're moving).
 * ---------------------------------------------------------------------- */

// One shared transition string. IMPORTANT: direct DOM writes (drag/settle)
// must restore EXACTLY this value — React skips re-writing style keys it
// thinks are unchanged, so leaving a different inline value behind would
// permanently kill the deck animation for that card.
const STACK_TRANS = 'transform 0.3s cubic-bezier(0.2, 0.7, 0.3, 1), opacity 0.3s ease'
const POSE_TOP = 'translate3d(0,0,0) scale(1)'
const POSE_NEXT = 'translate3d(0,14px,0) scale(0.955)'
const POSE_BACK = 'translate3d(0,26px,0) scale(0.91)'

function ChallengeStack({ cards }: { cards: ChallengeCard[] }) {
  const n = cards.length
  const [index, setIndex] = useState(0)
  // The card that just flew off and looped to the back must NOT animate from
  // its off-screen spot back across the deck — it snaps (transition: none).
  const [lastSwiped, setLastSwiped] = useState(-1)
  const wrapRef = useRef<HTMLDivElement>(null)
  const els = useRef<(HTMLDivElement | null)[]>([])
  const busy = useRef(false) // commit animation in flight
  const stackDrag = useRef({
    down: false,
    dx: 0,
    startX: 0,
    raf: null as number | null,
    samples: [] as { x: number; t: number }[],
  })

  const pose = (d: number) =>
    d === 0
      ? { transform: POSE_TOP, opacity: 1, zIndex: 30 }
      : d === 1
        ? { transform: POSE_NEXT, opacity: 1, zIndex: 20 }
        : { transform: POSE_BACK, opacity: d === 2 ? 1 : 0, zIndex: d === 2 ? 10 : 0 }

  // Drag writes happen once per FRAME (rAF), not per pointer event — same
  // jank fix as the desktop track. Only the top + next cards move.
  const applyDrag = useCallback(() => {
    const { dx, down } = stackDrag.current
    const w = wrapRef.current?.clientWidth || 1
    const top = els.current[index]
    const next = els.current[(index + 1) % n]
    if (top) top.style.transform = `translate3d(${dx}px,0,0) rotate(${((dx / w) * 4).toFixed(2)}deg)`
    if (next) {
      // the under-card eases up to full size as the top card moves away
      const p = Math.min(1, Math.abs(dx) / (w * 0.55))
      next.style.transform = `translate3d(0,${(14 * (1 - p)).toFixed(1)}px,0) scale(${(0.955 + 0.045 * p).toFixed(3)})`
    }
    stackDrag.current.raf = down ? requestAnimationFrame(applyDrag) : null
  }, [index, n])

  const settle = useCallback(
    (commit: boolean, dir: 1 | -1) => {
      const w = wrapRef.current?.clientWidth || 320
      const top = els.current[index]
      const next = els.current[(index + 1) % n]
      if (top) top.style.transition = STACK_TRANS
      if (next) next.style.transition = STACK_TRANS
      if (commit) {
        busy.current = true
        if (top) top.style.transform = `translate3d(${dir * (w + 80)}px,0,0) rotate(${dir * 6}deg)`
        if (next) next.style.transform = POSE_TOP
        window.setTimeout(() => {
          busy.current = false
          setLastSwiped(index)
          setIndex((i) => (i + 1) % n)
        }, 300)
      } else {
        if (top) top.style.transform = POSE_TOP
        if (next) next.style.transform = POSE_NEXT
      }
    },
    [index, n],
  )

  const onStackDown = (e: React.PointerEvent) => {
    if (busy.current) return
    const top = els.current[index]
    const next = els.current[(index + 1) % n]
    if (top) top.style.transition = 'none'
    if (next) next.style.transition = 'none'
    stackDrag.current = {
      down: true,
      dx: 0,
      startX: e.clientX,
      raf: stackDrag.current.raf,
      samples: [{ x: e.clientX, t: performance.now() }],
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    if (stackDrag.current.raf == null) stackDrag.current.raf = requestAnimationFrame(applyDrag)
  }
  const onStackMove = (e: React.PointerEvent) => {
    if (!stackDrag.current.down) return
    stackDrag.current.dx = e.clientX - stackDrag.current.startX
    const now = performance.now()
    const s = stackDrag.current.samples
    s.push({ x: e.clientX, t: now })
    while (s.length > 2 && now - s[0].t > 120) s.shift()
  }
  const onStackUp = (e: React.PointerEvent) => {
    if (!stackDrag.current.down) return
    stackDrag.current.down = false
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {}
    const { dx, samples } = stackDrag.current
    const w = wrapRef.current?.clientWidth || 320
    const now = performance.now()
    const first = samples[0]
    const last = samples[samples.length - 1]
    const dt = last.t - first.t
    const vx = dt > 0 ? (last.x - first.x) / dt : 0 // px/ms
    const flick = now - last.t < 90 && Math.abs(vx) > 0.45
    const dir = (dx !== 0 ? Math.sign(dx) : Math.sign(vx)) as 1 | -1 | 0
    const commit = dir !== 0 && (Math.abs(dx) > w * 0.3 || flick)
    settle(commit, dir === 0 ? 1 : dir)
    stackDrag.current.dx = 0
  }

  useEffect(
    () => () => {
      if (stackDrag.current.raf != null) cancelAnimationFrame(stackDrag.current.raf)
    },
    [],
  )

  return (
    <div className="md:hidden">
      <div className="mt-8 px-6">
        <div
          ref={wrapRef}
          className="br-grab relative mx-auto aspect-[1204/1150] w-full max-w-[480px] select-none"
          style={{ touchAction: 'pan-y' }}
          onPointerDown={onStackDown}
          onPointerMove={onStackMove}
          onPointerUp={onStackUp}
          onPointerCancel={onStackUp}
        >
          {cards.map((card, i) => {
            const d = (i - index + n) % n
            const p = pose(d)
            return (
              <div
                key={card.problem}
                ref={(el) => {
                  els.current[i] = el
                }}
                className="absolute inset-0"
                style={{
                  transform: p.transform,
                  opacity: p.opacity,
                  zIndex: p.zIndex,
                  transition: i === lastSwiped ? 'none' : STACK_TRANS,
                  willChange: 'transform',
                }}
              >
                <article className="relative h-full w-full rounded-2xl bg-white shadow-[0_18px_40px_-18px_rgba(7,14,44,0.35)]">
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    {/* mobile crop when it exists; both crops share the same
                        ~1.047 ratio as the wrapper so nothing letterboxes */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.mobileImage ?? card.image}
                      alt={`Problem ${card.problem}`}
                      draggable={false}
                      className="pointer-events-none h-full w-full object-cover"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl border border-[var(--br-stroke)]" />
                </article>
              </div>
            )
          })}
        </div>
      </div>

      {/* pills — tap to jump the deck */}
      <div
        className="br-noscrollbar mt-7 flex gap-2 overflow-x-auto pl-6 pr-6"
        style={{ touchAction: 'pan-x pan-y' }}
      >
        {cards.map((card, i) => (
          <button
            key={card.problem}
            onClick={() => {
              if (!busy.current) {
                setLastSwiped(-1)
                setIndex(i)
              }
            }}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
              i === index
                ? 'border-[var(--br-gold)] bg-[var(--br-gold)] font-medium text-white'
                : 'border-[var(--br-stroke)] bg-white text-neutral-500'
            }`}
          >
            Problem {card.problem}
          </button>
        ))}
      </div>
    </div>
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
      className={`relative ${card.mobileImage ? `${MOBILE_CARD_RATIO} lg:aspect-[1920/1150]` : CARD_RATIO[card.span]} w-[88vw] max-w-[88vw] shrink-0 rounded-2xl bg-white lg:h-[600px] lg:w-auto lg:max-w-none`}
    >
      {/* image clipped to the radius in its own layer. When a mobile crop exists,
          a <picture> serves it below the lg breakpoint and the wide desktop
          image at lg+ (matching the aspect handling on the article above). */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {card.mobileImage ? (
          <picture>
            <source media="(min-width: 1024px)" srcSet={card.image} />
            <img
              src={card.mobileImage}
              alt={`Problem ${card.problem}`}
              draggable={false}
              className="pointer-events-none h-full w-full object-cover"
            />
          </picture>
        ) : (
          <img
            src={card.image}
            alt={`Problem ${card.problem}`}
            draggable={false}
            className="pointer-events-none h-full w-full object-cover"
          />
        )}
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
