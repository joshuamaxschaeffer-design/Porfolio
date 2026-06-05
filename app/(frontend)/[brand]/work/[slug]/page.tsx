import { notFound } from 'next/navigation'
import Image from 'next/image'
import { asBrand, BRANDS } from '@/lib/brand'
import { getCaseStudyBySlug, getAllCaseStudySlugsForBrand } from '@/lib/queries'
import { BlockRenderer } from '@/components/BlockRenderer'

interface CaseStudyPageProps {
  params: Promise<{ brand: string; slug: string }>
}

// ISR + static generation — every case study pre-built at deploy, per brand.
export const revalidate = 3600

export async function generateStaticParams() {
  const params: { brand: string; slug: string }[] = []
  for (const brand of BRANDS) {
    const slugs = await getAllCaseStudySlugsForBrand(brand)
    for (const slug of slugs) params.push({ brand, slug })
  }
  return params
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { brand: rawBrand, slug } = await params
  const brand = asBrand(rawBrand)
  const cs = await getCaseStudyBySlug(slug, brand)
  if (!cs) notFound()

  // Some blocks own the entire page (their own header, hero, layout). When a
  // case study is built from one of these "full-bleed" blocks, skip the generic
  // template chrome so it isn't duplicated.
  const FULL_BLEED_BLOCKS = ['baserateCaseStudy']
  const isFullBleed = (cs.blocks || []).some((b: any) => FULL_BLEED_BLOCKS.includes(b.blockType))

  if (isFullBleed) {
    return (
      <article>
        <BlockRenderer blocks={cs.blocks || []} />
      </article>
    )
  }

  return (
    <article>
      {/* Hero header */}
      <header className="container my-16 px-6 md:my-24">
        <div className="max-w-3xl">
          <p className="text-sm font-mono uppercase tracking-wider text-neutral-500">
            {cs.client}
            {cs.dates?.start && ` · ${cs.dates.start}${cs.dates.end ? `–${cs.dates.end}` : ''}`}
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            {cs.title}
          </h1>
          <p className="mt-6 text-balance text-lg text-neutral-600 dark:text-neutral-400 md:text-xl">
            {cs.oneLineOutcome}
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-neutral-500">
            <div>
              <span className="block text-xs uppercase tracking-wider">Role</span>
              <span className="text-neutral-900 dark:text-neutral-100">{cs.role}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero image */}
      {cs.heroImage?.url && (
        <div className="container my-12 px-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
            <Image
              src={cs.heroImage.url}
              alt={cs.heroImage.alt || cs.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        </div>
      )}

      {/* Metrics row */}
      {cs.metrics && cs.metrics.length > 0 && (
        <section className="container my-16 px-6">
          <div className="grid gap-8 md:grid-cols-4">
            {cs.metrics.map((m: any, i: number) => (
              <div key={i}>
                <p className="text-3xl font-semibold tracking-tight md:text-4xl">{m.value}</p>
                <p className="mt-2 text-sm text-neutral-500">{m.label}</p>
                {m.description && (
                  <p className="mt-1 text-xs text-neutral-500">{m.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Body blocks */}
      <BlockRenderer blocks={cs.blocks || []} />

      {/* Testimonial */}
      {cs.testimonial && typeof cs.testimonial === 'object' && (
        <section className="container my-20 px-6">
          <blockquote className="mx-auto max-w-2xl">
            <p className="text-balance text-xl font-medium leading-snug md:text-2xl">
              "{cs.testimonial.quote}"
            </p>
            <footer className="mt-6 text-sm text-neutral-500">
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {cs.testimonial.name}
              </span>
              {cs.testimonial.title && ` · ${cs.testimonial.title}`}
              {cs.testimonial.company && `, ${cs.testimonial.company}`}
            </footer>
          </blockquote>
        </section>
      )}
    </article>
  )
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { brand: rawBrand, slug } = await params
  const brand = asBrand(rawBrand)
  const cs = await getCaseStudyBySlug(slug, brand)
  if (!cs) return {}
  return {
    title: `${cs.title} — ${cs.client}`,
    description: cs.oneLineOutcome,
  }
}
