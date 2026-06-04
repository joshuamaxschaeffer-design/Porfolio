import Link from 'next/link'
import type { Brand } from '@/lib/brand'

interface NavProps {
  nav: any
  settings: any
  brand: Brand
}

export function Nav({ nav, settings, brand }: NavProps) {
  const siteName = settings?.siteName || (brand === 'practice' ? 'Schaeffer Practice' : 'Joshua Schaeffer')
  const items = nav?.items || []

  return (
    <nav className="container flex items-center justify-between px-6 py-6">
      <Link href="/" className="text-base font-semibold tracking-tight">
        {siteName}
      </Link>
      <ul className="flex items-center gap-6 text-sm">
        {items.map((item: any, i: number) => {
          const href =
            item.type === 'external'
              ? item.externalUrl
              : item.page && typeof item.page === 'object'
                ? item.page.slug === 'home'
                  ? '/'
                  : `/${item.page.slug}`
                : '#'
          return (
            <li key={i}>
              <Link href={href} className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
