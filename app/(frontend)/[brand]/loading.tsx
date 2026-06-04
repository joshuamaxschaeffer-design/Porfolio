/**
 * Instant loading skeleton. Streams in as soon as a route is requested,
 * before any data is fetched. Replaced by the real page when ready.
 *
 * Keep this VERY minimal — it should look like a quiet pulse, not a UI.
 */
export default function Loading() {
  return (
    <div className="container px-6 py-24 md:py-32">
      <div className="max-w-4xl">
        {/* Pulsing eyebrow */}
        <div className="h-3 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        {/* Pulsing headline */}
        <div className="mt-6 h-12 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-3 h-12 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        {/* Pulsing paragraph */}
        <div className="mt-8 space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  )
}
