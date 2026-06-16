'use client'

import { motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'
import { releases as defaults } from './data'

const P = '/panda/mvp'

/**
 * Section 4 (part 3) — "MVP Section 3" device-scatter band. A full-bleed Panda-red
 * band that follows the 2020-Pivot two-card grid: six tilted phone screens fanned
 * across a receding diagonal, framed by four food props (cookie, firecracker-shrimp
 * bowl, chopsticks, firecracker-chicken bowl) and a bordered heading plate.
 *
 * Placement is 1:1 from Figma node 283:24935 ("MVP Section 3", 1443 × 734.47,
 * bg #d1282e). Every phone shares a 15.43° tilt; positions/sizes are normalized to
 * percentages of the band so the whole composition scales with width. Phones and
 * props clip off the top/bottom edges exactly as in the mock.
 *
 * Motion: a SUBTLE scroll parallax. The six phones group into 4 diagonal rows
 * reading left→right (1 / 2 / 2 / 1 screens). Rows drift along the phones' own
 * tilt axis (up + slightly right, 15.43° from vertical); adjacent rows alternate
 * direction (rows 1&3 up-right, rows 2&4 down-left). Travel is small (~40px total
 * along the axis) and centered, so mid-viewport matches the Figma static layout.
 * Each phone keeps a soft drop shadow cast down-right (light from upper-left).
 * Reduced-motion → no parallax.
 *
 * Assets in /public/panda/mvp.
 */

/** Tilt of every phone (deg), and the parallax travel along that axis (px). */
const TILT_DEG = 15.43
const TRAVEL = 80
const RAD = (TILT_DEG * Math.PI) / 180
// Unit vector "up the tilt axis" in screen space: up (−y) and slightly right (+x).
const AXIS_X = Math.sin(RAD) // ≈ 0.266
const AXIS_Y = -Math.cos(RAD) // ≈ −0.964

/** A phone: cx/cy = center as % of the band; w = width as % of band width.
 *  row 1–4 (left→right diagonal columns); dir = +1 drifts up-right, −1 down-left. */
interface Phone {
  id: string
  img: string
  cx: number
  cy: number
  w: number
  row: 1 | 2 | 3 | 4
  alt: string
}

/** Back → front paint order (matches the Figma layer order). Rows assigned by
 *  horizontal position: 1=s1, 2={s2,s4-top}, 3={s3,s3-top}, 4=s4-bottom. */
const PHONES: Phone[] = [
  { id: 'mvp-phone-6', img: 'screen4', cx: 81.261, cy: 106.908, w: 18.864, row: 4, alt: '' },
  { id: 'mvp-phone-5', img: 'screen4', cx: 54.858, cy: -1.458, w: 18.864, row: 2, alt: '' },
  { id: 'mvp-phone-1', img: 'screen1', cx: 27.144, cy: 48.342, w: 18.788, row: 1, alt: 'Panda Express app — reorder your recent order' },
  { id: 'mvp-phone-2', img: 'screen2', cx: 43.722, cy: 78.047, w: 18.802, row: 2, alt: 'Panda Express app — My Orders, recent and favorites' },
  { id: 'mvp-phone-3', img: 'screen3', cx: 65.564, cy: 70.462, w: 18.819, row: 3, alt: 'Panda Express app — Build Your Own Plate' },
  { id: 'mvp-phone-4', img: 'screen3', cx: 76.791, cy: -8.642, w: 18.819, row: 3, alt: '' },
]

/** Food props framing the scatter. left/top/width as % of the band. */
const PROPS = [
  { id: 'mvp-prop-cookie', img: 'cookie', left: 5.96, top: 10.62, w: 11.227 },
  { id: 'mvp-prop-shrimp', img: 'shrimp', left: -10.949, top: 33.085, w: 25.641 },
  { id: 'mvp-prop-chopsticks', img: 'chopsticks', left: 82.536, top: -17.019, w: 19.196 },
  { id: 'mvp-prop-firecracker', img: 'firecracker-chicken', left: 84.546, top: 26.005, w: 25.364 },
]

/** Rows 1&3 drift up the tilt axis; rows 2&4 drift down it. */
const rowDir = (row: 1 | 2 | 3 | 4) => (row === 1 || row === 3 ? 1 : -1)

/** Soft drop shadow, cast down-right. Applied on a NON-rotated wrapper so the
 *  offset stays in screen space (truly downward) while the phone itself tilts. */
const PHONE_SHADOW = 'drop-shadow(7px 17px 22px rgba(0,0,0,0.30))'

export function MvpScatterSection() {
  const reduce = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)

  // Scroll progress, computed manually from the section's viewport position.
  // 0 when the section's center sits at the bottom of the viewport, 1 when it
  // sits at the top, 0.5 when perfectly centered (≈ the Figma static layout).
  // We drive it ourselves (rAF + scroll/resize) rather than via useScroll's
  // element tracking, because this site's Lenis smooth-scroll doesn't reliably
  // feed useScroll's target-rect sampler — the progress would stay frozen.
  const progress = useMotionValue(0.5)

  useEffect(() => {
    if (reduce) return
    const el = stageRef.current
    if (!el) return
    let raf = 0
    const update = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const center = r.top + r.height / 2
      // center travels from vh (bottom) → 0 (top) as we scroll past.
      const p = 1 - center / vh
      progress.set(Math.max(0, Math.min(1, p)))
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // Lenis emits native scroll, but also tick on rAF for the first second so the
    // initial settle is smooth even before the first user scroll.
    const id = setInterval(update, 100)
    const stop = setTimeout(() => clearInterval(id), 1200)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
      clearInterval(id)
      clearTimeout(stop)
    }
  }, [reduce, progress])

  // One signed travel value per direction. Centered: at progress .5 → 0 (Figma
  // static), drifting ± a half-travel toward each end. `up` goes up the tilt
  // axis across the scroll; `down` is its mirror.
  const up = useTransform(progress, [0, 1], [-TRAVEL / 2, TRAVEL / 2])
  const down = useTransform(progress, [0, 1], [TRAVEL / 2, -TRAVEL / 2])

  // Resolve each direction into screen-space x/y offsets along the tilt axis.
  const upX = useTransform(up, (d) => d * AXIS_X)
  const upY = useTransform(up, (d) => d * AXIS_Y)
  const downX = useTransform(down, (d) => d * AXIS_X)
  const downY = useTransform(down, (d) => d * AXIS_Y)
  const axis = {
    1: { x: upX, y: upY },
    2: { x: downX, y: downY },
    3: { x: upX, y: upY },
    4: { x: downX, y: downY },
  } as const

  return (
    <section
      id="mvp-reordering"
      aria-label="Seamless simple reordering"
      data-anim="mvp-scatter-section"
      className="relative isolate w-full overflow-hidden border-y border-white/20 bg-[var(--px-red)]"
    >
      {/* ── DESKTOP / TABLET (≥1024px): exact Figma scatter ──────────────
          A fixed-aspect band; every node is positioned as a % of it, so the
          whole composition scales with width and clips top/bottom like the mock. */}
      <div
        ref={stageRef}
        data-anim="mvp-scatter-stage"
        className="relative mx-auto hidden aspect-[1443/734.47] w-full max-w-[1600px] lg:block"
      >
        {PHONES.map((p) => {
          const a = reduce ? null : axis[p.row]
          return (
            // Outer node: positioned by its CENTER. We set left/top to the center
            // point, width to the phone width, then pull back by half via the
            // wrapper's translate. Parallax rides on the inner motion layer.
            <div
              key={p.id}
              data-anim={p.id}
              data-row={p.row}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.cx}%`, top: `${p.cy}%`, width: `${p.w}%` }}
            >
              {/* Parallax layer — full width, real box. Motion owns this element's
                  transform (x/y along the tilt axis); the −50%/−50% centering lives
                  on the OUTER div above, so the two never collide. */}
              <motion.div className="w-full" style={{ x: a?.x, y: a?.y }}>
                {/* shadow wrapper (NOT rotated) → shadow falls straight down-right */}
                <div style={{ filter: PHONE_SHADOW }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${P}/${p.img}.webp`}
                    alt={p.alt}
                    aria-hidden={p.alt === '' ? true : undefined}
                    className="block w-full max-w-none"
                    style={{ transform: `rotate(${TILT_DEG}deg)`, transformOrigin: 'center center' }}
                  />
                </div>
              </motion.div>
            </div>
          )
        })}

        {PROPS.map((pr) => (
          <div
            key={pr.id}
            data-anim={pr.id}
            className="pointer-events-none absolute"
            style={{ left: `${pr.left}%`, top: `${pr.top}%`, width: `${pr.w}%` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${P}/${pr.img}.webp`} alt="" aria-hidden className="block w-full max-w-none" />
          </div>
        ))}

        {/* heading plate — top layer, red fill, hairline white border */}
        <div
          data-anim="mvp-scatter-heading"
          className="absolute left-[5.128%] top-[2.178%] flex w-[89.744%] flex-col gap-3 rounded-[10px] border border-white/60 bg-[var(--px-red)] p-7 lg:p-10"
        >
          <h2 className="text-[22px] font-semibold uppercase leading-tight tracking-wide text-white lg:text-2xl">
            {defaults.scatter.title}
          </h2>
          <p className="text-base leading-snug text-white/90 lg:text-xl">{defaults.scatter.body}</p>
        </div>
      </div>

      {/* ── MOBILE (<1024px): legible reduced fan ────────────────────────
          The wide 6-phone scatter shrinks phones to slivers on a phone screen,
          so below lg we show a calmer 3-phone fan in a taller band. Heading
          plate reflows; two props peek from the corners. Phones keep the same
          soft drop shadow. No parallax on mobile (touch scroll). */}
      <div data-anim="mvp-scatter-mobile" className="relative mx-auto w-full max-w-[520px] px-5 pb-14 pt-10 lg:hidden">
        {/* heading plate */}
        <div
          data-anim="mvp-scatter-heading"
          className="relative z-30 flex flex-col gap-2.5 rounded-[10px] border border-white/60 bg-[var(--px-red)] p-6 text-center"
        >
          <h2 className="text-[22px] font-semibold uppercase leading-tight tracking-wide text-white">
            {defaults.scatter.title}
          </h2>
          <p className="text-[15px] leading-snug text-white/90">{defaults.scatter.body}</p>
        </div>

        {/* phone fan — three tilted screens, sized so they overlap without
            running past the side edges; a portrait stage gives them height. */}
        <div data-anim="mvp-scatter-stage-mobile" className="relative mt-8 aspect-[360/420] w-full">
          {/* corner props (subtle, behind phones) */}
          <div data-anim="mvp-prop-shrimp" className="pointer-events-none absolute -left-[12%] bottom-[2%] z-0 w-[42%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${P}/shrimp.webp`} alt="" aria-hidden className="block w-full max-w-none" />
          </div>
          <div data-anim="mvp-prop-chopsticks" className="pointer-events-none absolute -right-[10%] -top-[6%] z-0 w-[34%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${P}/chopsticks.webp`} alt="" aria-hidden className="block w-full max-w-none" />
          </div>

          {/* back phone */}
          <div data-anim="mvp-phone-3" className="absolute left-[50%] top-[44%] z-10 w-[46%]" style={{ transform: 'translate(-50%, -50%)' }}>
            <div style={{ filter: PHONE_SHADOW }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${P}/screen3.webp`} alt="Panda Express app — Build Your Own Plate" className="block w-full max-w-none" style={{ transform: `rotate(${TILT_DEG}deg)` }} />
            </div>
          </div>
          {/* mid phone */}
          <div data-anim="mvp-phone-2" className="absolute left-[68%] top-[58%] z-20 w-[46%]" style={{ transform: 'translate(-50%, -50%)' }}>
            <div style={{ filter: PHONE_SHADOW }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${P}/screen2.webp`} alt="Panda Express app — My Orders" className="block w-full max-w-none" style={{ transform: `rotate(${TILT_DEG}deg)` }} />
            </div>
          </div>
          {/* front phone */}
          <div data-anim="mvp-phone-1" className="absolute left-[33%] top-[60%] z-20 w-[48%]" style={{ transform: 'translate(-50%, -50%)' }}>
            <div style={{ filter: PHONE_SHADOW }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${P}/screen1.webp`} alt="Panda Express app — reorder your recent order" className="block w-full max-w-none" style={{ transform: `rotate(${TILT_DEG}deg)` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
