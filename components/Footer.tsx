import Link from 'next/link'
import type { Brand } from '@/lib/brand'

interface FooterProps {
  footer: any
  settings: any
  brand: Brand
}

export function Footer({ footer, settings, brand }: FooterProps) {
  const columns = footer?.columns || []
  const copyright = footer?.copyrightText || `© ${new Date().getFullYear()} Joshua Schaeffer`
  const otherSite =
    brand === 'personal'
      ? { label: 'Schaeffer Practice', url: 'https://schaefferpractice.com' }
      : { label: 'Joshua Schaeffer', url: 'https://schaeffer.design' }

  return (
    <footer className="container mt-24 border-t border-neutral-200 px-6 py-12 dark:border-neutral-800">
      <div className="grid gap-10 md:grid-cols-4">
        <div>
          <p className="text-base font-semibold tracking-tight">{settings?.siteName}</p>
          {settings?.tagline && (
            <p className="mt-2 max-w-xs text-sm text-neutral-500">{settings.tagline}</p>
          )}
        </div>
        {columns.slice(0, 3).map((col: any, i: number) => (
          <div key={i}>
            {col.heading && (
              <h4 className="mb-3 text-xs font-mono uppercase tracking-wider text-neutral-500">
                {col.heading}
              </h4>
            )}
            <ul className="space-y-2 text-sm">
              {(col.items || []).map((item: any, j: number) => (
                <li key={j}>
                  <Link href={item.url} className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-col gap-3 border-t border-neutral-200 pt-6 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between dark:border-neutral-800">
        <p>{copyright}</p>
        <Link href={otherSite.url} className="hover:text-neutral-900 dark:hover:text-neutral-100">
          {otherSite.label} →
        </Link>
      </div>
    </footer>
  )
}
