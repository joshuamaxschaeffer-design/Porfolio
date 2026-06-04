import { notFound } from 'next/navigation'
import { asBrand, BRANDS } from '@/lib/brand'
import { getPageBySlug, getAllPageSlugsForBrand } from '@/lib/queries'
import { BlockRenderer } from '@/components/BlockRenderer'

interface DynamicPageProps {
  params: Promise<{ brand: string; slug?: string[] }>
}

// ISR: every page is statically generated at build time, then regenerated
// in the background every hour OR on-demand via /api/revalidate when CMS
// content changes. The brand is part of the route segment, so the cache key
// distinguishes /personal/about from /practice/about.
export const revalidate = 3600 // 1 hour fallback; on-demand revalidation is faster

// Generate static paths for BOTH brands at build time. Each published page
// for each brand gets pre-rendered, so first visits are instant.
export async function generateStaticParams() {
  const params: { brand: string; slug?: string[] }[] = []
  for (const brand of BRANDS) {
    const slugs = await getAllPageSlugsForBrand(brand)
    for (const slug of slugs) {
      params.push({
        brand,
        slug: slug === 'home' ? [] : slug.split('/'),
      })
    }
  }
  return params
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { brand: rawBrand, slug: slugParts } = await params
  const brand = asBrand(rawBrand)
  const slug = slugParts?.join('/') || 'home'

  const page = await getPageBySlug(slug, brand)
  if (!page) notFound()

  return <BlockRenderer blocks={page.blocks || []} />
}

export async function generateMetadata({ params }: DynamicPageProps) {
  const { brand: rawBrand, slug: slugParts } = await params
  const brand = asBrand(rawBrand)
  const slug = slugParts?.join('/') || 'home'
  const page = await getPageBySlug(slug, brand)
  if (!page) return {}
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description,
  }
}
