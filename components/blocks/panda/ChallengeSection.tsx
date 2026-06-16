import { challenge as defaults } from './data'

/** Thin line icons for each Challenge module — 24px grid, rounded caps. */
const icons: Record<string, React.ReactNode> = {
  // One order, three systems → three offset layers that share an order
  systems: (
    <>
      <rect x="3" y="3" width="13" height="9" rx="2" />
      <rect x="8" y="8.5" width="13" height="9" rx="2" />
      <path d="M11.5 14.5h6" />
      <path d="M11.5 11.5h2.5" />
    </>
  ),
  // 2,300+ restaurants → a location pin (per-store source of truth)
  locations: (
    <>
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  // Zero margin for confusion → status the guest sees matches the kitchen
  trust: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.6 2.6L16 9.4" />
    </>
  ),
}

function ModuleIcon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[22px] w-[22px]"
    >
      {icons[name]}
    </svg>
  )
}

/** Section 2 — the backend → restaurant → guest data-coordination problem. */
export function ChallengeSection({ intro }: { intro?: string } = {}) {
  return (
    <section id="challenge" className="bg-[var(--br-bg-2)]">
      <div className="br-container pt-16 pb-20 md:pt-20 md:pb-[120px]">
        <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          2. {defaults.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">
          {intro ?? defaults.intro}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-3 md:gap-[30px]">
          {defaults.problems.map((p) => (
            <div
              key={p.tag}
              className="flex h-full flex-col rounded-[var(--br-card-radius)] bg-white p-6 [box-shadow:var(--br-card-shadow)] md:p-7"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--px-red)] text-[var(--px-red)]">
                <ModuleIcon name={p.icon} />
              </span>
              <h3 className="mt-4 text-[20px] font-semibold leading-snug text-[var(--br-ink)] md:text-[22px]">
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-normal text-[var(--br-muted)] md:text-base">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
