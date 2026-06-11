'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { KEY_SHADOW } from '@/components/studio/keyShadow'
import { StudioObject } from '@/components/studio/StudioObject'

/**
 * Branding hero — "Brand & Marketing". Matched to Figma 224:53188.
 *
 * Composition (one 3D scene):
 *  - White top split from the teal→blue gradient field on a GENTLE diagonal.
 *  - Devices are SD Studio renders: transparent webp frame sequences whose
 *    pose was solved against the Figma frame (silhouette match). They fly in
 *    and SETTLE at the exact Figma pose — played once on scroll-in. No CSS
 *    3D transforms here: the perspective is baked into the render.
 *  - No baked shadows in the frames — each device casts a CSS shadow with a
 *    PROGRESSIVE BLUR (sharper near contact, dissolving with distance), same
 *    stacked-masked-layers technique as EdgeFadeBlur elsewhere on the site.
 *  - App-icon chips rotate in slowly with extruded depth and STOP at their
 *    Figma pose. Colour orbs drift on slow multi-axis paths.
 */

const FRAME_COUNT = 120
const FPS = 30

/**
 * App-icon chip: extruded 3D tile that rotates in ONCE and settles at its
 * Figma pose (rotation stops exactly where the mockup has it). A gentle
 * float continues on the wrapper so it still feels alive.
 */
function ExtrudedChip({
  src, alt, size, endX, endY, endZ, depth = 12, dur = 2.8, delay = 0, reduce, inView, className = '',
}: {
  src: string; alt: string; size: number
  endX: number; endY: number; endZ: number
  depth?: number; dur?: number; delay?: number
  reduce: boolean | null; inView: boolean; className?: string
}) {
  const layers = Array.from({ length: depth }, (_, i) => i)
  return (
    <div className={`pointer-events-none absolute ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={reduce ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        {/* cast shadow — same tile shape (rounded square at the settle pose),
            offset along the global key light so it sits BEHIND the chip.
            CSS filter blur (not ctx.filter) — works in Safari. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            transform: `translate(${(KEY_SHADOW.x * size).toFixed(1)}px, ${(KEY_SHADOW.y * size).toFixed(1)}px) rotateX(${endX}deg) rotateZ(${endZ}deg) scale(${KEY_SHADOW.scale})`,
            borderRadius: '20%',
            background: KEY_SHADOW.color,
            filter: `blur(${KEY_SHADOW.blur(size).toFixed(1)}px)`,
          }}
        />
        <div className="h-full w-full" style={{ perspective: 900 }}>
          <motion.div
            className="relative h-full w-full"
            style={{ transformStyle: 'preserve-3d', rotateX: endX, rotateZ: endZ }}
            initial={{ rotateY: endY - 360 }}
            animate={reduce ? { rotateY: endY } : (inView ? { rotateY: endY } : { rotateY: endY - 360 })}
            transition={{ duration: dur, ease: [0.16, 0.8, 0.3, 1], delay }}
          >
            {layers.map((i) => {
              const isFront = i === depth - 1
              const isBack = i === 0
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt={isFront ? alt : ''}
                  draggable={false}
                  className="absolute inset-0 h-full w-full"
                  style={{
                    // The BACK layer is flipped in place (rotateY 180) so the
                    // reverse of the chip shows the same un-mirrored, full-
                    // colour logo as the front while it spins; only the
                    // in-between layers darken to read as the extruded edge.
                    transform: `translateZ(${(i - (depth - 1) / 2) * 1.6}px)${isBack ? ' rotateY(180deg)' : ''}`,
                    filter: isFront || isBack ? 'none' : 'brightness(0.6)',
                    borderRadius: '20%',
                  }}
                />
              )
            })}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

/** Soft colour orb on a slow multi-axis drift, casting a soft shadow. */
function Orb({
  className = '', from, to, size, dur = 16, delay = 0, reduce,
}: {
  className?: string; from: string; to: string; size: number; dur?: number; delay?: number; reduce: boolean | null
}) {
  return (
    <div className={`pointer-events-none absolute ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={reduce ? {} : {
          x: [0, size * 0.34, -size * 0.18, size * 0.1, 0],
          y: [0, -size * 0.42, -size * 0.12, -size * 0.5, 0],
          scale: [1, 1.04, 0.985, 1.03, 1],
        }}
        transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay, times: [0, 0.3, 0.55, 0.8, 1] }}
      >
        {/* cast shadow — circle matching the orb, offset along the global key
            light so it peeks out BEHIND the sphere (same blur/direction/
            darkness rules as the chips). */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            transform: `translate(${(KEY_SHADOW.x * size).toFixed(1)}px, ${(KEY_SHADOW.y * size).toFixed(1)}px) scale(${KEY_SHADOW.scale})`,
            background: KEY_SHADOW.color,
            filter: `blur(${KEY_SHADOW.blur(size).toFixed(1)}px)`,
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 32% 27%, ${from}, ${to} 72%)`,
            boxShadow:
              'inset 0 -8px 16px rgba(0,0,0,0.25), inset 0 8px 14px rgba(255,255,255,0.35)',
          }}
        />
      </motion.div>
    </div>
  )
}

export function BrandingHero() {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { once: true, amount: 0.25 })
  useEffect(() => setMounted(true), [])

  return (
    <section ref={stageRef} className="relative overflow-hidden">
      {/* White top over the gradient field — gentle diagonal, higher on the
          right (Figma 243:54723 boundary mapped to the new section height).
          MOBILE: boundary raised 60.5/83 -> 45/67 (same slope) so the
          "B2C Brand Exploration" heading (~70% of section at 390w) sits fully
          on BLUE — at 60.5/83 its left half landed white-on-white. Devices/
          card/chips all end by ~58%, so they stay on the white field. */}
      <div className="absolute inset-0 bg-white [clip-path:polygon(0_0,100%_0,100%_45%,0_67%)] md:max-[1799px]:[clip-path:polygon(0_0,100%_0,100%_44.5%,0_59.5%)] min-[1800px]:[clip-path:polygon(0_0,100%_0,100%_47%,0_63.5%)]" />

      {/* STAGE — a centered max-w-[1443px] frame mirroring the Figma artboard
          (1443×893). Every md+ percentage below is a literal Figma coordinate,
          so the whole composition clusters around the frame's center instead
          of spreading to the viewport edges on wide screens.
          On LARGE displays (Studio Display etc.) the whole frame zooms up in
          steps — zoom scales layout too, so the section grows taller with it.
          Capped at 1.42: device frames stay below their native 2x resolution,
          chips are SVG and the card text is vector, so nothing goes pixelly. */}
      <div className="relative mx-auto w-full max-w-[1443px] min-[1800px]:[zoom:1.2] min-[2080px]:[zoom:1.32] min-[2400px]:[zoom:1.42]">
        {/* height: phone-friendly tall block on mobile, Figma aspect at md+ */}
        <div className="h-[124vw] max-h-[700px] min-h-[320px] md:h-auto md:max-h-none md:aspect-[1443/893]" />

        {/* Heading — SOLID white card stacked above the whole scene, so
            devices/chips/orbs can pass behind it without colliding with the
            text (per Figma: white fill, hairline border, soft lift).
            MOBILE (Joshua 2026-06-10): devices sit ABOVE the card vertically
            and the card overlaps their lower halves — same device-behind-card
            treatment as the Journalytic 2-Products stack. */}
        <div className="absolute left-1/2 top-[32%] z-40 w-[92%] -translate-x-1/2 rounded-[10px] border border-[#e7e9f1] bg-white px-5 py-6 text-center shadow-[0_24px_48px_-24px_rgba(10,23,48,0.28)] md:top-[15.7%] md:w-[41.3%] md:px-8 md:py-[34px]">
          <h2 className="text-[30px] font-semibold uppercase leading-none tracking-tight text-[var(--br-ink)] md:text-[44px]">
            Brand &amp; Marketing
          </h2>
          <p className="mt-3 text-[16px] text-[#2a3050] md:text-[21px]">
            Ran in tandem with product implementation.
          </p>
        </div>

        {/* ——— Floating scene (inside the 1443 frame) ——— */}
        {mounted && (
          <div className="pointer-events-none absolute inset-0">
            {/* PHONE — render carries the Figma pose; silhouette drop-shadow lives in the canvas */}
            <div className="absolute left-[0%] top-[3%] z-10 w-[42%] md:left-[11%] md:top-[18.5%] md:w-[18%]">
              <StudioObject base="/baserate/branding/devices/phone" frameCount={FRAME_COUNT} fps={FPS} delay={120} className="w-full" alt="phone device" />
            </div>

            {/* DESKTOP — pulled fully inside the frame, toward the center */}
            <div className="absolute right-[-7%] top-[4%] z-10 w-[58%] md:left-[63.5%] md:right-auto md:top-[17%] md:w-[33%]">
              <StudioObject base="/baserate/branding/devices/desktop" frameCount={FRAME_COUNT} fps={FPS} delay={0} className="w-full" alt="desktop device" />
            </div>

            {/* 3D extruded chips — rotate in once, SETTLE at the Figma pose.
                md positions are literal Figma 243:54723 coordinates (box ÷ 1443×893). */}
            <ExtrudedChip
              src="/baserate/branding/logos/journalytic-app.svg"
              alt="Journalytic"
              reduce={reduce}
              inView={inView}
              size={124}
              endX={7}
              endY={16}
              endZ={-9}
              className="left-[36%] top-[6%] z-[15] scale-[0.55] md:left-[21.5%] md:top-[4.5%] md:scale-100"
              dur={2.8}
            />
            <ExtrudedChip
              src="/baserate/branding/logos/baserate-app.svg"
              alt="Baserate"
              reduce={reduce}
              inView={inView}
              size={94}
              endX={5}
              endY={-20}
              endZ={10}
              className="left-[7%] top-[66%] z-[15] scale-[0.55] md:left-[58%] md:top-[38.5%] md:scale-100"
              dur={3.2}
              delay={0.25}
            />

            {/* Colour orbs on slow drifts — Figma spots; the navy one is moved
                LEFT of the desktop so it floats in clean space */}
            <Orb reduce={reduce} className="left-[10%] top-[8%] z-[15] scale-75 md:left-[15.1%] md:top-[7.5%] md:scale-100" from="#e3cfa0" to="#a07d20" size={30} dur={15} />
            <Orb reduce={reduce} className="left-[32.5%] top-[60%] z-[15] scale-75 md:left-[33.2%] md:top-[36.4%] md:scale-100" from="#4f9fcb" to="#1c5e8c" size={46} dur={18} delay={1.2} />
            <Orb reduce={reduce} className="left-[69.5%] top-[26%] z-[15] scale-75 md:left-[69.6%] md:top-[9%] md:scale-100" from="#2a2f3a" to="#05070d" size={46} dur={17} delay={2.2} />
            <Orb reduce={reduce} className="left-[64%] top-[64%] z-[15] scale-75 md:left-[55.5%] md:top-[57.5%] md:scale-100" from="#1e63c0" to="#06337a" size={46} dur={14} delay={0.6} />
          </div>
        )}
      </div>

      {/* B2C label on the blue — pulled UP into the stage's empty lower band
          (the scene ends ~75% down the frame) to tighten the gap; the pull
          grows with the large-display zoom steps so the visual gap stays
          consistent. */}
      <div className="relative z-30 -mt-10 px-6 pb-16 text-center md:mt-[clamp(-285px,calc(-200px_-_(100vw_-_1443px)_*_0.076),-200px)] md:pb-[88px]">
        <h3 className="text-[19px] font-semibold uppercase tracking-[0.05em] text-white md:text-[24px]">
          B2C Brand Exploration
        </h3>
        <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-relaxed text-white/90 md:text-[17px]">
          The B2C brand Journalytic was finished first, with consumer focussed branding and messaging.
        </p>
      </div>
    </section>
  )
}
