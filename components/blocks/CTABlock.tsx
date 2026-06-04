import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CTABlockProps {
  heading: string
  body?: string
  ctaLabel: string
  ctaUrl: string
  align?: 'center' | 'left'
}

export function CTABlock({ heading, body, ctaLabel, ctaUrl, align = 'center' }: CTABlockProps) {
  return (
    <section className="container my-20 px-6 md:my-32">
      <div className={cn('mx-auto max-w-3xl', align === 'center' ? 'text-center' : 'text-left')}>
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          {heading}
        </h2>
        {body && (
          <p className="mt-4 text-balance text-lg text-neutral-600 dark:text-neutral-400">
            {body}
          </p>
        )}
        <div className={cn('mt-8', align === 'center' && 'flex justify-center')}>
          <Link
            href={ctaUrl}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-900 px-6 py-3 text-sm font-medium transition-colors hover:bg-neutral-900 hover:text-white dark:border-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-900"
          >
            {ctaLabel} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
