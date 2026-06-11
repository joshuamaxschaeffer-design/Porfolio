import Link from 'next/link'
import type { Brand } from '@/lib/brand'
import { WorkNavGlass, type WorkPill } from './WorkNavGlass'
import { NavIconLink } from './NavIconLink'
import { MobileNav } from './MobileNav'
import { AboutIcon, ContactIcon, HomeIcon } from './nav-icons'

interface NavProps {
  nav: any
  settings: any
  brand: Brand
}

/** Work case-study sections shown as a vertical glass pill dropdown.
 *  Capabilities is the catch-all. */
const WORK_PILLS: WorkPill[] = [
  { label: 'Baserate', href: '/work/baserate' },
  { label: 'Panda Express', href: '/work/panda-express' },
  { label: 'Samsung', href: '/work/samsung' },
  { label: 'Wingstop', href: '/work/wingstop' },
  { label: 'Capabilities', href: '/work/capabilities' },
]

export function Nav({ nav, settings, brand }: NavProps) {
  // Wordmark: "Schaeffer" on both brands (per request).
  const siteName = 'Schaeffer'

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[var(--glass-border)] bg-[var(--glass-bar)] backdrop-blur-[12px] backdrop-saturate-150 [box-shadow:0_1px_0_rgba(255,255,255,0.5)_inset,0_6px_18px_rgba(7,14,44,0.06)]"
      style={
        {
          // Navy on the light personal brand; light on the dark practice brand.
          '--nav-fg': brand === 'practice' ? '#e7e7ea' : '#070E2C',
          '--nav-fg-hover': brand === 'practice' ? '#ffffff' : '#000000',
          '--nav-muted': brand === 'practice' ? '#9a9aa3' : '#7e7f88',
          // Whiter glass so pills + bar read on dark backgrounds too. On the
          // dark practice brand the white is pushed more opaque for contrast.
          '--glass-bar':
            brand === 'practice' ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.55)',
          // More opaque variant for the mobile panel (covers page content fully).
          '--glass-bar-solid':
            brand === 'practice' ? 'rgba(20,20,24,0.82)' : 'rgba(255,255,255,0.86)',
          '--glass-fill':
            brand === 'practice' ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.55)',
          '--glass-fill-hover':
            brand === 'practice' ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.78)',
          '--glass-border':
            brand === 'practice' ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.7)',
        } as React.CSSProperties
      }
    >
      <nav className="mx-auto flex h-[52px] w-full max-w-[1443px] items-center justify-between px-6 md:px-20">
        {/* Wordmark — Lexend Deca Medium, uppercase, tracked. */}
        <Link
          href="/"
          className="uppercase tracking-[0.08em] text-[var(--nav-fg)]"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '18px' }}
        >
          {siteName}
        </Link>

        {/* Desktop: equal fixed-width icon boxes (NAV_BOX); hover swaps the
            icon for the label instantly in place — nothing moves. */}
        <ul className="hidden h-full items-center gap-5 md:flex lg:gap-7">
          <li>
            <NavIconLink href="/" label="Home" icon={<HomeIcon />} />
          </li>
          <li className="flex h-full items-center">
            <WorkNavGlass items={WORK_PILLS} brand={brand} />
          </li>
          <li>
            <NavIconLink href="/about" label="About" icon={<AboutIcon />} />
          </li>
          <li>
            <NavIconLink href="/contact" label="Contact" icon={<ContactIcon />} />
          </li>
        </ul>

        {/* Mobile: hamburger → big glass pills. */}
        <MobileNav workItems={WORK_PILLS} brand={brand} />
      </nav>
    </header>
  )
}
