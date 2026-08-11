import { HeroSection } from './HeroSection'
import { NumbersSection } from './NumbersSection'
import { ProductSection } from './ProductSection'
import { LibrarySection } from './LibrarySection'
import { ShippedSection } from './ShippedSection'
import { BusinessSection } from './BusinessSection'
import { CreditsSection } from './CreditsSection'
import { SectionNav, type SectionNavItem } from '../baserate/SectionNav'

/**
 * Unfold case study, v2. Seven beats, visual first, ~600 words of copy total.
 * Rebuilt per positioning research 2026-08-10: reviewers scan in seconds, so
 * captions carry the story and every claim is specific and attributable.
 * Green dashed blocks are VisualPlaceholder markers for art Joshua will make.
 */

const NAV_ITEMS: SectionNavItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'numbers', title: 'In Numbers' },
  { id: 'product', title: 'The Product' },
  { id: 'library', title: 'Study Library' },
  { id: 'shipped', title: 'How It Shipped' },
  { id: 'business', title: 'Business Layer' },
  { id: 'credits', title: 'Credits + Next' },
]

export interface UnfoldCaseStudyProps {
  lead?: string
}

export function UnfoldCaseStudy(props: UnfoldCaseStudyProps = {}) {
  return (
    <article
      className="br-article bg-[#fff6e8]"
      style={{ '--uf-green': '#349c72', '--uf-cream': '#fff6e8', '--uf-charcoal': '#1c1a17' } as React.CSSProperties}
    >
      <SectionNav items={NAV_ITEMS} />
      <HeroSection lead={props.lead} />
      <NumbersSection />
      <ProductSection />
      <LibrarySection />
      <ShippedSection />
      <BusinessSection />
      <CreditsSection />
    </article>
  )
}
