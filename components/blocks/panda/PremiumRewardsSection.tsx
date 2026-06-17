'use client'

import { useEffect, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { premiumRewards as defaults } from './data'
import { RewardsRadial } from './RewardsRadial'
import { Sparkles } from './Sparkles'

const P = '/panda/pivot'

/**
 * "PREMIUM REWARDS APP" — the hero that opens the rewards chapter (Figma node
 * 292:25968, "MVP Section 6"). A full-bleed Panda-red band:
 *   • title + two-phase summary sit top-left,
 *   • the SAME two-phone rewards mockup from the 2020-Pivot card (RewardsCard)
 *     bursts from a radial firework at the centre — here scaled UP to fill the
 *     band as a hero,
 *   • gold sparkles + fireworks animate on/off across the top (see Sparkles).
 *
 * The phone/shadow scroll choreography is lifted 1:1 from RewardsCard so the
 * motion matches the earlier section: phones fly in from their own sides +
 * down, slightly over-rotated, and settle into the exact Figma overlap; the
 * radial burst draws spoke-by-spoke on first view (RewardsRadial). Phone 1's
 * cast shadow stays clipped to Phone 2 throughout. Reduced-motion → rest pose.
 *
 * Assets reused from /public/panda/pivot.
 */
export function PremiumRewardsSection({ intro }: { intro?: string } = {}) {
  return (
    <section
      id="premium-rewards"
      aria-label="Premium Rewards App"
      data-anim="premium-rewards-section"
      className="relative isolate w-full overflow-hidden border-y border-white/20 bg-[var(--px-red)]"
    >
      {/* animated gold sparkles + fireworks across the top of the band */}
      <Sparkles />

      {/* ── DESKTOP / TABLET (≥1024px) ─────────────────────────────────── */}
      <div className="relative mx-auto hidden w-full max-w-[1600px] px-10 pt-16 pb-8 lg:block">
        {/* title block, top-left */}
        <div data-anim="premium-rewards-header" className="relative z-20 max-w-[60%]">
          <h2 className="text-[40px] font-semibold uppercase leading-none tracking-wide text-white xl:text-[52px]">
            {defaults.heading}
          </h2>
          <p className="mt-5 max-w-[58ch] text-xl leading-snug text-white/90 xl:text-[22px]">
            {intro ?? defaults.intro}
          </p>
        </div>

        {/* scaled-up phone + firework stage, centred below the title */}
        <RewardsStage className="relative z-10 mx-auto mt-2 w-full max-w-[1124px]" />
      </div>

      {/* ── MOBILE (<1024px) ───────────────────────────────────────────── */}
      <div className="relative mx-auto w-full max-w-[520px] px-5 pt-12 pb-6 lg:hidden">
        <div data-anim="premium-rewards-header" className="relative z-20">
          <h2 className="text-[30px] font-semibold uppercase leading-tight tracking-wide text-white">
            {defaults.heading}
          </h2>
          <p className="mt-4 text-[15px] leading-snug text-white/90">{intro ?? defaults.intro}</p>
        </div>
        <RewardsStage className="relative z-10 mt-4 w-full" />
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * Entry progress — 0 → 1 as the stage scrolls up through a FIXED, viewport-
 * relative window (height-independent). Identical scheme to RewardsCard's
 * useEntryProgress so the two sections feel the same. Spring-smoothed.
 * ───────────────────────────────────────────────────────────────────────── */
function useEntryProgress(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean,
): MotionValue<number> {
  const raw = useMotionValue(0)
  const spring = useSpring(raw, { stiffness: 70, damping: 22, mass: 0.6 })

  useEffect(() => {
    if (!enabled) {
      raw.set(0)
      return
    }
    const el = ref.current
    if (!el) return
    let frame = 0
    const measure = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const ENTER_AT = 0.95 * vh // stage top here → progress 0 (devices entering)
      const DONE_AT = 0.45 * vh // stage top here → progress 1 (settled, ~centre)
      const top = rect.top
      const progress = (ENTER_AT - top) / (ENTER_AT - DONE_AT)
      raw.set(Math.max(0, Math.min(1, progress)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref, enabled, raw])

  return spring
}

/* ─────────────────────────────────────────────────────────────────────────
 * RewardsStage — the radial burst + two overlapping phones, scaled to fill the
 * hero. Geometry (the % left/top/width/height of every node) is the SAME as the
 * 715.26×611.50 Figma group used in RewardsCard; only the OUTER box is bigger,
 * so the whole composition scales up cleanly. Motion is lifted 1:1.
 * ───────────────────────────────────────────────────────────────────────── */
function RewardsStage({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const progress = useEntryProgress(stageRef, !reduce)

  // Displacement: 1 entering (progress 0) → 0 settled (progress 1), ease-out.
  const a = useTransform(progress, (p) => {
    const d = 1 - p
    return d * d
  })

  // Phones sit a touch higher than their raw slot so their centres land over
  // the radial's centre. Scaled up from RewardsCard's −70 to suit the hero.
  const REST_Y = -90

  // ── Phone 1 (front / left): slides in from lower-left, slightly extra CCW.
  const p1x = useTransform(a, (v) => -90 * v)
  const p1y = useTransform(a, (v) => REST_Y + 80 * v)
  const p1r = useTransform(a, (v) => -8 * v)
  // ── Phone 2 (back / right): slides in from lower-right, slightly extra CW.
  const p2x = useTransform(a, (v) => 90 * v)
  const p2y = useTransform(a, (v) => REST_Y + 80 * v)
  const p2r = useTransform(a, (v) => 8 * v)

  // ── Shadows. Horizontal: track the device (same sign). Rotation: opposite.
  // Vertical/elevation: as a→1 push DOWN + lighter + blurrier; settle at rest.
  const s1x = useTransform(a, (v) => -90 * v)
  const s1y = useTransform(a, (v) => REST_Y + 80 * v + 34 * v)
  const s1r = useTransform(a, (v) => 8 * v)
  const s1op = useTransform(a, (v) => 0.3 * (1 - 0.6 * v))
  const s1blur = useTransform(a, (v) => `blur(${12 * v}px)`)
  const s2x = useTransform(a, (v) => 90 * v)
  const s2y = useTransform(a, (v) => REST_Y + 80 * v + 34 * v)
  const s2r = useTransform(a, (v) => -8 * v)
  const s2op = useTransform(a, (v) => 0.3 * (1 - 0.6 * v))
  const s2blur = useTransform(a, (v) => `blur(${12 * v}px)`)
  // Phone 1's CLIPPED cast shadow on Phone 2 (art moves inside a fixed mask).
  const cs1x = useTransform(a, (v) => -90 * v)
  const cs1y = useTransform(a, (v) => 80 * v + 28 * v)
  const cs1r = useTransform(a, (v) => 8 * v)
  const cs1op = useTransform(a, (v) => 0.9 * (1 - 0.55 * v))
  const cs1blur = useTransform(a, (v) => `blur(${10 * v}px)`)

  return (
    <div
      ref={stageRef}
      data-anim="premium-rewards-stage"
      className={`aspect-[715.26/611.5] ${className ?? ''}`}
    >
      {/* radial burst (masked ring), centered behind the phones */}
      <RewardsRadial
        className="pointer-events-none absolute z-0 max-w-none"
        style={{ left: '6.96%', top: 'calc(1.96% - 20px)', width: '90.88%' }}
      />

      {/* BACK phone's drop shadow (Phone 2 Back Shadow) — rot 22.41°, op .30 */}
      <motion.div
        data-anim="premium-phone2-back-shadow"
        className="pointer-events-none absolute z-[5] flex items-center justify-center"
        style={{ left: '34.40%', top: '14.58%', width: '65.60%', height: '85.42%', x: s2x, y: s2y, rotate: s2r, opacity: s2op, filter: s2blur }}
      >
        <div style={{ width: '70.50%', height: '82.06%', transform: 'rotate(22.41deg)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${P}/phone2-back-shadow.webp`} alt="" aria-hidden className="h-full w-full max-w-none object-cover" />
        </div>
      </motion.div>
      {/* FRONT phone's back/ambient shadow (Phone 1 back shadow) — rot −26.51°, op .30 */}
      <motion.div
        data-anim="premium-phone1-back-shadow"
        className="pointer-events-none absolute z-[5] flex items-center justify-center"
        style={{ left: '0%', top: '0%', width: '68.72%', height: '86.28%', x: s1x, y: s1y, rotate: s1r, opacity: s1op, filter: s1blur }}
      >
        <div style={{ width: '69.11%', height: '79.63%', transform: 'rotate(-26.51deg)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${P}/phone1-back-shadow.webp`} alt="" aria-hidden className="h-full w-full max-w-none object-cover" />
        </div>
      </motion.div>

      {/* BACK phone (Phone 2) */}
      <motion.img
        data-anim="premium-phone2"
        src={`${P}/phone2.webp`}
        alt="Panda Rewards — upgrade to premium entrée screen"
        className="absolute z-10 max-w-none"
        style={{ left: '40.60%', top: '16.52%', width: '45.81%', height: '60.47%', x: p2x, y: p2y, rotate: p2r }}
      />

      {/* CLIPPED shadow: Phone 1's cast shadow falling onto Phone 2. */}
      <motion.div
        data-anim="premium-phone1-shadow"
        className="pointer-events-none absolute z-[15]"
        style={{
          left: '40.60%',
          top: '16.52%',
          width: '45.81%',
          height: '60.47%',
          x: p2x,
          y: p2y,
          rotate: p2r,
          WebkitMaskImage: `url(${P}/phone2.webp)`,
          maskImage: `url(${P}/phone2.webp)`,
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={`${P}/phone1-shadow.webp`}
          alt=""
          aria-hidden
          className="absolute max-w-none"
          style={{ left: '-33.75%', top: '36.51%', width: '78.56%', height: '62.78%', x: cs1x, y: cs1y, rotate: cs1r, opacity: cs1op, filter: cs1blur }}
        />
      </motion.div>

      {/* FRONT phone (Phone 1) */}
      <motion.img
        data-anim="premium-phone1"
        src={`${P}/phone1.webp`}
        alt="Panda Rewards — 520 Panda Points home screen"
        className="absolute z-20 max-w-none"
        style={{ left: '15.30%', top: '6.10%', width: '45.81%', height: '60.47%', x: p1x, y: p1y, rotate: p1r }}
      />
    </div>
  )
}
