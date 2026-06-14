'use client'

import { ImageCompareSlider } from './ImageCompareSlider'
import { StatCounters } from './StatCounters'
import { HoverIndexList } from './HoverIndexList'
import { MarqueeStrip } from './MarqueeStrip'
import { TiltCard } from './TiltCard'

/**
 * CaseStudyShowcase — a COMPACT, case-study-relevant subset of the component
 * library, dropped at the bottom of each case study so Joshua can review the
 * pieces most useful to a shipped-product story (before/after, outcome counters,
 * an other-work index, a capability ticker). Per-brand `accent`.
 *
 * Scratch — filler content, meant to be cherry-picked / culled.
 */

const OTHER_WORK = [
  { title: 'Baserate', meta: 'Fintech · 2023', href: '/work/baserate' },
  { title: 'Panda Express', meta: 'Mobile · 2020', href: '/work/panda-express' },
  { title: 'Wingstop', meta: 'Mobile · 2019', href: '/work/wingstop' },
  { title: 'Samsung', meta: 'Galaxy · 2013–17', href: '/work/samsung' },
]

export function CaseStudyShowcase({
  accent = 'var(--br-gold)',
  /** slug of the current case study, to drop it from the "other work" list */
  current,
}: {
  accent?: string
  current?: string
}) {
  const others = current ? OTHER_WORK.filter((w) => !w.href.includes(current)) : OTHER_WORK

  return (
    <div className="bg-white">
      {/* header */}
      <section className="br-container border-t-[3px] pt-20 pb-2 md:pt-28" style={{ borderColor: accent }}>
        <p className="br-data text-[12px] font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>
          Component Preview
        </p>
        <h2 className="mt-5 max-w-3xl text-[30px] font-medium leading-[1.06] tracking-[-0.02em] text-[var(--br-ink)] md:text-[48px]">
          Reusable blocks for this story.
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] text-[var(--br-muted)] md:text-lg">
          Scratch preview — filler content. The full library lives on the Capabilities page.
        </p>
      </section>

      {/* capability ticker */}
      <section className="br-container py-12 md:py-16">
        <p className="br-data mb-6 text-[11px] uppercase tracking-[0.18em] text-[var(--br-muted-2)]">◆ MarqueeStrip</p>
        <MarqueeStrip
          items={['Product Design', 'Brand Systems', 'Design Engineering', 'Motion', 'Prototyping', 'Art Direction']}
          className="text-[24px] font-medium uppercase tracking-[-0.01em] text-[var(--br-ink)] md:text-[38px]"
        />
      </section>

      {/* before / after */}
      <section className="br-container border-t border-[var(--br-line)] py-14 md:py-20">
        <p className="br-data mb-8 text-[11px] uppercase tracking-[0.18em] text-[var(--br-muted-2)]">◆ ImageCompareSlider (before / after)</p>
        <ImageCompareSlider
          ratio="16 / 9"
          beforeLabel="Before"
          afterLabel="After"
          before={<div className="flex h-full w-full items-center justify-center bg-[var(--br-grey-card)]"><span className="br-data text-[13px] uppercase tracking-[0.14em] text-[var(--br-muted-2)]">Legacy experience</span></div>}
          after={<div className="flex h-full w-full items-center justify-center" style={{ background: `linear-gradient(135deg, ${accent} 0%, #070e2c 130%)` }}><span className="br-data text-[13px] uppercase tracking-[0.14em] text-white/85">Redesign</span></div>}
        />
      </section>

      {/* outcome counters */}
      <section className="br-container border-t border-[var(--br-line)] py-14 md:py-20">
        <p className="br-data mb-8 text-[11px] uppercase tracking-[0.18em] text-[var(--br-muted-2)]">◆ StatCounters</p>
        <StatCounters
          stats={[
            { value: 4.9, decimals: 1, suffix: '★', label: 'App store rating', accent },
            { value: 70, suffix: '%', label: 'Digital share of sales', accent },
            { value: 16, suffix: 'M+', label: 'Rewards members', accent },
            { value: 31.9, decimals: 1, suffix: '%', label: 'Same-store sales lift', accent },
          ]}
        />
      </section>

      {/* tilt cards */}
      <section className="br-container border-t border-[var(--br-line)] py-14 md:py-20">
        <p className="br-data mb-8 text-[11px] uppercase tracking-[0.18em] text-[var(--br-muted-2)]">◆ TiltCard</p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {['Discovery', 'Design', 'Ship'].map((t, i) => (
            <TiltCard key={t} className="h-[200px]">
              <div className="flex h-full w-full flex-col justify-end overflow-hidden rounded-[var(--br-card-radius)] p-6 text-white" style={{ background: `linear-gradient(140deg, ${accent} 0%, #070e2c 130%)` }}>
                <p className="br-data text-[12px] uppercase tracking-[0.14em] text-white/70">Phase 0{i + 1}</p>
                <p className="mt-1 text-[24px] font-medium tracking-[-0.01em]">{t}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* other work index */}
      <section className="br-container border-t border-[var(--br-line)] py-14 md:py-20">
        <p className="br-data mb-8 text-[11px] uppercase tracking-[0.18em] text-[var(--br-muted-2)]">◆ HoverIndexList — more work</p>
        <HoverIndexList rows={others.map((w) => ({ ...w, accent }))} />
      </section>
    </div>
  )
}
