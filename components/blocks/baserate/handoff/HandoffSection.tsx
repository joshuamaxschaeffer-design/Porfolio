'use client'

import { useState } from 'react'
import { FeelingSlider } from './FeelingSlider'
import { RankingReorder } from './RankingReorder'
import { CommentSystem } from './CommentSystem'
import { HANDOFF_SNIPPETS, type HandoffElementId } from './handoff-snippets'
import { CodeBox } from './CodeBox'

/**
 * HANDOFF panel — three real, working dark-mode UI elements (imported from the
 * Baserate app) on the left; a code box on the right that shows cleaned-up code
 * for whichever element is hovered. Hovering an element rings it in gold and
 * swaps the code. Default (nothing hovered) shows the first element's code.
 */

const ELEMENTS: { id: HandoffElementId; label: string; render: () => React.ReactNode }[] = [
  { id: 'feeling', label: 'Feeling scale', render: () => <FeelingSlider /> },
  { id: 'ranking', label: 'Ranking poll', render: () => <RankingReorder /> },
  { id: 'comments', label: 'Comments', render: () => <CommentSystem /> },
]

export function HandoffSection({ title = 'HANDOFF', body = 'Dev handoff meetings, real-time collaborations, weekly open office hour' }: { title?: string; body?: string }) {
  const [hovered, setHovered] = useState<HandoffElementId | null>(null)
  const active = hovered ?? 'feeling'

  return (
    <div className="br-container mt-28 md:mt-40">
      <h3 className="text-[20px] font-semibold uppercase leading-tight text-white md:text-[24px]">{title}</h3>
      <p className="br-body mt-3 text-[16px] leading-relaxed text-white/60 md:text-[18px]">{body}</p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-10">
        {/* Left: working UI elements */}
        <div className="flex flex-col gap-5">
          {ELEMENTS.map((el) => {
            const isActive = hovered === el.id
            return (
              <div
                key={el.id}
                onMouseEnter={() => setHovered(el.id)}
                onMouseLeave={() => setHovered(null)}
                className="rounded-xl p-2 transition-colors duration-200"
                style={{
                  background: 'rgba(255,255,255,0.015)',
                  border: `1px solid ${isActive ? 'var(--br-gold)' : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isActive ? '0 0 0 1px var(--br-gold), 0 12px 40px -16px rgba(174,125,0,0.35)' : 'none',
                }}
              >
                {el.render()}
              </div>
            )
          })}
        </div>

        {/* Right: code box */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <CodeBox snippet={HANDOFF_SNIPPETS[active]} />
        </div>
      </div>
    </div>
  )
}
