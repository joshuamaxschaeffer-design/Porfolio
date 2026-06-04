import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { asBrand, BRANDS, type Brand } from '@/lib/brand'
import { getSettings, getNavigation, getFooter } from '@/lib/queries'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

interface BrandLayoutProps {
  children: React.ReactNode
  params: Promise<{ brand: string }>
}

// Pre-render both brand shells at build time.
export function generateStaticParams() {
  return BRANDS.map((brand) => ({ brand }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>
}): Promise<Metadata> {
  const brand = asBrand((await params).brand)
  const settings = await getSettings(brand)
  return {
    title: {
      default:
        settings?.siteName ||
        (brand === 'practice' ? 'Schaeffer Practice' : 'Joshua Schaeffer'),
      template: `%s — ${settings?.siteName || 'Schaeffer'}`,
    },
    description: settings?.tagline || undefined,
    openGraph: {
      type: 'website',
      images:
        settings?.defaultOGImage &&
        typeof settings.defaultOGImage === 'object' &&
        settings.defaultOGImage.url
          ? [{ url: settings.defaultOGImage.url }]
          : undefined,
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function BrandLayout({ children, params }: BrandLayoutProps) {
  const { brand: rawBrand } = await params
  // Guard against any path that isn't a real brand reaching this segment.
  if (rawBrand !== 'personal' && rawBrand !== 'practice') notFound()
  const brand: Brand = rawBrand

  const [nav, footer, settings] = await Promise.all([
    getNavigation(brand),
    getFooter(brand),
    getSettings(brand),
  ])

  return (
    <div data-brand={brand} className="contents">
      <Nav nav={nav} settings={settings} brand={brand} />
      <main>{children}</main>
      <Footer footer={footer} settings={settings} brand={brand} />
    </div>
  )
}
