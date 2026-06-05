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
export function ExplorationStack({ items, tag }: { items: ExplorationItem[]; tag?: string }) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState<number | null>(null)

  const n = items.length
  const lineIndex = hover ?? active

  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      {/* Image stack — Apple "Cover Flow" perspective. The front card faces
          forward (flat); the cards behind it angle away in 3D (rotateY), getting
          the foreshortened trapezoidal look, fanning to the left. Selecting a
          card brings it to the front and pushes the others back. */}
      <div className="relative mx-auto aspect-[874/932] w-full max-w-[440px] pl-20" style={{ perspective: '1200px' }}>
        {items.map((item, i) => {
          // depth = how far behind the front this card is (0 = front)
          const depth = (i - active + n) % n
          const isFront = depth === 0
          // Behind cards fan out HARD (sharp rotateY) so most of each image stays
          // visible to the left of the card in front, then recede in Z.
          const x = isFront ? 0 : -150 - 70 * (depth - 1)
          const rotateY = isFront ? 0 : 52 // degrees — sharper Cover Flow tilt
          const z = isFront ? 0 : -150 * depth // pushed back in 3D space
          const scale = isFront ? 1 : 1 - depth * 0.03
          // Even base blur applied to the WHOLE card per depth (2px on the 2nd
          // card back, 6px on the furthest).
          const baseBlur = isFront ? 0 : depth === 1 ? 2 : 6
          // Far-edge intensity of the graduated focal-plane overlay (~3x the
          // previous values) — ramps from sharp at the near edge to this at the far edge.
          const farBlur = depth === 1 ? 15 : 30
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
              {/* Every card shows its real screenshot — even behind. Behind cards
                  carry an even base blur (2px / 6px by depth). */}
              <motion.img
                // eslint-disable-next-line @next/next/no-img-element
                src={item.image}
                alt={item.title}
                draggable={false}
                className="h-full w-full object-contain"
                initial={false}
                animate={{ filter: `blur(${baseBlur}px)` }}
                transition={{ type: 'spring', stiffness: 220, damping: 28 }}
              />

              {/* Graduated "focal-plane" blur for receding cards: a blurred copy
                  of the same image, revealed by a left→right gradient mask so the
                  near (left) edge stays sharp and the far (right) edge — the part
                  tucked behind the front card — blurs progressively. */}
              {!isFront && (
                <motion.img
                  // eslint-disable-next-line @next/next/no-img-element
                  src={item.image}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                  initial={false}
                  animate={{ filter: `blur(${baseBlur + farBlur}px)` }}
                  transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                  style={{
                    // Mask ramps transparent→opaque across the width: the near
                    // (left) third stays fully sharp (only the base blur shows),
                    // then this heavily-blurred copy ramps in toward the far edge.
                    WebkitMaskImage:
                      'linear-gradient(to right, transparent 30%, rgba(0,0,0,0.65) 65%, black 95%)',
                    maskImage:
                      'linear-gradient(to right, transparent 30%, rgba(0,0,0,0.65) 65%, black 95%)',
                  }}
                />
              )}
              {/* faint depth shading only on the far edge — keep the screenshot legible */}
              {!isFront && (
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/[0.06]" />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Text column. The "Exploration" tag sits above the items — matching how
          "Crystalization" sits above its text items in the next section. */}
      <div>
        {tag && (
          <span className="br-data mb-6 ml-6 inline-block rounded-[var(--br-tag-radius)] border border-[var(--br-gold)] px-3 py-1.5 text-[14px] uppercase text-[var(--br-gold)]">
            {tag}
          </span>
        )}
        {/* items with vertical indicator line */}
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
                    className={`text-[24px] font-medium uppercase leading-[26px] transition-colors ${
                      selected ? 'text-[var(--br-ink)]' : 'text-[var(--br-muted-2)]'
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
    </div>
  )
}
