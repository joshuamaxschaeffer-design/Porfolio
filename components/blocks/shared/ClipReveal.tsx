'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import type { ReactNode } from 'react'

/**
 * ClipReveal — an image (or any block) that unmasks via an animated clip-path
 * inset wipe as it scrolls into view, with a subtle inner scale so the content
 * pushes forward at the same time (parallax-crop). The premium alternative to a
 * plain fade. Reduced-motion → renders plainly.
 *
 * `direction` controls the wipe origin. Provide either an `src` image or
 * arbitrary `children`.
 */
export function ClipReveal({
  src,
  alt = '',
  children,
  className,
  direction = 'up',
  ratio,
  rounded = true,
}: {
  src?: string
  alt?: string
  children?: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  /** aspect-ratio (w/h) string, e.g. '16 / 10' */
  ratio?: string
  rounded?: boolean
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.35'] })

  const insets: Record<string, [string, string]> = {
    up: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
    down: ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'],
    left: ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'],
    right: ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'],
  }
  const clip = useTransform(scrollYProgress, [0, 1], insets[direction])
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1])

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${rounded ? 'rounded-[var(--br-card-radius)]' : ''} ${className ?? ''}`}
      style={{ aspectRatio: ratio }}
    >
      <motion.div
        className="h-full w-full"
        style={reduce ? undefined : { clipPath: clip, WebkitClipPath: clip }}
      >
        <motion.div className="h-full w-full" style={reduce ? undefined : { scale }}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} className="h-full w-full object-cover" draggable={false} />
          ) : (
            children
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
