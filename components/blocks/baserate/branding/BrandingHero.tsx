'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/**
 * Branding hero — "Brand & Marketing". Matched to Figma 224:53188.
 *
 * Composition (one 3D scene):
 *  - White top split from the teal→blue gradient field on a GENTLE diagonal
 *    (≈5.5°, falling left → right like the Figma frame).
 *  - Each device floats over a white page-SHEET (the marketing site reads as
 *    the surface BEHIND the device, not a flat field under it).
 *  - Devices are transparent webp frame sequences played once on a <canvas>
 *    when scrolled into view (frames-v2: background removed, tight crop).
 *  - The Journalytic + Baserate app-icon CHIPS rotate slowly in 3D with
 *    extruded depth; colour orbs float and cast shadows on the field.
 */

const FRAME_COUNT = 120
const FPS = 30

function pad(n: number) {
  return String(n).padStart(4, '0')
}

/** Canvas frame-sequence player. Preloads webp frames, plays once on scroll-in. */
function DeviceCanvas({
  dir, className = '', delay = 0,
}: { dir: 'desktop' | 'phone'; className?: string; delay?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const played = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const base = `/baserate/branding/devices/${dir}/frames-v2/frame_`
    const imgs: HTMLImageElement[] = []

    const first = new Image()
    first.onload = () => {
      canvas.width = first.naturalWidth
      canvas.height = first.naturalHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(first, 0, 0)
    }
    first.src = `${base}0000.webp`

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.src = `${base}${pad(i)}.webp`
      imgs[i] = img
    }

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
      { threshold: 0.25 },
    )
    io.observe(canvas)

    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [dir, delay])

  return <canvas ref={canvasRef} className={className} aria-label={`${dir} device`} />
}

/**
 * App-icon chip rotating slowly in 3D with extruded depth (stacked layers).
 * Outer div takes the absolute position + responsive scale; inner layers
 * animate so the transforms never fight.
 */
function ExtrudedChip({
  src, alt, size, depth = 12, dur = 22, delay = 0, reduce, className = '',
}: {
  src: string; alt: string; size: number; depth?: number
  dur?: number; delay?: number; reduce: boolean | null; className?: string
}) {
  const layers = Array.from({ length: depth }, (_, i) => i)
  return (
    <div className={`pointer-events-none absolute ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="h-full w-full"
        style={{ perspective: 900 }}
        initial={false}
        animate={reduce ? {} : { y: [0, -10, 0] }}
        transition={{ duration: dur * 0.55, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: 'preserve-3d' }}
          initial={false}
          animate={reduce ? {} : { rotateY: [0, 360] }}
          transition={{ duration: dur, repeat: Infinity, ease: 'linear', delay }}
        >
          {layers.map((i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={i === depth - 1 ? alt : ''}
              draggable={false}
              className="absolute inset-0 h-full w-full"
              style={{
                transform: `translateZ(${(i - (depth - 1) / 2) * 1.6}px)`,
                filter: i === depth - 1 ? 'none' : 'brightness(0.6)',
                borderRadius: '20%',
              }}
            />
          ))}
        </motion.div>
      </motion.div>
      {/* contact shadow cast onto the field below */}
      <div className="absolute left-1/2 top-[114%] h-[16%] w-[78%] -translate-x-1/2 rounded-full bg-[#081a33]/30 blur-md" />
    </div>
  )
}

/** Soft colour orb that floats and casts a shadow on the field. */
function Orb({
  className = '', from, to, size, dur = 11, delay = 0, reduce,
}: {
  className?: string; from: string; to: string; size: number; dur?: number; delay?: number; reduce: boolean | null
}) {
  return (
    <div className={`pointer-events-none absolute ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="h-full w-full rounded-full"
        style={{
          background: `radial-gradient(circle at 32% 27%, ${from}, ${to} 72%)`,
          boxShadow:
            '0 30px 45px -12px rgba(7,18,40,0.4), inset 0 -8px 16px rgba(0,0,0,0.25), inset 0 8px 14px rgba(255,255,255,0.35)',
        }}
        initial={false}
        animate={reduce ? {} : { y: [0, -16, 0], x: [0, size * 0.15, 0] }}
        transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
      />
    </div>
  )
}

export function BrandingHero() {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section className="relative overflow-hidden">
      {/* White top over the gradient field — gentle diagonal, higher on the right */}
      <div
        className="absolute inset-0 bg-white"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 47%, 0 65%)' }}
      />

      {/* Subtle white corner page, top-left (as in Figma) */}
      <div className="absolute -left-[3%] -top-[10%] z-[3] hidden h-[200px] w-[15%] rotate-[15deg] rounded-[18px] bg-white shadow-[0_24px_50px_-22px_rgba(7,20,45,0.22)] md:block" />

      {/* Heading */}
      <div className="relative z-30 px-6 pt-16 text-center md:pt-[132px]">
        <h2 className="text-[30px] font-semibold uppercase leading-none tracking-tight text-[var(--br-ink)] md:text-[44px]">
          Brand &amp; Marketing
        </h2>
        <p className="mt-3 text-[16px] text-[#2a3050] md:text-[21px]">
          Ran in tandem with product implementation.
        </p>
      </div>

      {/* Stage spacer — the floaters live in the absolute layer */}
      <div className="h-[66vw] max-h-[460px] min-h-[230px] md:h-[clamp(340px,30vw,470px)]" />

      {/* B2C label on the blue */}
      <div className="relative z-30 px-6 pb-16 text-center md:pb-[88px]">
        <h3 className="text-[19px] font-semibold uppercase tracking-[0.05em] text-white md:text-[24px]">
          B2C Brand Exploration
        </h3>
        <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-relaxed text-white/90 md:text-[17px]">
          The B2C brand Journalytic was finished first, with consumer focussed branding and messaging.
        </p>
      </div>

      {/* ——— Floating scene ——— */}
      {mounted && (
        <div className="pointer-events-none absolute inset-0">
          {/* PHONE cluster (left) — page sheet behind, device in front */}
          <div
            className="absolute left-[0%] top-[22%] z-[5] w-[28%] md:left-[7.5%] md:top-[8%] md:w-[20%]"
            style={{ transform: 'perspective(1600px) rotateX(5deg) rotateY(6deg) rotate(15deg)' }}
          >
            <div className="aspect-[2/3] overflow-hidden rounded-[14px] bg-white shadow-[0_50px_90px_-30px_rgba(7,20,45,0.45)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/baserate/branding/sheet-journalytic.webp"
                alt=""
                className="h-full w-full object-cover object-top"
                loading="lazy"
              />
            </div>
          </div>
          <div
            className="absolute left-[2%] top-[18%] z-10 w-[25%] md:left-[9%] md:-top-[6%] md:w-[19%]"
            style={{ transform: 'perspective(1600px) rotateX(4deg) rotateY(7deg) rotate(16deg)' }}
          >
            <DeviceCanvas
              dir="phone"
              delay={120}
              className="h-auto w-full [filter:drop-shadow(0_45px_55px_rgba(7,20,40,0.30))]"
            />
          </div>

          {/* DESKTOP cluster (right) — page sheet behind, device in front */}
          <div
            className="absolute right-[-8%] top-[26%] z-[5] w-[50%] md:right-[0%] md:top-[16%] md:w-[38%]"
            style={{ transform: 'perspective(2000px) rotateX(6deg) rotateY(-10deg) rotate(-9deg)' }}
          >
            <div className="aspect-[1100/725] overflow-hidden rounded-[16px] bg-white shadow-[0_60px_100px_-32px_rgba(7,20,45,0.5)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/baserate/branding/sheet-baserate.webp"
                alt=""
                className="h-full w-full object-cover object-top"
                loading="lazy"
              />
            </div>
          </div>
          <div
            className="absolute right-[-10%] top-[16%] z-10 w-[62%] md:right-[-4.5%] md:-top-[8%] md:w-[46%]"
            style={{ transform: 'perspective(2000px) rotateX(5deg) rotateY(-12deg) rotate(-8deg)' }}
          >
            <DeviceCanvas
              dir="desktop"
              delay={0}
              className="h-auto w-full [filter:drop-shadow(0_50px_60px_rgba(7,20,40,0.32))]"
            />
          </div>

          {/* 3D extruded rotating logo chips */}
          <ExtrudedChip
            src="/baserate/branding/logos/journalytic-app.svg"
            alt="Journalytic"
            reduce={reduce}
            size={92}
            className="left-[36%] top-[27%] z-[15] scale-[0.55] md:left-[26%] md:top-[2%] md:scale-100"
            dur={22}
          />
          <ExtrudedChip
            src="/baserate/branding/logos/baserate-app.svg"
            alt="Baserate"
            reduce={reduce}
            size={116}
            className="left-[8%] top-[48%] z-[15] scale-[0.55] md:left-[12%] md:top-[66%] md:scale-100"
            dur={26}
            delay={1.4}
          />

          {/* Shadow-casting colour orbs */}
          <Orb reduce={reduce} className="left-[10%] top-[20%] z-[15] scale-75 md:left-[14%] md:top-[7%] md:scale-100" from="#e3cfa0" to="#a07d20" size={44} dur={10} />
          <Orb reduce={reduce} className="left-[32.5%] top-[41%] z-[15] scale-75 md:scale-100" from="#4f9fcb" to="#1c5e8c" size={56} dur={12} delay={0.8} />
          <Orb reduce={reduce} className="left-[69.5%] top-[14%] z-[15] scale-75 md:top-[9%] md:scale-100" from="#2a2f3a" to="#05070d" size={50} dur={13} delay={1.5} />
          <Orb reduce={reduce} className="left-[80%] top-[52%] z-[15] scale-75 md:left-[78.5%] md:top-[64%] md:scale-100" from="#1e63c0" to="#06337a" size={64} dur={11} delay={0.4} />
        </div>
      )}
    </section>
  )
}
