'use client'

import { Reveal } from '../../animation/Reveal'
import { StatCounters, type StatItem } from '../shared/StatCounters'

/**
 * A single capability sub-item shown in the overview's capability list
 * (Instrument-style: short label + optional one-clause description).
 */
export interface CapabilityItem {
  label: string
  note?: string
}

export interface DisciplineModuleProps {
  /** two-digit ordinal, e.g. "01" */
  num: string
  /** anchor id for the SectionNav rail */
  id: string
  /** discipline title (rail title + heading) */
  title: string
  /** one positioning sentence — the promise of the discipline */
  positioning: string
  /** the named capability sub-list */
  capabilities: CapabilityItem[]
  /** 3–4 overview stats (count-up) — mix scale / outcome / craft / reach */
  stats: StatItem[]
  /** small footnote under the stats (e.g. dated source) */
  statsNote?: string
  /** alternate the shaded background for scroll rhythm */
  shaded?: boolean
  /** the section's work modules render here */
  children?: React.ReactNode
}

/**
 * DisciplineModule — the reusable shell for each Capabilities discipline.
 *
 * Layout (research-backed: Clay / Instrument): eyebrow number → title →
 * positioning sentence + capability sub-list, then a full-width count-up stat
 * row, then the section's work modules. Numbered + alternating shaded
 * backgrounds keep a long scroll from feeling repetitive. Built on the br-*
 * editorial system with the single gold accent, matching the other case studies.
 */
export function DisciplineModule({
  num,
  id,
  title,
  positioning,
  capabilities,
  stats,
  statsNote,
  shaded = false,
  children,
}: DisciplineModuleProps) {
  return (
    <section id={id} className={shaded ? 'bg-[var(--br-bg-2)]' : 'bg-white'}>
      <div className="br-container py-16 md:py-24">
        {/* ── Overview block ───────────────────────────── */}
        {/* Number + title */}
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="br-data text-[15px] font-semibold tracking-[0.1em] text-[var(--br-gold)] md:text-[17px]">
              {num}
            </span>
            <h2 className="text-[30px] font-medium uppercase leading-none tracking-[-0.01em] text-[var(--br-ink)] md:text-[44px]">
              {title}
            </h2>
          </div>
        </Reveal>

        {/* Positioning sentence + capability list, side by side */}
        <div className="mt-6 grid grid-cols-1 gap-y-8 md:grid-cols-12 md:gap-x-[60px]">
          <div className="md:col-span-6 lg:col-span-7">
            <Reveal delay={60}>
              <p className="max-w-[44ch] text-lg leading-snug text-[var(--br-ink)] md:text-[24px] md:leading-[1.3]">
                {positioning}
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-6 lg:col-span-5">
            <Reveal delay={120}>
              <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {capabilities.map((c) => (
                  <li
                    key={c.label}
                    className="flex flex-col border-t border-[var(--br-line)] pt-3"
                  >
                    <span className="text-[15px] font-medium text-[var(--br-body)]">
                      {c.label}
                    </span>
                    {c.note && (
                      <span className="mt-0.5 text-[13px] leading-snug text-[var(--br-muted-2)]">
                        {c.note}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* Full-width count-up stat row */}
        <Reveal delay={100}>
          <div className="mt-12 border-t border-[var(--br-line)] pt-10 md:mt-14">
            <StatCounters stats={stats} />
            {statsNote && (
              <p className="br-data mt-7 text-[11px] uppercase leading-relaxed tracking-[0.08em] text-[var(--br-muted-2)]">
                {statsNote}
              </p>
            )}
          </div>
        </Reveal>

        {/* ── Work modules ─────────────────────────────── */}
        {children && <div className="mt-12 md:mt-16">{children}</div>}
      </div>
    </section>
  )
}
