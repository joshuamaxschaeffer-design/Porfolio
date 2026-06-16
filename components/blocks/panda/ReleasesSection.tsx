import { releases as defaults } from './data'

const P = '/panda/pivot'

/**
 * Section 3 — "2020 Pivot". Two cards: the MVP Fast-Launch (web-first) and the
 * Full Rewards App (native). Every visual element is placed individually with a
 * stable `data-anim` hook and its own absolutely-positioned node, so each piece
 * (phones, shadows, badge, radial, screenshot) can be animated independently
 * later. The rewards card's front-phone cast shadow is CLIPPED to the back
 * phone (Phone 1 shadow masked to Phone 2's rounded-rect footprint).
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

        <div data-anim="pivot-phases-label" className="mt-10">
          <p className="text-base font-semibold uppercase tracking-[0.02em] text-[var(--br-ink)] md:text-lg">
            {defaults.phasesLabel}
          </p>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--br-muted-2)] md:text-[15px]">
            {defaults.phasesIntro}
          </p>
        </div>

        {/* ── Two cards ──────────────────────────────────────────── */}
        <div className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-8">
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
 * FULL REWARDS APP card — Panda-red field. A floating Panda badge overlaps the
 * top edge, then heading + body, then a phone "stage": a radial burst behind
 * two overlapping phones, each device + each cast shadow placed as its own
 * absolutely-positioned node (percentages of the stage, so it scales). The
 * front phone's cast shadow (phone1-shadow) is CLIPPED to the back phone
 * (phone2) via a rounded-rect overflow window matching phone2's footprint.
 * All nodes carry `data-anim` hooks for later animation.
 * ───────────────────────────────────────────────────────────────────────── */
function RewardsCard() {
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
          Exact 1:1 from the Figma "Group 3877" (715.26 × 611.50). Positions,
          sizes, ROTATIONS and OPACITY all pulled from the Figma node:
          - back shadows: their art is rotated inside an axis-aligned box
            (−26.51° / 22.41°) and sit at OPACITY 0.30 (this is why they read as
            soft drops, not black boxes);
          - phone1's cast shadow ("Mask group") is the pre-shaped shadow that
            falls onto phone 2, placed at its exact Figma rect;
          - radial is the masked donut (radial-masked.svg) so the centre stays
            clear behind the phones.
          Phones are flat layers (tilt baked into the PNG — no CSS rotation). */}
      <div data-anim="rewards-stage" className="relative mx-auto mt-6 aspect-[715.26/611.5] w-full max-w-[680px]">
        {/* radial burst (masked to a ring), centered behind the phones */}
        <img
          data-anim="rewards-radial"
          src={`${P}/radial-masked.svg`}
          alt=""
          aria-hidden
          className="pointer-events-none absolute z-0 max-w-none"
          style={{ left: '6.96%', top: '1.96%', width: '90.88%' }}
        />

        {/* BACK phone's drop shadow (Phone 2 Back Shadow) — rot 22.41°, op .30 */}
        <div
          data-anim="rewards-phone2-back-shadow"
          className="pointer-events-none absolute z-[5] flex items-center justify-center"
          style={{ left: '34.40%', top: '14.58%', width: '65.60%', height: '85.42%' }}
        >
          <div className="opacity-30" style={{ width: '70.50%', height: '82.06%', transform: 'rotate(22.41deg)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${P}/phone2-back-shadow.webp`} alt="" aria-hidden className="h-full w-full max-w-none object-cover" />
          </div>
        </div>
        {/* FRONT phone's back/ambient shadow (Phone 1 back shadow) — rot −26.51°, op .30 */}
        <div
          data-anim="rewards-phone1-back-shadow"
          className="pointer-events-none absolute z-[5] flex items-center justify-center"
          style={{ left: '0%', top: '0%', width: '68.72%', height: '86.28%' }}
        >
          <div className="opacity-30" style={{ width: '69.11%', height: '79.63%', transform: 'rotate(-26.51deg)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${P}/phone1-back-shadow.webp`} alt="" aria-hidden className="h-full w-full max-w-none object-cover" />
          </div>
        </div>

        {/* BACK phone (Phone 2) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-anim="rewards-phone2"
          src={`${P}/phone2.webp`}
          alt="Panda Rewards — upgrade to premium entrée screen"
          className="absolute z-10 max-w-none"
          style={{ left: '40.60%', top: '16.52%', width: '45.81%', height: '60.47%' }}
        />

        {/* CLIPPED shadow ("Mask group"): Phone 1's cast shadow falling onto
            Phone 2 — the shadow asset is already shaped to Phone 2, placed at the
            exact Figma rect (left 145.59 / top 416.05 in stage space). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-anim="rewards-phone1-shadow"
          src={`${P}/phone1-shadow.webp`}
          alt=""
          aria-hidden
          className="pointer-events-none absolute z-[15] max-w-none"
          style={{ left: '25.14%', top: '38.60%', width: '35.99%', height: '37.96%' }}
        />

        {/* FRONT phone (Phone 1) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-anim="rewards-phone1"
          src={`${P}/phone1.webp`}
          alt="Panda Rewards — 520 Panda Points home screen"
          className="absolute z-20 max-w-none"
          style={{ left: '15.30%', top: '6.10%', width: '45.81%', height: '60.47%' }}
        />
      </div>
      </div>
    </div>
  )
}
