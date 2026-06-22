'use client'

import { Reveal } from '../../animation/Reveal'
import { StatCounters, type StatItem } from '../shared/StatCounters'
import { BG, type SectionBg } from './disciplines'
import { CapIcon } from './CapIcon'
import { BrandLogo, type BrandDef } from './BrandLogo'

export interface CapabilityItem {
  label: string
  note?: string
  /** icon key (see CapIcon) */
  icon?: string
}

export interface DisciplineModuleProps {
  num: string
  id: string
  title: string
  positioning: string
  capabilities: CapabilityItem[]
  stats: StatItem[]
  statsNote?: string
  /** flat background color for the whole section */
  bg: SectionBg
  /** optional row of client brands (logo or wordmark) this discipline's work was for */
  clientBrands?: BrandDef[]
  children?: React.ReactNode
}

/**
 * DisciplineModule — one discipline section, rendered as a single FLAT color
 * block edge-to-edge (white / grey / black / navy) so it reads as one connected
 * unit. Tone-aware: dark backgrounds flip to light text + dark FPO. The overview
 * is now CARD-based (capability cards with icons + a bordered stat panel) so it
 * reads as content, not a wall of text.
 */
export function DisciplineModule({
  num,
  id,
  title,
  positioning,
  capabilities,
  stats,
  bg,
  clientBrands,
  children,
}: DisciplineModuleProps) {
  const dark = BG[bg].dark
  const gold = dark ? 'var(--br-gold-soft)' : 'var(--br-gold)'
  const ink = dark ? 'text-white' : 'text-[var(--br-ink)]'

  return (
    <section id={id} className={BG[bg].className}>
      <div className="br-container py-16 md:py-24">
        {/* Number INLINE with the title (no separate little number) */}
        <Reveal>
          <h2 className={`text-[30px] font-medium uppercase leading-none tracking-[-0.01em] md:text-[46px] ${ink}`}>
            <span style={{ color: gold }}>{num}</span>&nbsp;&nbsp;{title}
          </h2>
        </Reveal>

        {/* Positioning sentence */}
        <Reveal delay={60}>
          <p className={`mt-6 max-w-[60ch] text-lg leading-snug md:text-[26px] md:leading-[1.3] ${dark ? 'text-white/90' : 'text-[var(--br-ink)]'}`}>
            {positioning}
          </p>
        </Reveal>

        {/* Client row — every brand this discipline's work was for (logo or wordmark) on white cards */}
        {clientBrands && clientBrands.length > 0 && (
          <Reveal delay={90}>
            <div className="mt-8 flex flex-wrap gap-3 md:mt-10 md:gap-4">
              {clientBrands.map((b) => (
                <span
                  key={b.name}
                  className="flex h-16 w-[140px] items-center justify-center rounded-[var(--br-card-radius)] border border-black/5 bg-white px-5 shadow-[0_4px_14px_rgba(7,14,44,0.06)] md:h-[72px] md:w-[160px]"
                >
                  <BrandLogo brand={b} />
                </span>
              ))}
            </div>
          </Reveal>
        )}

        {/* Capability list — borderless, label only (no card, no 2nd line) */}
        <Reveal delay={120}>
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 md:mt-12 md:grid-cols-3 md:gap-x-10 md:gap-y-5">
            {capabilities.map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: dark ? 'rgba(199,144,22,0.18)' : 'rgba(174,125,0,0.10)', color: gold }}>
                  <CapIcon name={c.icon} />
                </span>
                <p className={`text-[15px] font-medium leading-tight ${dark ? 'text-white' : 'text-[var(--br-body)]'}`}>{c.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Full-width stat row — flat on the section background (no card, no note) */}
        <Reveal delay={100}>
          <div className="mt-12 border-t pt-10 md:mt-16" style={{ borderColor: dark ? 'rgba(255,255,255,0.12)' : 'var(--br-line)' }}>
            <StatCounters stats={dark ? stats.map((s) => ({ ...s, accent: gold })) : stats} dark={dark} />
          </div>
        </Reveal>

        {/* Work modules */}
        {children && <div className="mt-14 md:mt-20">{children}</div>}
      </div>
    </section>
  )
}
