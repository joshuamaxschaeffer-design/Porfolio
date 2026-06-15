'use client'

import { useEffect, useState } from 'react'

/**
 * True when running in Safari (desktop or iOS) — including Safari-engine
 * browsers on iOS, which all share WebKit. Chrome/Edge/Firefox return false.
 *
 * SSR-safe: returns `false` on the server and on the first client render, then
 * flips to the real value after mount. That avoids a hydration mismatch — the
 * markup is identical on both sides; only post-mount behaviour (e.g. dropping a
 * heavy scroll-scrub on Safari) changes. Consumers should treat `false` as
 * "full effects" so non-Safari and the pre-mount frame both get the rich path.
 *
 * Why we special-case Safari: WebKit re-rasterizes filter:blur() and re-paints
 * <canvas> on scroll far more aggressively than Blink/Gecko, so per-scroll-frame
 * blur/canvas work that's smooth elsewhere drops Safari to single-digit fps.
 */
export function useIsSafari(): boolean {
  const [isSafari, setIsSafari] = useState(false)
  useEffect(() => {
    const ua = navigator.userAgent
    // Safari UA contains "Safari" but NOT Chrome/Chromium/Android. Also catch
    // iOS browsers (CriOS/FxiOS are still WebKit under the hood).
    const webkit =
      /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(ua) ||
      /iP(ad|hone|od)/.test(ua)
    setIsSafari(webkit)
  }, [])
  return isSafari
}
