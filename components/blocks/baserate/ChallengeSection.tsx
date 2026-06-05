'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { challenge as defaults, type ChallengeCard } from './data'

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

  // Drag-to-scroll (pointer). Distinguishes a drag from a click so card taps still work.
  const drag = useRef({ down: false, moved: false, startX: 0, startScroll: 0 })

  const updateEdges = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
    // Track which card is nearest the left edge for the pager.
    const children = Array.from(el.querySelectorAll<HTMLElement>('[data-card]'))
    let nearest = 0
    let best = Infinity
    children.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - el.scrollLeft)
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

  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current
    if (!el) return
    drag.current = { down: true, moved: false, startX: e.clientX, startScroll: el.scrollLeft }
    el.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const el = trackRef.current
    if (!el || !drag.current.down) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 4) drag.current.moved = true
    el.scrollLeft = drag.current.startScroll - dx
  }
  const endDrag = (e: React.PointerEvent) => {
    const el = trackRef.current
    if (el) {
      try {
        el.releasePointerCapture(e.pointerId)
      } catch {}
    }
    drag.current.down = false
  }

  return (
    <section className="bg-[var(--br-bg-2)] py-20 md:py-28">
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

      {/* Draggable track, bleeds to the right edge */}
      <div
        ref={trackRef}
        className="br-noscrollbar br-grab mt-8 flex gap-5 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 pl-[max(1.5rem,calc((100vw-1443px)/2+5rem))] pr-6 select-none"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {cards.map((card) => (
          <ChallengeCardView key={card.problem} card={card} dragRef={drag} />
        ))}
      </div>

      {/* Pager */}
      <div className="br-container mt-6 flex flex-wrap gap-x-5 gap-y-2">
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
      className={`relative ${CARD_RATIO[card.span]} h-[600px] shrink-0 overflow-hidden rounded-2xl border border-[var(--br-stroke)]`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.image}
        alt={`Problem ${card.problem}`}
        draggable={false}
        className="pointer-events-none h-full w-full object-cover"
      />
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
