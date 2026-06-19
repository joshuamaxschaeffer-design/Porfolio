import { overview as defaults } from './data'

interface OverviewProps {
  dateRange?: string
  lead?: string
  role?: string
  scope?: string[]
}

/**
 * Section 1 — Overview. WHITE title card (per Joshua, 2026-06-19) so the dark
 * Samsung wordmark reads boldly against it, left-aligned to match the other
 * case studies (Panda/Wingstop). Big logo, restrained lead, then role + scope.
 * The dark cinematic treatment kicks in from The Brief onward.
 */
export function OverviewSection(props: OverviewProps) {
  const dateRange = props.dateRange ?? defaults.dateRange
  const lead = props.lead ?? defaults.lead
  const role = props.role ?? defaults.role
  const scope = props.scope ?? defaults.scope

  return (
    <section id="overview" className="bg-white text-[#16181d]">
      <div className="br-container pt-16 pb-20 md:pt-24 md:pb-28">
        {/* big dark wordmark */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/samsung/brand/samsung-wordmark-ink.svg"
          alt="Samsung"
          className="h-12 w-auto md:h-[68px]"
        />
        <p className="br-data mt-4 text-[13px] font-medium uppercase tracking-[0.4em] text-[var(--sg-blue)] md:text-sm">
          2013 — 16
        </p>

        <p className="mt-10 max-w-3xl text-[20px] font-medium leading-snug text-[#16181d] md:mt-12 md:text-[26px]">
          {lead}
        </p>

        <div className="mt-10 max-w-3xl md:mt-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9aa0aa]">Role</p>
          <p className="mt-2 text-[15px] leading-normal text-[#4b515c]">{role}</p>
        </div>

        <div className="mt-7 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9aa0aa]">Scope</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {scope.map((s) => (
              <li
                key={s}
                className="br-data rounded-full border border-[#e2e4e9] px-3.5 py-1.5 text-[13px] uppercase tracking-[0.04em] text-[#4b515c]"
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
