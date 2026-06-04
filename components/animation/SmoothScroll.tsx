'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

/**
 * Wraps the app in Lenis smooth-scroll. Respects prefers-reduced-motion
 * (disables itself for users who request reduced motion). Cheap (~10KB gzipped).
 *
 * Drop this once inside the root layout.
 */
export function SmoothScroll() {
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mql.matches) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Don't hijack touch — native momentum scroll feels better on mobile
      syncTouch: false,
    })

    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return null
}
