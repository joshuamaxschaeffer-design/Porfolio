import { work as defaults } from './data'
import { PerspectiveDeviceGrid } from '../shared/PerspectiveDeviceGrid'

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

        {/* The wall of launch/product screens, laid down in perspective. Real
            screenshots drop in later via the `screens` prop; until then the
            grid renders on-brand FPO screens so the effect reads in full. */}
        <div className="mt-12 md:mt-16">
          <PerspectiveDeviceGrid
            accent="#1428A0"
            caption="Launch & product page screens — in progress"
          />
        </div>

        {/* Three workstreams — copy rows (media now lives in the grid above). */}
        <div className="mt-14 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-3 md:gap-[60px]">
          {defaults.rows.map((row) => (
            <div key={row.tag}>
              <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--sg-blue)]">
                {row.tag}
              </p>
              <h3 className="mt-3 text-[22px] font-semibold leading-tight text-[var(--br-ink)] md:text-[24px]">
                {row.title}
              </h3>
              <p className="mt-3 text-[15px] leading-normal text-[var(--br-muted)] md:text-base">
                {row.body}
              </p>
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
