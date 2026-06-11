'use client'

import { motion, useMotionValue, useReducedMotion } from 'motion/react'
import { Fragment, useEffect, useRef, useState } from 'react'

/**
 * B2B Brand Exploration — two infinite marquee rows on the continuous blue
 * gradient. Joshua (2026-06-10): make these behave like the other carousels —
 * same 14px/s ambient drift, 1:1 pointer drag, flick momentum with ~2s decay
 * (physics mirrored from AutoScrollCarousel). The NAMES row uses the
 * altnames-crop/ images (white panel + logo only, cropped to ~22px sides /
 * 12px top+bottom of white at display scale); the logo-board cards are 20%
 * bigger than before; ALL cards have a 2px corner radius.
 */

const ALT_NAMES = [
  'Delphi', 'Kaizen', 'Agility', 'Peak', 'Ionic', 'Journalytic',
  'Ferrratta', 'Schema', 'Streamline', 'Decisive', 'Flux',
].map((n) => `/baserate/branding/altnames-crop/${n}.png`)

const ALT_LOGOS = ['1', '2', '3', '4', '5', '6', '7', '8', '10', '11', '12', '13', '14'].map(
  (n) => `/baserate/branding/altlogos/${n}.png`,
)

/**
 * Infinite draggable marquee. Drifts at `speed` px/s (negative = drifts
 * RIGHT), drag tracks the pointer 1:1, release velocity coasts and decays
 * exponentially back into the ambient drift — same feel as the feature rows.
 */
function DraggableMarquee({
  children,
  speed = 14,
}: {
  children: React.ReactNode[]
  speed?: number
}) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const copyW = useRef(0)
  const dragging = useRef(false)
  const last = useRef<number | null>(null)
  const flingV = useRef(0)
  const [ready, setReady] = useState(false)

  // 3 copies back-to-back; wrap x within one copy's width so the loop is
  // seamless in BOTH directions and a fast drag never reveals an empty edge.
  const COPIES = 3
  useEffect(() => {
    const measure = () => {
      const el = trackRef.current
      if (!el) return
      copyW.current = el.scrollWidth / COPIES
      setReady(true)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [])

  const wrap = (v: number) => {
    const w = copyW.current || 1
    let r = v % w
    if (r > 0) r -= w
    return r
  }

  // Drift loop via rAF on the motion value (matches AutoScrollCarousel).
  useEffect(() => {
    if (reduce || !ready) return
    let raf = 0
    const tick = (t: number) => {
      if (last.current == null) last.current = t
      const dt = Math.min(0.05, (t - last.current) / 1000)
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

  const drag = useRef({
    down: false,
    startX: 0,
    startVal: 0,
    samples: [] as { x: number; t: number }[],
  })
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
    const s = drag.current.samples
    const now = performance.now()
    if (s.length >= 2) {
      const first = s[0]
      const lastS = s[s.length - 1]
      const dt = lastS.t - first.t
      const vx = dt > 0 ? (lastS.x - first.x) / dt : 0 // px/ms
      if (now - lastS.t < 90 && Math.abs(vx) > 0.05) {
        flingV.current = Math.max(-3500, Math.min(3500, vx * 1000)) // px/s
      }
    }
  }

  return (
    <div className="br-grab w-full overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <motion.div
        ref={trackRef}
        className="flex w-max select-none gap-[18px] md:gap-[26px]"
        style={{ x }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {Array.from({ length: COPIES }).flatMap((_, c) =>
          children.map((node, i) => <Fragment key={`c${c}-${i}`}>{node}</Fragment>),
        )}
      </motion.div>
    </div>
  )
}

/**
 * White nameplate card. The image is a TIGHT logo crop (altnames-crop/).
 * Joshua (2026-06-10): logo shrunk another ~50% (md ~31px -> ~16px tall) and
 * 3x more white around it (p-3 12px -> p-9 36px). The card height is sized
 * so logo + padding fit: ~16px logo + 72px vertical padding ≈ 88px at md.
 */
function NameCard({ src }: { src: string }) {
  // Mobile (Joshua 2026-06-10): the md sizing gave phones a 78px-tall card with
  // 36px padding all round — a 6px logo. Mobile now uses p-6 in a 60px card =
  // 12px logo (exactly 2x, in a SHORTER card). md keeps 36px pad / 16px logo.
  return (
    <div className="flex h-[60px] shrink-0 items-center justify-center overflow-hidden rounded-[2px] bg-white p-6 shadow-[0_22px_44px_-20px_rgba(4,16,38,0.5)] md:h-[88px] md:p-9">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        className="pointer-events-none h-full w-auto"
        loading="lazy"
      />
    </div>
  )
}

/** Square logo-concept board card — 20% bigger than the previous 178px. */
function LogoCard({ src }: { src: string }) {
  return (
    <div className="h-[163px] w-[163px] shrink-0 overflow-hidden rounded-[2px] bg-white shadow-[0_22px_44px_-20px_rgba(4,16,38,0.5)] md:h-[214px] md:w-[214px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        className="pointer-events-none h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  )
}

export function B2BExploration() {
  return (
    <section className="pb-20 md:pb-24">
      {/* Centered heading — copy per Figma */}
      <div className="br-container mb-10 text-center md:mb-12">
        <h3 className="text-[19px] font-semibold uppercase tracking-[0.05em] text-white md:text-[24px]">
          B2B Brand Exploration
        </h3>
        <p className="mx-auto mt-3 max-w-[620px] text-[15px] leading-relaxed text-white/90 md:text-[17px]">
          Starting from 200+ names, a thorough value assessment, and countless customer branding
          tests, one direction surfaced as a clear winner.
        </p>
      </div>

      {/* NAMES on top, logo boards below; opposite drift directions */}
      <div className="flex flex-col gap-[18px] md:gap-[26px]">
        <DraggableMarquee speed={14}>
          {ALT_NAMES.map((src) => (
            <NameCard key={src} src={src} />
          ))}
        </DraggableMarquee>
        <DraggableMarquee speed={-14}>
          {ALT_LOGOS.map((src) => (
            <LogoCard key={src} src={src} />
          ))}
        </DraggableMarquee>
      </div>
    </section>
  )
}
