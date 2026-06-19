import { overview as defaults } from './data'
import { GradientBackdrop } from './GradientBackdrop'

interface OverviewProps {
  dateRange?: string
  lead?: string
  role?: string
  scope?: string[]
}

/**
 * Section 1 — dark cinematic hero. The real white Samsung wordmark (traced SVG)
 * centered up top, "2013 — 16" in blue beneath it, the intro line large and
 * airy, then role + scope. A faint gradient wash bleeds in behind so the dark
 * hero isn't flat (echoes the Behance title card).
 */
export function OverviewSection(props: OverviewProps) {
  const dateRange = props.dateRange ?? defaults.dateRange
  const lead = props.lead ?? defaults.lead
  const role = props.role ?? defaults.role
  const scope = props.scope ?? defaults.scope

  return (
    <section id="overview" className="relative overflow-hidden">
      {/* faint ambient wash, low + behind */}
      <GradientBackdrop intensity={0.22} className="[mask-image:radial-gradient(120%_90%_at_50%_0%,black,transparent_70%)]" />

      <div className="br-container relative pt-20 pb-20 text-center md:pt-28 md:pb-28">
        {/* real Samsung wordmark, white */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/samsung/brand/samsung-wordmark.svg"
          alt="Samsung"
          className="mx-auto h-7 w-auto opacity-95 md:h-9"
        />
        <p
          className="br-data mt-4 text-[13px] font-medium uppercase tracking-[0.5em] text-[var(--sg-blue)] md:text-sm"
        >
          2013 — 16
        </p>

        <p className="mx-auto mt-12 max-w-4xl text-[26px] font-medium leading-[1.18] text-[var(--sg-ink)] md:mt-16 md:text-[44px]">
          {lead}
        </p>

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-8 text-left sm:grid-cols-[auto_1fr] sm:gap-12 md:mt-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--sg-muted-2)]">Role</p>
            <p className="mt-2 text-[15px] leading-normal text-[var(--sg-muted)]">{role}</p>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-3xl text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--sg-muted-2)]">Scope</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {scope.map((s) => (
              <li
                key={s}
                className="br-data rounded-full border border-[var(--sg-line)] bg-white/[0.03] px-3.5 py-1.5 text-[13px] uppercase tracking-[0.04em] text-[var(--sg-muted)] backdrop-blur-sm"
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
