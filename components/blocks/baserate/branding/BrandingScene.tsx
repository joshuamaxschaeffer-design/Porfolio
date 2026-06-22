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
import { useIsSafari } from '@/lib/useIsSafari'

/**
 * BrandingScene — the floating "Brand & Marketing" composition extracted from
 * BrandingHero so it can be reused on the home page (right of the Baserate
 * card). It contains ONLY the scene: the phone + desktop SD-Studio device
 * renders, the two baked app-icon chips (Journalytic + Baserate), and the four
 * brand colour-swatch cards — all with the exact same scroll parallax + spin.
 *
 * Explicitly EXCLUDED (vs BrandingHero): the white text card, the teal→blue
 * gradient field, the diagonal white clip, and the "B2C Brand Exploration"
 * label. Positions are the same literal Figma coords (box ÷ 1443×893) so the
 * cluster reads identically; the host sizes the scene via the wrapper.
 */

const SCRUB_FRAMES = 20
const FPS = 30

const PZ = { device: 28, chip: 60, orbFar: 60, orbMid: 80, orbNear: 104 }

const ParallaxContext = createContext<MotionValue<number> | null>(null)

function useParallaxY(z: number): MotionValue<number> | number {
  const factor = useContext(ParallaxContext)
  const fallback = useSpring(0)
  const signal = factor ?? fallback
  return useTransform(signal, (v) => -v * z)
}

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

function BakedChip({
  base, frameCount, size, scaleW, ml, mt, delay = 0, reduce, className = '', alt, shadowMode = 'svg', scrub,
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
        <StudioObject base={base} frameCount={frameCount} fps={30} scrub={scrub} staticFrame={scrub ? undefined : -1} shadowMode={shadowMode} className="w-full" alt={alt} />
      </motion.div>
    </div>
  )
}

function SwatchCard({
  className = '', color, hex, w = 64, rotX = 0, rotY = 0, rotZ = 0, dur = 16, delay = 0, reduce,
}: {
  className?: string; color: string; hex: string; w?: number
  rotX?: number; rotY?: number; rotZ?: number; dur?: number; delay?: number; reduce: boolean | null
}) {
  const drift = w
  return (
    <div className={`pointer-events-none ${className}`} style={{ width: w, perspective: 720 }}>
      <motion.div
        initial={false}
        animate={reduce ? {} : {
          x: [0, drift * 0.18, -drift * 0.1, drift * 0.06, 0],
          y: [0, -drift * 0.22, -drift * 0.06, -drift * 0.26, 0],
        }}
        transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay, times: [0, 0.3, 0.55, 0.8, 1] }}
      >
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
          <div style={{ background: color, borderRadius: Math.round(w * 0.09), aspectRatio: '1.35 / 1', width: '100%' }} />
          <div
            style={{
              fontSize: Math.max(5, Math.round(w * 0.13)),
              lineHeight: 1.1, color: '#3a4256', fontWeight: 600, letterSpacing: '0.01em',
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

/**
 * The floating scene. Renders inside a 1443/893 aspect box (positions are the
 * Figma coords). Drop it in any positioned container; it sizes to that box.
 */
export function BrandingScene({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion()
  const isSafari = useIsSafari()
  const [mounted, setMounted] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  useEffect(() => setMounted(true), [])

  // Self-contained scroll signal (same scheme as BrandingHero): signed −0.5…+0.5,
  // 0 when the scene is centered in the viewport, spring-smoothed into "physics".
  const signedRaw = useMotionValue(0)
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let raf = 0
    const measure = () => {
      raf = 0
      const r = stage.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const sectionCenter = r.top + r.height / 2
      const travel = (r.height + vh) / 2
      const v = (vh / 2 - sectionCenter) / travel
      signedRaw.set(Math.max(-0.5, Math.min(0.5, v)))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure) }
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
  const parallax = reduce ? null : factor

  const CHIP_CENTER = 0.78, CHIP_SPAN = 0.9
  const chipRot = useTransform(factor, (v) => Math.max(0, Math.min(1, CHIP_CENTER + v * CHIP_SPAN)))
  const chipScrub = reduce || isSafari ? undefined : chipRot

  return (
    <div
      ref={stageRef}
      className={`relative w-full ${className}`}
      style={{
        ['--hero-shadow' as string]:
          '2px 3px 3px rgba(28,50,82,0.30), 6px 9px 9px rgba(28,50,82,0.18), 14px 22px 20px rgba(28,50,82,0.13), 24px 40px 36px rgba(28,50,82,0.10)',
      }}
    >
      {/* aspect spacer (Figma artboard ratio) */}
      <div className="aspect-[1443/893] w-full" />

      {mounted && (
        <ParallaxContext.Provider value={parallax}>
          <div className="pointer-events-none absolute inset-0">
            {/* PHONE */}
            <Parallax z={PZ.device} className="absolute left-[6%] top-[16%] z-10 w-[26%]">
              <StudioObject base="/baserate/branding/devices/phone" frameCount={SCRUB_FRAMES} fps={FPS} staticFrame={-1} shadowMode="svg" className="w-full" alt="Journalytic phone" />
            </Parallax>

            {/* DESKTOP / tablet */}
            <Parallax z={PZ.device} className="absolute left-[58%] top-[14%] z-10 w-[42%]">
              <StudioObject base="/baserate/branding/devices/desktop" frameCount={SCRUB_FRAMES} fps={FPS} staticFrame={-1} shadowMode="svg" className="w-full" alt="Baserate marketing site" />
            </Parallax>

            {/* app-icon chips */}
            <Parallax z={PZ.chip} className="absolute left-[20%] top-[2%] z-30">
              <BakedChip base="/baserate/branding/chips/journalytic" alt="Journalytic" reduce={reduce} frameCount={SCRUB_FRAMES} size={124} scaleW={132.3} ml={-4.3} mt={-6.3} scrub={chipScrub} />
            </Parallax>
            <Parallax z={PZ.chip} className="absolute left-[57%] top-[40%] z-30">
              <BakedChip base="/baserate/branding/chips/baserate" alt="Baserate" reduce={reduce} frameCount={SCRUB_FRAMES} size={94} scaleW={103.2} ml={-6.2} mt={-3.3} delay={250} scrub={chipScrub} />
            </Parallax>

            {/* brand colour swatch cards */}
            <Parallax z={PZ.orbNear} className="absolute left-[12%] top-[6%] z-[15]">
              <SwatchCard reduce={reduce} color="#C08F2E" hex="#C08F2E" w={54} rotX={9} rotY={-7} dur={15} />
            </Parallax>
            <Parallax z={PZ.orbFar} className="absolute left-[31%] top-[40%] z-[15]">
              <SwatchCard reduce={reduce} color="#3F93CF" hex="#3F93CF" w={72} rotX={8} rotY={6} dur={18} delay={1.2} />
            </Parallax>
            <Parallax z={PZ.orbNear} className="absolute left-[70%] top-[8%] z-[15]">
              <SwatchCard reduce={reduce} color="#1A2436" hex="#1A2436" w={70} rotX={10} rotY={-5} dur={17} delay={2.2} />
            </Parallax>
            <Parallax z={PZ.orbMid} className="absolute left-[56%] top-[62%] z-[15]">
              <SwatchCard reduce={reduce} color="#1551C0" hex="#1551C0" w={70} rotX={8} rotY={7} dur={14} delay={0.6} />
            </Parallax>
          </div>
        </ParallaxContext.Provider>
      )}
    </div>
  )
}
