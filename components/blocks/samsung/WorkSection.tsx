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

      {/* BIG table acting as a backdrop; the takeover screens overlap up onto
          it, matching the Behance composition (#2). */}
      <TableWithScreens />

      {/* ── 3 · S7 store locator — full-bleed grey overlay, copy on the right ── */}
      <div className="pt-24 md:pt-32">
        <StoreLocatorPopout />
      </div>

      {/* ── 4 · Social ──────────────────────────────────────────────────── */}
      <div className="br-container pt-24 md:pt-32">
        <Workstream
          tag="Social Mockups"
          title="Hundreds of posts, one feed"
          body="Photo editing and device mockups for the brand’s social channels: phones, tablets, and Gear across launches, holidays, and carrier co-ops. A sample of the hundreds produced; drag to explore."
        />
      </div>
      {/* full-bleed rail so it never clips at the container edge (drag to center) */}
      <div className="mt-10">
        <SocialCarousel />
      </div>

      <div className="br-container">
        <div className="mt-16 border-l-2 border-[var(--sg-blue)] bg-white/[0.03] p-6 backdrop-blur-sm md:mt-20 md:p-8">
          <p className="max-w-4xl text-[15px] leading-relaxed text-[var(--sg-muted)] md:text-lg">
            {defaults.closer}
          </p>
        </div>
        {/* 100px clearance below the closer before the next section (#5) */}
        <div className="h-[64px] md:h-[100px]" />
      </div>
    </section>
  )
}

/**
 * TableWithScreens — the BIG in-store table acting as a backdrop, with the 3
 * takeover screens overlapping UP onto it and then staggering down the page
 * (Behance composition, #2/#8). A thin grey rail runs behind the screen column
 * to connect the set. The first screen pulls up with a negative margin so it
 * sits partly on top of the table.
 */
function TableWithScreens() {
  const aligns = ['md:mr-auto', 'md:ml-auto', 'md:mr-auto'] // left, right, left
  return (
    <div className="relative">
      {/* BIG table — full-res 3226px source for 2× density. Pull-up to close the
          gap above it is PROPORTIONAL (% of width, like the table itself) so it
          scales with the viewport instead of over-pulling on small screens. */}
      <div className="-mt-[6%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${W}/${inStore.device.file}`}
          alt={inStore.device.alt}
          width={inStore.device.w}
          height={inStore.device.h}
          className="mx-auto block w-full max-w-[2880px]"
        />
      </div>

      {/* Screens overlap the bottom of the table. The overlap is PERCENTAGE-based
          (relative to width, which is how the table height scales too) so the
          screens always sit on the lower part of the table at every width and
          never climb over the table/heading on mobile. The table's transparent
          shadow margin (~12% bottom) means ~-14% lands the screens on the table
          surface. */}
      <div className="relative z-10 -mt-[14%]">
        {/* connecting grey rail behind the screen column */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[8%] h-[84%] w-px -translate-x-1/2 bg-white/12 md:w-[2px]"
        />
        <div className="br-container relative flex flex-col gap-14 md:gap-24">
          {inStore.screens.map((s, i) => (
            <figure
              key={s.file}
              className={`w-full overflow-hidden ring-1 ring-[var(--sg-line)] md:w-[82%] ${aligns[i]}`}
              style={{ boxShadow: '0 50px 90px -28px rgba(0,0,0,0.7)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${W}/${s.file}`} alt={s.alt} loading="lazy" className="block w-full" />
            </figure>
          ))}
        </div>
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
