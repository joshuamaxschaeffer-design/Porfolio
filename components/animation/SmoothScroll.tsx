'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

/**
 * Wraps the app in Lenis smooth-scroll. Respects prefers-reduced-motion
 * (disables itself for users who request reduced motion). Cheap (~10KB gzipped).
 *
 * Drop this once inside the root layout.
 *
 * Safari note: Safari throttles requestAnimationFrame harder than Chrome during
 * scroll/compositing, so duration-based easing renders in visible steps ("low
 * keyframe" stutter) and any useScroll-driven animation inherits that low
 * cadence. We use `lerp` smoothing instead — it eases the scroll toward its
 * target by a fixed fraction each frame, so it stays smooth even when frames
 * arrive unevenly. The imported `lenis/dist/lenis.css` (in layout) is also
 * required: without it the browser's native scroll-behavior fights Lenis, which
 * is a major source of Safari jank.
 */
export function SmoothScroll() {
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mql.matches) return

    const lenis = new Lenis({
      // lerp (0–1): fraction of the remaining distance covered each frame.
      // ~0.12 is a smooth, responsive feel that survives Safari's uneven rAF
      // much better than a fixed `duration` ease.
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1,
      // Don't hijack touch — native momentum scroll feels better on mobile.
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
