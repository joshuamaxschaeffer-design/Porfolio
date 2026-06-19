import { work as defaults, webPages, inStore } from './data'
import { SocialCarousel } from './SocialCarousel'

const W = '/samsung/work'

/**
 * Section 3 — THE WORK. Three workstreams, each shown with the real assets at
 * their TRUE aspect ratio (per Joshua, 2026-06-19 — no forcing widescreen
 * captures into phone frames):
 *   1. Web & product pages → tall page-scroll cards in faux browser chrome
 *   2. In-store experience → the table render + its 16:9 screens + locator
 *   3. Social → the draggable bento carousel (SocialCarousel)
 */
export function WorkSection({ intro }: { intro?: string } = {}) {
  return (
    <section id="work" className="bg-white">
      <div className="br-container pt-16 pb-20 md:pt-20 md:pb-[120px]">
        <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          3. {defaults.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">
          {intro ?? defaults.intro}
        </p>

        {/* ── 1 · Web & product pages ─────────────────────────────────── */}
        <Workstream tag={webPages.tag} title={webPages.title} body={webPages.body} />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-10 md:grid-cols-3 md:gap-6">
          {webPages.shots.map((s) => (
            <PageScrollCard key={s.file} file={s.file} alt={s.alt} />
          ))}
        </div>

        {/* ── 2 · In-store experience ─────────────────────────────────── */}
        <Workstream
          tag={inStore.tag}
          title={inStore.title}
          body={inStore.body}
          className="mt-16 md:mt-24"
        />
        {/* The physical table render — leads the block, transparent bg sits on
            a soft brand-tinted stage. */}
        <div
          className="mt-8 overflow-hidden rounded-[var(--br-card-radius)] md:mt-10"
          style={{
            background:
              'radial-gradient(120% 100% at 50% 18%, rgba(20,40,160,0.07) 0%, rgba(20,40,160,0.02) 40%, transparent 70%), var(--br-bg-2)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${W}/${inStore.device.file}`}
            alt={inStore.device.alt}
            width={inStore.device.w}
            height={inStore.device.h}
            className="mx-auto block w-full max-w-[920px] px-4 py-6 md:py-10"
          />
        </div>
        {/* The three 16:9 takeover screens */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:mt-6 md:grid-cols-3 md:gap-6">
          {inStore.screens.map((s) => (
            <ScreenCard key={s.file} file={s.file} alt={s.alt} />
          ))}
        </div>
        {/* Store-locator module — wide crop, full width under the screens */}
        <div className="mt-5 md:mt-6">
          <ScreenCard file={inStore.locator.file} alt={inStore.locator.alt} />
        </div>

        {/* ── 3 · Social ──────────────────────────────────────────────── */}
        <Workstream
          tag="SOCIAL MOCKUPS"
          title="Hundreds of posts, one feed"
          body="Photo editing and device mockups for the brand’s social channels — phones, tablets, and Gear across launches, holidays, and carrier co-ops. A sample of the hundreds I produced; drag to explore."
          className="mt-16 md:mt-24"
        />
        <div className="mt-8 md:mt-10">
          <SocialCarousel />
        </div>

        {/* Era closer strip */}
        <div className="mt-14 rounded-[var(--br-card-radius)] border-l-[3px] border-[var(--sg-blue)] bg-[var(--br-bg-2)] p-6 md:mt-20 md:p-7">
          <p className="max-w-4xl text-[15px] leading-normal text-[var(--br-body)] md:text-lg">
            {defaults.closer}
          </p>
        </div>
      </div>
    </section>
  )
}

/** A workstream heading block (tag · title · body). */
function Workstream({
  tag,
  title,
  body,
  className,
}: {
  tag: string
  title: string
  body: string
  className?: string
}) {
  return (
    <div className={className}>
      <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--sg-blue)]">{tag}</p>
      <h3 className="mt-3 max-w-3xl text-[24px] font-semibold leading-tight text-[var(--br-ink)] md:text-[28px]">
        {title}
      </h3>
      <p className="mt-3 max-w-3xl text-[15px] leading-normal text-[var(--br-muted)] md:text-base">
        {body}
      </p>
    </div>
  )
}

/**
 * PageScrollCard — a tall full-page capture shown in faux browser chrome, with
 * the page clipped to a fixed viewport height. The image hovers to "scroll"
 * (translateY) so the full long page reveals on hover without a real scroller.
 */
function PageScrollCard({ file, alt }: { file: string; alt: string }) {
  return (
    <figure className="group overflow-hidden rounded-[14px] bg-white [box-shadow:0_1px_2px_rgba(0,0,0,0.08),0_22px_48px_-26px_rgba(8,12,24,0.4)]">
      {/* browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-[var(--br-line)] bg-[var(--br-bg-2)] px-3.5 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#e1e3ea]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e1e3ea]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e1e3ea]" />
        <span className="ml-2 h-3.5 flex-1 rounded-full bg-[#edeef3]" />
      </div>
      {/* clipped page viewport — image scrolls on hover */}
      <div className="relative h-[300px] overflow-hidden md:h-[340px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${W}/${file}`}
          alt={alt}
          loading="lazy"
          className="block w-full transition-transform duration-[5000ms] ease-linear will-change-transform group-hover:[transform:translateY(calc(-100%+300px))] md:group-hover:[transform:translateY(calc(-100%+340px))]"
        />
        {/* bottom fade hinting more page below */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/90 to-transparent transition-opacity duration-300 group-hover:opacity-0"
        />
      </div>
    </figure>
  )
}

/** ScreenCard — a 16:9 (or wide) flat screen capture, full-bleed within a card. */
function ScreenCard({ file, alt }: { file: string; alt: string }) {
  return (
    <figure className="overflow-hidden rounded-[14px] bg-[#0c0e13] [box-shadow:0_1px_2px_rgba(0,0,0,0.1),0_20px_44px_-24px_rgba(8,12,24,0.42)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${W}/${file}`} alt={alt} loading="lazy" className="block w-full" />
    </figure>
  )
}
