'use client'

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'

/**
 * The Component Libraries artifact on a card with a dramatic, cursor-reactive
 * 3D tilt. Hovering a corner pushes THAT corner back into space (the card
 * rotates away from the cursor), so it reads as a physical panel you're
 * pressing on. Stronger than the generic Tilt3D: bigger angle, near perspective,
 * cursor-following shine + a depth shadow that shifts opposite the tilt.
 */
export function ComponentsTiltCard({ src, alt }: { src: string; alt: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  // normalized cursor position, -0.5..0.5 (0,0 = center)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const spring = { stiffness: 220, damping: 22, mass: 0.5 }

  const MAX = 18 // degrees — dramatic
  // "Push the corner back": cursor toward the top → top edge rotates AWAY
  // (negative rotateX). Cursor toward the right → right edge rotates away.
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [-MAX, MAX]), spring)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [MAX, -MAX]), spring)

  // glare follows the cursor; brightest where the card tips toward you
  const glareX = useTransform(mx, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(my, [-0.5, 0.5], ['0%', '100%'])
  const glare = useTransform(
    [glareX, glareY],
    ([gx, gy]: string[]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.18), transparent 55%)`,
  )

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  if (reduce) {
    return (
      <div className="mt-10 overflow-hidden rounded-2xl bg-white shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)] md:mt-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="block w-full" />
      </div>
    )
  }

  return (
    // Outer holds the perspective; the closer (smaller) the perspective value,
    // the more extreme the foreshortening — so a corner really reads as going
    // back in Z.
    <div className="mt-10 md:mt-12" style={{ perspective: 900 }}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative rounded-2xl"
        style={{
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
          boxShadow: '0 40px 90px -40px rgba(0,0,0,0.85)',
          willChange: 'transform',
        }}
        whileHover={{ scale: 1.015 }}
        transition={{ scale: { duration: 0.3 } }}
      >
        <div className="overflow-hidden rounded-2xl bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} draggable={false} className="block w-full select-none" />
        </div>
        {/* cursor-following sheen */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: glare }} />
      </motion.div>
    </div>
  )
}
