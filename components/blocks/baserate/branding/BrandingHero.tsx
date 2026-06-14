'use client'

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

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
// Scroll-scrubbed sequences are 20-frame sub-ranges (devices = last 1/3 of the
// tilt, chips = a 45° spin), driven by section scroll instead of play-once.
const SCRUB_FRAMES = 20

/** Orb still crop: the sphere body fills ~95.7% of the exported frame (the
 *  +14px alpha-crop pad), so scale the render by (1 + 2·ORB_PAD) to land the
 *  visible body at the requested on-screen diameter. */
const ORB_PAD = 0.0224

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
  base, frameCount, size, scaleW, ml, mt, delay = 0, reduce, className = '', alt, shadowMode = 'canvas', scrub,
}: {
  base: string; frameCount: number; size: number; scaleW: number; ml: number; mt: number
  delay?: number; reduce: boolean | null; className?: string; alt: string; shadowMode?: 'canvas' | 'svg'
  scrub?: MotionValue<number>
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
        {/* Subtle scroll rotation: `scrub` drives the chip a few frames around
            its settled 45° pose as the user scrolls; the motion.div above keeps
            the gentle vertical bob. Falls back to the settled frame when there's
            no scrub (reduced motion). Screen content is static either way. */}
        <StudioObject base={base} frameCount={frameCount} fps={30} scrub={scrub} staticFrame={scrub ? undefined : -1} shadowMode={shadowMode} className="w-full" alt={alt} />
      </motion.div>
    </div>
  )
}

/**
 * Glossy pearlescent orb — an SD Studio shape-kind sphere render (transparent
 * still webp + shadow-v2) drawn through StudioObject, so it carries the same
 * rig + bottom-right physical shadow as the devices/chips. Replaces the old
 * flat CSS radial-gradient sphere. Still slow-drifts on its multi-axis path.
 * `size` = on-screen diameter of the orb body; the render crop is padded, so
 * it's scaled to `scaleW` (crop ÷ body) and the wrapper centered on the box.
 */
/**
 * Floating colour-swatch card — replaces the old 3D orbs. A small white card
 * (Tailwind/CSS only) holding a colour block + the hex code beneath, tilted to a
 * subtle 3D angle via CSS `rotate3d`/skew so it reads like a chip floating in the
 * scene. Casts the same desaturated-blue layered shadow as everything else
 * (var(--hero-shadow), tuned to match the studio-rendered objects). Slow multi-
 * axis drift like the orbs had. `w` = card width in px; rotX/rotY/rotZ give each
 * card its own 3D pose so they read at "various angles".
 */
function SwatchCard({
  className = '', color, hex, w = 64, rotX = 0, rotY = 0, rotZ = 0,
  dur = 16, delay = 0, reduce,
}: {
  className?: string; color: string; hex: string; w?: number
  rotX?: number; rotY?: number; rotZ?: number
  dur?: number; delay?: number; reduce: boolean | null
}) {
  const drift = w // travel scales with size
  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{ width: w, perspective: 720 }}
    >
      <motion.div
        initial={false}
        animate={reduce ? {} : {
          x: [0, drift * 0.18, -drift * 0.1, drift * 0.06, 0],
          y: [0, -drift * 0.22, -drift * 0.06, -drift * 0.26, 0],
        }}
        transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay, times: [0, 0.3, 0.55, 0.8, 1] }}
      >
        {/* the 3D-posed card: white surround + colour block + hex caption */}
        <div
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
            transformStyle: 'preserve-3d',
            borderRadius: Math.round(w * 0.14),
            background: '#fff',
            padding: Math.round(w * 0.07),
            paddingBottom: Math.round(w * 0.04),
            boxShadow: 'var(--hero-shadow)',
          }}
        >
          <div
            style={{
              background: color,
              borderRadius: Math.round(w * 0.09),
              aspectRatio: '1.35 / 1',
              width: '100%',
            }}
          />
          <div
            style={{
              fontSize: Math.max(5, Math.round(w * 0.13)),
              lineHeight: 1.1,
              color: '#3a4256',
              fontWeight: 600,
              letterSpacing: '0.01em',
              padding: `${Math.round(w * 0.05)}px ${Math.round(w * 0.03)}px ${Math.round(w * 0.03)}px`,
              whiteSpace: 'nowrap',
            }}
          >
            {hex}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function BrandingHero() {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  useEffect(() => setMounted(true), [])

  // Scroll signal for the whole scene. We compute it MANUALLY from the section's
  // viewport position rather than Framer's useScroll({target}) — the latter was
  // pinning scrollYProgress at 0 here (target measured stale under the SSR + tall
  // dynamically-mounted subtree), which froze both the parallax and the scrub.
  // signed = -0.5 when the section is entering (its center below the viewport),
  // 0 when its center is at the viewport center, +0.5 when leaving. A scroll +
  // resize listener (rAF-coalesced) drives a raw MotionValue; a spring smooths
  // it into the "physics" lag.
  const signedRaw = useMotionValue(0)
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let raf = 0
    const measure = () => {
      raf = 0
      const r = stage.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // center of the section relative to the viewport center, normalised by the
      // total travel (section height + viewport) → roughly -0.5…+0.5.
      const sectionCenter = r.top + r.height / 2
      const travel = (r.height + vh) / 2
      const v = (vh / 2 - sectionCenter) / travel
      signedRaw.set(Math.max(-0.5, Math.min(0.5, v)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [signedRaw])
  const factor = useSpring(signedRaw, { stiffness: 70, damping: 22, mass: 0.6 })
  // Disable parallax entirely for reduced-motion users.
  const parallax = reduce ? null : factor

  // SCROLL ROTATION: map the signed scroll factor (−0.5…+0.5, 0 when the section
  // is centered) onto each object's 20-frame spin so devices + logos rotate as
  // you scroll. `scrub` is a 0→1 MotionValue consumed by StudioObject (frame =
  // round(scrub·(N-1))). Centered sits near the settled Figma pose; scrolling
  // DOWN advances to the fully-settled frame, scrolling UP rotates back.
  //
  // CHIPS carry the scroll-rotation: their shadow-v2 IS per-frame (cast shadow
  // tracks the spin) AND their screen is just a logo (no in-screen scroll to
  // betray motion). DEVICES are rendered STATIC at the settled pose — their baked
  // frames include an in-screen page-scroll (0→100→0) and a flat single-pose
  // shadow, so any device rotation would (a) scroll the screen content (Joshua:
  // screens must stay static showing the top of the page) and (b) detach from
  // the fixed shadow. Static settled frame = top-of-page screen + correct shadow.
  const CHIP_CENTER = 0.78, CHIP_SPAN = 0.9 // factor −0.5 → ~frame 6, +0.5 → settled
  const chipRot = useTransform(factor, (v) => Math.max(0, Math.min(1, CHIP_CENTER + v * CHIP_SPAN)))
  // reduced motion → settle on the last frame, no scroll rotation
  const chipScrub = reduce ? undefined : chipRot

  // Shadow renderer: v3 (fast blurred-polygon SVG) is the hero default now — it
  // renders quicker AND is cheap enough to update every scroll-rotation frame
  // (the canvas band-recomposite was too heavy for per-frame scrub). ?shadow=canvas
  // forces the old renderer for comparison.
  const [shadowMode, setShadowMode] = useState<'canvas' | 'svg'>('svg')
  useEffect(() => {
    try {
      const v = new URLSearchParams(window.location.search).get('shadow')
      if (v === 'canvas') setShadowMode('canvas')
      else if (v === 'svg' || v === 'v3') setShadowMode('svg')
    } catch {}
  }, [])

  return (
    <section
      ref={stageRef}
      className="relative overflow-hidden"
      style={{
        // Layered, desaturated-blue shadow for the CSS swatch cards — matches the
        // studio-rendered objects' tone (#1c3252 ≈ rgb 28 50 82): a tight contact
        // layer + soft ambient layers. Offset hard toward BOTTOM-RIGHT (light from
        // top-left) and pushed ~20px further out so the swatches feel FLOATY — the
        // x/y offsets grow across layers, the softest landing ~+24/+40.
        ['--hero-shadow' as string]:
          '2px 3px 3px rgba(28,50,82,0.30), 6px 9px 9px rgba(28,50,82,0.18), 14px 22px 20px rgba(28,50,82,0.13), 24px 40px 36px rgba(28,50,82,0.10)',
      }}
    >
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
              <StudioObject base="/baserate/branding/devices/phone" frameCount={SCRUB_FRAMES} fps={FPS} staticFrame={-1} shadowMode={shadowMode} className="w-full" alt="phone device" />
            </Parallax>

            {/* DESKTOP — pulled fully inside the frame, toward the center */}
            <Parallax z={PZ.device} className="absolute right-[-7%] top-[4%] z-10 w-[58%] md:left-[63.5%] md:right-auto md:top-[17%] md:w-[33%]">
              <StudioObject base="/baserate/branding/devices/desktop" frameCount={SCRUB_FRAMES} fps={FPS} staticFrame={-1} shadowMode={shadowMode} className="w-full" alt="desktop device" />
            </Parallax>

            {/* Baked 3D chips — SD Studio icon exports: spin in once with
                physically-cast rotating shadows, SETTLE at the Figma pose.
                Same tilts as before (J: x7 z-9 y16 · B: x5 z10 y-20), spun
                about the local Y. md positions stay literal Figma 243:54723
                coordinates (box ÷ 1443×893). */}
            <Parallax z={PZ.chip} className="absolute left-[36%] top-[6%] z-30 md:left-[21.5%] md:top-[4.5%]">
              <BakedChip
                base="/baserate/branding/chips/journalytic"
                alt="Journalytic"
                reduce={reduce}
                frameCount={SCRUB_FRAMES}
                size={124}
                scaleW={132.3}
                ml={-4.3}
                mt={-6.3}
                className="scale-[0.55] md:scale-100"
                shadowMode={shadowMode}
                scrub={chipScrub}
              />
            </Parallax>
            <Parallax z={PZ.chip} className="absolute left-[7%] top-[66%] z-30 md:left-[58%] md:top-[38.5%]">
              <BakedChip
                base="/baserate/branding/chips/baserate"
                alt="Baserate"
                reduce={reduce}
                frameCount={SCRUB_FRAMES}
                size={94}
                scaleW={103.2}
                ml={-6.2}
                mt={-3.3}
                className="scale-[0.55] md:scale-100"
                delay={250}
                shadowMode={shadowMode}
                scrub={chipScrub}
              />
            </Parallax>

            {/* Floating colour-SWATCH CARDS (replaced the 3D orbs) — the 4 brand
                colours as little CSS cards at varied 3D angles, each at the orb's
                old spot/size. Foreground layer (largest z) so they parallax most;
                staggered drift + distinct rot so they read at different angles. */}
            <Parallax z={PZ.orbNear} className="absolute left-[10%] top-[8%] z-[15] md:left-[15.1%] md:top-[7.5%]">
              <SwatchCard reduce={reduce} className="scale-75 md:scale-100" color="#C08F2E" hex="#C08F2E" w={54} rotX={9} rotY={-7} rotZ={0} dur={15} />
            </Parallax>
            <Parallax z={PZ.orbFar} className="absolute left-[32.5%] top-[60%] z-[15] md:left-[33.2%] md:top-[36.4%]">
              <SwatchCard reduce={reduce} className="scale-75 md:scale-100" color="#3F93CF" hex="#3F93CF" w={72} rotX={8} rotY={6} rotZ={0} dur={18} delay={1.2} />
            </Parallax>
            <Parallax z={PZ.orbNear} className="absolute left-[69.5%] top-[26%] z-[15] md:left-[69.6%] md:top-[9%]">
              <SwatchCard reduce={reduce} className="scale-75 md:scale-100" color="#1A2436" hex="#1A2436" w={70} rotX={10} rotY={-5} rotZ={0} dur={17} delay={2.2} />
            </Parallax>
            <Parallax z={PZ.orbMid} className="absolute left-[64%] top-[64%] z-[15] md:left-[55.5%] md:top-[57.5%]">
              <SwatchCard reduce={reduce} className="scale-75 md:scale-100" color="#1551C0" hex="#1551C0" w={70} rotX={8} rotY={7} rotZ={0} dur={14} delay={0.6} />
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
