import { cn } from '@/lib/utils'

interface CapabilitiesBlockProps {
  heading?: string
  items: Array<{ label: string }>
  style?: 'inline' | 'pills' | 'grid'
}

export function CapabilitiesBlock({ heading, items, style = 'inline' }: CapabilitiesBlockProps) {
  if (!items?.length) return null

  return (
    <section className="container my-16 px-6">
      {heading && (
        <h3 className="mb-4 text-sm font-mono uppercase tracking-wider text-neutral-500">
          {heading}
        </h3>
      )}
      {style === 'inline' && (
        <p className="text-lg font-medium tracking-tight md:text-xl">
          {items.map((item, i) => (
            <span key={i}>
              {item.label}
              {i < items.length - 1 && (
                <span className="mx-3 text-neutral-400" aria-hidden="true">·</span>
              )}
            </span>
          ))}
        </p>
      )}
      {style === 'pills' && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span
              key={i}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm dark:border-neutral-800"
            >
              {item.label}
            </span>
          ))}
        </div>
      )}
      {style === 'grid' && (
        <ul className={cn('grid gap-3 sm:grid-cols-2 md:grid-cols-3')}>
          {items.map((item, i) => (
            <li key={i} className="text-base">{item.label}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
