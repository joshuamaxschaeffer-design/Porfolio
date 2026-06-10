import Link from 'next/link'
import type { Brand } from '@/lib/brand'
import { WorkNavGlass, type WorkPill } from './WorkNavGlass'

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
  // Wordmark per Figma (Frame 3109). Practice brand keeps its own name.
  const siteName = brand === 'practice' ? 'Schaeffer Practice' : 'Schaeffer Solutions'

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[rgba(7,14,44,0.06)] bg-[rgba(242,242,245,0.24)] backdrop-blur-[10px] [box-shadow:0_1px_0_rgba(255,255,255,0.4)_inset,0_6px_18px_rgba(7,14,44,0.05)]"
      style={
        {
          // Navy on the light personal brand; light on the dark practice brand.
          '--nav-fg': brand === 'practice' ? '#d4d4d8' : '#070E2C',
          '--nav-fg-hover': brand === 'practice' ? '#ffffff' : '#000000',
        } as React.CSSProperties
      }
    >
      <nav className="mx-auto flex h-[52px] w-full max-w-[1443px] items-center justify-between px-6 md:px-20">
        {/* Wordmark — Lexend Deca Medium, uppercase, tracked (Figma P-Header). */}
        <Link
          href="/"
          className="uppercase tracking-[0.08em] text-[var(--nav-fg)]"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '18px' }}
        >
          {siteName}
        </Link>

        {/* Right links — Lexend Deca ~14px, uppercase, tracked. */}
        <ul className="flex items-center gap-7 md:gap-9">
          <li>
            <Link
              href="/"
              className="uppercase tracking-[0.08em] text-[var(--nav-fg)] transition-colors hover:text-[var(--nav-fg-hover)]"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '14px' }}
            >
              Home
            </Link>
          </li>
          <li>
            <WorkNavGlass items={WORK_PILLS} />
          </li>
          <li>
            <Link
              href="/about"
              className="uppercase tracking-[0.08em] text-[var(--nav-fg)] transition-colors hover:text-[var(--nav-fg-hover)]"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '14px' }}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="uppercase tracking-[0.08em] text-[var(--nav-fg)] transition-colors hover:text-[var(--nav-fg-hover)]"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '14px' }}
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
