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
  /** seconds to skip from the start of the video (intro trim); loops back here */
  videoStart?: number
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
  speed = 14,
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

  // The track renders COPIES copies of the content back-to-back. We wrap x
  // within one copy's width, so as long as there are >=3 copies the viewport is
  // always covered no matter where a (fast) drag lands — no empty edge ever.
  const COPIES = 3
  // Measure ONE copy's width so we can wrap seamlessly.
  useEffect(() => {
    const measure = () => {
      const el = trackRef.current
      if (!el) return
      halfRef.current = el.scrollWidth / COPIES
      setReady(true)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [])

  // Wrap ANY value into the window (-copyW, 0] so the loop is seamless in BOTH
  // directions — there is never a left or right edge to hit.
  const wrap = (v: number) => {
    const copyW = halfRef.current || 1
    let w = v % copyW
    if (w > 0) w -= copyW
    return w
  }

  // Release velocity (px/s) from a flick. It decays exponentially inside the
  // drift loop, so a swipe coasts on from the finger/mouse and slowly settles
  // back into the ambient marquee drift — in either direction.
  const flingV = useRef(0)

  // Drift loop via rAF on the motion value — runs on all sizes (slow leftward
  // marquee that can be dragged/swiped but resumes drifting on release).
  useEffect(() => {
    if (reduce || !ready) return
    let raf = 0
    const tick = (t: number) => {
      if (last.current == null) last.current = t
      const dt = Math.min(0.05, (t - last.current) / 1000) // clamp post-stall jumps
      last.current = t
      if (!dragging.current) {
        let v = flingV.current
        if (v !== 0) {
          v *= Math.exp(-2.4 * dt) // ~2s coast from a firm flick
          if (Math.abs(v) < 8) v = 0
          flingV.current = v
        }
        x.set(wrap(x.get() + (v - speed) * dt))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      last.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, ready, speed, x])

  const drag = useRef({ down: false, startX: 0, startVal: 0, samples: [] as { x: number; t: number }[] })
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    flingV.current = 0 // grabbing a coasting track stops it
    drag.current = {
      down: true,
      startX: e.clientX,
      startVal: x.get(),
      samples: [{ x: e.clientX, t: performance.now() }],
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return
    // Wrap while dragging so dragging right never reveals an empty left edge.
    x.set(wrap(drag.current.startVal + (e.clientX - drag.current.startX)))
    // keep ~120ms of samples for a stable, time-windowed release velocity
    const now = performance.now()
    const s = drag.current.samples
    s.push({ x: e.clientX, t: now })
    while (s.length > 2 && now - s[0].t > 120) s.shift()
  }
  const onPointerUp = (e: React.PointerEvent) => {
    drag.current.down = false
    dragging.current = false
    x.set(wrap(x.get()))
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {}
    // Carry the flick into the drift loop: it coasts on and slowly decays.
    const s = drag.current.samples
    const now = performance.now()
    if (s.length >= 2) {
      const first = s[0]
      const lastS = s[s.length - 1]
      const dt = lastS.t - first.t
      const vx = dt > 0 ? (lastS.x - first.x) / dt : 0 // px/ms
      const idle = now - lastS.t
      if (idle < 90 && Math.abs(vx) > 0.05) {
        flingV.current = Math.max(-3500, Math.min(3500, vx * 1000)) // px/s
      }
    }
  }

  // Video-first on mobile, video-in-middle on desktop. CRITICAL for hydration:
  // `videoFirst` starts FALSE so the very first client render matches the
  // server-rendered HTML (which is also false). We only flip it to true in a
  // useEffect — i.e. AFTER hydration completes — so React reconciles it as a
  // normal post-mount update, never a hydration mismatch (the earlier #418 came
  // from deriving the order from matchMedia during the first render).
  const [videoFirst, setVideoFirst] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px), (pointer: coarse)')
    const apply = () => setVideoFirst(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const sequence = [...row.images]
  const mid = videoFirst ? 0 : Math.floor(sequence.length / 2)

  const items: React.ReactNode[] = []
  if (mid === 0) items.push(<VideoCard key="v-0" row={row} />)
  sequence.forEach((src, i) => {
    if (i === mid && mid !== 0) items.push(<VideoCard key={`v-${i}`} row={row} />)
    items.push(<ImageCard key={`i-${i}`} src={src} />)
  })
  if (mid >= sequence.length) items.push(<VideoCard key="v-end" row={row} />)

  // All sizes use the continuously-drifting marquee (slow leftward motion that
  // can be dragged but never fully stopped). No scrollbar. touch-action: pan-y
  // hands horizontal touch gestures to the JS drag (pan-x let the browser
  // claim them and cancel the pointer stream) while vertical swipes scroll.
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
        {/* COPIES copies back-to-back so a fast drag never reveals an empty
            edge (one copy can be narrower than the viewport). */}
        {Array.from({ length: COPIES }).flatMap((_, c) =>
          items.map((node, i) => <Clone key={`c${c}-${i}`}>{node}</Clone>),
        )}
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
    <div className="relative aspect-video w-[85vw] max-w-[617px] shrink-0 overflow-hidden rounded-[12px] border border-[var(--br-stroke)] bg-white lg:w-[617px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" draggable={false} className="pointer-events-none h-full w-full object-contain" />
    </div>
  )
}

function VideoCard({ row }: { row: CarouselRow }) {
  const ref = useRef<HTMLVideoElement>(null)
  const start = row.videoStart ?? 0

  // Muted autoplay is a core feature, but `autoPlay` alone is unreliable in
  // real browsers (off-screen at mount, buffering, deferred autoplay policy).
  // We aggressively force playback: set muted, call play() on every readiness
  // event, poll until it's actually advancing, retry on visibility, and fall
  // back to the first user interaction if the browser still refuses.
  // Intro trim: seek to `start` once metadata is known, and loop back to
  // `start` (not 0) via the `ended` event instead of the native `loop` attr.
  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    v.defaultMuted = true

    let seeded = false
    const seekToStart = () => {
      if (start > 0 && !isNaN(v.duration) && start < v.duration) {
        try {
          v.currentTime = start
        } catch {}
      }
    }
    // Seek to the start offset the first time we know the duration.
    const onMeta = () => {
      if (!seeded) {
        seeded = true
        seekToStart()
      }
    }
    // Manual loop: when it ends, jump back to the offset and keep playing.
    const onEnded = () => {
      seekToStart()
      const p = v.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }
    v.addEventListener('loadedmetadata', onMeta)
    v.addEventListener('ended', onEnded)

    let stop = false
    const tryPlay = () => {
      if (stop || !v.paused) return
      const p = v.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }

    // Fire on every event that signals the video can advance.
    const evts = ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'stalled', 'suspend']
    evts.forEach((e) => v.addEventListener(e, tryPlay))

    // Poll for the first ~6s in case all events fire before React attaches.
    const poll = setInterval(tryPlay, 400)
    setTimeout(() => clearInterval(poll), 6000)

    // Resume when scrolled into view.
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && tryPlay()), {
      threshold: 0.05,
    })
    io.observe(v)

    // Last-resort: kick all paused videos on the first user gesture.
    const onGesture = () => tryPlay()
    window.addEventListener('pointerdown', onGesture, { once: true, passive: true })
    window.addEventListener('keydown', onGesture, { once: true })
    window.addEventListener('scroll', onGesture, { once: true, passive: true })

    if (v.readyState >= 1) onMeta()
    tryPlay()
    return () => {
      stop = true
      clearInterval(poll)
      evts.forEach((e) => v.removeEventListener(e, tryPlay))
      v.removeEventListener('loadedmetadata', onMeta)
      v.removeEventListener('ended', onEnded)
      io.disconnect()
      window.removeEventListener('pointerdown', onGesture)
      window.removeEventListener('keydown', onGesture)
      window.removeEventListener('scroll', onGesture)
    }
  }, [start])

  return (
    <div className="relative aspect-video w-[85vw] max-w-[617px] shrink-0 overflow-hidden rounded-[12px] border border-[var(--br-stroke)] bg-white lg:w-[617px]">
      <video
        ref={ref}
        className="pointer-events-none h-full w-full object-contain"
        src={row.video}
        muted
        autoPlay
        playsInline
        preload="auto"
      />
    </div>
  )
}
