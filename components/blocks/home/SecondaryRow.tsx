import Link from 'next/link'
import { Reveal } from '@/components/animation/Reveal'
import { Tilt3D } from '@/components/animation/Tilt3D'
import { secondary as defaultItems, type SecondaryItem } from './data'

export interface SecondaryRowProps {
  heading?: string
  items?: { title?: string; blurb?: string; meta?: string; href?: string }[]
}

/**
 * The lower three — Wingstop · Samsung · Capabilities. A compact 3-up row that
 * sits beneath the two flagship showpieces. Deliberately smaller than the
 * flagships so the page itself encodes the importance hierarchy: two things
 * are big, three things are small. Capabilities links to the discipline-grouped
 * /personal/capabilities page rather than a case study.
 */
export function SecondaryRow({ heading, items }: SecondaryRowProps) {
  const cards: SecondaryItem[] =
    items?.length
      ? items.map((it, i) => ({ ...defaultItems[i], ...stripEmpty(it) }))
      : defaultItems

  return (
    <section className="br-container my-20 md:my-28">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
        {heading ?? 'More work'}
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 80}>
            <Link href={c.href} className="group block">
              <Tilt3D max={5} scale={1.01}>
                <div className="flex aspect-[4/3] items-end overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 p-5 dark:border-neutral-800 dark:bg-neutral-900">
                  <span className="select-none font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                    {c.title} — visual slot
                  </span>
                </div>
              </Tilt3D>
              <div className="mt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-semibold tracking-tight md:text-xl">
                    {c.title}
                  </h3>
                  <span className="text-xs text-neutral-500">{c.meta}</span>
                </div>
                <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                  {c.blurb}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function stripEmpty<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== ''),
  ) as Partial<T>
}
