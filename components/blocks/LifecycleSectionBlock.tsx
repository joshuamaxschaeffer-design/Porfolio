import Image from 'next/image'

interface LifecycleSectionBlockProps {
  phase: 'strategy' | 'brand' | 'product' | 'systems' | 'launch'
  title: string
  description?: string
  logos?: Array<{
    id: string
    name: string
    image: { url: string; alt?: string }
  }>
  artifacts?: Array<{
    image: { url: string; alt?: string }
    caption?: string
  }>
}

export function LifecycleSectionBlock({
  phase,
  title,
  description,
  logos,
  artifacts,
}: LifecycleSectionBlockProps) {
  return (
    <section className="container my-16 px-6 md:my-20">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">
            {phase}
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h3>
          {description && (
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">{description}</p>
          )}
        </div>
        <div className="md:col-span-8">
          {logos && logos.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-6">
              {logos.map((logo) => (
                <div key={logo.id} className="flex h-8 items-center">
                  {logo.image?.url && (
                    <Image
                      src={logo.image.url}
                      alt={logo.image.alt || logo.name}
                      width={100}
                      height={32}
                      className="max-h-7 w-auto opacity-60 grayscale"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          {artifacts && artifacts.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {artifacts.map((art, i) => (
                <figure key={i}>
                  {art.image?.url && (
                    <div className="relative aspect-square overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-900">
                      <Image
                        src={art.image.url}
                        alt={art.image.alt || ''}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  )}
                  {art.caption && (
                    <figcaption className="mt-1 text-xs text-neutral-500">
                      {art.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
