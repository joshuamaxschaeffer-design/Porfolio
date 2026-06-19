import { redesign as defaults } from './data'
import { PerspectiveDeviceGrid } from '../shared/PerspectiveDeviceGrid'

/** Section 3 — Flavor World + Wing Calculator™, then the COVID payoff strip. */
export function RedesignSection({ intro }: { intro?: string } = {}) {
  return (
    <section
      id="redesign"
      className="ws-dark bg-[#0c0d0d]"
      style={
        {
          // BLACK flavor-first showpiece. Light text tokens; brighter green
          // accent so the perspective-grid FPO screens + tags pop on black.
          '--br-ink': '#f6f7f8',
          '--br-body': '#d4d7dd',
          '--br-muted': '#9aa0aa',
          '--br-muted-2': '#7c828d',
          '--br-line': 'rgba(255,255,255,0.14)',
          '--ws-green': '#23c265',
        } as React.CSSProperties
      }
    >
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
            accent="#23c265"
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

        {/* COVID payoff strip — subtle dark card on the black field */}
        <div className="mt-14 rounded-[var(--br-card-radius)] border-l-[3px] border-[var(--ws-green)] bg-white/[0.05] p-6 md:mt-20 md:p-7">
          <p className="max-w-4xl text-[15px] leading-normal text-[var(--br-body)] md:text-lg">
            {defaults.covidStrip}
          </p>
        </div>
      </div>
    </section>
  )
}
