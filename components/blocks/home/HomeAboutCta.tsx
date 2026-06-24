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
  img: string
}

const ITEMS: AboutItem[] = [
  {
    n: '01',
    title: 'Strategic Planning',
    body: 'Research and user needs always inform product strategy.',
    img: '/home/about/strategic-planning.webp',
  },
  {
    n: '02',
    title: 'Product Clarity',
    body: 'Long-term thinking, scalable architecture, clear leadership.',
    img: '/home/about/product-clarity.webp',
  },
  {
    n: '03',
    title: 'Full System Design',
    body: 'UX, UI, and Branding all form one complete product system.',
    img: '/home/about/full-system-design.webp',
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
          <div
            key={it.n}
            className="rounded-[8px] border border-[#e3e3e6] bg-white p-7"
          >
            {/* iso illustration — ~1/3 the block width, left-aligned. */}
            <div className="mb-5 flex aspect-square w-1/3 max-w-[120px] items-center justify-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.img} alt="" aria-hidden className="h-full w-full object-contain" />
            </div>
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

      {/* CTA panel — faint sketches photo background under a 70% white overlay.
          The image + overlay ARE the panel background (no solid fill on top, or
          it would hide the photo); content sits above via relative z-10. */}
      <div className="relative isolate mt-20 flex min-h-[480px] flex-col items-center justify-center overflow-hidden rounded-[10px] bg-[#f3f3f3] px-6 py-20 text-center md:mt-24 md:min-h-[520px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/home/about/cta-sketches.webp"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        />
        {/* light overlay to keep the photo faint (lighter now that the text sits
            on its own white card, so more of the sketches shows around it) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-white/55" />

        {/* white card carrying the text, centered over the sketches */}
        <div className="relative z-10 w-full max-w-2xl rounded-[10px] border border-black/5 bg-white px-8 py-12 shadow-[0_24px_60px_rgba(7,14,44,0.10)]">
          <h2
            className="uppercase text-black"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(22px, 3vw, 30px)' }}
          >
            {ctaHeading}
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-black"
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
      </div>
    </section>
  )
}
