import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm uppercase tracking-wider text-neutral-500">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
        Couldn't find that page.
      </h1>
      <p className="mt-4 max-w-md text-neutral-600 dark:text-neutral-400">
        It might have moved, or never existed. Head home and try again.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-neutral-900 px-6 py-3 text-sm font-medium transition-colors hover:bg-neutral-900 hover:text-white dark:border-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-900"
      >
        Back home <span aria-hidden>→</span>
      </Link>
    </div>
  )
}
