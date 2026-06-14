'use client'

import { RevealText } from './RevealText'
import { MarqueeStrip } from './MarqueeStrip'
import { StickyStackCards } from './StickyStackCards'
import { BentoGrid } from './BentoGrid'
import { StatCounters } from './StatCounters'
import { HoverIndexList } from './HoverIndexList'
import { ClipReveal } from './ClipReveal'
import { MagneticCTA } from './MagneticCTA'
import { KineticHeadline } from './KineticHeadline'
import { ParallaxColumns } from './ParallaxColumns'

/**
 * ComponentShowcase — a scratch gallery that mounts every new shared component
 * with placeholder content so Joshua can review them in-situ and keep/cull. Each
 * band is labelled with the component name. NOT a permanent section — meant to
 * be cherry-picked from. All content here is filler.
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

export function ComponentShowcase() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="br-container pt-20 pb-4 md:pt-28">
        <p className="br-data text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--br-gold)]">
          Component Library
        </p>
        <h2 className="mt-5 max-w-4xl text-[34px] font-medium leading-[1.05] tracking-[-0.02em] text-[var(--br-ink)] md:text-[56px]">
          A kit of motion-first sections, ready to drop in.
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-[var(--br-muted)] md:text-xl">
          Scratch gallery — every block below is a reusable component with filler content. Keep what lands, cut the rest.
        </p>
      </section>

      {/* RevealText */}
      <Band name="RevealText (line-mask scroll reveal)">
        <RevealText
          as="h3"
          text={'Design that earns trust\nbefore it asks for it.'}
          className="max-w-5xl text-[34px] font-medium leading-[1.05] tracking-[-0.02em] text-[var(--br-ink)] md:text-[64px]"
        />
      </Band>

      {/* Marquee */}
      <Band name="MarqueeStrip (velocity-reactive ticker)" tight>
        <MarqueeStrip
          items={['Product Design', 'Brand Systems', 'Design Engineering', 'Motion', 'Prototyping', 'Art Direction', 'Design Ops']}
          className="text-[28px] font-medium uppercase tracking-[-0.01em] text-[var(--br-ink)] md:text-[44px]"
        />
      </Band>

      {/* KineticHeadline */}
      <Band name="KineticHeadline (scroll-settle type)">
        <KineticHeadline text="Strategy through shipped product." />
      </Band>

      {/* StatCounters */}
      <Band name="StatCounters (count-up on scroll)">
        <StatCounters
          stats={[
            { value: 13, suffix: '+', label: 'Years shipping product & brand' },
            { value: 70, suffix: '%', label: 'Digital share of sales, at peak' },
            { value: 16, suffix: 'M+', label: 'Rewards members served' },
            { value: 4.9, decimals: 1, suffix: '★', label: 'App store rating' },
          ]}
        />
      </Band>

      {/* Bento */}
      <Band name="BentoGrid (asymmetric mixed-media grid)">
        <BentoGrid
          cells={[
            { col: 2, row: 2, tone: 'ink', eyebrow: 'Flagship', title: 'Baserate', body: 'Investor-grade product, brand, and marketing site — one operator, end to end.', accent: GOLD },
            { col: 2, eyebrow: 'Discipline', big: '01', title: 'Product design', accent: BLUE },
            { col: 1, eyebrow: 'Stars', big: '4.9', title: 'Panda Express', accent: RED },
            { col: 1, eyebrow: 'Stars', big: '4.8', title: 'Wingstop', accent: GREEN },
            { col: 2, eyebrow: 'Reach', big: '318M', title: 'Phones shipped the year of the work', accent: BLUE },
            { col: 2, eyebrow: 'Operating model', title: 'One engagement, not three vendors', body: 'Product, brand, and motion that actually agree with each other.', accent: GOLD },
          ]}
        />
      </Band>

      {/* HoverIndexList */}
      <Band name="HoverIndexList (cursor-preview project index)">
        <HoverIndexList
          rows={[
            { title: 'Baserate', meta: 'Fintech · 2023', href: '/work/baserate', accent: GOLD },
            { title: 'Panda Express', meta: 'Mobile · 2020', href: '/work/panda-express', accent: RED },
            { title: 'Wingstop', meta: 'Mobile · 2019', href: '/work/wingstop', accent: GREEN },
            { title: 'Samsung', meta: 'Galaxy · 2013–17', href: '/work/samsung', accent: BLUE },
          ]}
        />
      </Band>

      {/* ClipReveal */}
      <Band name="ClipReveal (clip-path image wipe)">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <ClipReveal ratio="4 / 3" direction="up">
            <div className="flex h-full w-full items-end bg-[linear-gradient(135deg,#1428A0_0%,#070e2c_120%)] p-6">
              <span className="br-data text-[12px] uppercase tracking-[0.14em] text-white/85">Wipe up</span>
            </div>
          </ClipReveal>
          <ClipReveal ratio="4 / 3" direction="left">
            <div className="flex h-full w-full items-end bg-[linear-gradient(135deg,#D02B2E_0%,#070e2c_120%)] p-6">
              <span className="br-data text-[12px] uppercase tracking-[0.14em] text-white/85">Wipe left</span>
            </div>
          </ClipReveal>
        </div>
      </Band>

      {/* ParallaxColumns */}
      <Band name="ParallaxColumns (dual-speed gallery)">
        <ParallaxColumns
          tiles={[
            { label: 'Frame 01', accent: '#e7e7ef' }, { label: 'Frame 02', accent: '#dfe7f5' },
            { label: 'Frame 03', accent: '#f1e3e3' }, { label: 'Frame 04', accent: '#e1efe6' },
            { label: 'Frame 05', accent: '#ece7f5' }, { label: 'Frame 06', accent: '#e7e7ef' },
          ]}
        />
      </Band>

      {/* StickyStackCards */}
      <Band name="StickyStackCards (pin + scale stack)">
        <p className="mb-6 max-w-xl text-[15px] text-[var(--br-muted)]">Scroll — each card pins, then recedes as the next slides over it.</p>
        <StickyStackCards
          cards={[
            { eyebrow: 'Phase 01', title: 'Discover', body: 'First principles, constraints, and the real job to be done — before a pixel.', accent: BLUE },
            { eyebrow: 'Phase 02', title: 'Design', body: 'Product and brand in lockstep, prototyped at speed and pressure-tested.', accent: GREEN },
            { eyebrow: 'Phase 03', title: 'Ship', body: 'Built, handed off, and launched — strategy through shipped product.', accent: RED },
          ]}
        />
      </Band>

      {/* MagneticCTA */}
      <MagneticCTA
        eyebrow="Component — MagneticCTA"
        headline="Let’s build the thing."
        ctaLabel="Start a project"
        ctaHref="/contact"
        links={[
          { label: 'Email', href: '/contact' },
          { label: 'Work', href: '/' },
        ]}
      />
    </div>
  )
}
