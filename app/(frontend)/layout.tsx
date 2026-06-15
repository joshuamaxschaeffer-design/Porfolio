import type { Viewport } from 'next'
import { Inter, Noto_Sans, Roboto } from 'next/font/google'
import localFont from 'next/font/local'
import { SmoothScroll } from '@/components/animation/SmoothScroll'
import { SpeculationRules } from '@/components/loading/SpeculationRules'
import { PageTransition } from '@/components/loading/PageTransition'
import 'lenis/dist/lenis.css'
import '../globals.css'

// Self-hosted via next/font. font-display: swap. Subset to latin.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
})

// Baserate design-system fonts (match Figma exactly):
// headings = Lexend Deca, body = Noto Sans, data/pills = Recursive.
// Lexend + Recursive are self-hosted from the exact variable font files.
const lexend = localFont({
  src: '../fonts/LexendDeca.woff2',
  display: 'swap',
  variable: '--font-heading',
  weight: '100 900',
})
const recursive = localFont({
  src: '../fonts/Recursive.woff2',
  display: 'swap',
  variable: '--font-data',
  weight: '300 1000',
  // Recursive is only used by the Baserate case study's ported product UI
  // (Handoff code/comments). Don't preload it on every page — it loaded ~407KB
  // on the home page for nothing. With preload:false it fetches on demand when
  // those glyphs actually render (display:swap keeps text visible meanwhile).
  preload: false,
})
const notoSans = Noto_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
})
// Roboto — used by the Baserate product UI components ported into the Handoff
// section, so they render in the exact product typeface. Self-hosted at build.
const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  weight: ['400', '500', '700'],
  // Baserate-only (Handoff product UI). Don't preload site-wide.
  preload: false,
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
      className={`${inter.variable} ${lexend.variable} ${notoSans.variable} ${recursive.variable} ${roboto.variable}`}
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
