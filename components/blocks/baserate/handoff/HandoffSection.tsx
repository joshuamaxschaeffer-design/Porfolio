'use client'

import { useState } from 'react'
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

      {/* ── Mobile: stacked pairs (element directly above its own code). ── */}
      <div className="mt-8 flex flex-col gap-10 lg:hidden">
        {ELEMENTS.map((el) => (
          <div key={el.id} className="flex min-w-0 flex-col gap-3">
            {/* the element shows its "active" (gold-ringed) state so it reads as
                selected without a hover the device can't do */}
            <ElementCard active>{el.render()}</ElementCard>
            <CodeBox snippet={HANDOFF_SNIPPETS[el.id]} compact />
          </div>
        ))}
      </div>
    </div>
  )
}
