import Link from 'next/link'
import type { Brand } from '@/lib/brand'
import { WorkNavGlass, type WorkPill } from './WorkNavGlass'

interface NavProps {
  nav: any
  settings: any
  brand: Brand
}

/** Work case-study sections shown as liquid-glass pills under the Work tab.
 *  Capabilities is the catch-all. */
const WORK_PILLS: WorkPill[] = [
  { label: 'Baserate', href: '/work/baserate' },
  { label: 'Panda Express', href: '/work/panda-express' },
  { label: 'Samsung', href: '/work/samsung' },
  { label: 'Wingstop', href: '/work/wingstop' },
  { label: 'Capabilities', href: '/work/capabilities' },
]

export function Nav({ nav, settings, brand }: NavProps) {
  const siteName =
    settings?.siteName || (brand === 'practice' ? 'Schaeffer Practice' : 'Joshua Schaeffer')
  const items = nav?.items || []

  return (
    <div className="container flex justify-center px-6 py-5">
      {/* Glass capsule — same recipe as the left SectionNav rail
          (Figma 234:53845): neutral glass fill + 10px backdrop blur,
          hairline border, shadow biased downward. */}
      <nav className="flex items-center gap-2 rounded-full border border-[rgba(7,14,44,0.05)] bg-[rgba(242,242,245,0.24)] py-1.5 pl-4 pr-2 backdrop-blur-[10px] [box-shadow:0_8px_22px_rgba(7,14,44,0.09),0_2px_6px_rgba(7,14,44,0.05)]">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
        >
          {siteName}
        </Link>

        <span aria-hidden className="mx-1 h-4 w-px bg-[rgba(7,14,44,0.1)]" />

        <ul className="flex items-center gap-1 text-sm">
          <li>
            <WorkNavGlass items={WORK_PILLS} />
          </li>
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
                <Link
                  href={href}
                  className="rounded-full px-3 py-1.5 text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
