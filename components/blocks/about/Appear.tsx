'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface AppearProps {
  children: ReactNode
  /** ms delay before the entrance */
  delay?: number
  /** translate distance (px) */
  distance?: number
  className?: string
  /**
   * When true, animate as the element enters the viewport (for below-the-fold
   * content). When false (default), animate on mount — the reliable choice for
   * above-the-fold content, which a whileInView observer can miss.
   */
  onView?: boolean
}

/**
 * Entrance wrapper that NEVER hides content.
 *
 * The resting (target) state is the visible one. With motion enabled we add an
 * entrance from a faded/offset start; with reduced-motion (or SSR before
 * hydration) the child is simply visible — no opacity:0 that could get stuck.
 *
 * `onView=false` (default) animates on mount, which is reliable for hero/above-
 * the-fold content. `onView=true` uses whileInView for below-the-fold sections.
 * Either way, if the animation never runs the content is still shown, because
 * `whileInView`/`animate` both target the visible state and we only set the
 * faded `initial` when motion is on.
 */
export function Appear({
  children,
  delay = 0,
  distance = 20,
  className,
  onView = false,
}: AppearProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  const common = {
    className,
    initial: { opacity: 0, y: distance },
    transition: { duration: 0.6, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] as const },
  }

  if (onView) {
    return (
      <motion.div
        {...common}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3, margin: '0px 0px -60px 0px' }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div {...common} animate={{ opacity: 1, y: 0 }}>
      {children}
    </motion.div>
  )
}
