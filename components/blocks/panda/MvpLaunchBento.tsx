'use client'

import { useEffect, useRef, useState } from 'react'
import { mvpLaunch as defaults, type MvpBentoStat } from './data'

/**
 * MvpLaunchBento — closing module of the MVP Fast-Launch (#mvp) section.
 *
 * An asymmetric mixed-media bento that lands the section's two claims: the
 * launch was FAST + SUCCESSFUL, and it shipped CROSS-PLATFORM (one ordering
 * flow across web + iOS + Android). Sits at the very end of the red #mvp
 * field, so — like the Component Libraries panel above it — it renders as a
 * bare block: WHITE cards (plus one dark "flagship" cell) on the parent's red.
 *
 * Distinct from the Outcomes stat grid (section 5): that owns the lifetime
 * business numbers; this speaks only to the launch. The two count-up cells
 * reuse the OutcomesSection mechanic (one-shot IntersectionObserver + rAF
 * ease-out-expo, reduced-motion snap).
 *
 * Layout (desktop ≥lg): a 12-col grid —
 *   ┌───────────────┬───────────────────────────┐
 *   │               │  ONE EXPERIENCE (platform) │
 *   │  FLAGSHIP      ├─────────────┬─────────────┤
 *   │  (dark, tall)  │  ~6 mo      │  1,900+     │
 *   ├───────────────┴─────────────┴─────────────┤
 *   │  OPERATING MODEL (web-first MVP)           │
 *   └────────────────────────────────────────────┘
 * Below lg it stacks to a single column in the same reading order.
 *
 * Device art in the platform cell is FPO/drop-in: swap `platform.screens`
 * (or the props) for final mockups. The frames are built to flatter art.
 */

const RED = 'var(--px-red)'

/* ── shared count-up plumbing (mirrors OutcomesSection) ──────────────────── */
function useInViewOnce<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, inView }
}

function formatValue(v: number, decimals: number) {
  return decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-US')
}

/* A compact count-up stat cell — white card on the red field. */
function StatCell({ stat, index }: { stat: MvpBentoStat; index: number }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const decimals = stat.decimals ?? 0
  const [display, setDisplay] = useState(0)
  const started = useRef(false)
  const delay = index * 110
  const duration = 1600

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(stat.value)
      return
    }
    let raf = 0
    const t0 = performance.now() + delay
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0) / duration))
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setDisplay(stat.value * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, stat.value, delay])

  return (
    <div
      ref={ref}
      className="flex h-full flex-col justify-between rounded-[10px] bg-white p-6 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.28)] md:p-7"
    >
      <p className="br-data text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-[var(--px-red)]">
        {stat.eyebrow}
      </p>
      <p
        className="mt-7 whitespace-nowrap text-[44px] font-medium leading-none tracking-[-0.01em] text-[var(--br-ink)] md:mt-10 md:text-[52px]"
        style={{ fontFamily: 'var(--br-font-heading)' }}
      >
        {stat.prefix}
        {formatValue(display, decimals)}
        {stat.suffix ? <span className="text-[var(--px-red)]">{stat.suffix}</span> : null}
      </p>
      <p className="mt-3 max-w-[30ch] text-[14px] leading-snug text-[var(--br-muted)] md:text-[15px]">
        {stat.caption}
      </p>
    </div>
  )
}

/* ── device cluster for the cross-platform cell (FPO / drop-in) ──────────────
 * A wide "web" frame with two phones overlapping its lower-right — the visual
 * shorthand for "one flow, every surface." The two phones use the real MVP
 * screens (portrait, shown at their true aspect). The web frame is an explicit
 * FPO slot: Joshua can drop a desktop/web capture into `webSrc`; until then it
 * renders a labeled placeholder rather than a cropped phone screen (the only
 * art on hand is portrait, which would distort in a landscape frame).
 * Rounded clip, hairline frame, soft drop shadow. No motion (rasterizes art). */
function DeviceCluster({ phones, webSrc }: { phones: string[]; webSrc?: string }) {
  const [phoneA, phoneB] = phones
  return (
    <div className="relative mt-6 h-[160px] w-full md:h-[180px]" aria-hidden>
      {/* web / browser frame — FPO drop-in slot */}
      <div className="absolute left-0 top-0 w-[70%] overflow-hidden rounded-[8px] bg-white shadow-[0_14px_30px_-14px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
        <div className="flex h-[18px] items-center gap-1.5 border-b border-black/5 bg-[var(--br-bg-2)] px-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-black/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-black/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-black/15" />
        </div>
        {webSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={webSrc} alt="" className="block h-[122px] w-full object-cover object-top md:h-[140px]" />
        ) : (
          <div className="grid h-[122px] w-full place-items-center bg-[var(--br-bg-2)] md:h-[140px]">
            <span className="br-data text-[11px] uppercase tracking-[0.14em] text-[var(--br-muted-2)]">
              Web · ordering site
            </span>
          </div>
        )}
      </div>
      {/* two phones, overlapping the web frame's lower-right (true portrait ratio) */}
      <div className="absolute bottom-0 right-[15%] w-[19%] overflow-hidden rounded-[10px] bg-white shadow-[0_14px_30px_-12px_rgba(0,0,0,0.4)] ring-1 ring-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={phoneA} alt="" className="block w-full" />
      </div>
      <div className="absolute -bottom-1 right-0 w-[19%] overflow-hidden rounded-[10px] bg-white shadow-[0_14px_30px_-12px_rgba(0,0,0,0.4)] ring-1 ring-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={phoneB} alt="" className="block w-full" />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * MvpLaunchBento
 * ───────────────────────────────────────────────────────────────────────── */
export function MvpLaunchBento({
  phones,
  webSrc,
  contained = false,
}: {
  /** override the two phone screens in the cross-platform cell */
  phones?: string[]
  /** drop in a web/desktop capture for the browser frame (FPO until set) */
  webSrc?: string
  /** true = bare block inside an already-red parent; false = own red band (default) */
  contained?: boolean
} = {}) {
  const d = defaults
  const devicePhones = phones ?? d.platform.phones
  const deviceWeb = webSrc ?? d.platform.webSrc

  const content = (
    <>
      {/* quiet eyebrow + heading, matching the section's editorial voice */}
      <p className="br-data text-[11px] font-semibold uppercase leading-none tracking-[0.16em] text-white/70">
        {d.kicker}
      </p>
      <h3 className="mt-3 text-[24px] font-semibold uppercase leading-tight text-white md:text-[28px]">
        {d.heading}
      </h3>

      {/* asymmetric bento. Mobile: single column. lg+: 12-col mixed grid.
          Left: tall flagship (5 cols, 2 rows). Right: platform cell (row 1)
          over two stat cells (row 2). items-stretch so cells fill their row
          height and the column edges line up. */}
      <div className="mt-8 grid grid-cols-1 gap-3 md:mt-10 md:gap-4 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:items-stretch">
        {/* FLAGSHIP — dark, tall: left 5 cols over both rows. Header pinned to
            top, title block to the bottom (justify-between). */}
        <div className="flex flex-col justify-between gap-12 rounded-[10px] bg-[var(--br-ink)] p-7 text-white shadow-[0_18px_44px_-18px_rgba(0,0,0,0.5)] md:p-8 lg:col-span-5 lg:row-span-2">
          <p className="br-data text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-white/55">
            {d.flagship.eyebrow}
          </p>
          <div>
            <h4
              className="text-[30px] font-medium leading-none tracking-[-0.01em] text-white md:text-[40px]"
              style={{ fontFamily: 'var(--br-font-heading)' }}
            >
              {d.flagship.title}
            </h4>
            <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-white/80 md:text-base">
              {d.flagship.body}
            </p>
            {/* pulled-forward proof line, set off with a red rule */}
            <p className="mt-6 border-l-2 pl-4 text-[14px] font-medium leading-snug text-white md:text-[15px]" style={{ borderColor: RED }}>
              {d.flagship.proof}
            </p>
          </div>
        </div>

        {/* ONE EXPERIENCE — cross-platform cell, right 7 cols, top row */}
        <div className="flex flex-col rounded-[10px] bg-white p-6 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.28)] md:p-7 lg:col-span-7">
          <p className="br-data text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-[var(--px-red)]">
            {d.platform.eyebrow}
          </p>
          <h4
            className="mt-3 text-[24px] font-medium leading-none tracking-[-0.01em] text-[var(--br-ink)] md:text-[30px]"
            style={{ fontFamily: 'var(--br-font-heading)' }}
          >
            {d.platform.title}
          </h4>
          <p className="mt-3 max-w-[44ch] text-[14px] leading-snug text-[var(--br-muted)] md:text-[15px]">
            {d.platform.body}
          </p>
          <DeviceCluster phones={devicePhones} webSrc={deviceWeb} />
        </div>

        {/* two count-up stat cells — right side, second row. Each spans half of
            the 7-col right block; h-full so they match the row height and bottom-
            align with the flagship card. */}
        <div className="lg:col-span-4 lg:col-start-6 lg:h-full">
          <StatCell stat={d.stats[0]} index={0} />
        </div>
        <div className="lg:col-span-3 lg:col-start-10 lg:h-full">
          <StatCell stat={d.stats[1]} index={1} />
        </div>

        {/* OPERATING MODEL — full-width closing row */}
        <div className="rounded-[10px] bg-white p-6 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.28)] md:p-8 lg:col-span-12">
          <div className="md:flex md:items-baseline md:justify-between md:gap-10">
            <div className="md:max-w-[52%]">
              <p className="br-data text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-[var(--px-red)]">
                {d.model.eyebrow}
              </p>
              <h4
                className="mt-3 text-[22px] font-medium leading-tight tracking-[-0.01em] text-[var(--br-ink)] md:text-[28px]"
                style={{ fontFamily: 'var(--br-font-heading)' }}
              >
                {d.model.title}
              </h4>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--br-muted)] md:mt-0 md:max-w-[42%] md:text-base">
              {d.model.body}
            </p>
          </div>
        </div>
      </div>

      {/* quiet sourced footnote */}
      <p className="br-data mt-6 max-w-3xl text-[11.5px] leading-relaxed text-white/55 md:mt-8">
        {d.source}
      </p>
    </>
  )

  // Contained: bare block inside an already-red parent section.
  if (contained) {
    return (
      <div data-anim="mvp-launch-bento" className="mt-14 md:mt-20">
        {content}
      </div>
    )
  }

  // Standalone (default): own full-bleed Panda-red band + container, so it can
  // be the closing section after the (white-bordered) Seamless Reordering band.
  return (
    <section
      id="mvp-launch"
      data-anim="mvp-launch-bento"
      aria-label="Fast launch, shipped everywhere"
      className="relative left-1/2 -ml-[50vw] w-screen overflow-hidden bg-[var(--px-red)] py-16 text-white md:py-24"
    >
      <div className="br-container">{content}</div>
    </section>
  )
}
