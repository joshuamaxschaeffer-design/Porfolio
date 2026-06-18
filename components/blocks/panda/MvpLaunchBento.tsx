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

/* Shared white-card shell: hairline stroke + soft shadow, relative + clipped so
 * the corner glow can bleed to the rounded edge. (matches the original Baserate
 * bento mockup's faint corner gradients — recoloured red here.) */
const CARD =
  'relative overflow-hidden rounded-[10px] border border-[var(--br-line)] bg-white shadow-[0_10px_24px_-14px_rgba(7,14,44,0.20)]'

/* Faint red glow tucked into a card's top-right corner. Same technique as the
 * shared BentoGrid mockup: a solid-colour circle at low opacity, softened with
 * a large blur (blur-2xl) so it reads as a big, soft gradient — not a hard dot. */
function CornerGlow() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-[0.12] blur-2xl"
      style={{ background: RED }}
    />
  )
}

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
      className={`flex h-full flex-col justify-between ${CARD} p-6 md:p-7`}
    >
      <CornerGlow />
      <div className="relative flex items-center gap-2.5">
        {stat.icon ? (
          <span
            aria-hidden
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--px-red)]/10 text-[var(--px-red)] [&_svg]:h-[18px] [&_svg]:w-[18px] [&_svg_path]:fill-current"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: stat.icon }}
          />
        ) : null}
        <p className="br-data text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-[var(--px-red)]">
          {stat.eyebrow}
        </p>
      </div>
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

/* ── App Store gallery strip ─────────────────────────────────────────────────
 * The actual App Store listing screenshots, laid out as a horizontal gallery
 * the way they appear on the store product page. Each screen is a real 6.5"
 * App Store capture (portrait, 9:19.5) on a soft-shadowed rounded card. The
 * row scrolls horizontally if it overflows the cell, so every screen stays
 * reachable at any width; a right-edge fade hints there's more to swipe. No
 * device bezel is drawn — the captures already include the marketing frame. */
function AppStoreGallery({ screens, alts }: { screens: string[]; alts?: string[] }) {
  return (
    <div className="relative mt-6">
      <ul
        className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 pt-1 [scrollbar-width:none] md:gap-4 [&::-webkit-scrollbar]:hidden"
        aria-label="Panda Express App Store screenshots"
      >
        {screens.map((src, i) => (
          <li
            key={src}
            className="w-[110px] shrink-0 snap-start overflow-hidden rounded-[12px] bg-white shadow-[0_12px_28px_-14px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.06] md:w-[124px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alts?.[i] ?? ''}
              width={1240}
              height={2684}
              loading="lazy"
              className="block w-full"
            />
          </li>
        ))}
      </ul>
      {/* right-edge fade — signals the strip continues (matches the white card) */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent"
        aria-hidden
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * MvpLaunchBento
 * ───────────────────────────────────────────────────────────────────────── */
export function MvpLaunchBento({
  screens,
  contained = false,
}: {
  /** override the App Store screenshots shown in the release cell */
  screens?: string[]
  /** true = bare block inside an already-red parent; false = own red band (default) */
  contained?: boolean
} = {}) {
  const d = defaults
  const appStoreScreens = screens ?? d.platform.screens

  const content = (
    <>
      {/* quiet eyebrow + heading, matching the section's editorial voice */}
      <p className="br-data text-[11px] font-semibold uppercase leading-none tracking-[0.16em] text-[var(--px-red)]">
        {d.kicker}
      </p>
      <h3 className="mt-3 text-[24px] font-semibold uppercase leading-tight text-[var(--br-ink)] md:text-[28px]">
        {d.heading}
      </h3>

      {/* asymmetric bento. Mobile: single column. lg+: 12-col mixed grid.
          Left: tall flagship (5 cols, 2 rows). Right: platform cell (row 1)
          over two stat cells (row 2). items-stretch so cells fill their row
          height and the column edges line up. */}
      <div className="mt-8 grid grid-cols-1 gap-3 md:mt-10 md:gap-4 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:items-stretch">
        {/* FLAGSHIP — tall: left 5 cols over both rows. The cross-platform
            device composition (phone app + web checkout on the Panda-red field)
            is the cell BACKGROUND, filling the whole cell via object-cover. The
            "Panda Delivers" copy overlays at the BOTTOM, over the red — a soft
            dark scrim along the bottom keeps it legible. The phone-app +
            web-checkout pairing is the section's whole point. */}
        <div className="relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[10px] bg-[var(--px-red)] text-white shadow-[0_18px_44px_-18px_rgba(0,0,0,0.5)] lg:min-h-0 lg:col-span-5 lg:row-span-2">
          {/* background composition */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={d.flagship.image}
            alt="Panda Express ordering on the phone app and the web checkout — one experience across surfaces"
            width={1600}
            height={1959}
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-top"
          />
          {/* bottom scrim so the copy reads over the red field */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-[rgba(120,12,14,0.92)] via-[rgba(150,18,20,0.55)] to-transparent"
          />
          {/* copy — overlaid at the bottom, over the red */}
          <div className="p-7 md:p-8">
            <p className="br-data text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-white/70">
              {d.flagship.eyebrow}
            </p>
            <h4
              className="mt-4 text-[30px] font-medium leading-none tracking-[-0.01em] text-white md:text-[40px]"
              style={{ fontFamily: 'var(--br-font-heading)' }}
            >
              {d.flagship.title}
            </h4>
            <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-white/90 md:text-base">
              {d.flagship.body}
            </p>
            {/* one-experience proof line, set off with a white rule */}
            <p className="mt-6 border-l-2 border-white/70 pl-4 text-[14px] font-medium leading-snug text-white md:text-[15px]">
              {d.flagship.proof}
            </p>
          </div>
        </div>

        {/* THE RELEASE — App Store gallery cell, right 7 cols, top row */}
        <div className={`flex flex-col ${CARD} p-6 md:p-7 lg:col-span-7`}>
          <CornerGlow />
          <p className="br-data relative text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-[var(--px-red)]">
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
          <AppStoreGallery screens={appStoreScreens} alts={d.platform.alts} />
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
        <div className={`${CARD} p-6 md:p-8 lg:col-span-12`}>
          <CornerGlow />
          <div className="relative md:flex md:items-baseline md:justify-between md:gap-10">
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
      <p className="br-data mt-6 max-w-3xl text-[11.5px] leading-relaxed text-[var(--br-muted-2)] md:mt-8">
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
      className="relative left-1/2 -ml-[50vw] w-screen overflow-hidden bg-white py-16 text-[var(--br-body)] md:py-24"
    >
      <div className="br-container">{content}</div>
    </section>
  )
}
