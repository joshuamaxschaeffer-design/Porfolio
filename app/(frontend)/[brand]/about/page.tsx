import type { Metadata } from 'next'
import { BRANDS } from '@/lib/brand'
import { AboutPage } from '@/components/blocks/about/AboutPage'

/**
 * /about — code-first content page (not CMS-driven).
 *
 * Like the Capabilities and case-study work, the About page is a hand-built
 * React component rather than a Payload Blocks document: the content is
 * authored, stable, and editorial, so a dedicated route + component is simpler
 * and more controllable than the page builder. This static `about/` segment
 * takes precedence over the catch-all `[[...slug]]` route, exactly as
 * `work/[slug]` does.
 *
 * Pre-rendered for both brands at build time. Today the copy is the personal
 * ("Product + Brand Design Lead") frame for both; when the Practice variant
 * gets its own framing, branch on the brand param here.
 */
export const revalidate = 3600

export function generateStaticParams() {
  return BRANDS.map((brand) => ({ brand }))
}

export const metadata: Metadata = {
  title: 'About',
  description:
    'Joshua Schaeffer — Product + Brand Design Lead. 13 years shipping product and brand end to end for Samsung, Panda Express, Wingstop, Mindbody, and Baserate.',
}

export default function About() {
  return <AboutPage />
}
