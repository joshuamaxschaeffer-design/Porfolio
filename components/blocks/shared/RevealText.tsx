'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * RevealText — editorial line/word mask reveal.
 *
 * Splits a string into words (or whole lines) and wipes them up from behind a
 * clip mask with a staggered cascade as the block scrolls into view. The single
 * highest-leverage move on a type-forward layout — pair with oversized headings.
 *
 * Pure CSS transform + overflow mask (no layout thrash). Reduced-motion → the
 * text renders plainly, fully visible. `as` lets it be an h1/h2/p etc.
 */
export function RevealText({
  text,
  as: Tag = 'h2',
  by = 'word',
  className,
  stagger = 0.045,
  duration = 0.7,
  once = true,
}: {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  /** split granularity */
  by?: 'word' | 'line'
  className?: string
  stagger?: number
  duration?: number
  once?: boolean
}) {
  const reduce = useReducedMotion()
  // 'line' splits on explicit \n; 'word' splits on spaces but keeps \n as breaks.
  const tokens = by === 'line' ? text.split('\n') : text.split(/(\s+|\n)/)

  if (reduce) {
    return <Tag className={className}>{text}</Tag>
  }

  const MotionTag = motion[Tag] as typeof motion.h2
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.35, margin: '0px 0px -10% 0px' }}
      transition={{ staggerChildren: stagger }}
      aria-label={text}
    >
      {tokens.map((tok, i) => {
        if (tok === '\n') return <br key={i} />
        if (/^\s+$/.test(tok)) return <span key={i}> </span>
        return (
          <span
            key={i}
            aria-hidden
            style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}
          >
            <motion.span
              style={{ display: 'inline-block', willChange: 'transform' }}
              variants={{
                hidden: { y: '110%' },
                show: { y: '0%', transition: { duration, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              {tok}
            </motion.span>
          </span>
        )
      })}
    </MotionTag>
  )
}

/**
 * RevealBlock — same mask-up cascade but for arbitrary children (a stack of
 * elements), each revealed in sequence. Good for eyebrow + headline + lead.
 */
export function RevealBlock({
  children,
  className,
  stagger = 0.12,
  y = 24,
  once = true,
}: {
  children: ReactNode
  className?: string
  stagger?: number
  y?: number
  once?: boolean
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.3, margin: '0px 0px -8% 0px' }}
      transition={{ staggerChildren: stagger }}
    >
      {Array.isArray(children)
        ? children.map((c, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
            >
              {c}
            </motion.div>
          ))
        : children}
    </motion.div>
  )
}
