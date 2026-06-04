/**
 * Convert a Payload Media doc into props for next/image including a
 * blur placeholder. Uses the auto-generated thumbnail (configured in
 * collections/Media.ts) as the low-quality preview.
 *
 * Usage:
 *   const props = mediaToImageProps(caseStudy.heroImage, { priority: true })
 *   <Image {...props} />
 */

type PayloadMedia = {
  url?: string
  alt?: string
  width?: number
  height?: number
  // The thumbnail size we configured in Media.ts
  sizes?: {
    thumbnail?: { url?: string; width?: number; height?: number }
    card?: { url?: string }
    feature?: { url?: string }
    hero?: { url?: string }
  }
} | null | undefined

export function mediaToImageProps(
  media: PayloadMedia,
  opts: { priority?: boolean; sizes?: string } = {}
) {
  if (!media?.url) return null

  // The 400px thumbnail makes a good blur source — small enough that it
  // doesn't add real bytes, big enough to blur cleanly.
  const blurUrl = media.sizes?.thumbnail?.url

  return {
    src: media.url,
    alt: media.alt || '',
    width: media.width || 1920,
    height: media.height || 1080,
    placeholder: blurUrl ? ('blur' as const) : ('empty' as const),
    blurDataURL: blurUrl,
    priority: opts.priority || false,
    sizes: opts.sizes || '(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1280px',
  }
}
