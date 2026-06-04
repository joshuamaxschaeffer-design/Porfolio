'use client'

import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Tilt3DProps {
  children: ReactNode
  /** Max tilt angle in degrees. */
  max?: number
  /** Adds a subtle shine glare that follows the cursor. */
  shine?: boolean
  /** Scale on hover. Default 1.02. */
  scale?: number
  className?: string
}

/**
 * Cheap mouse-tracked 3D tilt wrapper. Wrap any content (case study card,
 * image, etc.) for the popular "card responds to cursor" effect.
 *
 * Uses CSS 3D transforms + motion springs — no Three.js required (~3KB).
 * Respects prefers-reduced-motion.
 */
export function Tilt3D({ children, max = 10, shine = false, scale = 1.02, className }: Tilt3DProps) {
  const prefersReduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const spring = { stiffness: 200, damping: 25 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), spring)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), spring)

  // Glare position
  const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%'])

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1200,
        rotateX,
        rotateY,
      }}
      whileHover={{ scale }}
      transition={{ scale: { duration: 0.3 } }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
      {shine && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: `radial-gradient(circle at ${glareX as any} ${glareY as any}, rgba(255,255,255,0.15), transparent 50%)`,
          }}
        />
      )}
    </motion.div>
  )
}
