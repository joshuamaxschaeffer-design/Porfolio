'use client'

import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export interface CarouselRow {
  centerLabel: string
  centerIcon: string
  video: string
  images: string[]
  /** horizontal start offset in px, used to stagger rows from each other */
  offset?: number
}

/**
 * Infinite auto-scrolling carousel that drifts left forever and can be dragged
 * but never fully stopped — releasing the drag resumes the drift. The content
 * is duplicated so the loop is seamless; we wrap x within [-half, 0].
 *
 * `speed` is px/sec. `startOffset` staggers this row relative to the one above.
 */
export function AutoScrollCarousel({
  row,
  speed = 28,
  startOffset = 0,
}: {
  row: CarouselRow
  speed?: number
  startOffset?: number
}) {
  const reduce = useReducedMotion()
  const x = useMotionValue(-startOffset)
  const trackRef = useRef<HTMLDivElement>(null)
  const halfRef = useRef(0)
  const dragging = useRef(false)
  const last = useRef<number | null>(null)
  const [ready, setReady] = useState(false)

  // Measure one copy's width (half the track) so we can wrap seamlessly.
  useEffect(() => {
    const measure = () => {
      const el = trackRef.current
      if (!el) return
      halfRef.current = el.scrollWidth / 2
      setReady(true)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [])

  // Drift loop via rAF on the motion value.
  useEffect(() => {
    if (reduce || !ready) return
    let raf = 0
    const tick = (t: number) => {
      if (last.current == null) last.current = t
      const dt = (t - last.current) / 1000
      last.current = t
      if (!dragging.current) {
        let next = x.get() - speed * dt
        const half = halfRef.current || 1
        // wrap: keep within (-half, 0]
        if (next <= -half) next += half
        x.set(next)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      last.current = null
    }
  }, [reduce, ready, speed, x])

  // Normalize x after a drag so it stays inside the wrap window.
  const normalize = () => {
    const half = halfRef.current || 1
    let v = x.get() % half
    if (v > 0) v -= half
    x.set(v)
  }

  const drag = useRef({ down: false, startX: 0, startVal: 0 })
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    drag.current = { down: true, startX: e.clientX, startVal: x.get() }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return
    x.set(drag.current.startVal + (e.clientX - drag.current.startX))
  }
  const onPointerUp = (e: React.PointerEvent) => {
    drag.current.down = false
    dragging.current = false
    normalize()
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {}
    // Carry a little momentum back into the drift.
  }

  const sequence = [...row.images]
  // Place the labelled video roughly in the middle of the row.
  const mid = Math.floor(sequence.length / 2)

  const items: React.ReactNode[] = []
  sequence.forEach((src, i) => {
    if (i === mid) items.push(<VideoCard key={`v-${i}`} row={row} />)
    items.push(<ImageCard key={`i-${i}`} src={src} />)
  })
  if (mid >= sequence.length) items.push(<VideoCard key="v-end" row={row} />)

  return (
    <div className="br-grab overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <motion.div
        ref={trackRef}
        className="flex w-max gap-5 py-1 select-none"
        style={{ x }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {items}
        {/* duplicate for seamless loop */}
        {items.map((node, i) => (
          <Clone key={`clone-${i}`}>{node}</Clone>
        ))}
      </motion.div>
    </div>
  )
}

function Clone({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// Carousel cards keep the 16:9 (1920×1080) ratio of the source images/videos so
// nothing is cropped (object-contain). 617px wide, per Figma.
function ImageCard({ src }: { src: string }) {
  return (
    <div className="relative aspect-video w-[617px] shrink-0 overflow-hidden rounded-[12px] border border-[var(--br-stroke)] bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" draggable={false} className="pointer-events-none h-full w-full object-contain" />
    </div>
  )
}

function VideoCard({ row }: { row: CarouselRow }) {
  return (
    <div className="relative aspect-video w-[617px] shrink-0 overflow-hidden rounded-[12px] border border-[var(--br-stroke)] bg-white">
      <video
        className="pointer-events-none h-full w-full object-contain"
        src={row.video}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
      />
    </div>
  )
}
