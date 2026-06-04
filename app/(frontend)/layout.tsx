import type { Viewport } from 'next'
import { Inter } from 'next/font/google'
import { SmoothScroll } from '@/components/animation/SmoothScroll'
import { SpeculationRules } from '@/components/loading/SpeculationRules'
import { PageTransition } from '@/components/loading/PageTransition'
import '../globals.css'

// Self-hosted via next/font. font-display: swap. Subset to latin.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

/**
 * Root frontend shell — brand-agnostic. The `<html>`/`<body>` and global
 * client behaviors live here; per-brand chrome (Nav/Footer) and brand-aware
 * metadata live in `[brand]/layout.tsx`, which receives the brand via the
 * route segment the middleware rewrites to.
 */
export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <SpeculationRules />
      </head>
      <body>
        <SmoothScroll />
        <PageTransition />
        {children}
      </body>
    </html>
  )
}
