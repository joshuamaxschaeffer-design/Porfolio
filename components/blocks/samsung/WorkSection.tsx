import { work as defaults, inStore } from './data'
import { SocialCarousel } from './SocialCarousel'
import { ProductPagesStage } from './ProductPagesStage'
import { StoreLocatorPopout } from './StoreLocatorPopout'

const W = '/samsung/work'

/**
 * Section 3 — THE WORK (dark / cinematic). Three movements:
 *  1. Product & landing pages → full pages, angled in perspective, alternating
 *     parallax, over the full-bleed sharp-edged gradient (ProductPagesStage).
 *  2. In-store experience → a BIG table render, then 3 flat staggered takeover
 *     screens, then the S7 store locator as an angled popout that grows on
 *     scroll (StoreLocatorPopout) — Behance layout.
 *  3. Social → the draggable bento carousel (uniform tiles; wide banner gone).
 */
export function WorkSection({ intro }: { intro?: string } = {}) {
  return (
    <section id="work" className="relative bg-[var(--sg-bg)]">
      <div className="br-container pt-16 pb-12 md:pt-24">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--sg-blue)]">
          The Work
        </h2>
        <p className="mt-4 max-w-3xl text-[22px] font-medium leading-snug text-[var(--sg-ink)] md:text-[30px]">
          {intro ?? defaults.intro}
        </p>
      </div>

      {/* +100px breathing room below the intro before the gradient (#10) */}
      <div className="h-[60px] md:h-[100px]" />

      {/* ── 1 · Product pages — full-bleed gradient + angled parallax ────── */}
      <ProductPagesStage />

      {/* ── 2 · In-store experience ─────────────────────────────────────── */}
      <div className="br-container pt-20 md:pt-28">
        <Workstream tag="In-Store Experience" title={inStore.title} body={inStore.body} />

        {/* BIG table render */}
        <div
          className="relative mt-12 overflow-hidden rounded-2xl border border-[var(--sg-line)] md:mt-16"
          style={{
            background:
              'radial-gradient(80% 90% at 60% 30%, #1b1e24 0%, #121419 70%, #0e0f13 100%)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${W}/${inStore.device.file}`}
            alt={inStore.device.alt}
            width={inStore.device.w}
            height={inStore.device.h}
            className="relative mx-auto block w-full max-w-[1200px] px-2 py-6 md:py-10"
          />
        </div>

        {/* 3 flat, vertically staggered takeover screens (Behance structure) */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3 md:gap-7">
          {inStore.screens.map((s, i) => (
            <div key={s.file} className={i === 1 ? 'md:mt-12' : i === 2 ? 'md:mt-24' : ''}>
              <ScreenCard file={s.file} alt={s.alt} />
            </div>
          ))}
        </div>

        {/* S7 store locator — angled popout, grows on scroll (#6) */}
        <div className="mt-20 md:mt-28">
          <p className="br-data text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--sg-blue)]">
            S7 Store Locator
          </p>
          <h3 className="mt-3 max-w-2xl text-[24px] font-semibold leading-tight text-[var(--sg-ink)] md:text-[30px]">
            Helping customers find a store
          </h3>
          <p className="mt-3 max-w-2xl text-[15px] leading-normal text-[var(--sg-muted)] md:text-base">
            Full-page design and UI for the S7 launch — locating a nearby store to buy the device.
          </p>
          <div className="mt-12 md:mt-16">
            <StoreLocatorPopout />
          </div>
        </div>
      </div>

      {/* ── 3 · Social ──────────────────────────────────────────────────── */}
      <div className="br-container pt-20 md:pt-28">
        <Workstream
          tag="Social Mockups"
          title="Hundreds of posts, one feed"
          body="Photo editing and device mockups for the brand’s social channels — phones, tablets, and Gear across launches, holidays, and carrier co-ops. A sample of the hundreds produced; drag to explore."
        />
        <div className="mt-10">
          <SocialCarousel />
        </div>

        <div className="mt-16 rounded-2xl border-l-2 border-[var(--sg-blue)] bg-white/[0.03] p-6 backdrop-blur-sm md:mt-20 md:p-8">
          <p className="max-w-4xl text-[15px] leading-relaxed text-[var(--sg-muted)] md:text-lg">
            {defaults.closer}
          </p>
        </div>
      </div>
    </section>
  )
}

function Workstream({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <div>
      <p className="br-data text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--sg-blue)]">{tag}</p>
      <h3 className="mt-3 max-w-3xl text-[24px] font-semibold leading-tight text-[var(--sg-ink)] md:text-[30px]">
        {title}
      </h3>
      <p className="mt-3 max-w-3xl text-[15px] leading-normal text-[var(--sg-muted)] md:text-base">{body}</p>
    </div>
  )
}

function ScreenCard({ file, alt }: { file: string; alt: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-[var(--sg-line)] bg-black/40">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${W}/${file}`} alt={alt} loading="lazy" className="block w-full" />
    </figure>
  )
}
