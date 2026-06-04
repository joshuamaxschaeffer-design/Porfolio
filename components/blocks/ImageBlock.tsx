import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageBlockProps {
  image: { url: string; alt?: string; width?: number; height?: number }
  caption?: string
  width?: 'narrow' | 'wide' | 'full'
}

export function ImageBlock({ image, caption, width = 'wide' }: ImageBlockProps) {
  if (!image?.url) return null
  const containerClass = {
    narrow: 'max-w-2xl',
    wide: 'max-w-5xl',
    full: 'max-w-none',
  }[width]

  return (
    <figure className={cn('container my-12 px-6 md:my-16', containerClass)}>
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={image.url}
          alt={image.alt || ''}
          width={image.width || 1920}
          height={image.height || 1080}
          className="h-auto w-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1280px"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-neutral-500">{caption}</figcaption>
      )}
    </figure>
  )
}
