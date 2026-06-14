'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

export interface HScrollPanel {
  title?: string
  body?: string
  meta?: string
  src?: string
  accent?: string
}

/**
 * HorizontalScroll — a tall section that PINS to the viewport and translates a
 * row of panels horizontally as you scroll vertically through it. The flagship
 * "scrollytelling gallery" move on agency sites. The section's height controls
 * how long it stays pinned (≈ panels × viewport).
 *
 * Reduced-motion / touch-friendliness: falls back to a normal vertical stack so
 * there's no scroll-hijack on phones (where horizontal pin feels broken).
 */
export function HorizontalScroll({ panels, className }: { panels: HScrollPanel[]; className?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // translate from 0 to -(n-1)/n of the track width as we scroll through.
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(panels.length - 1) * (100 / panels.length)}%`])

  if (reduce) {
    return (
      <div className={`flex flex-col gap-4 ${className ?? ''}`}>
        {panels.map((p, i) => <Panel key={i} panel={p} stacked />)}
      </div>
    )
  }

  return (
    // tall track: ~1 viewport of scroll per panel keeps the pace natural
    <div ref={ref} className={`relative ${className ?? ''}`} style={{ height: `${panels.length * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div className="flex gap-5 px-6 md:px-20" style={{ x, width: `${panels.length * 100}%` }}>
          {panels.map((p, i) => <Panel key={i} panel={p} />)}
        </motion.div>
      </div>
    </div>
  )
}

function Panel({ panel, stacked }: { panel: HScrollPanel; stacked?: boolean }) {
  return (
    <div className={stacked ? 'w-full' : 'w-[80vw] shrink-0 md:w-[60vw] lg:w-[44vw]'}>
      <div className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)]" style={{ aspectRatio: '16 / 10' }}>
        {panel.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={panel.src} alt={panel.title ?? ''} draggable={false} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col justify-end p-7" style={{ background: `linear-gradient(145deg, ${panel.accent ?? 'var(--br-ink)'} 0%, #070e2c 130%)` }}>
            {panel.meta ? <span className="br-data text-[12px] uppercase tracking-[0.14em] text-white/70">{panel.meta}</span> : null}
            {panel.title ? <h3 className="mt-2 text-[26px] font-medium leading-tight tracking-[-0.01em] text-white md:text-[34px]">{panel.title}</h3> : null}
            {panel.body ? <p className="mt-2 max-w-md text-[14px] leading-relaxed text-white/70 md:text-[15px]">{panel.body}</p> : null}
          </div>
        )}
      </div>
    </div>
  )
}
