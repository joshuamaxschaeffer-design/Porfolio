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
      <div className="br-container pt-16 md:pt-24">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">3. {defaults.eyebrow}</p>
        <h2 className="mt-3 max-w-[24ch] text-[32px] font-medium leading-[1.05] text-[var(--br-ink)] md:text-[40px]">
          {defaults.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">{defaults.intro}</p>
      </div>

      <CrmEmailScatter />
      <CrmAnimatedGrid />
    </section>
  )
}

/* ── Module 1: angled / staggered email scatter (Panda MvpScatter model) ────── */

const TILT_DEG = 15.43
const TRAVEL = 80
const RAD = (TILT_DEG * Math.PI) / 180
const AXIS_X = Math.sin(RAD)
const AXIS_Y = -Math.cos(RAD)
/** Each email window is this aspect (portrait), showing the campaign's top. */
const EMAIL_AR = '320 / 460'
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
 *  positions as % of the band; rows 1&3 drift up the tilt axis, 2&4 down it. */
const SCATTER: EmailNode[] = [
  { src: defaults.scope.emails[4], cx: 80.5, cy: -2, w: 19, row: 2 },
  { src: defaults.scope.emails[0], cx: 20, cy: 40, w: 19.5, row: 1 },
  { src: defaults.scope.emails[1], cx: 38.5, cy: 70, w: 19.5, row: 2 },
  { src: defaults.scope.emails[2], cx: 60.5, cy: 62, w: 19.5, row: 3 },
  { src: defaults.scope.emails[3], cx: 80, cy: 96, w: 19, row: 4 },
]
/** Top-down food props framing the scatter (left/top/width as % of band). */
const FOOD = [
  { src: defaults.scope.food[0], left: 4, top: 8, w: 12, rot: -10 },
  { src: defaults.scope.food[1], left: 86, top: 50, w: 13, rot: 8 },
  { src: defaults.scope.food[2], left: 49, top: 90, w: 9, rot: -6 },
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
  const axis = {
    1: { x: upX, y: upY },
    2: { x: downX, y: downY },
    3: { x: upX, y: upY },
    4: { x: downX, y: downY },
  } as const

  return (
    <div aria-label="Campaign after campaign">
      {/* heading plate */}
      <div className="br-container mt-10 md:mt-14">
        <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ws-green)]">
          {defaults.scope.eyebrow}
        </span>
        <h3 className="mt-2 text-[26px] font-semibold text-[var(--br-ink)] sm:text-[32px]">{defaults.scope.title}</h3>
      </div>

      {/* ── DESKTOP / TABLET (≥1024px): the Panda-style scatter band ───────── */}
      <div ref={stageRef} className="relative mx-auto mt-4 hidden aspect-[1443/720] w-full max-w-[1500px] lg:block">
        {/* food props (behind emails) */}
        {FOOD.map((f) => (
          <div
            key={f.src}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 opacity-95"
            style={{ left: `${f.left}%`, top: `${f.top}%`, width: `${f.w}%`, filter: 'drop-shadow(0 16px 26px rgba(0,0,0,0.16))' }}
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
      </div>

      {/* ── MOBILE (<1024px): calmer 3-email fan ──────────────────────────── */}
      <div className="relative mx-auto mt-6 w-full max-w-[520px] px-5 pb-14 lg:hidden">
        <div className="relative aspect-[360/440] w-full">
          <div className="pointer-events-none absolute -left-[8%] bottom-[2%] z-0 w-[38%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={defaults.scope.food[0]} alt="" aria-hidden className="block w-full max-w-none" />
          </div>
          {[
            { src: defaults.scope.emails[2], l: 50, t: 44, w: 50, z: 10 },
            { src: defaults.scope.emails[1], l: 70, t: 60, w: 50, z: 20 },
            { src: defaults.scope.emails[0], l: 32, t: 62, w: 52, z: 20 },
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
          + bottom-right span (a 4-col × 2-row bento). */}
      <div className="mt-7 hidden gap-4 lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:aspect-[1443/620]">
        {defaults.animated.gifs.map((g, i) => {
          const span = i === 0 ? 'lg:col-span-2 lg:row-span-2' : i === 3 ? 'lg:col-span-2' : ''
          return (
            <figure
              key={g.src}
              className={`group relative overflow-hidden rounded-2xl border border-[var(--br-line)] bg-[var(--br-bg-2)] [box-shadow:var(--br-card-shadow)] ${span}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.src} alt={g.label} loading="lazy" className="h-full w-full object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
                {g.label}
              </figcaption>
            </figure>
          )
        })}
      </div>

      {/* Mobile: draggable carousel with label pills below */}
      <div className="mt-6 lg:hidden">
        <DragGrid items={defaults.animated.gifs} tone="light" />
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
