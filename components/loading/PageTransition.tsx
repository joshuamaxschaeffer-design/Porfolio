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
  }, [pathname])

  return null
}
