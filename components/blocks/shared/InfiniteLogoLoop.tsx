'use client'

import { useId } from 'react'

/**
 * InfiniteLogoLoop — a seamless, always-on logo/skill loop with edge fades.
 * Pure CSS keyframe (no JS rAF, no scroll listener) so it's the cheapest possible
 * "trusted by / capabilities" strip; pauses on hover. Two copies translate -50%
 * for a perfect loop. Honors prefers-reduced-motion (stops, shows statically).
 */
export function InfiniteLogoLoop({
  items,
  className,
  duration = 28,
  reverse = false,
  fade = true,
}: {
  items: string[]
  className?: string
  /** seconds for one full loop */
  duration?: number
  reverse?: boolean
  fade?: boolean
}) {
  const uid = useId().replace(/[:]/g, '')
  const set = (
    <ul className={`pdgloop-set-${uid} flex shrink-0 items-center`}>
      {items.map((it, i) => (
        <li key={i} className="mx-6 whitespace-nowrap text-[var(--br-muted)] md:mx-10">
          <span className="text-[18px] font-medium tracking-[-0.01em] text-[var(--br-ink)] md:text-[22px]">{it}</span>
        </li>
      ))}
    </ul>
  )

  return (
    <div
      className={`group relative overflow-hidden ${className ?? ''}`}
      style={
        fade
          ? { WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }
          : undefined
      }
    >
      <div className={`pdgloop-track-${uid} flex w-max`}>
        {set}
        {set}
      </div>
      <style>{`
        .pdgloop-track-${uid} { animation: pdgloop-${uid} ${duration}s linear infinite; will-change: transform; }
        .group:hover .pdgloop-track-${uid} { animation-play-state: paused; }
        @keyframes pdgloop-${uid} {
          from { transform: translateX(0); }
          to { transform: translateX(${reverse ? '50%' : '-50%'}); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pdgloop-track-${uid} { animation: none; }
        }
      `}</style>
    </div>
  )
}
