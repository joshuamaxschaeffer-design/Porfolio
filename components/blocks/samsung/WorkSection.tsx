import { work as defaults, webPages, inStore } from './data'
import { SocialCarousel } from './SocialCarousel'
import { GradientBackdrop } from './GradientBackdrop'

const W = '/samsung/work'

/**
 * Section 3 — THE WORK (dark / cinematic). Three movements:
 *  1. Product & landing pages → tall captures fanned out as SKEWED, receding
 *     perspective panels floating over the multi-color blurred gradient wash
 *     (the signature Behance "Product Pages" moment).
 *  2. In-store experience → the table render + its 16:9 takeover screens, on
 *     the dark field with a diagonal split.
 *  3. Social → the draggable bento carousel (restyled for dark).
 */
export function WorkSection({ intro }: { intro?: string } = {}) {
  return (
    <section id="work" className="relative border-t border-[var(--sg-line)] bg-[var(--sg-bg)]">
      <div className="br-container pt-16 pb-12 md:pt-24 md:pb-16">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--sg-blue)]">
          The Work
        </h2>
        <p className="mt-4 max-w-3xl text-[22px] font-medium leading-snug text-[var(--sg-ink)] md:text-[30px]">
          {intro ?? defaults.intro}
        </p>
      </div>

      {/* ── 1 · Product pages — skewed panels over the gradient ─────────── */}
      <ProductPagesStage />

      {/* ── 2 · In-store experience ─────────────────────────────────────── */}
      <div className="br-container pt-20 md:pt-28">
        <Workstream tag="In-Store Experience" title={inStore.title} body={inStore.body} />
        {/* table render, large, on a diagonal-split dark stage */}
        <div
          className="relative mt-10 overflow-hidden rounded-2xl border border-[var(--sg-line)]"
          style={{
            background:
              'linear-gradient(118deg, #15171c 0%, #15171c 44%, #0e0f13 44%, #0e0f13 100%)',
          }}
        >
          <GradientBackdrop intensity={0.16} className="[mask-image:radial-gradient(70%_80%_at_80%_30%,black,transparent_70%)]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${W}/${inStore.device.file}`}
            alt={inStore.device.alt}
            width={inStore.device.w}
            height={inStore.device.h}
            className="relative mx-auto block w-full max-w-[900px] px-4 py-8 md:py-12"
          />
        </div>
        {/* the three takeover screens */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:mt-6 md:grid-cols-3 md:gap-6">
          {inStore.screens.map((s) => (
            <ScreenCard key={s.file} file={s.file} alt={s.alt} />
          ))}
        </div>
        <div className="mt-5 md:mt-6">
          <ScreenCard file={inStore.locator.file} alt={inStore.locator.alt} />
        </div>
      </div>

      {/* ── 3 · Social ──────────────────────────────────────────────────── */}
      <div className="br-container pt-20 md:pt-28">
        <Workstream
          tag="Social Mockups"
          title="Hundreds of posts, one feed"
          body="Photo editing and device mockups for the brand’s social channels — phones, tablets, and Gear across launches, holidays, and carrier co-ops. A sample of the hundreds I produced; drag to explore."
        />
        <div className="mt-10">
          <SocialCarousel />
        </div>

        {/* closer */}
        <div className="mt-16 rounded-2xl border-l-2 border-[var(--sg-blue)] bg-white/[0.03] p-6 backdrop-blur-sm md:mt-20 md:p-8">
          <p className="max-w-4xl text-[15px] leading-relaxed text-[var(--sg-muted)] md:text-lg">
            {defaults.closer}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── Product pages stage: skewed receding panels over the gradient ──────── */
function ProductPagesStage() {
  return (
    <div className="relative mt-2 overflow-hidden">
      {/* the big multi-color blurred gradient wash */}
      <GradientBackdrop intensity={1} />
      {/* darken top/bottom edges so it blends into the charcoal sections */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, var(--sg-bg) 0%, rgba(32,35,40,0) 16%, rgba(32,35,40,0) 84%, var(--sg-bg) 100%)',
        }}
      />

      <div className="br-container relative py-16 md:py-24">
        <div className="max-w-xl">
          <p className="br-data text-[12px] font-semibold uppercase tracking-[0.2em] text-white/90">
            {webPages.tag}
          </p>
          <h3 className="mt-3 text-[26px] font-semibold leading-tight text-white md:text-[34px]">
            {webPages.title}
          </h3>
          <p className="mt-3 max-w-md text-[15px] leading-normal text-white/80 md:text-base">
            {webPages.body}
          </p>
        </div>

        {/* skewed perspective fan of the tall landing pages */}
        <div
          className="mt-12 md:mt-16"
          style={{ perspective: '2200px', perspectiveOrigin: '50% 40%' }}
        >
          <div
            className="flex justify-center gap-5 md:gap-8"
            style={{
              transform: 'rotateX(14deg) rotateY(-22deg) rotateZ(6deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {webPages.shots.map((s, i) => (
              <SkewPanel key={s.file} file={s.file} alt={s.alt} depth={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** One tall landing-page panel, clipped to a window, lifted in Z so the row
 *  reads as receding cards (each successive panel pushed slightly back). */
function SkewPanel({ file, alt, depth }: { file: string; alt: string; depth: number }) {
  return (
    <figure
      className="relative w-[30%] max-w-[300px] shrink-0 overflow-hidden rounded-xl ring-1 ring-white/15"
      style={{
        height: 'clamp(280px, 38vw, 520px)',
        transform: `translateZ(${-depth * 60}px) translateY(${depth * 14}px)`,
        boxShadow: '0 30px 60px -20px rgba(0,0,0,0.6), 0 8px 20px -8px rgba(0,0,0,0.5)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${W}/${file}`} alt={alt} loading="lazy" className="block w-full" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(125deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 30%)' }}
      />
    </figure>
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

/** A 16:9 (or wide) flat screen capture in a dark card. */
function ScreenCard({ file, alt }: { file: string; alt: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-[var(--sg-line)] bg-black/40">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${W}/${file}`} alt={alt} loading="lazy" className="block w-full" />
    </figure>
  )
}
