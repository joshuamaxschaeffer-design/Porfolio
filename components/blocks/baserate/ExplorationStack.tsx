'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'

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
export function ExplorationStack({ items, tag }: { items: ExplorationItem[]; tag?: string }) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState<number | null>(null)

  const n = items.length
  // Hover drives the whole interaction (image + line + selected state); the last
  // hovered item stays active after the cursor leaves.
  const current = hover ?? active

  // Mobile: horizontal swipe on EITHER the image stack or the text list advances
  // the shared `current` index, so both swap in sync (no hover on touch).
  const swipe = useRef({ x: 0, active: false })
  const onTouchStart = (e: React.TouchEvent) => {
    swipe.current = { x: e.touches[0].clientX, active: true }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!swipe.current.active) return
    swipe.current.active = false
    const dx = e.changedTouches[0].clientX - swipe.current.x
    if (Math.abs(dx) < 35) return // ignore taps / tiny moves
    const dir = dx < 0 ? 1 : -1 // swipe left → next
    setActive((a) => Math.max(0, Math.min(n - 1, a + dir)))
    setHover(null)
  }

  return (
    <div
      className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Image stack — Apple "Cover Flow" perspective. The front card faces
          forward (flat); the cards behind it angle away in 3D (rotateY), getting
          the foreshortened trapezoidal look, fanning to the left. Selecting a
          card brings it to the front and pushes the others back. */}
      <div className="relative mx-auto aspect-[874/932] w-full max-w-[440px] pl-8 md:pl-20" style={{ perspective: '1200px' }}>
        {items.map((item, i) => {
          // depth = how far behind the front this card is (0 = front)
          const depth = (i - current + n) % n
          const isFront = depth === 0
          // Behind cards: shifted left, angled away (rotateY), pushed back in Z, smaller.
          const x = isFront ? 0 : -64 * depth
          const rotateY = isFront ? 0 : 38 // degrees — Cover Flow tilt
          const z = isFront ? 0 : -120 * depth // pushed back in 3D space
          const scale = isFront ? 1 : 1 - depth * 0.02
          return (
            <motion.button
              key={item.title}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${item.title}`}
              className="absolute inset-0 origin-left overflow-hidden rounded-2xl border border-[var(--br-line)] bg-white shadow-[0_24px_50px_-26px_rgba(0,0,0,0.35)] focus:outline-none"
              style={{ zIndex: n - depth, transformStyle: 'preserve-3d' }}
              initial={false}
              animate={
                reduce
                  ? { opacity: isFront ? 1 : 0 }
                  : {
                      x,
                      rotateY,
                      z,
                      scale,
                      opacity: depth > 2 ? 0 : 1,
                    }
              }
              transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            >
              {/* Front card shows the image; cards behind read as blank angled panels. */}
              {isFront ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.title} draggable={false} className="h-full w-full object-contain" />
              ) : (
                <>
                  <span className="absolute inset-0 bg-white" />
                  {/* subtle shading on the receding face for depth */}
                  <span className="absolute inset-0 bg-gradient-to-l from-black/0 to-black/[0.06]" />
                </>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Text items with a gold indicator line (no grey track). The line is
          ~60% of an item slot tall and vertically centered on the active item's
          slot — so it lines up with the text rather than the full padded block. */}
      <div>
        {/* Exploration tag — restored above the text column (it lives here, not
            above the whole block, so it sits beside the image stack). */}
        {tag && (
          <span className="br-data mb-5 inline-block rounded-[var(--br-tag-radius)] border border-[var(--br-gold)] px-3 py-1.5 text-[14px] uppercase text-[var(--br-gold)]">
            {tag}
          </span>
        )}
        <div className="relative">
        {/* moving gold line — height 60% of one slot, centered in that slot */}
        <motion.div
          className="absolute left-0 w-[2px] bg-[var(--br-gold)]"
          initial={false}
          animate={{ top: `${(current / n) * 100 + (100 / n) * 0.2}%` }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 35 }}
          style={{ height: `${(100 / n) * 0.6}%` }}
        />
        <ul>
          {items.map((item, i) => {
            const selected = i === current
            return (
              <li key={item.title}>
                <button
                  type="button"
                  onMouseEnter={() => {
                    setHover(i)
                    setActive(i) // hover commits selection (persists on leave)
                  }}
                  onFocus={() => setActive(i)}
                  className="block w-full py-3 pl-5 text-left md:py-6 md:pl-6"
                >
                  <h4
                    className={`text-xs font-bold tracking-tight transition-colors md:text-lg ${
                      selected ? 'text-[var(--br-ink)]' : 'text-neutral-400'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <motion.p
                    className="overflow-hidden text-xs leading-snug text-neutral-600 md:text-sm"
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
    </div>
  )
}
