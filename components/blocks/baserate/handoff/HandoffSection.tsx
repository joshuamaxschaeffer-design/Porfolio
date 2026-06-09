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

  // Mobile: a single index cycles the 3 components; the active one floats in
  // front of the bottom of the code box, and a horizontal swipe swaps it.
  const [mIdx, setMIdx] = useState(0)
  const mSwipe = useRef({ x: 0, on: false })
  const onMTouchStart = (e: React.TouchEvent) => {
    mSwipe.current = { x: e.touches[0].clientX, on: true }
  }
  const onMTouchEnd = (e: React.TouchEvent) => {
    if (!mSwipe.current.on) return
    mSwipe.current.on = false
    const dx = e.changedTouches[0].clientX - mSwipe.current.x
    if (Math.abs(dx) < 35) return
    const dir = dx < 0 ? 1 : -1
    setMIdx((i) => (i + dir + ELEMENTS.length) % ELEMENTS.length)
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

      {/* ── Mobile: the code box is the back layer; the active component floats
          in FRONT of its bottom edge (z-axis), sitting low in the box. Swiping
          horizontally cycles the 3 components and swaps the code. ── */}
      <div
        className="relative mt-8 lg:hidden"
        onTouchStart={onMTouchStart}
        onTouchEnd={onMTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        {/* code box (back), taller so the floating component has room below it */}
        <CodeBox snippet={HANDOFF_SNIPPETS[mEl.id]} compact />

        {/* active component, overlapping the lower portion of the code box */}
        <div className="absolute inset-x-2 bottom-3 z-10">
          <div
            key={mEl.id}
            className="overflow-hidden rounded-xl p-2"
            style={{
              background: 'rgba(12,14,22,0.92)',
              border: '1px solid var(--br-gold)',
              boxShadow: '0 0 0 1px var(--br-gold), 0 20px 50px -18px rgba(0,0,0,0.8)',
              backdropFilter: 'blur(2px)',
              animation: 'brHandoffSwap 280ms ease',
            }}
          >
            {mEl.render()}
          </div>
        </div>

        {/* dots + swipe hint */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {ELEMENTS.map((el, i) => (
            <button
              key={el.id}
              aria-label={el.label}
              onClick={() => setMIdx(i)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === mIdx ? 18 : 6,
                background: i === mIdx ? 'var(--br-gold)' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-white/35">Swipe to switch component</p>
      </div>

      <style>{`@keyframes brHandoffSwap { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }`}</style>
    </div>
  )
}
