import { BaserateLogo } from './BaserateLogo'
import { overview as defaults } from './data'

interface OverviewProps {
  client?: string
  dateRange?: string
  lead?: string
  role?: string
  scope?: string[]
}

export function OverviewSection(props: OverviewProps) {
  const client = props.client ?? defaults.client
  const dateRange = props.dateRange ?? defaults.dateRange
  const lead = props.lead ?? defaults.lead
  const role = props.role ?? defaults.role
  const scope = props.scope ?? defaults.scope

  return (
    <section className="br-container pt-16 md:pt-24">
      <BaserateLogo className="text-[var(--br-ink)]" />

      <p className="br-data mt-3 flex items-center gap-2 text-sm text-[var(--br-muted)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/baserate/icons/calendar-icon.svg" alt="" aria-hidden className="h-4 w-4" />
        {dateRange}
      </p>

      <h2 className="mt-10 text-[28px] font-medium leading-none text-[var(--br-ink)]">OVERVIEW</h2>
      <p className="mt-3 max-w-2xl text-base text-[var(--br-muted)] md:text-lg">{lead}</p>

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--br-muted-2)]">Role</p>
        <p className="mt-1.5 text-base text-[var(--br-body)]">{role}</p>
      </div>

      <div className="mt-7">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--br-muted-2)]">Scope</p>
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {scope.map((s) => (
            <li
              key={s}
              className="rounded-[var(--br-tag-radius)] border border-[var(--br-gold)] px-3 py-1.5 text-sm text-[var(--br-gold)]"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}


