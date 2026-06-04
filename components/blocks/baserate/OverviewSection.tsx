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
      <BaserateLogo className="text-[#0a0a0a]" />

      <p className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
        <CalendarIcon className="h-4 w-4" />
        {dateRange}
      </p>

      <h2 className="mt-10 text-3xl font-bold tracking-tight text-[#0a0a0a] md:text-4xl">OVERVIEW</h2>
      <p className="mt-3 max-w-2xl text-base text-neutral-600 md:text-lg">{lead}</p>

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Role</p>
        <p className="mt-1.5 text-base text-[#0a0a0a]">{role}</p>
      </div>

      <div className="mt-7">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Scope</p>
        <ul className="mt-2.5 flex flex-wrap gap-2.5">
          {scope.map((s) => (
            <li
              key={s}
              className="rounded-md border border-[var(--br-gold)] px-3 py-1.5 text-sm text-[var(--br-gold)]"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 6h12M5 1.5v3M11 1.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
