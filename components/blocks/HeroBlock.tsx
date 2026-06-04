import Image from 'next/image'
import Link from 'next/link'

interface HeroBlockProps {
  eyebrow?: string
  headline: string
  subhead?: string
  background?: 'none' | 'image' | 'video' | 'animation'
  backgroundMedia?: { url: string; alt?: string } | null
  cta?: { label?: string; url?: string }
}

export function HeroBlock({
  eyebrow,
  headline,
  subhead,
  background = 'none',
  backgroundMedia,
  cta,
}: HeroBlockProps) {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      {background === 'image' && backgroundMedia?.url && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={backgroundMedia.url}
            alt={backgroundMedia.alt || ''}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}
      {background === 'animation' && (
        // Custom animated background goes here. Replace with the process animation component.
        <div className="absolute inset-0 -z-10 opacity-30" aria-hidden="true">
          {/* TODO: Drop in the wireframe process animation component */}
        </div>
      )}
      <div className="container max-w-4xl px-6">
        {eyebrow && (
          <p className="mb-6 text-sm font-mono uppercase tracking-wider text-neutral-500">
            {eyebrow}
          </p>
        )}
        <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl">
          {headline}
        </h1>
        {subhead && (
          <p className="mt-6 max-w-2xl text-balance text-lg text-neutral-600 dark:text-neutral-400 md:text-xl">
            {subhead}
          </p>
        )}
        {cta?.label && cta?.url && (
          <div className="mt-10">
            <Link
              href={cta.url}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-900 px-6 py-3 text-sm font-medium transition-colors hover:bg-neutral-900 hover:text-white dark:border-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-900"
            >
              {cta.label} <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
