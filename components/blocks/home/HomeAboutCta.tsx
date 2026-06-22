import Link from 'next/link'

export interface HomeAboutCtaProps {
  ctaHeading?: string
  ctaBody?: string
  ctaLabel?: string
  ctaUrl?: string
}

interface AboutItem {
  n: string
  title: string
  body: string
}

const ITEMS: AboutItem[] = [
  {
    n: '01',
    title: 'Full Design Systems',
    body: 'Long-term thinking and scalable architecture. Design as infrastructure, not decoration.',
  },
  {
    n: '02',
    title: 'Strategy through execution',
    body: 'Leadership backed by shipped product, not concept-only work.',
  },
  {
    n: '03',
    title: 'Clarity and Trust',
    body: 'A UX philosophy tuned for fintech, enterprise, and high-stakes interfaces.',
  },
]

/**
 * Home closing band (Figma 346-47084): three numbered "about" blocks — each
 * with an icon placeholder box (illustrations land later) — then the centered
 * availability CTA on a soft grey panel. Server component (no interactivity).
 */
export function HomeAboutCta({
  ctaHeading = 'Currently available for select engagements.',
  ctaBody = 'Senior product design, brand systems, and strategic consulting.',
  ctaLabel = 'Get in touch',
  ctaUrl = '/contact',
}: HomeAboutCtaProps) {
  return (
    <section className="home-container pb-24 pt-8 md:pb-32">
      {/* three numbered blocks */}
      <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((it) => (
          <div key={it.n}>
            {/* icon placeholder — illustration drops in later */}
            <div
              className="mb-7 aspect-[283/171] w-full rounded-[2px] bg-[rgba(217,217,217,0.25)]"
              aria-hidden
            />
            <p
              className="uppercase text-[#7e7f88]"
              style={{ fontFamily: 'var(--font-data)', fontSize: '16px' }}
            >
              {it.n}
            </p>
            <h3
              className="mt-3 uppercase text-[#070e2c]"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '16px' }}
            >
              {it.title}
            </h3>
            <p
              className="mt-3 max-w-[300px] text-[#242627]"
              style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.5 }}
            >
              {it.body}
            </p>
          </div>
        ))}
      </div>

      {/* CTA panel */}
      <div className="mt-20 flex min-h-[320px] flex-col items-center justify-center rounded-[10px] bg-[#f3f3f3] px-6 py-16 text-center md:mt-24">
        <h2
          className="uppercase text-black"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(22px, 3vw, 30px)' }}
        >
          {ctaHeading}
        </h2>
        <p
          className="mt-4 max-w-xl text-black"
          style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
        >
          {ctaBody}
        </p>
        <Link
          href={ctaUrl}
          className="group mt-7 inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-black transition-colors hover:border-black/50 hover:bg-black hover:text-white"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '12px' }}
        >
          {ctaLabel}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </section>
  )
}
