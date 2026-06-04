import Image from 'next/image'

interface LogoWallBlockProps {
  logos: Array<{
    id: string
    name: string
    image: { url: string; alt?: string; width?: number; height?: number }
  }>
  maxCount?: number
  randomize?: boolean
}

export function LogoWallBlock({ logos, maxCount = 8, randomize = false }: LogoWallBlockProps) {
  if (!logos?.length) return null
  let list = [...logos]
  if (randomize) list = list.sort(() => Math.random() - 0.5)
  list = list.slice(0, maxCount)

  return (
    <section className="container my-16 px-6">
      <div className="grid grid-cols-3 gap-x-8 gap-y-10 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {list.map((logo) => (
          <div key={logo.id} className="flex h-12 items-center justify-center">
            {logo.image?.url && (
              <Image
                src={logo.image.url}
                alt={logo.image.alt || logo.name}
                width={logo.image.width || 120}
                height={logo.image.height || 40}
                className="max-h-10 w-auto opacity-60 grayscale transition-opacity hover:opacity-100"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
