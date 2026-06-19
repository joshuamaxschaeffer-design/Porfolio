import { brief as defaults } from './data'

/** Section 2 — dark. Brand-bible / relentless-calendar framing in three dark
 *  glass cards on the charcoal field. */
export function BriefSection({ intro }: { intro?: string } = {}) {
  return (
    <section id="brief" className="relative border-t border-[var(--sg-line)] bg-[var(--sg-bg-2)]">
      <div className="br-container pt-16 pb-20 md:pt-24 md:pb-28">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--sg-blue)]">
          The Brief
        </h2>
        <p className="mt-4 max-w-3xl text-[22px] font-medium leading-snug text-[var(--sg-ink)] md:text-[30px]">
          {intro ?? defaults.intro}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-3 md:gap-6">
          {defaults.problems.map((p) => (
            <div
              key={p.tag}
              className="flex h-full flex-col rounded-2xl border border-[var(--sg-line)] bg-white/[0.03] p-6 backdrop-blur-sm md:p-7"
            >
              <p
                className="text-[28px] font-medium leading-none text-[var(--sg-blue)] md:text-[32px]"
                style={{ fontFamily: 'var(--br-font-heading)' }}
              >
                {p.tag}
              </p>
              <h3 className="mt-4 text-[19px] font-semibold leading-snug text-[var(--sg-ink)] md:text-[21px]">
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-normal text-[var(--sg-muted)]">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
