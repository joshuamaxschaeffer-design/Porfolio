'use client'

import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { useRef } from 'react'

/**
 * MarqueeStrip — an infinite ticker that drifts forever and reacts to scroll
 * velocity (scrolling fast speeds it up and can flip its direction, then it
 * eases back to the ambient drift). The current, "alive" variant of a marquee
 * vs. a plain CSS loop. Content is duplicated so the wrap is seamless.
 *
 * Pure transform (GPU-composited). Reduced-motion → a static, centered row.
 */
export function MarqueeStrip({
  items,
  baseVelocity = 40,
  className,
  separator = '—',
  reverse = false,
}: {
  items: string[]
  /** px/sec ambient drift */
  baseVelocity?: number
  className?: string
  separator?: string
  reverse?: boolean
}) {
  const reduce = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false })

  const dir = reverse ? -1 : 1
  const directionRef = useRef(dir)
  const x = useTransform(baseX, (v) => `${wrapPct(-25, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    let moveBy = directionRef.current * baseVelocity * (delta / 1000)
    // scroll velocity bends speed AND can flip direction momentarily
    const vf = velocityFactor.get()
    if (vf < 0) directionRef.current = -dir
    else if (vf > 0) directionRef.current = dir
    moveBy += directionRef.current * moveBy * Math.abs(vf)
    baseX.set(baseX.get() + moveBy)
  })

  // 4 copies so a fast scroll-fling never reveals an empty edge.
  const copies = [0, 1, 2, 3]
  const row = (
    <span className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span className="whitespace-nowrap">{it}</span>
          <span aria-hidden className="mx-6 text-[var(--br-muted-2)] md:mx-9">{separator}</span>
        </span>
      ))}
    </span>
  )

  if (reduce) {
    return (
      <div className={`overflow-hidden ${className ?? ''}`}>
        <div className="flex flex-wrap justify-center gap-x-2">{row}</div>
      </div>
    )
  }

  return (
    <div className={`overflow-hidden ${className ?? ''}`}>
      <motion.div className="flex w-max flex-nowrap" style={{ x }}>
        {copies.map((c) => (
          <span key={c} className="flex shrink-0 items-center">{row}</span>
        ))}
      </motion.div>
    </div>
  )
}

/** wrap v into [min,max) as a percentage so the loop is seamless. */
function wrapPct(min: number, max: number, v: number) {
  const range = max - min
  const mod = (((v - min) % range) + range) % range
  return mod + min
}
