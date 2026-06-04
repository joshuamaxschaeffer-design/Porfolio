import Image from 'next/image'
import { Marquee } from '@/components/animation/Marquee'

interface MarqueeLogosBlockRendererProps {
  logos: Array<{
    id: string
    name: string
    image: { url: string; alt?: string }
  }>
  duration?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
}

export function MarqueeLogosBlockRenderer({
  logos,
  duration = 40,
  direction = 'left',
  pauseOnHover = true,
}: MarqueeLogosBlockRendererProps) {
  if (!logos?.length) return null

  return (
    <section className="my-16">
      <Marquee duration={duration} direction={direction} pauseOnHover={pauseOnHover}>
        {logos.map((logo) => (
          <div key={logo.id} className="flex h-10 shrink-0 items-center">
            {logo.image?.url && (
              <Image
                src={logo.image.url}
                alt={logo.image.alt || logo.name}
                width={140}
                height={40}
                className="max-h-8 w-auto opacity-50 grayscale"
              />
            )}
          </div>
        ))}
      </Marquee>
    </section>
  )
}
