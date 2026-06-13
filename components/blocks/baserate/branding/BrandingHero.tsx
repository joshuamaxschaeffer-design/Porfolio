'use client'

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

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
 * Scroll parallax + physics for the floating hero elements.
 *
 * One shared scroll signal drives the whole scene. `useScroll` measures the
 * section's travel through the viewport: progress 0 = section's top hits the
 * viewport bottom (entering), 1 = section's bottom hits the viewport top
 * (leaving), so 0.5 ≈ section centered. We re-center that to a SIGNED factor
 * (−0.5 … +0.5, zero when centered) and spring-smooth it — that spring is the
 * "physics": the elements lag the scroll and ease in, never snap.
 *
 * Each element declares a `z` depth (its parallax strength in px of travel at
 * the scroll extremes). Foreground elements (orbs) get a larger z than the
 * background devices, so nearer things move more — the depth cue. Because the
 * offset is tied to scroll POSITION (not velocity), it returns to 0 — the
 * element's original Figma pose — whenever the section sits centered. Scroll
 * away and back and everything settles exactly where it started.
 *
 * Per-element parallax DEPTH below (`PZ`) = px of vertical travel across the
 * full scroll range (peak-to-peak ≈ 2× these). Tune intensity from there.
 */
const PZ = {
  device: 28,
  chip: 60,
  orbFar: 60,
  orbMid: 80,
  orbNear: 104,
}

const ParallaxContext = createContext<MotionValue<number> | null>(null)

function useParallaxY(z: number): MotionValue<number> | number {
  const factor = useContext(ParallaxContext)
  // hooks must run unconditionally; when there's no provider (reduced motion
  // or SSR) we still call useTransform on a dummy and return a static 0.
  const fallback = useSpring(0)
  const signal = factor ?? fallback
  // negative z·factor: as the page scrolls UP (factor grows), elements drift UP
  return useTransform(signal, (v) => -v * z)
}

/** Wraps a positioned element so it parallax-drifts on scroll by its depth. */
function Parallax({
  z, className = '', style, children,
}: {
  z: number; className?: string; style?: React.CSSProperties; children: React.ReactNode
}) {
  const y = useParallaxY(z)
  return (
    <motion.div className={className} style={{ ...style, y }}>
      {children}
    </motion.div>
  )
}

/**
 * Baked logo chip — an SD Studio icon-kind export (transparent webp spin +
 * per-frame physical shadow-v2) rendered through StudioObject. The shadow
 * rotates and squashes WITH the chip and matches the device family exactly
 * (same rig, same key light, bottom-right fall). Replaces the old CSS
 * 12-layer chip whose static CSS shadow ignored the spin.
 *
 * `size` = on-screen width of the SETTLED chip face (the old chip box, so
 * all Figma positions are unchanged). The baked crop is wider than the
 * face (spin sweep + pad), so the render is scaled up to `scaleW` and
 * nudged by `ml`/`mt` margins to land the settled face exactly on that
 * box — numbers measured from each export's last-frame alpha bbox.
 */
function BakedChip({
  base, frameCount, size, scaleW, ml, mt, delay = 0, reduce, className = '', alt,
}: {
  base: string; frameCount: number; size: number; scaleW: number; ml: number; mt: number
  delay?: number; reduce: boolean | null; className?: string; alt: string
}) {
  return (
    <div className={`pointer-events-none ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="relative"
        style={{ width: scaleW, marginLeft: ml, marginTop: mt }}
        initial={false}
        animate={reduce ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: delay / 1000 }}
      >
        <StudioObject base={base} frameCount={frameCount} fps={30} delay={delay} className="w-full" alt={alt} />
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
    <div className={`pointer-events-none ${className}`} style={{ width: size, height: size }}>
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
  useEffect(() => setMounted(true), [])

  // Scroll signal for the whole scene: 0 = section entering (top at viewport
  // bottom), 1 = leaving (bottom at viewport top), 0.5 ≈ centered. We map to a
  // SIGNED factor centered on 0, then spring-smooth it (the "physics" lag).
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start end', 'end start'],
  })
  const signed = useTransform(scrollYProgress, [0, 1], [-0.5, 0.5])
  const factor = useSpring(signed, { stiffness: 70, damping: 22, mass: 0.6 })
  // Disable parallax entirely for reduced-motion users.
  const parallax = reduce ? null : factor

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
          <ParallaxContext.Provider value={parallax}>
          <div className="pointer-events-none absolute inset-0">
            {/* PHONE — render carries the Figma pose; silhouette drop-shadow lives in the canvas.
                Devices sit DEEP (small z) so they parallax the least — the backdrop the
                nearer chips/orbs float in front of. */}
            <Parallax z={PZ.device} className="absolute left-[0%] top-[3%] z-10 w-[42%] md:left-[11%] md:top-[18.5%] md:w-[18%]">
              <StudioObject base="/baserate/branding/devices/phone" frameCount={FRAME_COUNT} fps={FPS} delay={120} className="w-full" alt="phone device" />
            </Parallax>

            {/* DESKTOP — pulled fully inside the frame, toward the center */}
            <Parallax z={PZ.device} className="absolute right-[-7%] top-[4%] z-10 w-[58%] md:left-[63.5%] md:right-auto md:top-[17%] md:w-[33%]">
              <StudioObject base="/baserate/branding/devices/desktop" frameCount={FRAME_COUNT} fps={FPS} delay={0} className="w-full" alt="desktop device" />
            </Parallax>

            {/* Baked 3D chips — SD Studio icon exports: spin in once with
                physically-cast rotating shadows, SETTLE at the Figma pose.
                Same tilts as before (J: x7 z-9 y16 · B: x5 z10 y-20), spun
                about the local Y. md positions stay literal Figma 243:54723
                coordinates (box ÷ 1443×893). */}
            <Parallax z={PZ.chip} className="absolute left-[36%] top-[6%] z-[15] md:left-[21.5%] md:top-[4.5%]">
              <BakedChip
                base="/baserate/branding/chips/journalytic"
                alt="Journalytic"
                reduce={reduce}
                frameCount={84}
                size={124}
                scaleW={153.5}
                ml={-13.8}
                mt={-12.8}
                className="scale-[0.55] md:scale-100"
              />
            </Parallax>
            <Parallax z={PZ.chip} className="absolute left-[7%] top-[66%] z-[15] md:left-[58%] md:top-[38.5%]">
              <BakedChip
                base="/baserate/branding/chips/baserate"
                alt="Baserate"
                reduce={reduce}
                frameCount={96}
                size={94}
                scaleW={109.6}
                ml={-9.4}
                mt={-6.5}
                className="scale-[0.55] md:scale-100"
                delay={250}
              />
            </Parallax>

            {/* Colour orbs on slow drifts — Figma spots; the navy one is moved
                LEFT of the desktop so it floats in clean space */}
            {/* Orbs are the FOREGROUND layer (largest z) so they parallax most;
                each gets a slightly different depth so they don't drift in
                lockstep — that subtle desync sells the 3D. */}
            <Parallax z={PZ.orbNear} className="absolute left-[10%] top-[8%] z-[15] md:left-[15.1%] md:top-[7.5%]">
              <Orb reduce={reduce} className="scale-75 md:scale-100" from="#e3cfa0" to="#a07d20" size={30} dur={15} />
            </Parallax>
            <Parallax z={PZ.orbFar} className="absolute left-[32.5%] top-[60%] z-[15] md:left-[33.2%] md:top-[36.4%]">
              <Orb reduce={reduce} className="scale-75 md:scale-100" from="#4f9fcb" to="#1c5e8c" size={46} dur={18} delay={1.2} />
            </Parallax>
            <Parallax z={PZ.orbNear} className="absolute left-[69.5%] top-[26%] z-[15] md:left-[69.6%] md:top-[9%]">
              <Orb reduce={reduce} className="scale-75 md:scale-100" from="#2a2f3a" to="#05070d" size={46} dur={17} delay={2.2} />
            </Parallax>
            <Parallax z={PZ.orbMid} className="absolute left-[64%] top-[64%] z-[15] md:left-[55.5%] md:top-[57.5%]">
              <Orb reduce={reduce} className="scale-75 md:scale-100" from="#1e63c0" to="#06337a" size={46} dur={14} delay={0.6} />
            </Parallax>
          </div>
          </ParallaxContext.Provider>
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
