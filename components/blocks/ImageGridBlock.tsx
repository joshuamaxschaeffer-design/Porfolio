import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageGridBlockProps {
  images: Array<{
    image: { url: string; alt?: string; width?: number; height?: number }
    caption?: string
  }>
  columns?: '2' | '3' | '4'
  aspectRatio?: 'natural' | 'square' | '4-3' | '16-9' | '3-4'
}

export function ImageGridBlock({ images, columns = '3', aspectRatio = 'natural' }: ImageGridBlockProps) {
  if (!images?.length) return null

  const gridCols = {
    '2': 'sm:grid-cols-2',
    '3': 'sm:grid-cols-2 md:grid-cols-3',
    '4': 'sm:grid-cols-2 md:grid-cols-4',
  }[columns]

  const aspectClass = {
    natural: '',
    square: 'aspect-square',
    '4-3': 'aspect-[4/3]',
    '16-9': 'aspect-video',
    '3-4': 'aspect-[3/4]',
  }[aspectRatio]

  return (
    <section className="container my-12 px-6 md:my-16">
      <div className={cn('grid grid-cols-1 gap-4 md:gap-6', gridCols)}>
        {images.map((item, i) => (
          <figure key={i} className="group">
            <div className={cn('relative overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900', aspectClass)}>
              {item.image?.url && (
                <Image
                  src={item.image.url}
                  alt={item.image.alt || ''}
                  width={item.image.width || 1200}
                  height={item.image.height || 900}
                  className={cn('w-full', aspectRatio !== 'natural' && 'h-full object-cover')}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
            </div>
            {item.caption && (
              <figcaption className="mt-2 text-sm text-neutral-500">{item.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  )
}
