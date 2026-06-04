/**
 * Media URL resolver for the Baserate case study.
 *
 * Images are small enough to ship in /public and commit to git.
 * Videos are large (~60–80MB each) so they are NOT committed — they live in a
 * CDN (Vercel Blob). Set NEXT_PUBLIC_MEDIA_BASE_URL to the Blob base URL in
 * production; in dev it falls back to the local /public copies.
 *
 * Example:
 *   NEXT_PUBLIC_MEDIA_BASE_URL=https://<id>.public.blob.vercel-storage.com/baserate
 *   videoSrc('decision-demo.mp4')
 *     dev  -> /baserate/videos/decision-demo.mp4
 *     prod -> https://<id>.public.blob.vercel-storage.com/baserate/videos/decision-demo.mp4
 */

const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || '').replace(/\/$/, '')

/** Resolve a video file (in the videos/ folder) to a CDN or local URL. */
export function videoSrc(file: string): string {
  const path = `/videos/${file}`
  return MEDIA_BASE ? `${MEDIA_BASE}${path}` : `/baserate${path}`
}

/** Optional poster image shown before a video loads / if it fails. */
export function posterSrc(file?: string): string | undefined {
  if (!file) return undefined
  return MEDIA_BASE ? `${MEDIA_BASE}/videos/${file}` : `/baserate/videos/${file}`
}
