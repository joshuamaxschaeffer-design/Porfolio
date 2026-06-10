'use client'

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useRef, useState } from 'react'

export interface ExplorationItem {
  title: string
  body: string
  image: string
}

/**
 * The Exploration interaction:
 *  - Left: a stack of images. The selected image sits upright on top; the
 *    others fan out behind it, skewed and offset (Apple "Cover Flow").
 *  - Right: a list of text items with a vertical indicator line. Hovering an
 *    item slides the line to it; clicking selects it.
 *
 * TOUCH: the front card tracks the finger in real time (a motion value follows
 * touchmove and translates the top card live). On release we commit to the
 * next/prev card if the drag passed a (deliberately small) distance OR velocity
 * threshold, animating on from where the finger left off; otherwise it springs
 * back. The stack is INFINITE: it wraps modulo n in both directions, so you can
 * keep swiping forever and the items just cycle. A BIG swipe (long pull or hard
 * flick) flings through TWO cards back-to-back.
 */
export function ExplorationStack({ items, tag }: { items: ExplorationItem[]; tag?: string }) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState<number | null>(null)

  const n = items.length
  const current = hover ?? active

  // Live drag offset of the FRONT card (px). Behind cards derive a gentle
  // parallax from it so the whole stack feels connected to the finger.
  const dragX = useMotionValue(0)
  const behindParallax = useTransform(dragX, (v) => v * 0.25)

  // Touch bookkeeping: start x + time (for velocity), and the last sample so we
  // can compute instantaneous velocity at release.
  const touch = useRef({ x: 0, t: 0, lastX: 0, lastT: 0, dragging: false, width: 320 })

  // Infinite cycling: indices wrap modulo n in both directions (no ends).
  const wrapIndex = (i: number) => ((i % n) + n) % n

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    const width = (e.currentTarget as HTMLElement).getBoundingClientRect().width || 320
    touch.current = { x: t.clientX, t: performance.now(), lastX: t.clientX, lastT: performance.now(), dragging: true, width }
    setHover(null)
    dragX.stop()
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touch.current.dragging) return
    const t = e.touches[0]
    // 1:1 finger tracking — no rubber-banding: the stack has no ends now.
    dragX.set(t.clientX - touch.current.x)
    touch.current.lastX = t.clientX
    touch.current.lastT = performance.now()
  }

  const settle = (to: number) =>
    animate(dragX, to, reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 34 })

  // Fling the front card out, advance (wrapping), and for big swipes chain a
  // second, snappier fling so the motion visibly passes through two cards.
  const flingThrough = (dir: 1 | -1, steps: number, velocity: number) => {
    const width = touch.current.width
    const exitTo = dir > 0 ? -width * 0.6 : width * 0.6
    animate(
      dragX,
      exitTo,
      reduce
        ? { duration: 0 }
        : { type: 'spring', stiffness: steps > 1 ? 460 : 340, damping: 38, velocity: velocity * 1000 },
    ).then(() => {
      setActive((a) => wrapIndex(a + dir))
      dragX.set(0) // new front card starts centered (it was behind, off-stage)
      if (steps > 1) requestAnimationFrame(() => flingThrough(dir, steps - 1, velocity * 0.6))
    })
  }

  const onTouchEnd = () => {
    if (!touch.current.dragging) return
    touch.current.dragging = false
    const dx = touch.current.lastX - touch.current.x
    const dt = Math.max(1, touch.current.lastT - touch.current.t)
    const velocity = dx / dt // px/ms
    const width = touch.current.width
    // Commit threshold is deliberately SMALL (~10% of the card) so the next
    // card is easy to reach; a gentle flick commits too.
    const distanceCommit = Math.abs(dx) > width * 0.1
    const velocityCommit = Math.abs(velocity) > 0.3
    // A BIG swipe — long pull or hard flick — jumps TWO cards.
    const big = Math.abs(dx) > width * 0.5 || Math.abs(velocity) > 1.2

    if ((distanceCommit || velocityCommit) && Math.abs(dx) > 8) {
      const dir: 1 | -1 = dx < 0 ? 1 : -1 // drag left → next
      flingThrough(dir, big ? 2 : 1, velocity)
      return
    }
    // No commit → spring back to center.
    settle(0)
  }

  return (
    <div
      className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Image stack — Cover Flow perspective. Front card faces forward; cards
          behind angle away (rotateY), fanning left. */}
      <div className="relative mx-auto aspect-[874/932] w-full max-w-[440px] pl-8 md:pl-20" style={{ perspective: '1200px' }}>
        {items.map((item, i) => {
          const depth = (i - current + n) % n
          const isFront = depth === 0
          const x = isFront ? 0 : -64 * depth
          const rotateY = isFront ? 0 : 38
          const z = isFront ? 0 : -120 * depth
          const scale = isFront ? 1 : 1 - depth * 0.02
          return (
            <motion.button
              key={item.title}
              type="button"
              onClick={() => {
                // a click that wasn't a drag selects (desktop + tap)
                if (Math.abs(dragX.get()) < 6) setActive(i)
              }}
              aria-label={`Show ${item.title}`}
              className="absolute inset-0 origin-left overflow-hidden rounded-2xl border border-[var(--br-line)] bg-white shadow-[0_24px_50px_-26px_rgba(0,0,0,0.35)] focus:outline-none"
              style={{
                zIndex: n - depth,
                transformStyle: 'preserve-3d',
                // Live finger tracking: front card follows dragX; the cards
                // behind get a fraction of it for a connected parallax.
                x: isFront ? dragX : behindParallax,
              }}
              initial={false}
              animate={
                reduce
                  ? { opacity: isFront ? 1 : 0 }
                  : {
                      // NOTE: x is intentionally omitted here for the front card
                      // so the motion value (dragX) owns its horizontal position
                      // during/after drag. Behind cards' base x is applied via
                      // translateX in the keyframes below.
                      rotateY,
                      z,
                      scale,
                      opacity: depth > 2 ? 0 : 1,
                      translateX: isFront ? 0 : x,
                    }
              }
              transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            >
              {isFront ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.title} draggable={false} className="h-full w-full object-contain" />
              ) : (
                <>
                  <span className="absolute inset-0 bg-white" />
                  <span className="absolute inset-0 bg-gradient-to-l from-black/0 to-black/[0.06]" />
                </>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Text items with a gold indicator line. */}
      <div>
        {tag && (
          <span className="br-data mb-5 inline-block rounded-[var(--br-tag-radius)] border border-[var(--br-gold)] px-3 py-1.5 text-[14px] uppercase text-[var(--br-gold)]">
            {tag}
          </span>
        )}
        <div className="relative">
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
                    setActive(i)
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
                    animate={{ opacity: selected ? 1 : 0.5 }}
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
