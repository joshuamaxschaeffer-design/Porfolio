import { covid as defaults } from './data'

/**
 * Section 8 — THE COVID PAYOFF. Full-bleed Wingstop-GREEN band. The emotional
 * turn: shipped 2019 → dining rooms close → the app becomes the business. Three
 * beats on white cards over green (white headings/intro forced, like the
 * Challenge band, so the cards keep dark text).
 */
export function CovidSection({ intro }: { intro?: string } = {}) {
  return (
    <section id="covid" className="bg-[var(--ws-green)]">
      <div className="br-container pt-16 pb-20 md:pt-24 md:pb-[120px]">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-white/80">
          {defaults.eyebrow}
        </p>
        <h2 className="mt-3 text-[32px] font-medium uppercase leading-none text-white md:text-[40px]">
          8. {defaults.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-white/90 md:text-[22px]">
          {intro ?? defaults.intro}
        </p>

        <ol className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-3 md:gap-[30px]">
          {defaults.beats.map((b, i) => (
            <li
              key={b.eyebrow}
              className="relative flex h-full flex-col rounded-[var(--br-card-radius)] bg-white p-6 [box-shadow:var(--br-card-shadow)] md:p-7"
            >
              <span
                className="text-[44px] font-medium leading-none text-[var(--ws-green)]/25 md:text-[52px]"
                style={{ fontFamily: 'var(--br-font-heading)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="br-data mt-4 text-[13px] uppercase tracking-[0.12em] text-[var(--ws-green)]">
                {b.eyebrow}
              </p>
              <h3 className="mt-2 text-[20px] font-semibold leading-snug text-[var(--br-ink)] md:text-[22px]">
                {b.title}
              </h3>
              <p className="mt-3 text-[15px] leading-normal text-[var(--br-muted)] md:text-base">
                {b.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
