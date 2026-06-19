'use client'

import { craft as defaults } from './data'

/**
 * Section 6 — RANGE OF CRAFT. BLACK band (leads with the sleek dark-mode work).
 * Three beats: Dark Mode phone row, In-Store boards, and the modular CRM email
 * wall (native scroll-snap rail). Shows the breadth Joshua led + art-directed.
 */
export function CraftSection({ intro }: { intro?: string } = {}) {
  const { darkMode, inStore, crm } = defaults
  return (
    <section
      id="craft"
      className="ws-dark relative overflow-hidden bg-[#0c0d0d]"
      style={
        {
          '--br-ink': '#f6f7f8',
          '--br-body': '#d4d7dd',
          '--br-muted': '#9aa0aa',
          '--br-muted-2': '#7c828d',
          '--br-line': 'rgba(255,255,255,0.14)',
          '--ws-green': '#23c265',
        } as React.CSSProperties
      }
    >
      <div className="br-container pt-16 pb-20 md:pt-24 md:pb-[120px]">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">
          {defaults.eyebrow}
        </p>
        <h2 className="mt-3 text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          6. {defaults.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">
          {intro ?? defaults.intro}
        </p>

        {/* Dark Mode — phone row */}
        <div className="mt-14 md:mt-20">
          <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">
            {darkMode.eyebrow}
          </p>
          <h3 className="mt-3 text-[24px] font-semibold leading-tight text-[var(--br-ink)] md:text-[28px]">
            {darkMode.title}
          </h3>
          <p className="mt-3 max-w-[60ch] text-[15px] leading-normal text-[var(--br-muted)] md:text-base">
            {darkMode.body}
          </p>
          <div className="-mx-6 mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:-mx-20 md:px-20 [scrollbar-width:thin]">
            {darkMode.screens.map((s) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={s.src}
                src={s.src}
                alt={s.alt}
                loading="lazy"
                className="w-[210px] shrink-0 snap-start rounded-[18px] border border-white/10 [box-shadow:0_18px_40px_rgba(0,0,0,0.5)] sm:w-[240px]"
              />
            ))}
          </div>
        </div>

        {/* In-Store boards */}
        <div className="mt-14 md:mt-20">
          <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">
            {inStore.eyebrow}
          </p>
          <h3 className="mt-3 text-[24px] font-semibold leading-tight text-[var(--br-ink)] md:text-[28px]">
            {inStore.title}
          </h3>
          <p className="mt-3 max-w-[60ch] text-[15px] leading-normal text-[var(--br-muted)] md:text-base">
            {inStore.body}
          </p>
          <div className="mt-7 grid grid-cols-2 gap-4 md:gap-6">
            {inStore.boards.map((b) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={b.src}
                src={b.src}
                alt={b.alt}
                loading="lazy"
                className="w-full rounded-[14px] border border-white/10 [box-shadow:0_18px_40px_rgba(0,0,0,0.5)]"
              />
            ))}
          </div>
        </div>

        {/* CRM — modular email wall */}
        <div className="mt-14 md:mt-20">
          <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">
            {crm.eyebrow}
          </p>
          <h3 className="mt-3 text-[24px] font-semibold leading-tight text-[var(--br-ink)] md:text-[28px]">
            {crm.title}
          </h3>
          <p className="mt-3 max-w-[60ch] text-[15px] leading-normal text-[var(--br-muted)] md:text-base">
            {crm.body}
          </p>
          <div className="-mx-6 mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:-mx-20 md:px-20 [scrollbar-width:thin]">
            {crm.emails.map((e) => (
              <div
                key={e.src}
                className="h-[420px] w-[230px] shrink-0 snap-start overflow-hidden rounded-[14px] border border-white/10 bg-white/[0.03] [box-shadow:0_18px_40px_rgba(0,0,0,0.45)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.src} alt={e.alt} loading="lazy" className="block w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
