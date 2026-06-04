'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  /** Animation duration in seconds (lower = faster). */
  duration?: number
  /** Direction of travel. */
  direction?: 'left' | 'right'
  /** Pause on hover. */
  pauseOnHover?: boolean
  /** Gap between repeated copies (Tailwind class). */
  gap?: string
  className?: string
}

/**
 * Infinite horizontal marquee. Drop logos, testimonials, or words into it
 * for the polished "always-moving" effect popularized by Linear, Vercel, etc.
 *
 * Respects prefers-reduced-motion (renders static).
 */
export function Marquee({
  children,
  duration = 30,
  direction = 'left',
  pauseOnHover = true,
  gap = 'gap-16',
  className,
}: MarqueeProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={`flex ${gap} ${className || ''}`}>{children}</div>
  }

  return (
    <div className={`group overflow-hidden ${className || ''}`}>
      <motion.div
        className={`flex w-max ${gap}`}
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          animationPlayState: pauseOnHover ? 'running' : 'running',
        }}
      >
        {children}
        {/* Duplicate for seamless loop */}
        {children}
      </motion.div>
    </div>
  )
}
