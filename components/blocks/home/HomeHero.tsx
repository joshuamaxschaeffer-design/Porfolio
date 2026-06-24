'use client'

import { useEffect, useRef } from 'react'
import { HeroTimeline } from './HeroTimeline'

export interface HomeHeroProps {
  /** Big wordmark. Defaults to "Schaeffer". */
  name?: string
  /** Small label under the wordmark. Defaults to "Design Solutions". */
  label?: string
}

/**
 * Home top section (Figma 335-73237). A tall opening band with the big
 * "SCHAEFFER" wordmark + "DESIGN" label, left-aligned to the home column.
 *
 * Name-aware nav: while this component is mounted it flags <html data-home-hero>
 * and toggles <html data-home-name-shown> based on whether the hero name is
 * still on screen. The nav wordmark (Nav.tsx, [data-nav-wordmark]) is hidden by
 * CSS until the name scrolls past, then fades in — so the name never appears in
 * two places at once. Cleans the attributes up on unmount (route change) so
 * other pages get a normal nav. Collapses to "always shown" under reduced
 * motion is unnecessary — the reveal is a fade, and the name is always reachable.
 */
export function HomeHero({ name = 'Schaeffer', label = 'Design Solutions' }: HomeHeroProps) {
  const sentinel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-home-hero', '')

    const el = sentinel.current
    if (!el) {
      // No sentinel (shouldn't happen) → show the nav name so it's never lost.
      root.setAttribute('data-home-name-shown', '')
      return () => {
        root.removeAttribute('data-home-hero')
        root.removeAttribute('data-home-name-shown')
      }
    }

    // The sentinel sits at the BOTTOM of the hero name. When it leaves the top
    // of the viewport (scrolled past), reveal the nav wordmark; restore on the
    // way back up. rootMargin top -52px ≈ the nav bar height so the swap lands
    // right as the name tucks under the bar.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) root.removeAttribute('data-home-name-shown')
        else root.setAttribute('data-home-name-shown', '')
      },
      { rootMargin: '-52px 0px 0px 0px', threshold: 0 },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      root.removeAttribute('data-home-hero')
      root.removeAttribute('data-home-name-shown')
    }
  }, [])

  return (
    <section className="relative flex min-h-[20vh] items-center py-0 md:min-h-[44vh] md:py-16">
      <div className="home-container">
        {/* w-fit so the label+timeline row below spans exactly the wordmark's
            width — the timeline's right edge lands on SCHAEFFER's right edge. */}
        <div className="w-fit">
          <h1
            className="font-heading uppercase leading-[0.9] tracking-[-0.01em] text-[var(--br-ink,#070e2c)]"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 500,
              fontSize: 'clamp(3rem, 11vw, 8.5rem)',
            }}
          >
            {name}
          </h1>
          {/* Sentinel anchored to the baseline of the name. */}
          <div ref={sentinel} aria-hidden className="h-px w-px" />

          {/* DESIGN SOLUTIONS label + the interactive process timeline filling
              the rest of the row to the wordmark's right edge. */}
          <div className="mt-4 flex items-center gap-4">
            <p
              className="shrink-0 whitespace-nowrap uppercase text-[var(--br-ink,#070e2c)]"
              style={{ fontFamily: 'var(--font-data)', fontSize: '14px', letterSpacing: '0.02em' }}
            >
              {label}
            </p>
            <HeroTimeline className="min-w-0 flex-1" />
          </div>
        </div>
      </div>
    </section>
  )
}
