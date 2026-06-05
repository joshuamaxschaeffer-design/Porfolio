import type { Viewport } from 'next'
import { Inter, Lexend_Deca, Noto_Sans, Recursive } from 'next/font/google'
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

// Baserate design-system fonts (match Figma):
// headings = Lexend Deca, body = Noto Sans, data/mono = Recursive.
const lexend = Lexend_Deca({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
})
const notoSans = Noto_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
})
const recursive = Recursive({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-data',
  weight: ['400', '500'],
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
    <html
      lang="en"
      className={`${inter.variable} ${lexend.variable} ${notoSans.variable} ${recursive.variable}`}
    >
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
