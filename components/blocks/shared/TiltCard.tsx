'use client'

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import type { ReactNode } from 'react'

/**
 * TiltCard — a 3D pointer-tilt card with a moving glare highlight. The card
 * rotates toward the cursor in perspective and a soft sheen tracks the pointer,
 * then springs flat on leave. Ubiquitous on premium product/portfolio cards.
 *
 * Real 3D (perspective on the wrapper, rotateX/Y on the child). No-op on touch /
 * reduced-motion. `max` = max tilt in degrees.
 */
export function TiltCard({
  children,
  className,
  max = 10,
  glare = true,
}: {
  children: ReactNode
  className?: string
  max?: number
  glare?: boolean
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  // normalized pointer position -0.5..0.5
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 200, damping: 18, mass: 0.4 })
  const sy = useSpring(py, { stiffness: 200, damping: 18, mass: 0.4 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max])
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max])
  const glareX = useTransform(sx, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(sy, [-0.5, 0.5], ['0%', '100%'])

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => { px.set(0); py.set(0) }

  if (reduce) return <div className={className}>{children}</div>

  return (
    <div style={{ perspective: 900 }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
      >
        {children}
        {glare ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              background: useTransform([glareX, glareY], ([x, y]) =>
                `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.35), rgba(255,255,255,0) 45%)`,
              ),
              mixBlendMode: 'overlay',
            }}
          />
        ) : null}
      </motion.div>
    </div>
  )
}
