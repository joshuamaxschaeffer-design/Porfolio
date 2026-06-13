'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface AppearProps {
  children: ReactNode
  /** ms delay before the entrance (scroll-in case only) */
  delay?: number
  /** translate distance (px) */
  distance?: number
  className?: string
  /**
   * true  → animate as the element scrolls into view (below-the-fold sections).
   * false → render immediately, no animation (above-the-fold / hero). Default false.
   */
  onView?: boolean
}

/**
 * Entrance wrapper.
 *
 * Deliberate split:
 *  - onView=false (hero / above the fold): renders the child PLAINLY, no entrance
 *    animation. The hero is the first paint and the site's first impression — it
 *    must be visible instantly and unconditionally. (We tried JS- and CSS-mount
 *    animations; both can leave content faded when the tab is backgrounded/
 *    throttled, since the browser suspends animations + rAF on hidden tabs. Not
 *    worth risking a blank hero for a fade.)
 *  - onView=true (below the fold): motion's whileInView fade-up — reliable,
 *    because these sit below the hero and only animate once a (focused) user
 *    scrolls them into view. Never hides content for reduced-motion users.
 *
 * The visual polish on this page comes from the scroll-in sections and the
 * timeline's scroll-drawn rail; the hero just lands, cleanly.
 */
export function Appear({
  children,
  delay = 0,
  distance = 20,
  className,
  onView = false,
}: AppearProps) {
  const prefersReduced = useReducedMotion()

  if (!onView || prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
