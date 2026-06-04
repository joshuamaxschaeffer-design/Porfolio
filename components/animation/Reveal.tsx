'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Direction of the entrance. */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  /** How much to translate (px). Default 24. */
  distance?: number
  /** Delay in ms. */
  delay?: number
  /** Duration in seconds. Default 0.6. */
  duration?: number
  /** Percentage of element that must be in view before revealing (0–1). */
  amount?: number
  /** When true, the animation runs every time it enters view; otherwise just once. */
  repeat?: boolean
  className?: string
}

/**
 * Cheap, reusable scroll-reveal wrapper. Fades + translates the child once
 * it enters the viewport. Respects prefers-reduced-motion automatically.
 *
 * Use to add baseline polish to any block: <Reveal><HeroContent /></Reveal>
 */
export function Reveal({
  children,
  direction = 'up',
  distance = 24,
  delay = 0,
  duration = 0.6,
  amount = 0.2,
  repeat = false,
  className,
}: RevealProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced || direction === 'none') {
    return <div className={className}>{children}</div>
  }

  const initial: Record<string, number> = { opacity: 0 }
  if (direction === 'up') initial.y = distance
  if (direction === 'down') initial.y = -distance
  if (direction === 'left') initial.x = distance
  if (direction === 'right') initial.x = -distance

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: !repeat, amount, margin: '0px 0px -80px 0px' }}
      transition={{ duration, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
