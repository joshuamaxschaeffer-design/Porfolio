import { shipped } from './data'
import { VisualPlaceholder } from './VisualPlaceholder'

const LIGHT_VARS = {
  '--br-ink': '#3a342e',
  '--br-body': '#4c453d',
  '--br-muted': '#73685c',
  '--br-muted-2': '#8a7f71',
  '--br-line': 'rgba(58,52,46,0.14)',
} as React.CSSProperties

/** 5 · How it shipped. Pipeline rail, review timeline, store strip. */
export function ShippedSection() {
  return (
    <section id="shipped" className="relative bg-[#fff6e8]" style={LIGHT_VARS}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.45] mix-blend-multiply"
        style={{ backgroundImage: 'url(/unfold/texture/paper-cream.webp)', backgroundSize: '900px' }}
      />
      <div className="br-container relative z-[2] py-16 md:py-24">
        <h2 className="text-[28px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[34px]">
          {shipped.heading}
        </h2>
        <p className="mt-3 text-lg text-[var(--br-muted)]">{shipped.intro}</p>

        <ol className="mt-9 grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          {shipped.steps.map((s, i) => (
            <li key={s.n} className="relative rounded-2xl border border-[var(--br-line)] bg-[#fffaf0] p-4">
              <span className="br-data text-[12px] text-[var(--uf-green)]">{s.n}</span>
              <h3 className="mt-1 text-[15px] font-medium leading-snug text-[var(--br-ink)]">{s.title}</h3>
              <p className="mt-1 text-[13px] leading-snug text-[var(--br-muted)]">{s.body}</p>
              {i < shipped.steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-[8px] top-1/2 hidden h-[2px] w-[13px] bg-[var(--uf-green)] opacity-60 md:block"
                />
              )}
            </li>
          ))}
        </ol>

        <p className="mt-6 border-l-2 border-[var(--uf-green)] pl-4 text-[16px] text-[var(--br-body)]">
          {shipped.povLine}
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <ol>
            {shipped.timeline.map((t, i) => (
              <li key={t.date + i} className="relative flex gap-4 pb-5 last:pb-0">
                {i < shipped.timeline.length - 1 && (
                  <span aria-hidden className="absolute left-[6px] top-4 h-full w-[2px] bg-[var(--uf-green)] opacity-30" />
                )}
                <span aria-hidden className="relative mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[var(--uf-green)] bg-[#fff6e8]" />
                <p className="text-[14px] leading-snug text-[var(--br-body)]">
                  <span className="br-data mr-2 uppercase tracking-wide text-[var(--uf-green)]">{t.date}</span>
                  {t.event}
                </p>
              </li>
            ))}
          </ol>
          <VisualPlaceholder label={shipped.artifactsPlaceholder} aspect="16 / 9" />
        </div>

        <p className="br-data mt-12 text-[12px] uppercase tracking-wide text-[var(--br-muted-2)]">
          {shipped.storeStripLabel}
        </p>
        <div className="-mx-2 mt-4 flex gap-3 overflow-x-auto px-2 pb-2 [scrollbar-width:thin]">
          {shipped.storeStrip.map((src, i) => (
            <div key={src} className="w-[124px] shrink-0 overflow-hidden rounded-[13px] shadow-[0_8px_22px_rgba(28,26,23,0.18)] md:w-[142px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`App Store screenshot ${i + 1}`} loading="lazy" className="block h-auto w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
