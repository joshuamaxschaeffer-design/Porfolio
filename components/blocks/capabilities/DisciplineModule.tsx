'use client'

import { Reveal } from '../../animation/Reveal'
import { StatCounters, type StatItem } from '../shared/StatCounters'
import { BG, type SectionBg } from './disciplines'
import { CapIcon } from './CapIcon'

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
  statsNote,
  bg,
  children,
}: DisciplineModuleProps) {
  const dark = BG[bg].dark
  const ink = dark ? 'text-white' : 'text-[var(--br-ink)]'
  const body = dark ? 'text-white/70' : 'text-[var(--br-muted)]'
  const cardBg = dark ? 'bg-white/[0.04] border-white/10' : 'bg-white border-[var(--br-line)]'
  const cardNote = dark ? 'text-white/45' : 'text-[var(--br-muted-2)]'
  const statNote = dark ? 'text-white/40' : 'text-[var(--br-muted-2)]'

  return (
    <section id={id} className={BG[bg].className}>
      <div className="br-container py-20 md:py-28">
        {/* Number + title */}
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="br-data text-[15px] font-semibold tracking-[0.1em] text-[var(--br-gold)] md:text-[17px]">
              {num}
            </span>
            <h2 className={`text-[30px] font-medium uppercase leading-none tracking-[-0.01em] md:text-[46px] ${ink}`}>
              {title}
            </h2>
          </div>
        </Reveal>

        {/* Positioning sentence */}
        <Reveal delay={60}>
          <p className={`mt-6 max-w-[60ch] text-lg leading-snug md:text-[26px] md:leading-[1.3] ${dark ? 'text-white/90' : 'text-[var(--br-ink)]'}`}>
            {positioning}
          </p>
        </Reveal>

        {/* Capability CARDS (icon + label + note) */}
        <Reveal delay={120}>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-12 md:grid-cols-3 md:gap-4">
            {capabilities.map((c) => (
              <div
                key={c.label}
                className={`group flex items-start gap-3.5 rounded-[var(--br-card-radius)] border p-4 transition-colors duration-300 md:p-5 ${cardBg}`}
              >
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[var(--br-gold)]"
                  style={{ background: dark ? 'rgba(197,160,80,0.14)' : 'rgba(197,160,80,0.12)' }}
                >
                  <CapIcon name={c.icon} />
                </span>
                <div>
                  <p className={`text-[15px] font-medium leading-tight ${dark ? 'text-white' : 'text-[var(--br-body)]'}`}>
                    {c.label}
                  </p>
                  {c.note && (
                    <p className={`mt-1 text-[13px] leading-snug ${cardNote}`}>{c.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Full-width stat row in a bordered panel */}
        <Reveal delay={100}>
          <div className={`mt-12 rounded-[var(--br-card-radius)] border p-7 md:mt-14 md:p-9 ${cardBg}`}>
            <StatCounters stats={stats} />
            {statsNote && (
              <p className={`br-data mt-7 text-[11px] uppercase leading-relaxed tracking-[0.08em] ${statNote}`}>
                {statsNote}
              </p>
            )}
          </div>
        </Reveal>

        {/* Work modules */}
        {children && <div className="mt-14 md:mt-20">{children}</div>}
      </div>
    </section>
  )
}
