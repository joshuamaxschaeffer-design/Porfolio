import { overview as defaults } from './data'

interface OverviewProps {
  dateRange?: string
  lead?: string
  role?: string
  scope?: string[]
}

/**
 * Section 1 — cinematic BLACK hero. Wordmark / date / lead / role / scope on the
 * left; a flavor-burst hero shot bleeds off the right with floating-food
 * cut-outs sprinkled around it. Wingstop-green accent (brightened on black).
 */
export function OverviewSection(props: OverviewProps) {
  const dateRange = props.dateRange ?? defaults.dateRange
  const lead = props.lead ?? defaults.lead
  const role = props.role ?? defaults.role
  const scope = props.scope ?? defaults.scope
  const { heroImage, floaters } = defaults

  return (
    <section
      id="overview"
      className="ws-dark relative overflow-hidden bg-[#0c0d0d]"
      style={
        {
          '--br-ink': '#f6f7f8',
          '--br-body': '#d4d7dd',
          '--br-muted': '#9aa0aa',
          '--br-muted-2': '#7c828d',
          '--br-line': 'rgba(255,255,255,0.14)',
          '--ws-green': '#23c265',
        } as React.CSSProperties
      }
    >
      {/* Hero flavor-burst — bleeds off the right on desktop; a faint band on mobile. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full opacity-[0.28] md:w-[58%] md:opacity-100"
        style={{
          backgroundImage: `radial-gradient(120% 90% at 100% 50%, transparent 38%, #0c0d0d 72%), url(${heroImage})`,
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center, center right',
          backgroundRepeat: 'no-repeat, no-repeat',
        }}
      />
      {/* Left-edge fade so text never fights the photo on desktop. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 hidden md:block"
        style={{ background: 'linear-gradient(90deg, #0c0d0d 32%, transparent 72%)' }}
      />

      {/* Floating food cut-outs (decoration). */}
      {floaters?.[0] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={floaters[0].src}
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-[8%] top-[14%] z-[1] hidden w-[110px] rotate-[-12deg] drop-shadow-[0_18px_30px_rgba(0,0,0,0.5)] lg:block"
        />
      )}
      {floaters?.[1] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={floaters[1].src}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-[16%] right-[34%] z-[1] hidden w-[120px] rotate-[8deg] drop-shadow-[0_18px_30px_rgba(0,0,0,0.5)] xl:block"
        />
      )}

      <div className="br-container relative z-[2] pt-16 pb-20 md:pt-24 md:pb-[160px]">
        {/* Typographic wordmark until brand assets land */}
        <p
          className="text-[28px] font-semibold uppercase leading-none tracking-[0.02em] text-[var(--ws-green)] md:text-[34px]"
          style={{ fontFamily: 'var(--br-font-heading)' }}
        >
          Wingstop
        </p>

        <p className="br-data mt-3 flex items-center gap-2 text-sm text-[var(--br-muted)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/baserate/icons/calendar-icon.svg" alt="" aria-hidden className="h-4 w-4" />
          {dateRange}
        </p>

        <h2 className="mt-10 text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          1. OVERVIEW
        </h2>
        <p className="mt-3 max-w-[34rem] text-lg text-[var(--br-muted)] md:text-[22px]">{lead}</p>

        <div className="mt-8 max-w-[34rem]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--br-muted-2)]">Role</p>
          <p className="mt-1.5 text-base text-[var(--br-body)]">{role}</p>
        </div>

        <div className="mt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--br-muted-2)]">Scope</p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {scope.map((s) => (
              <li
                key={s}
                className="br-data rounded-[var(--br-tag-radius)] border border-[var(--ws-green)] px-3 py-1.5 text-[14px] uppercase text-[var(--ws-green)]"
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
