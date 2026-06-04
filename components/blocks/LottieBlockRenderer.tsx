import { LottieAnimation } from '@/components/animation/LottieAnimation'
import { Reveal } from '@/components/animation/Reveal'
import { cn } from '@/lib/utils'

interface LottieBlockRendererProps {
  file: { url: string } | null
  loop?: boolean
  autoplay?: boolean
  playOnHover?: boolean
  width?: 'narrow' | 'wide' | 'full'
  caption?: string
}

export function LottieBlockRenderer({
  file,
  loop = true,
  autoplay = true,
  playOnHover = false,
  width = 'wide',
  caption,
}: LottieBlockRendererProps) {
  if (!file?.url) return null

  const containerClass = {
    narrow: 'max-w-md',
    wide: 'max-w-2xl',
    full: 'max-w-none',
  }[width]

  return (
    <figure className={cn('container my-12 px-6 md:my-16', containerClass)}>
      <Reveal>
        <LottieAnimation
          src={file.url}
          loop={loop}
          autoplay={autoplay}
          playOnHover={playOnHover}
        />
      </Reveal>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-neutral-500">{caption}</figcaption>
      )}
    </figure>
  )
}
