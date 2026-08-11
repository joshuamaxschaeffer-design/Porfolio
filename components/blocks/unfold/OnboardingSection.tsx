import { onboarding } from './data'
import { PhoneFrame } from './PhoneFrame'

/**
 * Section 7 — onboarding & day one. The research-backed "delete the tour"
 * call, Neil's welcome on video, and the dunes film.
 */
export function OnboardingSection() {
  return (
    <section
      id="onboarding"
      className="relative bg-[#fff6e8]"
      style={
        {
          '--br-ink': '#3a342e',
          '--br-body': '#4c453d',
          '--br-muted': '#73685c',
          '--br-muted-2': '#8a7f71',
          '--br-line': 'rgba(58,52,46,0.14)',
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.45] mix-blend-multiply"
        style={{ backgroundImage: 'url(/unfold/texture/paper-cream.webp)', backgroundSize: '900px' }}
      />
      <div className="br-container relative z-[2] grid items-center gap-12 py-16 md:grid-cols-[0.85fr_1.15fr] md:py-24">
        <div className="order-2 mx-auto grid w-full max-w-[420px] grid-cols-2 items-start gap-4 md:order-1">
          <PhoneFrame src={onboarding.screens[0].src} alt={onboarding.screens[0].alt} />
          <div className="pt-8">
            <PhoneFrame src={onboarding.screens[1].src} alt={onboarding.screens[1].alt} />
          </div>
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
            7. Onboarding
          </h2>
          <p className="mt-3 max-w-[34rem] text-lg text-[var(--br-body)] md:text-[20px]">{onboarding.intro}</p>
          {onboarding.body.map((p) => (
            <p key={p.slice(0, 24)} className="mt-5 max-w-[34rem] text-[15px] leading-relaxed text-[var(--br-muted)]">
              {p}
            </p>
          ))}
          <p className="br-data mt-7 inline-block rounded-full border border-[var(--br-line)] bg-white px-4 py-1.5 text-[13px] uppercase tracking-wide text-[var(--br-muted)]">
            No walkthrough — contextual discovery tips, backed by usability research
          </p>
        </div>
      </div>
    </section>
  )
}
