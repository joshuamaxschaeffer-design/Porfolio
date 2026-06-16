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
import { releases as defaults } from './data'
import { RewardsRadial } from './RewardsRadial'

const P = '/panda/pivot'

/**
 * Section 3 — "2020 Pivot". Two cards: the MVP Fast-Launch (web-first) and the
 * Full Rewards App (native). Every visual element is placed individually with a
 * stable `data-anim` hook and its own absolutely-positioned node, so each piece
 * (phones, shadows, badge, radial, screenshot) can be animated independently.
 * The rewards card's front-phone cast shadow is CLIPPED to the back phone
 * (Phone 1 shadow masked to Phone 2's rounded-rect footprint).
 *
 * Figma: node 285:24956. Assets in /public/panda/pivot.
 */
export function ReleasesSection({ intro }: { intro?: string } = {}) {
  return (
    <section id="releases" className="bg-white">
      <div className="br-container pt-16 pb-20 md:pt-20 md:pb-[120px]">
        {/* ── Header ─────────────────────────────────────────────── */}
        <h2
          data-anim="pivot-heading"
          className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]"
        >
          3. {defaults.heading}
        </h2>
        <p
          data-anim="pivot-intro"
          className="mt-5 max-w-3xl text-lg leading-snug text-[var(--br-muted)] md:text-[22px]"
        >
          {intro ?? defaults.intro}
        </p>

        {/* ── Two cards. items-center so the shorter MVP card centers against
            the taller Full Rewards card — MVP ends up inset (shorter at the top
            AND bottom), matching the Figma. ── */}
        <div className="mt-10 grid grid-cols-1 items-center gap-7 lg:grid-cols-2 lg:gap-8 md:mt-14">
          <MvpCard />
          <RewardsCard />
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * MVP FAST-LAUNCH card — white field, Panda-red outline. Centered icon +
 * heading + body, with the web homepage screenshot anchored at the bottom and
 * bleeding past the card's lower edge. Each element is its own node.
 * ───────────────────────────────────────────────────────────────────────── */
function MvpCard() {
  return (
    <div
      data-anim="mvp-card"
      className="relative flex flex-col items-center overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--px-red)] bg-white px-6 pt-12 pb-0 text-center md:px-10 md:pt-14"
    >
      {/* fast-forward icon badge */}
      <div
        data-anim="mvp-icon"
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[var(--px-red)] text-white md:h-[57px] md:w-[57px]"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-[22px] w-[22px]" aria-hidden>
          <path d="M3 5.5v13a1 1 0 0 0 1.55.83L13 13.5v5a1 1 0 0 0 1.55.83l8-6.5a1 1 0 0 0 0-1.66l-8-6.5A1 1 0 0 0 13 5.5v5L4.55 4.67A1 1 0 0 0 3 5.5Z" />
        </svg>
      </div>

      <h3
        data-anim="mvp-title"
        className="mt-6 text-[30px] font-semibold uppercase leading-none text-[var(--br-ink)] md:text-[40px]"
      >
        {defaults.mvp.title}
      </h3>
      <p
        data-anim="mvp-body"
        className="mt-4 max-w-[42ch] text-base leading-snug text-[var(--br-muted)] md:text-lg"
      >
        {defaults.mvp.body}
      </p>

      {/* web homepage screenshot — sits at the bottom, slight rounded top */}
      <div data-anim="mvp-screenshot" className="mt-9 w-full max-w-[460px] md:mt-11">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${P}/homepage-hero.webp`}
          alt="Panda Express MVP homepage — We Wok For You menu"
          className="block w-full rounded-t-[10px] shadow-[0_-2px_20px_rgba(0,0,0,0.06)]"
        />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * Entry progress — 0 → 1 as the stage scrolls up through a FIXED, viewport-
 * relative window: progress 0 when the stage top is near the bottom of the
 * viewport (devices just entering), progress 1 when the stage top reaches just
 * above centre (settled, card in the middle of the screen). Anchored to vh
 * fractions, NOT the section height, so it completes at the same on-screen
 * position on tall and short viewports alike (the old centeredness scheme
 * normalised by section height, so a tall card on a short viewport didn't
 * finish until it was nearly scrolled off the top). Spring-smoothed for weight.
 * ───────────────────────────────────────────────────────────────────────── */
function useEntryProgress(ref: React.RefObject<HTMLElement | null>, enabled: boolean): MotionValue<number> {
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
      // Entry PROGRESS driven by a fixed viewport-relative window — NOT the
      // section size — so it behaves the same on tall and short viewports.
      // The stage TOP travels from ENTER_AT (just entering, near the bottom)
      // up to DONE_AT (just above centre). progress 0 → 1 across that window;
      // it completes by the time the card reaches the middle of the screen and
      // then holds. (Independent of stage height, which is what broke short
      // viewports before.)
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
 * FULL REWARDS APP card — Panda-red field. A floating Panda badge overlaps the
 * top edge, then heading + body, then a phone "stage": a radial burst behind
 * two overlapping phones.
 *
 * SCROLL CHOREOGRAPHY (scrubbed + reversible):
 *   `a` ∈ [0,1] is the entry amount, 1 while the card is still low on screen,
 *   easing to 0 as it reaches centre (and only the entering half drives it —
 *   past centre it holds at rest, so the phones don't fly back out the top).
 *
 *   At a=1 the phones are displaced OUT toward their own sides + DOWN and a
 *   touch over-rotated, then slide/settle into the exact Figma overlap at a=0.
 *
 *   Shadows follow real-ish physics, per the brief:
 *     • move WITH the device horizontally (same direction),
 *     • rotate the OPPOSITE direction to the device,
 *     • as the device lifts in (a→1) the shadow drops DOWN, gets LIGHTER and
 *       BLURRIER (device floating above the surface); at rest (a=0) every
 *       shadow returns to its exact Figma offset / opacity / sharpness.
 *   Phone 1's cast shadow stays CLIPPED to Phone 2 the whole time (the mask
 *   window itself never moves; only the shadow art inside it animates).
 * ───────────────────────────────────────────────────────────────────────── */
function RewardsCard() {
  const reduce = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  // progress: 0 as the devices enter the bottom of the screen → 1 when the card
  // reaches the middle (fixed viewport window, height-independent).
  const progress = useEntryProgress(stageRef, !reduce)

  // Displacement amount: 1 when entering (progress 0) → 0 when settled
  // (progress 1), with an EASE-OUT so the devices decelerate into the resting
  // Figma pose — fast as they fly in, slowing at the end. (1-p)^2 eases the
  // displacement toward 0 near the end.
  const a = useTransform(progress, (p) => {
    const d = 1 - p
    return d * d // ease-out toward rest (slows down at the end)
  })

  // Both phones sit 80px higher than their raw Figma slot so their centres land
  // over the radial's centre. REST_Y is the settled baseline; the scroll entry
  // (60*v down) rides on top of it. Shadows share the same baseline so they stay
  // glued to their phones at rest.
  const REST_Y = -80

  // ── Phone 1 (front / left): slides in from lower-left, slightly extra CCW.
  const p1x = useTransform(a, (v) => -70 * v)
  const p1y = useTransform(a, (v) => REST_Y + 60 * v)
  const p1r = useTransform(a, (v) => -8 * v)
  // ── Phone 2 (back / right): slides in from lower-right, slightly extra CW.
  const p2x = useTransform(a, (v) => 70 * v)
  const p2y = useTransform(a, (v) => REST_Y + 60 * v)
  const p2r = useTransform(a, (v) => 8 * v)

  // ── Shadows. Horizontal: track the device (same sign). Rotation: opposite.
  // Vertical/elevation: as a→1 push DOWN + lighter + blurrier.
  // Phone 1 back/ambient shadow couples to Phone 1.
  const s1x = useTransform(a, (v) => -70 * v) // with device
  const s1y = useTransform(a, (v) => REST_Y + 60 * v + 26 * v) // device-down + extra lift drop
  const s1r = useTransform(a, (v) => 8 * v) // opposite of device's -8
  const s1op = useTransform(a, (v) => 0.3 * (1 - 0.6 * v)) // 0.30 → lighter
  const s1blur = useTransform(a, (v) => `blur(${10 * v}px)`)
  // Phone 2 back shadow couples to Phone 2.
  const s2x = useTransform(a, (v) => 70 * v)
  const s2y = useTransform(a, (v) => REST_Y + 60 * v + 26 * v)
  const s2r = useTransform(a, (v) => -8 * v) // opposite of device's +8
  const s2op = useTransform(a, (v) => 0.3 * (1 - 0.6 * v))
  const s2blur = useTransform(a, (v) => `blur(${10 * v}px)`)
  // Phone 1's CLIPPED cast shadow on Phone 2 couples to Phone 1's motion, but
  // only its art moves inside the fixed mask window. Drops down + lightens +
  // blurs as Phone 1 lifts in. (No REST_Y here — this shadow art is positioned
  // relative to the fixed phone2 mask window, not the moving phone.)
  const cs1x = useTransform(a, (v) => -70 * v)
  const cs1y = useTransform(a, (v) => 60 * v + 22 * v)
  const cs1r = useTransform(a, (v) => 8 * v)
  const cs1op = useTransform(a, (v) => 0.9 * (1 - 0.55 * v))
  const cs1blur = useTransform(a, (v) => `blur(${8 * v}px)`)

  return (
    <div data-anim="rewards-card" className="relative">
      {/* floating Panda badge — sibling of the clipped card so it can overhang
          the top edge without being cut by the card's overflow-hidden. */}
      <div
        data-anim="rewards-badge"
        className="absolute left-1/2 top-0 z-30 flex h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[18px] bg-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] md:h-[88px] md:w-[88px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/panda/panda-logo.svg" alt="Panda Express" className="h-[58px] w-[58px] md:h-[66px] md:w-[66px]" />
      </div>

      <div
        data-anim="rewards-card-surface"
        className="relative overflow-hidden rounded-[var(--br-card-radius)] bg-[var(--px-red)] px-6 pt-16 pb-0 text-center md:px-10 md:pt-16"
      >

      <h3
        data-anim="rewards-title"
        className="relative z-20 text-[30px] font-semibold uppercase leading-none text-white md:text-[40px]"
      >
        {defaults.rewards.title}
      </h3>
      <p
        data-anim="rewards-body"
        className="relative z-20 mx-auto mt-4 max-w-[46ch] text-base leading-snug text-white/95 md:text-lg"
      >
        {defaults.rewards.body}
      </p>

      {/* ── phone stage ──────────────────────────────────────────────
          Exact 1:1 from the Figma "Group 3877" (715.26 × 611.50). Stage breaks
          fully out of the card's side padding so the radial + phones fill the
          red card edge-to-edge, then the whole group is scaled up ~30% and
          nudged down ~60px. Phones + shadows scrub in on scroll (see header). */}
      <div
        ref={stageRef}
        data-anim="rewards-stage"
        className="relative -mx-6 -mt-2 aspect-[715.26/611.5] w-[calc(100%+3rem)] [transform:translateY(48px)_scale(1.3)] [transform-origin:center_top] md:-mx-10 md:w-[calc(100%+5rem)] md:[transform:translateY(60px)_scale(1.3)]"
      >
        {/* radial burst (masked to a ring), centered behind the phones. Inlined
            SVG so each spoke animates from the centre outward on first view. */}
        <RewardsRadial
          className="pointer-events-none absolute z-0 max-w-none"
          style={{ left: '6.96%', top: '1.96%', width: '90.88%' }}
        />

        {/* BACK phone's drop shadow (Phone 2 Back Shadow) — rot 22.41°, op .30 */}
        <motion.div
          data-anim="rewards-phone2-back-shadow"
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
          data-anim="rewards-phone1-back-shadow"
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
          data-anim="rewards-phone2"
          src={`${P}/phone2.webp`}
          alt="Panda Rewards — upgrade to premium entrée screen"
          className="absolute z-10 max-w-none"
          style={{ left: '40.60%', top: '16.52%', width: '45.81%', height: '60.47%', x: p2x, y: p2y, rotate: p2r }}
        />

        {/* CLIPPED shadow: Phone 1's cast shadow falling onto Phone 2. The clip
            box is placed at Phone 2's EXACT rect and uses phone2.webp itself as a
            CSS mask, so the shadow is clipped to Phone 2's real silhouette. The
            window TRACKS Phone 2 (same x/y/rotate) so the clip stays aligned to
            the device wherever it moves; the shadow art inside then animates with
            Phone 1's coupling. */}
        <motion.div
          data-anim="rewards-phone1-shadow"
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
          data-anim="rewards-phone1"
          src={`${P}/phone1.webp`}
          alt="Panda Rewards — 520 Panda Points home screen"
          className="absolute z-20 max-w-none"
          style={{ left: '15.30%', top: '6.10%', width: '45.81%', height: '60.47%', x: p1x, y: p1y, rotate: p1r }}
        />
      </div>
      </div>
    </div>
  )
}
