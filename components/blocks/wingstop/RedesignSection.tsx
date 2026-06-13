import { redesign as defaults } from './data'
import { PerspectiveDeviceGrid } from '../shared/PerspectiveDeviceGrid'

/** Section 3 — Flavor World + Wing Calculator™, then the COVID payoff strip. */
export function RedesignSection({ intro }: { intro?: string } = {}) {
  return (
    <section id="redesign" className="bg-white">
      <div className="br-container pt-16 pb-20 md:pt-20 md:pb-[120px]">
        <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          3. {defaults.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">
          {intro ?? defaults.intro}
        </p>

        {/* Flavor World + Wing Calculator app screens, laid down in perspective.
            Real screenshots drop in later via the `screens` prop. */}
        <div className="mt-12 md:mt-16">
          <PerspectiveDeviceGrid
            accent="#00843D"
            caption="Flavor World + Wing Calculator app screens — in progress"
          />
        </div>

        {/* Two features — copy (media now lives in the grid above). */}
        <div className="mt-14 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-2 md:gap-[60px]">
          {defaults.features.map((feature) => (
            <div key={feature.tag}>
              <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">
                {feature.tag}
              </p>
              <h3 className="mt-3 text-[24px] font-semibold leading-tight text-[var(--br-ink)] md:text-[28px]">
                {feature.title}
              </h3>
              <p className="mt-3 max-w-[52ch] text-[15px] leading-normal text-[var(--br-muted)] md:text-base">
                {feature.body}
              </p>
            </div>
          ))}
        </div>

        {/* COVID payoff strip */}
        <div className="mt-14 rounded-[var(--br-card-radius)] border-l-[3px] border-[var(--ws-green)] bg-[var(--br-bg-2)] p-6 md:mt-20 md:p-7">
          <p className="max-w-4xl text-[15px] leading-normal text-[var(--br-body)] md:text-lg">
            {defaults.covidStrip}
          </p>
        </div>
      </div>
    </section>
  )
}
