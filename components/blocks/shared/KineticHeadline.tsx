'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

/**
 * KineticHeadline — an oversized headline whose words fan with a slight per-word
 * vertical offset that resolves to a flat baseline as you scroll through it
 * (a kinetic-type "settle"). Sets a type-forward tone as a full-bleed section
 * divider. Reduced-motion → static headline.
 */
export function KineticHeadline({
  text,
  className,
  as: Tag = 'h2',
}: {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const words = text.split(' ')

  return (
    <div ref={ref} className={className}>
      <Tag className="flex flex-wrap gap-x-[0.3em] gap-y-1 text-[40px] font-medium leading-[0.95] tracking-[-0.02em] text-[var(--br-ink)] md:text-[96px]">
        {words.map((w, i) => (
          <KineticWord key={i} word={w} index={i} total={words.length} progress={scrollYProgress} reduce={!!reduce} />
        ))}
      </Tag>
    </div>
  )
}

function KineticWord({
  word,
  index,
  total,
  progress,
  reduce,
}: {
  word: string
  index: number
  total: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  progress: any
  reduce: boolean
}) {
  // alternate words start offset up/down, converge to 0 mid-scroll
  const dir = index % 2 === 0 ? 1 : -1
  const start = dir * (18 + (index % 3) * 8)
  const y = useTransform(progress, [0, 0.5, 1], [start, 0, -start * 0.5])
  return (
    <motion.span style={{ display: 'inline-block', y: reduce ? 0 : y, willChange: 'transform' }}>
      {word}
    </motion.span>
  )
}
