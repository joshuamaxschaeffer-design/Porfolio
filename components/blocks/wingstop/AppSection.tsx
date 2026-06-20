'use client'

import { app as defaults } from './data'

/**
 * SECTION 2 — WINGSTOP APP. Solid Wingstop-GREEN field. A feature carousel
 * (key features as app-screen modules that scroll to the right, Panda-rewards
 * style) + a Component Library card (Panda/Baserate style) + the desktop site
 * stacked + a bento of the shipped app using App Store imagery.
 */
export function AppSection() {
  return (
    <section
      id="app"
      className="ws-dark relative w-full overflow-hidden bg-[var(--ws-green)] text-white"
      style={
        {
          '--br-ink': '#ffffff',
          '--br-body': 'rgba(255,255,255,0.9)',
          '--br-muted': 'rgba(255,255,255,0.82)',
          '--br-muted-2': 'rgba(255,255,255,0.68)',
          '--br-line': 'rgba(255,255,255,0.22)',
        } as React.CSSProperties
      }
    >
      <div className="br-container pt-16 pb-8 md:pt-24">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-white/80">2. {defaults.eyebrow}</p>
        <h2 className="mt-3 max-w-[24ch] text-[32px] font-medium leading-[1.05] text-white md:text-[40px]">
          {defaults.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-white/85 md:text-[22px]">{defaults.intro}</p>
      </div>

      {/* Feature carousel — native scroll rail of equal-height modules. */}
      <div
        className="br-noscrollbar mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-3"
        style={{
          paddingInline: 'calc(max(1.5rem, (100vw - 1443px) / 2 + 5rem))',
          scrollPaddingInline: 'calc(max(1.5rem, (100vw - 1443px) / 2 + 5rem))',
          touchAction: 'pan-x pan-y',
        }}
      >
        {defaults.features.map((f) => (
          <article
            key={f.title}
            className="flex h-[480px] w-[80vw] max-w-[680px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/[0.08] p-7 backdrop-blur-sm sm:w-[64vw] sm:p-8 lg:w-[640px]"
          >
            <header className="max-w-[52ch]">
              <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-white/80">{f.eyebrow}</span>
              <h3 className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-[26px]">{f.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/80">{f.body}</p>
            </header>
            <div className="mt-5 flex min-h-0 flex-1 items-end justify-center gap-3">
              {f.screens.map((s, i) => (
                <div key={s} className={i === 1 ? 'w-[36%] max-w-[210px]' : 'mb-6 w-[31%] max-w-[185px] opacity-95'}>
                  <Phone src={s} />
                </div>
              ))}
            </div>
          </article>
        ))}

        {/* Component Library card (Panda/Baserate style) */}
        <article className="flex h-[480px] w-[80vw] max-w-[680px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-white/20 bg-white p-7 text-[var(--br-ink)] sm:w-[64vw] sm:p-8 lg:w-[640px]">
          <header className="max-w-[52ch]">
            <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ws-green)]">
              {defaults.components.eyebrow}
            </span>
            <h3 className="mt-2 text-2xl font-semibold leading-tight text-[#0c0d0d] sm:text-[26px]">
              {defaults.components.title}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[#585b6b]">{defaults.components.body}</p>
          </header>
          <div className="mt-6 grid min-h-0 flex-1 grid-cols-2 gap-4">
            {/* buttons + inputs column */}
            <div className="flex flex-col gap-3">
              <div className="rounded-full bg-[var(--ws-green)] px-5 py-3 text-center text-sm font-semibold text-white">Add to order</div>
              <div className="rounded-full border-2 border-[var(--ws-green)] px-5 py-3 text-center text-sm font-semibold text-[var(--ws-green)]">Customize</div>
              <div className="rounded-lg border border-[#dcdce1] px-4 py-3 text-sm text-[#7e7f88]">Search the menu…</div>
              <div className="flex gap-2">
                {defaults.components.swatches.map((c) => (
                  <div key={c} className="h-9 flex-1 rounded-md border border-black/10" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            {/* flavor chips + card */}
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-4 gap-2 rounded-xl border border-[#ebecf0] bg-[#f8f8fb] p-3">
                {defaults.components.icons.map((ic) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={ic} src={ic} alt="" className="h-8 w-8 object-contain" />
                ))}
                {defaults.components.icons.map((ic) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={ic + '2'} src={ic} alt="" className="h-8 w-8 object-contain opacity-40" />
                ))}
              </div>
              <div className="rounded-xl border border-[#ebecf0] p-3">
                <div className="h-2 w-2/3 rounded bg-[#ebecf0]" />
                <div className="mt-2 h-2 w-1/2 rounded bg-[#f0f0f0]" />
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#ebecf0]">
                  <div className="h-full w-2/3 rounded-full bg-[var(--ws-green)]" />
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Desktop site card */}
        <article className="flex h-[480px] w-[80vw] max-w-[680px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/[0.08] p-7 backdrop-blur-sm sm:w-[64vw] sm:p-8 lg:w-[640px]">
          <header className="max-w-[52ch]">
            <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-white/80">{defaults.desktop.eyebrow}</span>
            <h3 className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-[26px]">{defaults.desktop.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-white/80">{defaults.desktop.body}</p>
          </header>
          <div className="relative mt-6 min-h-0 flex-1">
            {defaults.desktop.screens.slice(0, 2).map((s, i) => (
              <div
                key={s}
                className="absolute overflow-hidden rounded-lg border border-black/10 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
                style={{ left: `${i * 12}%`, top: `${i * 14}%`, width: '78%', zIndex: 2 - i }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s} alt={defaults.desktop.title} loading="lazy" className="block w-full object-cover object-top" />
              </div>
            ))}
          </div>
        </article>
      </div>

      {/* Bento — the shipped app, App Store imagery */}
      <div className="br-container pb-20 pt-8 md:pb-[120px]">
        <div className="mb-5">
          <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-white/80">{defaults.bento.eyebrow}</span>
          <h3 className="mt-2 text-2xl font-semibold text-white sm:text-[28px]">{defaults.bento.title}</h3>
          <p className="mt-2 max-w-[60ch] text-[15px] text-white/80 sm:text-base">{defaults.bento.body}</p>
        </div>
        <div className="grid grid-cols-2 auto-rows-[180px] gap-3 sm:auto-rows-[200px] lg:[grid-template-columns:repeat(4,1fr)] lg:[grid-auto-rows:220px]">
          {defaults.bento.images.map((src, i) => {
            // True bento on desktop: a composed 4-col / 2-row layout with varied spans.
            // [0] tall feature (left, 2 rows), [1] tall (2 rows), [2] wide (2 cols),
            // [3] tall (2 rows), [4] standard 1x1 fills the remaining cell.
            const span = [
              'lg:[grid-row:span_2]',
              'lg:[grid-row:span_2]',
              'lg:[grid-column:span_2]',
              'lg:[grid-row:span_2]',
              '',
            ][i] ?? ''
            return (
              <div
                key={src}
                className={`overflow-hidden rounded-xl border border-white/15 bg-white/5 ${span}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" className="block h-full w-full object-cover" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Phone({ src }: { src: string }) {
  return (
    <div className="relative aspect-[750/1624] w-full overflow-hidden rounded-[14%/6.5%] bg-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.5)] ring-1 ring-black/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" draggable={false} loading="lazy" className="pointer-events-none h-full w-full object-cover object-top" />
    </div>
  )
}
