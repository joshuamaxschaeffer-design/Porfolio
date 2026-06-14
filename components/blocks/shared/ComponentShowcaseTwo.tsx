'use client'

import { TiltCard } from './TiltCard'
import { ImageCompareSlider } from './ImageCompareSlider'
import { Accordion } from './Accordion'
import { DragGallery } from './DragGallery'
import { SpotlightGrid } from './SpotlightGrid'
import { ScrambleText } from './ScrambleText'
import { HorizontalScroll } from './HorizontalScroll'
import { InfiniteLogoLoop } from './InfiniteLogoLoop'

/**
 * ComponentShowcaseTwo — wave-2 scratch gallery. Same labelled-band format as
 * ComponentShowcase; filler content; meant to be cherry-picked / culled.
 */

function Band({ name, children, tight }: { name: string; children: React.ReactNode; tight?: boolean }) {
  return (
    <section className={`br-container border-t border-[var(--br-line)] ${tight ? 'py-14 md:py-20' : 'py-16 md:py-28'}`}>
      <p className="br-data mb-8 text-[11px] uppercase tracking-[0.18em] text-[var(--br-muted-2)] md:mb-12">
        ◆ Component — {name}
      </p>
      {children}
    </section>
  )
}

const GOLD = 'var(--br-gold)'
const BLUE = '#1428A0'
const GREEN = '#00843D'
const RED = '#D02B2E'

export function ComponentShowcaseTwo() {
  return (
    <div className="bg-white">
      <section className="br-container border-t-[3px] border-[var(--br-ink)] pt-20 pb-4 md:pt-28">
        <p className="br-data text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--br-gold)]">
          Component Library — Wave 2
        </p>
        <h2 className="mt-5 max-w-4xl text-[34px] font-medium leading-[1.05] tracking-[-0.02em] text-[var(--br-ink)] md:text-[56px]">
          Interactive &amp; tactile blocks.
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-[var(--br-muted)] md:text-xl">
          Pointer-driven and scroll-driven pieces. Same deal — filler content, keep the winners.
        </p>
      </section>

      {/* InfiniteLogoLoop */}
      <Band name="InfiniteLogoLoop (seamless CSS loop)" tight>
        <InfiniteLogoLoop items={['Samsung', 'Panda Express', 'Wingstop', 'Mindbody', 'Journalytic', 'Baserate', "Raising Cane’s", 'CBTL']} />
      </Band>

      {/* ScrambleText */}
      <Band name="ScrambleText (decode-on-view)">
        <ScrambleText
          as="h3"
          text="STRATEGY / BRAND / PRODUCT / MOTION"
          className="br-data block text-[22px] font-semibold uppercase tracking-[0.04em] text-[var(--br-ink)] md:text-[40px]"
        />
        <p className="mt-4 text-[14px] text-[var(--br-muted)]">Hover to re-scramble.</p>
      </Band>

      {/* TiltCard */}
      <Band name="TiltCard (3D pointer tilt + glare)">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: 'Product', a: BLUE }, { t: 'Brand', a: GREEN }, { t: 'Motion', a: RED },
          ].map((c) => (
            <TiltCard key={c.t} className="h-[240px]">
              <div className="flex h-full w-full flex-col justify-end overflow-hidden rounded-[var(--br-card-radius)] p-6 text-white" style={{ background: `linear-gradient(140deg, ${c.a} 0%, #070e2c 130%)` }}>
                <p className="br-data text-[12px] uppercase tracking-[0.14em] text-white/70">Discipline</p>
                <p className="mt-1 text-[26px] font-medium tracking-[-0.01em]">{c.t}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </Band>

      {/* SpotlightGrid */}
      <Band name="SpotlightGrid (cursor spotlight grid)">
        <SpotlightGrid
          items={[
            { tag: '01', title: 'Discovery', body: 'First principles and the real job to be done.' },
            { tag: '02', title: 'Systems', body: 'Design systems that scale without breaking.' },
            { tag: '03', title: 'Prototyping', body: 'Pressure-tested at speed, in-browser.' },
            { tag: '04', title: 'Brand', body: 'Identity that agrees with the product.' },
            { tag: '05', title: 'Motion', body: 'Considered, performant interaction.' },
            { tag: '06', title: 'Handoff', body: 'Built and shipped, not thrown over a wall.' },
          ]}
        />
      </Band>

      {/* ImageCompareSlider */}
      <Band name="ImageCompareSlider (before / after)">
        <ImageCompareSlider
          ratio="16 / 9"
          beforeLabel="Before"
          afterLabel="After"
          before={<div className="flex h-full w-full items-center justify-center bg-[var(--br-grey-card)]"><span className="br-data text-[13px] uppercase tracking-[0.14em] text-[var(--br-muted-2)]">Legacy UI</span></div>}
          after={<div className="flex h-full w-full items-center justify-center" style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #070e2c 130%)` }}><span className="br-data text-[13px] uppercase tracking-[0.14em] text-white/85">Redesign</span></div>}
        />
      </Band>

      {/* DragGallery */}
      <Band name="DragGallery (inertia drag rail)">
        <DragGallery
          cards={[
            { title: 'Baserate', meta: 'Fintech', accent: '#dfe7f5' },
            { title: 'Panda Express', meta: 'Mobile', accent: '#f1e3e3' },
            { title: 'Wingstop', meta: 'Mobile', accent: '#e1efe6' },
            { title: 'Samsung', meta: 'Galaxy', accent: '#dfe7f5' },
            { title: 'Mindbody', meta: 'Platform', accent: '#ece7f5' },
          ]}
        />
        <p className="mt-4 text-[14px] text-[var(--br-muted)]">Grab and fling — it coasts and settles.</p>
      </Band>

      {/* Accordion */}
      <Band name="Accordion (animated expand list)">
        <Accordion
          items={[
            { tag: '01', q: 'What do you actually do?', a: 'Product design, brand, motion, and the marketing site — shipped as one engagement instead of three vendors.' },
            { tag: '02', q: 'How do you work with founders?', a: 'In lockstep with the CEO and lead engineer, from first principle through shipped product.' },
            { tag: '03', q: 'What’s the engagement model?', a: 'Senior, hands-on, end to end. Strategy through launch — not concepts waiting on a brief.' },
          ]}
        />
      </Band>

      {/* HorizontalScroll — full-bleed pinned */}
      <section className="border-t border-[var(--br-line)]">
        <div className="br-container pt-16 md:pt-24">
          <p className="br-data mb-2 text-[11px] uppercase tracking-[0.18em] text-[var(--br-muted-2)]">◆ Component — HorizontalScroll (pinned gallery)</p>
          <p className="text-[14px] text-[var(--br-muted)]">Scroll down — the row pans sideways while pinned.</p>
        </div>
        <HorizontalScroll
          panels={[
            { meta: 'Case 01', title: 'Baserate', body: 'Investor-grade product + brand.', accent: '#13205e' },
            { meta: 'Case 02', title: 'Panda Express', body: '4.9★, millions of reviews.', accent: '#5e1313' },
            { meta: 'Case 03', title: 'Wingstop', body: 'Flavor-first, COVID-proof.', accent: '#13401f' },
            { meta: 'Case 04', title: 'Samsung', body: 'Eight Galaxy launches, under NDA.', accent: '#13205e' },
          ]}
        />
      </section>
    </div>
  )
}
