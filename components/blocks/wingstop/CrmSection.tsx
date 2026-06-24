'use client'

import { motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'
import { crmSection as defaults } from './data'
import { DragGrid } from './DragGrid'

/**
 * SECTION 3 — CRM. WHITE field.
 * Module 1: the scope of all CRM work as an ANGLED, STAGGERED scatter of email
 * mockups — modelled 1:1 on Panda's `MvpScatterSection` (15.43° tilt, diagonal
 * rows, soft down-right shadow, subtle scroll parallax), tweaked for the tall
 * email aspect (each email is a fixed-ratio window showing the top of the
 * campaign). Top-down Wingstop food frames the scatter like Panda's props.
 * Module 2: the modular/animated side — a Panda-style bento on desktop, a
 * draggable carousel with label pills on mobile.
 */
export function CrmSection() {
  return (
    <section id="crm" className="relative w-full overflow-hidden bg-white">
      <CrmEmailScatter />
      <CrmAnimatedGrid />
    </section>
  )
}

/** Soft drop shadow for the food props (cast down-right, light upper-left). */
const FOOD_SHADOW = 'drop-shadow(6px 16px 24px rgba(0,0,0,0.20))'

/* ── Module 1: angled / staggered email scatter (Panda MvpScatter model) ────── */

const TILT_DEG = 15.43
const TRAVEL = 80
const RAD = (TILT_DEG * Math.PI) / 180
const AXIS_X = Math.sin(RAD)
const AXIS_Y = -Math.cos(RAD)
/** Each email window is this aspect — tall (≈3× the old height) so it shows much
 *  more of the campaign down its length, like a real email scroll. */
const EMAIL_AR = '320 / 1180'
/** Soft drop shadow, cast down-right (light from upper-left). On a NON-rotated
 *  wrapper so the offset stays truly downward while the email tilts. */
const EMAIL_SHADOW = 'drop-shadow(7px 17px 24px rgba(0,0,0,0.26))'

interface EmailNode {
  src: string
  cx: number
  cy: number
  w: number
  row: 1 | 2 | 3 | 4
}
/** Five emails fanned across a receding diagonal (back → front paint order),
 *  positions as % of the band; rows 1&3 drift up the tilt axis, 2&4 down it.
 *  Modelled on Panda's MvpScatter: the windows are BIG and bleed off the top
 *  and bottom of the (short) band, so the row reads as a confident stream of
 *  campaigns rather than small floating thumbnails. */
// Even horizontal spacing: 6 emails at equal cx intervals (~15.33% apart) and a
// near-uniform cy (a tiny ±5 alternating lift so the row isn't dead-flat) so the
// white gaps between the tilted windows read as a consistent small distance.
const SCATTER: EmailNode[] = [
  { src: defaults.scope.emails[0], cx: 12, cy: 50, w: 12.5, row: 1 },
  { src: defaults.scope.emails[4], cx: 27.33, cy: 45, w: 12.5, row: 2 },
  { src: defaults.scope.emails[1], cx: 42.66, cy: 50, w: 12.5, row: 1 },
  { src: defaults.scope.emails[2], cx: 58, cy: 45, w: 12.5, row: 2 },
  { src: defaults.scope.emails[3], cx: 73.33, cy: 50, w: 12.5, row: 1 },
  { src: defaults.scope.emails[5], cx: 88.66, cy: 45, w: 12.5, row: 2 },
]
/** Top-down food props framing the scatter (left/top/width as % of band).
 *  Pushed to clip off the side/top/bottom edges (Panda model). */
const FOOD = [
  { src: defaults.scope.food[0], left: 3, top: 8, w: 11, rot: -10 },
  { src: defaults.scope.food[1], left: 96, top: 64, w: 12, rot: 8 },
  { src: defaults.scope.food[2], left: 70, top: 96, w: 8, rot: -6 },
]

const rowDir = (row: 1 | 2 | 3 | 4) => (row === 1 || row === 3 ? 1 : -1)

function CrmEmailScatter() {
  const reduce = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
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

  const up = useTransform(progress, [0, 1], [-TRAVEL / 2, TRAVEL / 2])
  const down = useTransform(progress, [0, 1], [TRAVEL / 2, -TRAVEL / 2])
  const upX = useTransform(up, (d) => d * AXIS_X)
  const upY = useTransform(up, (d) => d * AXIS_Y)
  const downX = useTransform(down, (d) => d * AXIS_X)
  const downY = useTransform(down, (d) => d * AXIS_Y)
  // All rows drift TOGETHER (same direction) so the even horizontal gaps between
  // the windows are preserved through the scroll parallax — no scissoring.
  const axis = {
    1: { x: upX, y: upY },
    2: { x: upX, y: upY },
    3: { x: upX, y: upY },
    4: { x: upX, y: upY },
  } as const

  return (
    <div aria-label="Campaign after campaign">
      {/* ── DESKTOP / TABLET (≥1024px): the Panda-reorder scatter band ───────
          A SHORT, fixed-aspect band cut off top + bottom by hairline dividers
          (border-y). Big email windows + big food props bleed off all four edges,
          exactly like Panda's "Seamless simple reordering" section. The heading
          rides in a bordered plate at the top-left of the band. */}
      <div
        ref={stageRef}
        className="relative left-1/2 right-1/2 -mx-[50vw] hidden aspect-[1600/860] w-screen overflow-hidden border-y border-[var(--br-line)] lg:block"
      >
        {/* food props (behind emails) */}
        {FOOD.map((f) => (
          <div
            key={f.src}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${f.left}%`, top: `${f.top}%`, width: `${f.w}%`, filter: FOOD_SHADOW }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.src} alt="" aria-hidden className="block w-full max-w-none" style={{ transform: `rotate(${f.rot}deg)` }} />
          </div>
        ))}
        {/* emails */}
        {SCATTER.map((e, i) => {
          const a = reduce ? null : axis[e.row]
          return (
            <div
              key={e.src + i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${e.cx}%`, top: `${e.cy}%`, width: `${e.w}%` }}
            >
              <motion.div className="w-full" style={{ x: a?.x, y: a?.y }}>
                <div style={{ filter: EMAIL_SHADOW }}>
                  <div
                    className="overflow-hidden rounded-[14px] border border-black/10 bg-white"
                    style={{ aspectRatio: EMAIL_AR, transform: `rotate(${TILT_DEG}deg)`, transformOrigin: 'center center' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={e.src} alt="Wingstop CRM campaign email" loading="lazy" className="block w-full object-cover object-top" />
                  </div>
                </div>
              </motion.div>
            </div>
          )
        })}

        {/* heading plate — bordered, aligned to the editorial column (Panda style) */}
        <div
          className="absolute top-[8%] z-30 max-w-[420px] rounded-[10px] border border-[var(--br-line)] bg-white/95 p-6 shadow-[var(--br-card-shadow)] backdrop-blur-sm lg:p-7"
          style={{ left: 'calc(max(1.5rem, (100vw - 1443px) / 2 + 5rem))' }}
        >
          <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ws-green)]">
            {defaults.scope.eyebrow}
          </span>
          <h3 className="mt-2 text-[26px] font-semibold leading-tight text-[var(--br-ink)] sm:text-[30px]">
            {defaults.scope.title}
          </h3>
        </div>
      </div>

      {/* ── MOBILE (<1024px): calmer 3-email fan ──────────────────────────── */}
      <div className="relative mx-auto w-full max-w-[520px] px-5 pb-14 pt-2 lg:hidden">
        {/* Heading rides in a white card ABOVE the tilted emails (z-30) so the
            text stays readable over the screens (mirrors the desktop plate). */}
        <div className="relative z-30 rounded-[12px] border border-[var(--br-line)] bg-white/95 p-5 shadow-[var(--br-card-shadow)] backdrop-blur-sm">
          <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ws-green)]">
            {defaults.scope.eyebrow}
          </span>
          <h3 className="mt-2 text-[26px] font-semibold leading-tight text-[var(--br-ink)]">{defaults.scope.title}</h3>
        </div>
        {/* Stage clips the tall tilted emails so they tuck behind the heading
            card and don't bleed into the next module. Pulled up under the card. */}
        <div className="relative -mt-6 aspect-[360/440] w-full overflow-hidden">
          <div className="pointer-events-none absolute -left-[8%] bottom-[2%] z-0 w-[38%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={defaults.scope.food[0]} alt="" aria-hidden className="block w-full max-w-none" />
          </div>
          {[
            { src: defaults.scope.emails[2], l: 50, t: 50, w: 50, z: 10 },
            { src: defaults.scope.emails[1], l: 72, t: 64, w: 50, z: 20 },
            { src: defaults.scope.emails[0], l: 30, t: 66, w: 52, z: 20 },
          ].map((e, i) => (
            <div key={i} className="absolute" style={{ left: `${e.l}%`, top: `${e.t}%`, width: `${e.w}%`, zIndex: e.z, transform: 'translate(-50%,-50%)' }}>
              <div style={{ filter: EMAIL_SHADOW }}>
                <div className="overflow-hidden rounded-[12px] border border-black/10 bg-white" style={{ aspectRatio: EMAIL_AR, transform: `rotate(${TILT_DEG}deg)` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={e.src} alt="Wingstop CRM campaign email" loading="lazy" className="block w-full object-cover object-top" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Module 2: animated CRM — Panda-style bento (desktop) + draggable (mobile) */

function CrmAnimatedGrid() {
  return (
    <div className="br-container pb-20 pt-10 md:pb-[120px] md:pt-16">
      <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ws-green)]">
        {defaults.animated.eyebrow}
      </span>
      <h3 className="mt-2 text-2xl font-semibold text-[var(--br-ink)] sm:text-[28px]">{defaults.animated.title}</h3>
      <p className="mt-2 max-w-[60ch] text-[15px] text-[var(--br-muted)] sm:text-base">{defaults.animated.body}</p>

      {/* Desktop: Panda-style bento grid (varied tile spans) including the gifs.
          4 gifs → tile0 is the 2×2 anchor, the other three fill the right column
          + bottom-right span (a 4-col × 2-row bento). The gif is CONTAINED inside
          each card (padded, object-contain) so the whole animation reads — it
          doesn't fill / crop the card — and the label sits in its own strip. */}
      <div className="mt-7 hidden gap-4 lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:aspect-[1443/620]">
        {defaults.animated.gifs.map((g, i) => {
          const span = i === 0 ? 'lg:col-span-2 lg:row-span-2' : i === 3 ? 'lg:col-span-2' : ''
          // Light-grey stroke so white cards read as distinct cards against the
          // white page; black cards take a faint matching edge for consistency.
          const isWhite = g.bg.toLowerCase() === '#ffffff'
          return (
            <figure
              key={g.src}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border ${span}`}
              style={{ backgroundColor: g.bg, borderColor: isWhite ? '#e2e3e5' : 'rgba(255,255,255,0.10)' }}
            >
              <div className="flex min-h-0 flex-1 items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.src}
                  alt={g.label}
                  loading="eager"
                  className="max-h-full max-w-full rounded-lg object-contain"
                />
              </div>
            </figure>
          )
        })}
      </div>

      {/* Mobile: draggable carousel with label pills below */}
      <div className="mt-6 lg:hidden">
        <DragGrid items={defaults.animated.gifs} tone="light" aspect="aspect-[4/3]" fit="contain" />
        <div className="br-noscrollbar mt-4 flex gap-2 overflow-x-auto" style={{ touchAction: 'pan-x pan-y' }}>
          {defaults.animated.gifs.map((g) => (
            <span
              key={g.src}
              className="shrink-0 whitespace-nowrap rounded-full border border-[var(--br-line)] px-3 py-1.5 text-xs text-[var(--br-muted)]"
            >
              {g.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
