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
              {isFront ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.title} draggable={false} className="h-full w-full object-contain" />
              ) : (
                /* Behind cards: a graduated "focal-plane" blur that RAMPS smoothly
                   across the full width — sharpest at the near (left) edge,
                   blurriest at the far (right) edge — so the increase reads even
                   in the thin exposed sliver. Built from several copies of the
                   image at increasing blur, each masked to a progressive band.
                   Every layer is hard-clipped to the rounded rect so the blur
                   never bleeds past the corners (which was smearing the stroke). */
                <BlurRamp src={item.image} alt={item.title} baseBlur={baseBlur} farBlur={farBlur} />
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

/**
 * A left→right graduated blur of a single image. Renders the image as a stack
 * of `layers` copies, each blurred progressively more (from `baseBlur` at the
 * near edge up to `baseBlur + farBlur` at the far edge) and each revealed by a
 * narrow gradient band so the copies cross-fade into one another. The result is
 * a smooth focal-plane ramp whose blur increase is visible at ANY horizontal
 * position — including the thin sliver that peeks out from behind the front
 * card. Every layer is clipped to the rounded rect so blur can't smear the
 * card's stroke/corners.
 */
function BlurRamp({
  src,
  alt,
  baseBlur,
  farBlur,
  layers = 5,
}: {
  src: string
  alt: string
  baseBlur: number
  farBlur: number
  layers?: number
}) {
  const clip = { clipPath: 'inset(0 round 1rem)', WebkitClipPath: 'inset(0 round 1rem)' } as const
  return (
    <div className="pointer-events-none absolute inset-0" style={clip}>
      {Array.from({ length: layers }).map((_, k) => {
        const t = k / (layers - 1) // 0 → 1 across the width (near → far)
        const blur = baseBlur + farBlur * t
        // Centre of this layer's reveal band, as a % across the width.
        const c = t * 100
        // Soft band: fully visible at the centre, fading out ~22% to each side,
        // so adjacent layers overlap and blend into a continuous ramp.
        const a = Math.max(0, c - 24)
        const b = Math.min(100, c + 24)
        const mask =
          k === 0
            ? // first (sharpest) layer covers the whole near side so there's no gap
              `linear-gradient(to right, black 0%, black ${b}%, transparent ${Math.min(100, b + 20)}%)`
            : k === layers - 1
              ? // last (blurriest) layer covers the whole far side
                `linear-gradient(to right, transparent ${Math.max(0, a - 20)}%, black ${a}%, black 100%)`
              : `linear-gradient(to right, transparent ${a}%, black ${c}%, transparent ${b}%)`
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={k}
            src={src}
            alt={k === 0 ? alt : ''}
            aria-hidden={k !== 0}
            draggable={false}
            className="absolute inset-0 h-full w-full object-contain"
            style={{ filter: `blur(${blur.toFixed(1)}px)`, WebkitMaskImage: mask, maskImage: mask }}
          />
        )
      })}
    </div>
  )
}
