import { RichText } from '@payloadcms/richtext-lexical/react'
import { cn } from '@/lib/utils'

interface TextSectionBlockProps {
  eyebrow?: string
  heading?: string
  body?: any
  width?: 'narrow' | 'wide' | 'full'
}

export function TextSectionBlock({ eyebrow, heading, body, width = 'narrow' }: TextSectionBlockProps) {
  const widthClass = {
    narrow: 'max-w-prose',
    wide: 'max-w-3xl',
    full: 'max-w-5xl',
  }[width]

  return (
    <section className="py-12 md:py-16">
      <div className={cn('container px-6', widthClass)}>
        {eyebrow && (
          <p className="mb-3 text-sm font-mono uppercase tracking-wider text-neutral-500">
            {eyebrow}
          </p>
        )}
        {heading && (
          <h2 className="mb-6 text-3xl font-semibold tracking-tight md:text-4xl">{heading}</h2>
        )}
        {body && (
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <RichText data={body} />
          </div>
        )}
      </div>
    </section>
  )
}
