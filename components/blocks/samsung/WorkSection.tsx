import { work as defaults, inStore } from './data'
import { SocialCarousel } from './SocialCarousel'
import { ProductPagesStage } from './ProductPagesStage'
import { StoreLocatorPopout } from './StoreLocatorPopout'

const W = '/samsung/work'

/**
 * Section 3 — THE WORK (dark / cinematic). Movements:
 *  1. Product & landing pages → ProductPagesStage (big, left, parallax, gradient).
 *  2. In-store experience → BIG table on the BARE section background (no
 *     container), then 3 large takeover screens stacked + staggered L/R with a
 *     thin grey rail connecting them.
 *  3. S7 store locator → StoreLocatorPopout (page behind + popout over, on grey).
 *  4. Social → the draggable bento carousel.
 * No rounded corners anywhere (per Joshua).
 */
export function WorkSection({ intro }: { intro?: string } = {}) {
  return (
    <section id="work" className="relative bg-[var(--sg-bg)]">
      <div className="br-container pt-16 md:pt-24">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--sg-blue)]">
          The Work
        </h2>
        <p className="mt-4 max-w-3xl text-[22px] font-medium leading-snug text-[var(--sg-ink)] md:text-[30px]">
          {intro ?? defaults.intro}
        </p>
      </div>

      {/* 100px breathing room below the intro (#6) */}
      <div className="h-[64px] md:h-[100px]" />

      {/* ── 1 · Product pages ───────────────────────────────────────────── */}
      <ProductPagesStage />

      {/* ── 2 · In-store experience ─────────────────────────────────────── */}
      <div className="br-container pt-24 md:pt-32">
        <Workstream tag="In-Store Experience" title={inStore.title} body={inStore.body} />
      </div>

      {/* BIG table render — sits directly on the section background (#7) */}
      <div className="br-container pt-10 md:pt-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${W}/${inStore.device.file}`}
          alt={inStore.device.alt}
          width={inStore.device.w}
          height={inStore.device.h}
          className="mx-auto block w-full max-w-[1320px]"
        />
      </div>

      {/* 3 takeover screens — large, stacked, staggered L/R, grey rail behind (#8) */}
      <StaggeredScreens />

      {/* ── 3 · S7 store locator — full-bleed grey popout overlay ────────── */}
      <div className="br-container pt-24 md:pt-32">
        <p className="br-data text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--sg-blue)]">
          S7 Store Locator
        </p>
        <p className="mt-3 max-w-2xl text-[15px] leading-normal text-[var(--sg-muted)] md:text-base">
          Full-page design and UI for the S7 launch, locating a nearby store to buy the device.
        </p>
      </div>
      <div className="pt-10 md:pt-14">
        <StoreLocatorPopout />
      </div>

      {/* ── 4 · Social ──────────────────────────────────────────────────── */}
      <div className="br-container pt-24 md:pt-32">
        <Workstream
          tag="Social Mockups"
          title="Hundreds of posts, one feed"
          body="Photo editing and device mockups for the brand’s social channels: phones, tablets, and Gear across launches, holidays, and carrier co-ops. A sample of the hundreds produced; drag to explore."
        />
        <div className="mt-10">
          <SocialCarousel />
        </div>

        <div className="mt-16 border-l-2 border-[var(--sg-blue)] bg-white/[0.03] p-6 backdrop-blur-sm md:mt-20 md:p-8">
          <p className="max-w-4xl text-[15px] leading-relaxed text-[var(--sg-muted)] md:text-lg">
            {defaults.closer}
          </p>
        </div>
      </div>
    </section>
  )
}

/**
 * StaggeredScreens — the 3 in-store takeover captures, LARGE, stacked
 * vertically and staggered left/right, with a thin grey rectangle running
 * behind them to connect the set (per Joshua's Behance example, #8/#9).
 */
function StaggeredScreens() {
  // each screen alternates which side it hugs; the rail sits behind the column.
  const aligns = ['md:mr-auto', 'md:ml-auto', 'md:mr-auto'] // left, right, left
  return (
    <div className="relative pt-16 md:pt-24">
      {/* connecting grey rail — thin vertical rectangle centered behind */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10 md:w-[2px]"
      />
      <div className="br-container relative flex flex-col gap-12 md:gap-20">
        {inStore.screens.map((s, i) => (
          <figure
            key={s.file}
            className={`w-full overflow-hidden ring-1 ring-[var(--sg-line)] md:w-[78%] ${aligns[i]}`}
            style={{ boxShadow: '0 40px 80px -30px rgba(0,0,0,0.6)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${W}/${s.file}`} alt={s.alt} loading="lazy" className="block w-full" />
          </figure>
        ))}
      </div>
    </div>
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
