import { hero } from './data'
import { VisualPlaceholder } from './VisualPlaceholder'

const DARK_VARS = {
  '--br-ink': '#f5f2ed',
  '--br-body': '#d9d3ca',
  '--br-muted': '#a8a29e',
  '--br-muted-2': '#8a847e',
  '--br-line': 'rgba(255,246,232,0.14)',
} as React.CSSProperties

/** 1 · Overview. One line, five chips, key art slot. Six-second legible. */
export function HeroSection({ lead }: { lead?: string }) {
  return (
    <section id="overview" className="uf-dark relative overflow-hidden bg-[#1c1a17]" style={DARK_VARS}>
      <video
        aria-hidden
        autoPlay
        muted
        loop
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.22]"
        src={hero.heroVideo}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(28,26,23,0.55) 0%, rgba(28,26,23,0.82) 62%, #1c1a17 100%)' }}
      />

      <div className="br-container relative z-[2] grid items-center gap-12 pt-16 pb-16 md:grid-cols-[1fr_0.85fr] md:pt-24 md:pb-24">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.mark}
            alt="Unfold"
            className="h-[64px] w-[64px] rounded-[16px] shadow-[0_8px_28px_rgba(0,0,0,0.45)] md:h-[76px] md:w-[76px] md:rounded-[19px]"
          />
          <h1 className="mt-5 text-[38px] font-medium leading-none tracking-tight text-[var(--br-ink)] md:text-[52px]">
            {hero.title}
          </h1>
          <p className="mt-4 max-w-[30rem] text-lg leading-snug text-[var(--br-body)] md:text-[24px]">
            {lead ?? hero.lead}
          </p>
          <p className="br-data mt-4 text-sm text-[var(--br-muted)]">{hero.metaLine}</p>

          <ul className="mt-7 flex max-w-[34rem] flex-wrap gap-2">
            {hero.scope.map((s) => (
              <li
                key={s}
                className="br-data rounded-[var(--br-tag-radius)] border border-[var(--uf-green)] px-3 py-1.5 text-[13px] uppercase text-[#7ed3ae]"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        <VisualPlaceholder label={hero.keyArtPlaceholder} aspect="4 / 5" className="hidden md:flex" />
      </div>
    </section>
  )
}
