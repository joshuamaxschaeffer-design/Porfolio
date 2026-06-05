'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

export interface ExplorationItem {
  title: string
  body: string
  image: string
}

/**
 * The Exploration interaction:
 *  - Left: a stack of images. The selected image sits upright on top; the
 *    others fan out behind it, skewed and offset.
 *  - Right: a list of text items with a vertical indicator line. Hovering an
 *    item slides the line to it; clicking selects it, which fades the current
 *    top image out, drops it to the back, and brings the others forward.
 */
export function ExplorationStack({ items }: { items: ExplorationItem[] }) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState<number | null>(null)

  const n = items.length
  const lineIndex = hover ?? active

  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      {/* Image stack. Matches Figma: the front card is flat/upright; the cards
          behind are plain flat rectangles peeking out to the UPPER-LEFT (no 3D
          rotation, no skew). Left padding leaves room for them. */}
      <div className="relative mx-auto aspect-[874/932] w-full max-w-[460px] pl-14 pt-6">
        {items.map((item, i) => {
          // depth = how far behind the front this card is (0 = front)
          const depth = (i - active + n) % n
          const isFront = depth === 0
          // Behind cards step out to the upper-left, slightly smaller. Flat — no rotate/skew.
          const x = isFront ? 0 : -26 * depth
          const y = isFront ? 0 : -20 * depth
          const scale = isFront ? 1 : 1 - depth * 0.03
          return (
            <motion.button
              key={item.title}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${item.title}`}
              className="absolute inset-0 origin-center overflow-hidden rounded-2xl border border-[var(--br-line)] bg-white shadow-[0_18px_44px_-28px_rgba(0,0,0,0.3)] focus:outline-none"
              style={{ zIndex: n - depth }}
              initial={false}
              animate={
                reduce
                  ? { opacity: isFront ? 1 : 0 }
                  : {
                      x,
                      y,
                      scale,
                      opacity: depth > 2 ? 0 : 1,
                    }
              }
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            >
              {/* Front card shows the image; the cards behind are blank panels (as in Figma). */}
              {isFront ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.title} draggable={false} className="h-full w-full object-contain" />
              ) : (
                <span className="absolute inset-0 bg-white" />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Text items with vertical indicator line */}
      <div className="relative">
        {/* track */}
        <div className="absolute left-0 top-0 h-full w-px bg-[var(--br-line)]" />
        {/* moving line */}
        <motion.div
          className="absolute left-0 w-[2px] bg-[var(--br-gold)]"
          initial={false}
          animate={{ top: `${(lineIndex / n) * 100}%` }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 35 }}
          style={{ height: `${100 / n}%` }}
        />
        <ul>
          {items.map((item, i) => {
            const selected = i === active
            return (
              <li key={item.title}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  className="block w-full py-5 pl-6 text-left md:py-6"
                >
                  <h4
                    className={`text-base font-bold tracking-tight transition-colors md:text-lg ${
                      selected ? 'text-[var(--br-ink)]' : 'text-neutral-400'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <motion.p
                    className="overflow-hidden text-sm leading-snug text-neutral-600"
                    initial={false}
                    animate={{
                      opacity: selected ? 1 : 0.5,
                    }}
                  >
                    {item.body}
                  </motion.p>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
