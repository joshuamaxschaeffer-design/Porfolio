import { overview as defaults } from './data'

interface OverviewProps {
  dateRange?: string
  lead?: string
  role?: string
  scope?: string[]
}

/**
 * Section 1 — dark warm-charcoal hero. The dunes b-roll (the film that
 * breathes behind the app's onboarding) plays muted behind a charcoal wash;
 * the open-book mark, date, lead, role, and green scope chips sit on top.
 */
export function OverviewSection(props: OverviewProps) {
  const dateRange = props.dateRange ?? defaults.dateRange
  const lead = props.lead ?? defaults.lead
  const role = props.role ?? defaults.role
  const scope = props.scope ?? defaults.scope

  return (
    <section
      id="overview"
      className="uf-dark relative overflow-hidden bg-[#1c1a17]"
      style={
        {
          '--br-ink': '#f5f2ed',
          '--br-body': '#d9d3ca',
          '--br-muted': '#a8a29e',
          '--br-muted-2': '#8a847e',
          '--br-line': 'rgba(255,246,232,0.14)',
        } as React.CSSProperties
      }
    >
      {/* Dunes b-roll — the actual onboarding background film, dimmed to a texture. */}
      <video
        aria-hidden
        autoPlay
        muted
        loop
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.22]"
        src={defaults.heroVideo}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(28,26,23,0.55) 0%, rgba(28,26,23,0.82) 62%, #1c1a17 100%)' }}
      />

      <div className="br-container relative z-[2] pt-16 pb-20 md:pt-24 md:pb-[140px]">
        {/* Open-book mark on its green tile. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={defaults.mark}
          alt="Unfold"
          className="h-[64px] w-[64px] rounded-[16px] shadow-[0_8px_28px_rgba(0,0,0,0.45)] md:h-[80px] md:w-[80px] md:rounded-[20px]"
        />
        <p className="mt-5 text-[26px] font-medium leading-none tracking-tight text-[var(--br-ink)] md:text-[30px]">
          Unfold
        </p>

        <p className="br-data mt-3 text-sm text-[var(--br-muted)]">{defaults.metaLine}</p>

        <h2 className="mt-10 text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          1. Overview
        </h2>
        <p className="mt-3 max-w-[36rem] text-lg text-[var(--br-body)] md:text-[22px]">{lead}</p>

        <div className="mt-8 max-w-[36rem]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--br-muted-2)]">Role</p>
          <p className="mt-1.5 text-base text-[var(--br-body)]">{role}</p>
        </div>

        <div className="mt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--br-muted-2)]">Scope</p>
          <ul className="mt-2.5 flex max-w-[40rem] flex-wrap gap-2">
            {scope.map((s) => (
              <li
                key={s}
                className="br-data rounded-[var(--br-tag-radius)] border border-[var(--uf-green)] px-3 py-1.5 text-[14px] uppercase text-[#7ed3ae]"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
