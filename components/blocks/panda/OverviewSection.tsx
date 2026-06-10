import { overview as defaults } from './data'

interface OverviewProps {
  dateRange?: string
  lead?: string
  role?: string
  scope?: string[]
}

/** Section 1 — wordmark, date, lead, role, scope pills (Panda red accent). */
export function OverviewSection(props: OverviewProps) {
  const dateRange = props.dateRange ?? defaults.dateRange
  const lead = props.lead ?? defaults.lead
  const role = props.role ?? defaults.role
  const scope = props.scope ?? defaults.scope

  return (
    <section id="overview" className="br-container pt-16 pb-20 md:pt-24 md:pb-[160px]">
      {/* Typographic wordmark until brand assets land */}
      <p
        className="text-[28px] font-semibold uppercase leading-none tracking-[0.02em] text-[var(--px-red)] md:text-[34px]"
        style={{ fontFamily: 'var(--br-font-heading)' }}
      >
        Panda Express
      </p>

      <p className="br-data mt-3 flex items-center gap-2 text-sm text-[var(--br-muted)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/baserate/icons/calendar-icon.svg" alt="" aria-hidden className="h-4 w-4" />
        {dateRange}
      </p>

      <h2 className="mt-10 text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
        1. OVERVIEW
      </h2>
      <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">{lead}</p>

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--br-muted-2)]">Role</p>
        <p className="mt-1.5 max-w-3xl text-base text-[var(--br-body)]">{role}</p>
      </div>

      <div className="mt-7">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--br-muted-2)]">Scope</p>
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {scope.map((s) => (
            <li
              key={s}
              className="br-data rounded-[var(--br-tag-radius)] border border-[var(--px-red)] px-3 py-1.5 text-[14px] uppercase text-[var(--px-red)]"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
