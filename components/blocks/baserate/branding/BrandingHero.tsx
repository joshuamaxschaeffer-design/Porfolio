'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/**
 * Branding hero — "Brand & Marketing".
 *
 * One 3D-feeling environment:
 *  - A soft blue→white GRADIENT field split on a GENTLE diagonal.
 *  - The two marketing SITES sit BEHIND the devices as the "surface" they float on.
 *  - TWO devices (desktop = Baserate site, phone = Journalytic site), each
 *    rotating on a matched plane while its screen scrolls. Rendered in SD Studio
 *    as transparent PNG frame sequences, played ONCE on a <canvas> when scrolled
 *    into view (canvas keeps perfect alpha everywhere — VP9/HEVC alpha video is
 *    unreliable cross-browser).
 *  - The Baserate + Journalytic LOGOS rotate in 3D with EXTRUDED depth (stacked
 *    layers) and a slow continuous spin.
 *  - Soft COLOUR ORBS float and cast shadows on the field.
 */

const FRAME_COUNT = 120
const FPS = 30

function pad(n: number) {
  return String(n).padStart(4, '0')
}

/** Canvas frame-sequence player. Preloads PNG frames, plays once on scroll-in. */
function DeviceCanvas({
  dir, className = '', delay = 0,
}: { dir: 'desktop' | 'phone'; className?: string; delay?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const played = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const base = `/baserate/branding/devices/${dir}/frames/frame_`
    const imgs: HTMLImageElement[] = []
    let loaded = 0

    // First frame establishes canvas size + shows the poster immediately.
    const first = new Image()
    first.onload = () => {
      canvas.width = first.naturalWidth
      canvas.height = first.naturalHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(first, 0, 0)
    }
    first.src = `${base}0000.png`

    // Preload the rest.
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.onload = () => { loaded++ }
      img.src = `${base}${pad(i)}.png`
      imgs[i] = img
    }
    framesRef.current = imgs

    const drawFrame = (i: number) => {
      const img = imgs[i]
      if (img && img.complete && img.naturalWidth) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
    }

    const play = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const elapsed = (now - start) / 1000
        const frame = Math.min(FRAME_COUNT - 1, Math.floor(elapsed * FPS))
        drawFrame(frame)
        if (frame < FRAME_COUNT - 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !played.current) {
            played.current = true
            setTimeout(play, delay)
          }
        }
      },
      { threshold: 0.3 },
    )
    io.observe(canvas)

    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [dir, delay])

  return <canvas ref={canvasRef} className={className} aria-label={`${dir} device`} />
}

/** A 3D-extruded logo that slowly spins on its Y axis. Depth faked with stacked layers. */
function ExtrudedLogo({
  src, alt, className = '', size, depth = 10, dur = 14, delay = 0, reduce,
}: {
  src: string; alt: string; className?: string; size: number
  depth?: number; dur?: number; delay?: number; reduce: boolean | null
}) {
  // Stack N copies translated along Z to fake extrusion; the front face is full
  // opacity, the back layers darken to read as a side.
  const layers = Array.from({ length: depth }, (_, i) => i)
  return (
    <motion.div
      className={`pointer-events-none absolute ${className}`}
      style={{ width: size, height: size, perspective: 600, transformStyle: 'preserve-3d' }}
      initial={false}
      animate={reduce ? {} : { y: [0, -12, 0] }}
      transition={{ duration: dur * 0.7, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        initial={false}
        animate={reduce ? {} : { rotateY: [0, 360] }}
        transition={{ duration: dur, repeat: Infinity, ease: 'linear', delay }}
      >
        {layers.map((i) => (
          <img
            key={i}
            src={src}
            alt={i === depth - 1 ? alt : ''}
            // eslint-disable-next-line @next/next/no-img-element
            className="absolute inset-0 h-full w-full object-contain"
            draggable={false}
            style={{
              transform: `translateZ(${(i - depth / 2) * 1.4}px)`,
              filter: i === depth - 1 ? 'none' : `brightness(${0.5 + (i / depth) * 0.5})`,
              opacity: i === depth - 1 ? 1 : 0.92,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

/** A premium soft colour orb that floats and casts a shadow on the field. */
function Orb({
  className = '', from, to, size, dur = 11, delay = 0, reduce,
}: {
  className?: string; from: string; to: string; size: number; dur?: number; delay?: number; reduce: boolean | null
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        width: size, height: size,
        background: `radial-gradient(circle at 34% 28%, ${from}, ${to} 74%)`,
        // drop-shadow casts onto whatever is behind (the field) — softer + offset
        boxShadow: `0 28px 44px -10px rgba(10,20,45,0.35), inset 0 -7px 16px rgba(0,0,0,0.22), inset 0 6px 12px rgba(255,255,255,0.4)`,
      }}
      initial={false}
      animate={reduce ? {} : { y: [0, -20, 0], x: [0, size * 0.18, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

export function BrandingHero() {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section className="relative overflow-hidden">
      {/* Blue→white field on a GENTLE diagonal, WITH a blue gradient (not flat). */}
      <div className="absolute inset-0 bg-white" />
      <div
        className="absolute inset-0"
        style={{
          // gentler diagonal (172deg ≈ near-horizontal); blue is a gradient.
          background:
            'linear-gradient(172deg, transparent 0%, transparent 52%, #2f6db5 52.3%, #3f7cc0 70%, #2a5e9c 100%)',
        }}
      />

      {/* Heading */}
      <div className="br-container relative z-30 pt-20 text-center md:pt-28">
        <h2 className="text-[34px] font-semibold uppercase leading-none tracking-tight text-[var(--br-ink)] md:text-[54px]">
          Brand &amp; Marketing
        </h2>
        <p className="mt-4 text-lg text-[var(--br-muted)] md:text-[22px]">
          Ran in tandem with product implementation.
        </p>
      </div>

      {/* The 3D stage */}
      <div className="relative z-10 mx-auto h-[82vh] max-h-[860px] min-h-[560px] w-full max-w-[1600px]">
        {mounted && (
          <>
            {/* DEVICES — big, floating, on the matched plane. PHONE left, DESKTOP right. */}
            <DeviceCanvas
              dir="phone"
              delay={120}
              className="absolute bottom-[4%] left-[1%] h-[86%] w-[46%] md:left-[4%] md:w-[38%]"
            />
            <DeviceCanvas
              dir="desktop"
              delay={0}
              className="absolute bottom-[10%] right-[0%] h-[78%] w-[66%] md:right-[2%] md:w-[58%]"
            />

            {/* 3D extruded rotating logos */}
            <ExtrudedLogo
              src="/baserate/branding/logos/journalytic-app.svg"
              alt="Journalytic"
              reduce={reduce}
              size={64}
              className="left-[28%] top-[12%] md:h-20 md:w-20"
              dur={13} delay={0}
            />
            <ExtrudedLogo
              src="/baserate/branding/logos/baserate-app.svg"
              alt="Baserate"
              reduce={reduce}
              size={64}
              className="right-[42%] top-[38%] md:h-20 md:w-20"
              dur={16} delay={1.2}
            />

            {/* Shadow-casting colour orbs */}
            <Orb reduce={reduce} className="left-[19%] top-[15%]" from="#e9c46a" to="#c79016" size={26} dur={10} />
            <Orb reduce={reduce} className="left-[40%] top-[55%]" from="#5b9bd5" to="#2f6db5" size={34} dur={12} delay={0.8} />
            <Orb reduce={reduce} className="right-[32%] top-[22%]" from="#1b2440" to="#070e2c" size={30} dur={13} delay={1.5} />
            <Orb reduce={reduce} className="right-[18%] bottom-[18%]" from="#3a6fb0" to="#234d80" size={42} dur={11} delay={0.4} />
          </>
        )}
      </div>

      {/* Sub-label over the blue */}
      <div className="br-container relative z-30 pb-20 text-center md:pb-28">
        <h3 className="text-[22px] font-semibold uppercase tracking-tight text-white md:text-[28px]">
          B2C Brand Exploration
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-white/85 md:text-lg">
          The B2C brand Journalytic was finished first, with consumer-focussed branding and messaging.
        </p>
      </div>
    </section>
  )
}
