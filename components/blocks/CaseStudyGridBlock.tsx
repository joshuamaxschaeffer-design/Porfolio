import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CaseStudyGridBlockProps {
  caseStudies: Array<{
    id: string
    slug: string
    title: string
    client: string
    oneLineOutcome: string
    heroImage?: { url: string; alt?: string }
  }>
  columns?: '2' | '3'
}

export function CaseStudyGridBlock({ caseStudies, columns = '2' }: CaseStudyGridBlockProps) {
  if (!caseStudies?.length) return null
  const gridCols = columns === '3' ? 'md:grid-cols-3' : 'md:grid-cols-2'

  return (
    <section className="container my-16 px-6">
      <div className={cn('grid grid-cols-1 gap-6', gridCols)}>
        {caseStudies.map((cs) => (
          <Link key={cs.id} href={`/work/${cs.slug}`} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
              {cs.heroImage?.url && (
                <Image
                  src={cs.heroImage.url}
                  alt={cs.heroImage.alt || cs.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              )}
            </div>
            <h3 className="mt-3 text-lg font-medium">{cs.client}</h3>
            <p className="text-sm text-neutral-500">{cs.oneLineOutcome}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
