'use client'

import { app as defaults } from './data'
import { DragCarousel } from '../shared/DragCarousel'

/**
 * SECTION 2 — WINGSTOP APP. Solid Wingstop-GREEN field. A feature carousel
 * (key features as app-screen modules) + a Component Library card + the desktop
 * site, all on the SHARED draggable rail (DragCarousel: native scroll + mouse
 * drag + flick momentum + jump-pills, full-bleed to the screen edge). Below the
 * rail, a bento of the shipped app using App Store imagery.
 */

// Equal card height across every rail item.
const CARD = 'flex h-[500px] w-[84vw] max-w-[680px] flex-col overflow-hidden rounded-2xl p-7 sm:w-[64vw] sm:p-8 lg:h-[520px] lg:w-[640px]'

export function AppSection() {
  // Build the rail items: 3 feature cards, the component-library card, the
  // desktop card. Each is wrapped by DragCarousel in a [data-card] shell.
  const items = [
    ...defaults.features.map((f) => <FeatureCard key={f.title} f={f} />),
    <ComponentCard key="components" />,
    <DesktopCard key="desktop" />,
  ]

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

      {/* Shared draggable rail (drag + momentum + jump-pills, edge-to-edge). */}
      <div className="mt-6 pb-4">
        <DragCarousel items={items} labels={defaults.pills} accent="#00843D" />
      </div>

      {/* Bento — the shipped app, App Store imagery */}
      <div className="br-container pb-20 pt-10 md:pb-[120px]">
        <div className="mb-5">
          <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-white/80">{defaults.bento.eyebrow}</span>
          <h3 className="mt-2 text-2xl font-semibold text-white sm:text-[28px]">{defaults.bento.title}</h3>
          <p className="mt-2 max-w-[60ch] text-[15px] text-white/80 sm:text-base">{defaults.bento.body}</p>
        </div>
        {/* These are the real App Store listing graphics (a phone mockup on a
            branded background, each its own art). Show them WHOLE at a uniform
            height so they read like the actual App Store gallery. */}
        {/* overflow-x-auto forces overflow-y:auto, which would clip the cards'
            drop shadow — so the vertical padding here must exceed the shadow's
            reach (y 24 + blur 50 ≈ 74px) to keep it from being cut off. */}
        <div className="-mx-6 flex gap-5 overflow-x-auto px-6 pt-6 pb-24 md:-mx-20 md:px-20 [scrollbar-width:thin]">
          {defaults.bento.images.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              loading="lazy"
              className="h-[460px] w-auto shrink-0 rounded-[20px] border border-white/15 object-contain [box-shadow:0_24px_50px_rgba(0,0,0,0.5)]"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/** A feature card: copy on top, a fan of app screens grounded at the bottom. */
function FeatureCard({ f }: { f: { eyebrow: string; title: string; body: string; screens: string[] } }) {
  return (
    <article className={`${CARD} border border-white/20 bg-white/[0.08] backdrop-blur-sm`}>
      <header className="max-w-[52ch]">
        <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-white/80">{f.eyebrow}</span>
        <h3 className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-[26px]">{f.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-white/80">{f.body}</p>
      </header>
      {/* A 5-phone fan: hero center, two peeks each side stepping back, smaller +
          dimmer + more rotated outward so the card reads as a full spread of
          screens. On phones we show only the hero. */}
      <div className="relative mt-5 flex min-h-0 flex-1 items-end justify-center">
        <div
          className="absolute bottom-4 hidden h-[66%] lg:block"
          style={{ aspectRatio: '750 / 1624', transform: 'translateX(-108%) rotate(-9deg)' }}
        >
          <Phone src={f.screens[3] ?? f.screens[0]} dim />
        </div>
        <div
          className="absolute bottom-4 hidden h-[66%] lg:block"
          style={{ aspectRatio: '750 / 1624', transform: 'translateX(108%) rotate(9deg)' }}
        >
          <Phone src={f.screens[4] ?? f.screens[1] ?? f.screens[0]} dim />
        </div>
        <div
          className="absolute bottom-2 hidden h-[80%] sm:block"
          style={{ aspectRatio: '750 / 1624', transform: 'translateX(-58%) rotate(-5deg)' }}
        >
          <Phone src={f.screens[0]} dim />
        </div>
        <div
          className="absolute bottom-2 hidden h-[80%] sm:block"
          style={{ aspectRatio: '750 / 1624', transform: 'translateX(58%) rotate(5deg)' }}
        >
          <Phone src={f.screens[2] ?? f.screens[0]} dim />
        </div>
        <div className="relative z-10 h-full max-h-[400px]" style={{ aspectRatio: '750 / 1624' }}>
          <Phone src={f.screens[1] ?? f.screens[0]} />
        </div>
      </div>
    </article>
  )
}

/** Component-library card (Panda/Baserate style), white. */
function ComponentCard() {
  return (
    <article className={`${CARD} border border-white/20 bg-white text-[var(--br-ink)]`}>
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
  )
}

/** Desktop-site card. */
function DesktopCard() {
  return (
    <article className={`${CARD} border border-white/20 bg-white/[0.08] backdrop-blur-sm`}>
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
  )
}

function Phone({ src, dim = false }: { src: string; dim?: boolean }) {
  // A real device: dark bezel, rounded corners, a small notch. The screen sits
  // inset so the frame reads as hardware, not just a rounded screenshot.
  return (
    <div
      className={`relative h-full w-full rounded-[15%/7%] bg-[#0c0d0d] p-[3.5%] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/10 ${
        dim ? 'brightness-[0.82] saturate-[0.92]' : ''
      }`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[12%/6%] bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" draggable={false} loading="lazy" className="pointer-events-none h-full w-full object-cover object-top" />
      </div>
      {/* notch */}
      <div className="absolute left-1/2 top-[3.5%] h-[1.6%] w-[34%] -translate-x-1/2 rounded-full bg-[#0c0d0d]" />
    </div>
  )
}
