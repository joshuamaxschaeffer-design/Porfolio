'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * View Transitions API integration. Each route change triggers a CSS
 * view-transition. In browsers without the API (Firefox, older Safari),
 * navigation works normally — just without the cross-fade.
 *
 * Combined with named view-transition CSS, you can morph specific elements
 * across pages (e.g., a case study card image growing into the hero).
 */
export function PageTransition() {
  const pathname = usePathname()

  useEffect(() => {
    // Add a class to body briefly to suppress flicker during transitions
    document.body.dataset.pathname = pathname

    // Always land at the TOP of the new route. Next's default scroll reset is
    // defeated here by Lenis smooth-scroll (it keeps + re-applies its own scroll
    // offset), so links from the footer "More Work" carousel — which lives at
    // the BOTTOM of a case study — were landing mid/bottom of the next page.
    // Skip when the URL targets an in-page anchor so #hash links still work.
    if (typeof window !== 'undefined' && !window.location.hash) {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis
      if (lenis) {
        // Reset Lenis immediately (no animation) AND on the next frame, since
        // Lenis re-applies its stored target on its own rAF tick.
        lenis.scrollTo(0, { immediate: true, force: true })
        requestAnimationFrame(() => lenis.scrollTo(0, { immediate: true, force: true }))
      }
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
}
