import { overview as defaults } from './data'

interface OverviewProps {
  dateRange?: string
  lead?: string
  role?: string
  scope?: string[]
}

/**
 * Section 1 — Overview. Full-bleed Panda-red field with a white-outlined card
 * on the left (logo · date · overview · role · scope) and the Firecracker
 * Shrimp takeout box bleeding off the right edge. Matches the Figma overview
 * (node 270:25897); copy comes from data.ts. Everything reads white on red.
 */
export function OverviewSection(props: OverviewProps) {
  const dateRange = props.dateRange ?? defaults.dateRange
  const lead = props.lead ?? defaults.lead
  const role = props.role ?? defaults.role
  const scope = props.scope ?? defaults.scope

  return (
    <section
      id="overview"
      className="relative overflow-hidden bg-[var(--px-red)] text-white"
    >
      <div className="br-container relative py-16 md:py-24">
        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,820px)_minmax(0,1fr)] lg:gap-8">
          {/* ── Left: solid red card. On mobile it un-cards (no border/padding)
              so the heading, lead, and scope pills get the full column width;
              the card framing returns at sm+. ──────────────────────────── */}
          <div className="relative z-10 p-0 sm:rounded-[var(--br-card-radius)] sm:border sm:border-white/70 sm:bg-[var(--px-red)] sm:p-10 md:p-[60px]">
            <div className="flex flex-col gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/panda/panda-logo.svg"
                alt="Panda Express"
                width={200}
                height={200}
                className="h-[120px] w-[120px] md:h-[200px] md:w-[200px]"
              />
              <p className="br-data flex items-center gap-2 text-base text-white md:text-[22px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/panda/calendar-icon.svg"
                  alt=""
                  aria-hidden
                  className="h-5 w-5 shrink-0"
                />
                {dateRange}
              </p>
            </div>

            <div className="mt-10">
              <h2
                className="text-[32px] font-medium uppercase leading-none text-white md:text-[40px]"
                style={{ fontFamily: 'var(--br-font-heading)' }}
              >
                Overview
              </h2>
              <p className="mt-3 max-w-2xl text-lg leading-snug text-white/95 md:text-[22px]">
                {lead}
              </p>
            </div>

            <div className="mt-9">
              <p
                className="text-lg font-medium uppercase leading-none text-white md:text-[22px]"
                style={{ fontFamily: 'var(--br-font-heading)' }}
              >
                Role
              </p>
              <p className="mt-2 max-w-2xl text-lg leading-snug text-white/95 md:text-[22px]">
                {role}
              </p>
            </div>

            <div className="mt-9">
              <p
                className="text-lg font-medium uppercase leading-none text-white md:text-[22px]"
                style={{ fontFamily: 'var(--br-font-heading)' }}
              >
                Scope
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {scope.map((s) => (
                  <li
                    key={s}
                    className="br-data rounded-[var(--br-tag-radius)] border border-white/80 px-4 py-2.5 text-[15px] leading-none text-white md:text-[20px]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right: food image, bleeds off the right edge on desktop.
              Hidden on mobile (not important there) — returns at lg. ── */}
          <div className="pointer-events-none relative hidden justify-center lg:absolute lg:inset-y-0 lg:right-[-5rem] lg:left-[calc(820px-2rem)] lg:flex lg:items-center lg:justify-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/panda/firecracker-shrimp.webp"
              alt="Panda Express Firecracker Shrimp in a takeout box"
              className="w-[300px] max-w-none drop-shadow-2xl sm:w-[380px] lg:w-[min(46vw,760px)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
