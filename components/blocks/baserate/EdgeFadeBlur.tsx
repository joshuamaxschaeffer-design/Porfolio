'use client'

/**
 * EdgeFadeBlur — wraps a full-bleed horizontal carousel and softens its left &
 * right edges so the content dissolves into the section background instead of
 * hard-cutting at the viewport edge.
 *
 * Two effects, both confined to a `width`-px band on each side:
 *  1. FADE — a horizontal mask fades the scrolling content to transparent over
 *     the band, revealing the section background behind it. (Cheap, robust.)
 *  2. PROGRESSIVE BLUR — stacked `backdrop-filter` layers, each with a larger
 *     blur radius and a mask that only reveals it nearer the edge, so the blur
 *     ramps from 0 (inner) to max (outer). This is the "frosted gradient"
 *     technique; kept to a few layers + sub-20px radii for mobile GPU budget.
 *
 * Usage: <EdgeFadeBlur bg="var(--br-bg-2)">{carousel}</EdgeFadeBlur>
 * The child is the bleeding track (it scrolls; the overlays don't).
 */

// True tilt-shift ramp: many fine layers whose blur RADIUS climbs from ~1px at
// the inner edge of the band to the max at the outer edge. Each layer is masked
// to a narrow band so the *effective* blur at any x is the radius assigned to
// that x — a genuine progressive blur, not one heavy blur fading in opacity.
const LAYERS = 8
const MIN_BLUR = 1 // px at the inner edge of the band
const MAX_BLUR = 18 // px at the very edge

function blurLayer(side: 'left' | 'right', width: number) {
  const dir = side === 'left' ? 'to left' : 'to right'
  return Array.from({ length: LAYERS }, (_, i) => {
    // radius grows with i; ease so it stays gentle near the inner edge and
    // ramps up toward the outer edge (quadratic feels closest to a lens)
    const t = i / (LAYERS - 1)
    const radius = MIN_BLUR + (MAX_BLUR - MIN_BLUR) * (t * t)
    // this layer paints from its band onward; a short feather (one band wide)
    // hands off smoothly to the next, heavier layer
    const bandStart = (i / LAYERS) * 100
    const bandFeatherEnd = ((i + 1) / LAYERS) * 100
    const mask = `linear-gradient(${dir}, transparent ${bandStart}%, black ${bandFeatherEnd}%, black 100%)`
    return (
      <div
        key={`${side}-${i}`}
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          [side]: 0,
          width,
          backdropFilter: `blur(${radius.toFixed(2)}px)`,
          WebkitBackdropFilter: `blur(${radius.toFixed(2)}px)`,
          WebkitMaskImage: mask,
          maskImage: mask,
          pointerEvents: 'none',
        }}
      />
    )
  })
}

export function EdgeFadeBlur({
  children,
  bg,
  width = 200,
  className = '',
}: {
  children: React.ReactNode
  /** the section background the edges fade INTO (e.g. 'var(--br-bg-2)' or '#fff') */
  bg: string
  /** px width of the fade/blur band on each side */
  width?: number
  className?: string
}) {
  // The content fade: a mask transparent at both outer edges → opaque in the
  // middle, over `width` px. Using a mask (not an overlay gradient) genuinely
  // reveals whatever is behind, over any background.

  return (
    // overflow-x:clip guarantees nothing this wraps (a wide marquee / scroll
    // track) can push the page wider, WITHOUT creating a scroll container.
    // ALL edge effects (fade mask + blur + bg wash) are DESKTOP-ONLY (≥lg) — on
    // mobile/tablet the carousels show plain, crisp edges (no blur, no fade to
    // grey). The mask is applied via the `.br-edgefade` class which only sets
    // mask-image at ≥1024px (see globals.css); the CSS var carries the band px.
    <div
      className={`br-edgefade relative ${className}`}
      style={{ overflowX: 'clip', ['--edgefade' as string]: `${width}px` }}
    >
      <div className="br-edgefade-mask">{children}</div>

      {/* progressive blur bands + bg wash — DESKTOP ONLY */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
        {blurLayer('left', width)}
        {blurLayer('right', width)}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to right, ${bg} 0, transparent ${width * 0.55}px, transparent calc(100% - ${width * 0.55}px), ${bg} 100%)`,
          }}
        />
      </div>
    </div>
  )
}
