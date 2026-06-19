import { challenge as defaults } from './data'

/** Section 2 — menu complexity, per-store variance, group-order math. */
export function ChallengeSection({ intro }: { intro?: string } = {}) {
  return (
    // Full-bleed Wingstop-green accent band. Heading + intro are forced white
    // here (NOT via a token override — the problem cards below are white and
    // must keep their dark ink/muted text + green tag).
    <section id="challenge" className="bg-[var(--ws-green)]">
      <div className="br-container pt-16 pb-20 md:pt-20 md:pb-[120px]">
        <h2 className="text-[32px] font-medium uppercase leading-none text-white md:text-[40px]">
          2. {defaults.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-white/90 md:text-[22px]">
          {intro ?? defaults.intro}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-3 md:gap-[30px]">
          {defaults.problems.map((p) => (
            <div
              key={p.tag}
              className="flex h-full flex-col rounded-[var(--br-card-radius)] bg-white p-6 [box-shadow:var(--br-card-shadow)] md:p-7"
            >
              <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">
                {p.tag}
              </p>
              <h3 className="mt-3 text-[20px] font-semibold leading-snug text-[var(--br-ink)] md:text-[22px]">
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
