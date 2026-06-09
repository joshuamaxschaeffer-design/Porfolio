'use client'

import { useRef, useState } from 'react'
import { FeelingSlider } from './FeelingSlider'
import { RankingReorder } from './RankingReorder'
import { CommentSystem } from './CommentSystem'
import { HANDOFF_SNIPPETS, type HandoffElementId } from './handoff-snippets'
import { CodeBox } from './CodeBox'

/**
 * HANDOFF panel — three real, working dark-mode UI elements (imported from the
 * Baserate app) paired with the cleaned-up code that builds each.
 *
 * Desktop (lg+): two columns. Elements on the left; ONE code box on the right
 * that swaps to whichever element is hovered (gold ring on hover). Default shows
 * the first element's code.
 *
 * Mobile (<lg): hover doesn't exist on touch, so the columns collapse into
 * self-contained PAIRS — each working element sits directly above its own code
 * block, in reading order. The relationship is conveyed by proximity instead of
 * a cross-column hover link. (See Baserate Mobile Spec §8.)
 */

const ELEMENTS: { id: HandoffElementId; label: string; render: () => React.ReactNode }[] = [
  { id: 'feeling', label: 'Feeling scale', render: () => <FeelingSlider /> },
  { id: 'ranking', label: 'Ranking poll', render: () => <RankingReorder /> },
  { id: 'comments', label: 'Comments', render: () => <CommentSystem /> },
]

function ElementCard({
  active,
  onEnter,
  onLeave,
  children,
}: {
  active: boolean
  onEnter?: () => void
  onLeave?: () => void
  children: React.ReactNode
}) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="min-w-0 overflow-hidden rounded-xl p-2 transition-colors duration-200"
      style={{
        background: 'rgba(255,255,255,0.015)',
        border: `1px solid ${active ? 'var(--br-gold)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: active ? '0 0 0 1px var(--br-gold), 0 12px 40px -16px rgba(174,125,0,0.35)' : 'none',
      }}
    >
      {children}
    </div>
  )
}

export function HandoffSection({ title = 'HANDOFF', body = 'Dev handoff meetings, real-time collaborations, weekly open office hour' }: { title?: string; body?: string }) {
  const [hovered, setHovered] = useState<HandoffElementId | null>(null)
  const active = hovered ?? 'feeling'

  // Mobile: a horizontal scroll-snap track of the 3 components sits over the code
  // box; the centered card's index drives which code the box shows.
  const [mIdx, setMIdx] = useState(0)
  const mTrackRef = useRef<HTMLDivElement>(null)
  const onMScroll = () => {
    const el = mTrackRef.current
    if (!el) return
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-handoff-card]'))
    const center = el.scrollLeft + el.clientWidth / 2
    let nearest = 0
    let best = Infinity
    cards.forEach((c, i) => {
      const cc = c.offsetLeft + c.offsetWidth / 2
      const d = Math.abs(cc - center)
      if (d < best) {
        best = d
        nearest = i
      }
    })
    if (nearest !== mIdx) setMIdx(nearest)
  }
  const scrollMTo = (i: number) => {
    const el = mTrackRef.current
    if (!el) return
    const card = el.querySelectorAll<HTMLElement>('[data-handoff-card]')[i]
    if (card) el.scrollTo({ left: card.offsetLeft - 12, behavior: 'smooth' })
  }
  const mEl = ELEMENTS[mIdx]

  return (
    <div className="br-container mt-28 md:mt-40">
      <h3 className="text-[20px] font-semibold uppercase leading-tight text-white md:text-[24px]">{title}</h3>
      <p className="br-body mt-3 text-[16px] leading-relaxed text-white/60 md:text-[18px]">{body}</p>

      {/* ── Desktop / wide: two columns with hover-swap. Hidden < lg. ── */}
      <div className="mt-10 hidden gap-10 lg:grid lg:grid-cols-2">
        {/* Left: working UI elements */}
        <div className="flex min-w-0 flex-col gap-5">
          {ELEMENTS.map((el) => (
            <ElementCard
              key={el.id}
              active={hovered === el.id}
              onEnter={() => setHovered(el.id)}
              onLeave={() => setHovered(null)}
            >
              {el.render()}
            </ElementCard>
          ))}
        </div>

        {/* Right: single code box that follows the hovered element */}
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <CodeBox snippet={HANDOFF_SNIPPETS[active]} />
        </div>
      </div>

      {/* ── Mobile: the code box is the back layer; in FRONT of it (anchored to
          the BOTTOM of the code card) sits a horizontal scroll-snap track of the
          3 components — the active one fills the width and the NEXT peeks in on
          the right. Snapping to a new component swaps the code behind it. ── */}
      <div className="relative mt-8 lg:hidden">
        {/* code box (back) — swaps to whatever component is centered */}
        <CodeBox snippet={HANDOFF_SNIPPETS[mEl.id]} compact />

        {/* swipeable component track, overlaid on the BOTTOM of the code box.
            Cards are ~84vw with the next peeking. */}
        <div
          ref={mTrackRef}
          onScroll={onMScroll}
          className="br-noscrollbar absolute inset-x-0 bottom-3 z-20 flex snap-x snap-mandatory items-end gap-3 overflow-x-auto px-3"
          style={{ touchAction: 'pan-x' }}
        >
          {ELEMENTS.map((el) => {
            const isComments = el.id === 'comments'
            return (
              <div
                key={el.id}
                data-handoff-card
                className="relative h-[190px] w-[84%] shrink-0 snap-center overflow-hidden rounded-xl p-2"
                style={{
                  background: 'rgba(12,14,22,0.92)',
                  border: '1px solid var(--br-gold)',
                  boxShadow: '0 0 0 1px var(--br-gold), 0 20px 50px -18px rgba(0,0,0,0.8)',
                }}
              >
                {el.render()}
                {/* Comments overflows the fixed height — fade it to black at the
                    bottom instead of a hard clip. */}
                {isComments && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 rounded-b-xl"
                    style={{ background: 'linear-gradient(to bottom, rgba(12,14,22,0) 0%, rgba(12,14,22,0.96) 90%)' }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* dots + swipe hint, below the code box */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {ELEMENTS.map((el, i) => (
            <button
              key={el.id}
              aria-label={el.label}
              onClick={() => scrollMTo(i)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === mIdx ? 18 : 6,
                background: i === mIdx ? 'var(--br-gold)' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
