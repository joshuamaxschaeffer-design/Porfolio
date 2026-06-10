import { work as defaults } from './data'

/** Media scaffold — neutral frame holding the spot for real imagery. */
function PlaceholderFrame({ label }: { label: string }) {
  return (
    <div className="flex aspect-[16/10] w-full items-center justify-center rounded-[var(--br-card-radius)] border border-dashed border-[var(--br-divider)] bg-[var(--br-grey-card)]">
      <p className="br-data px-6 text-center text-[12px] uppercase tracking-[0.14em] text-[var(--br-muted-2)]">
        {label}
      </p>
    </div>
  )
}

/** Section 3 — launch pages · social engine · in-store table UI, then closer. */
export function WorkSection({ intro }: { intro?: string } = {}) {
  return (
    <section id="work" className="bg-white">
      <div className="br-container pt-16 pb-20 md:pt-20 md:pb-[120px]">
        <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          3. {defaults.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">
          {intro ?? defaults.intro}
        </p>

        <div className="mt-12 flex flex-col gap-14 md:mt-16 md:gap-20">
          {defaults.rows.map((row, i) => (
            <div
              key={row.tag}
              className="grid grid-cols-1 items-center gap-7 md:grid-cols-2 md:gap-[60px]"
            >
              {/* Copy column — alternates sides on desktop */}
              <div className={i % 2 === 1 ? 'md:order-2' : undefined}>
                <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--sg-blue)]">
                  {row.tag}
                </p>
                <h3 className="mt-3 text-[24px] font-semibold leading-tight text-[var(--br-ink)] md:text-[28px]">
                  {row.title}
                </h3>
                <p className="mt-3 max-w-[52ch] text-[15px] leading-normal text-[var(--br-muted)] md:text-base">
                  {row.body}
                </p>
              </div>
              <div className={i % 2 === 1 ? 'md:order-1' : undefined}>
                <PlaceholderFrame label={row.placeholder} />
              </div>
            </div>
          ))}
        </div>

        {/* Era closer strip */}
        <div className="mt-14 rounded-[var(--br-card-radius)] border-l-[3px] border-[var(--sg-blue)] bg-[var(--br-bg-2)] p-6 md:mt-20 md:p-7">
          <p className="max-w-4xl text-[15px] leading-normal text-[var(--br-body)] md:text-lg">
            {defaults.closer}
          </p>
        </div>
      </div>
    </section>
  )
}
