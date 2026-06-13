import type { Metadata } from 'next'
import { BRANDS } from '@/lib/brand'
import { ContactPage } from '@/components/blocks/contact/ContactPage'

/**
 * /contact — code-first page with an interactive inquiry form.
 *
 * Static `contact/` segment (takes precedence over the catch-all [[...slug]],
 * like work/[slug] and about/). The page shell is server-rendered and
 * pre-built for both brands; the form is a client island that POSTs to
 * /api/contact, which emails Joshua via Resend.
 */
export const revalidate = 3600

export function generateStaticParams() {
  return BRANDS.map((brand) => ({ brand }))
}

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Start a conversation about product design, brand systems, or a full product-and-brand engagement with Joshua Schaeffer.',
}

export default function Contact() {
  return <ContactPage />
}
