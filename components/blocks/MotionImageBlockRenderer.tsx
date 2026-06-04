import { MotionImage } from '@/components/animation/MotionImage'
import { Reveal } from '@/components/animation/Reveal'
import { cn } from '@/lib/utils'

interface MotionImageBlockRendererProps {
  image: { url: string; alt?: string; width?: number; height?: number }
  alt?: string
  skewX?: number
  skewY?: number
  rotate?: number
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  shadow?: 'none' | 'soft' | 'dramatic' | 'colored' | 'drop-png'
  shadowColor?: string
  shadowBlur?: number
  shadowOffsetX?: number
  shadowOffsetY?: number
  maskImage?: { url: string } | null
  hover?: 'none' | 'lift' | 'tilt-3d' | 'parallax-skew'
  tiltMax?: number
  width?: 'narrow' | 'wide' | 'full'
  caption?: string
}

export function MotionImageBlockRenderer(props: MotionImageBlockRendererProps) {
  const { image, alt, width = 'wide', caption, maskImage, ...rest } = props
  if (!image?.url) return null

  const containerClass = {
    narrow: 'max-w-2xl',
    wide: 'max-w-5xl',
    full: 'max-w-none',
  }[width]

  return (
    <figure className={cn('container my-12 px-6 md:my-16', containerClass)}>
      <Reveal>
        <MotionImage
          src={image.url}
          alt={alt || image.alt || ''}
          width={image.width}
          height={image.height}
          maskImageUrl={maskImage?.url}
          {...rest}
        />
      </Reveal>
      {caption && (
        <figcaption className="mt-3 text-sm text-neutral-500">{caption}</figcaption>
      )}
    </figure>
  )
}
