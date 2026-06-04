import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/animation/Reveal'
import { Tilt3D } from '@/components/animation/Tilt3D'

interface FeaturedWorkBlockProps {
  caseStudies: Array<{
    id: string
    slug: string
    title: string
    client: string
    role: string
    oneLineOutcome: string
    heroImage?: { url: string; alt?: string; width?: number; height?: number }
  }>
  layout?: 'single' | 'two' | 'three'
}

export function FeaturedWorkBlock({ caseStudies, layout = 'two' }: FeaturedWorkBlockProps) {
  if (!caseStudies?.length) return null

  const gridCols = {
    single: 'grid-cols-1',
    two: 'grid-cols-1 md:grid-cols-2',
    three: 'grid-cols-1 md:grid-cols-3',
  }[layout]

  return (
    <section className="container my-16 px-6 md:my-24">
      <div className={cn('grid gap-6 md:gap-8', gridCols)}>
        {caseStudies.map((cs, i) => (
          <Reveal key={cs.id} delay={i * 80}>
            <Link href={`/work/${cs.slug}`} className="group block">
              <Tilt3D max={6} scale={1.01}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
                  {cs.heroImage?.url && (
                    <Image
                      src={cs.heroImage.url}
                      alt={cs.heroImage.alt || cs.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                </div>
              </Tilt3D>
              <div className="mt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                    {cs.client}
                  </h3>
                  <span className="text-sm text-neutral-500">{cs.role}</span>
                </div>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                  {cs.oneLineOutcome}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
