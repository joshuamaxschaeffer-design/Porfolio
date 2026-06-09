'use client'

/**
 * EdgeFadeBlur — wraps a full-bleed horizontal carousel and softens ONLY the
 * content that overflows past the centered editorial column, dissolving it into
 * the section background instead of hard-cutting at the viewport edge.
 *
 * BAND GEOMETRY (the important bit):
 *  The fade/blur band on each side is exactly the gap between the viewport edge
 *  and the centered CONTENT_WIDTH column:  max(0, (100vw - CONTENT_WIDTH)/2).
 *  So the blur begins precisely at the column edge and covers only what sticks
 *  out beyond it. When the viewport is <= CONTENT_WIDTH the band computes to 0,
 *  which collapses the mask, the blur layers, and the bg wash to zero width —
 *  i.e. the whole effect disappears below that minimum width, with no extra
 *  media query needed. The value is published once as the CSS var --edgefade
 *  and every layer reads it, so SSR and client agree (no JS viewport reads).
 *
 * Two effects, both confined to the --edgefade band on each side:
 *  1. FADE — a horizontal mask fades the scrolling content to transparent over
 *     the band, revealing the section background behind it.
 *  2. PROGRESSIVE BLUR — stacked backdrop-filter layers, each a larger blur
 *     radius masked to ramp from 0 (inner/column edge) to max (viewport edge).
 *
 * Usage: <EdgeFadeBlur bg="var(--br-bg-2)">{bleedingTrack}</EdgeFadeBlur>
 */

// The centered content column the band hugs. Matches .br-container (1443px).
// Below this viewport width the band is 0 → no fade, no blur, no gradient.
const CONTENT_WIDTH = 1443

// Per-side band width as a CSS expression. Clamped at 0 so it never goes
// negative (which would otherwise flip the gradient/mask) on narrow screens.
const BAND = `max(0px, (100vw - ${CONTENT_WIDTH}px) / 2)`

// True tilt-shift ramp: many fine layers whose blur RADIUS climbs from ~1px at
// the inner edge of the band to the max at the outer (viewport) edge.
const LAYERS = 8
const MIN_BLUR = 1 // px at the inner edge (column edge)
const MAX_BLUR = 18 // px at the very edge (viewport edge)

function blurLayer(side: 'left' | 'right') {
  const dir = side === 'left' ? 'to left' : 'to right'
  return Array.from({ length: LAYERS }, (_, i) => {
    const t = i / (LAYERS - 1)
    const radius = MIN_BLUR + (MAX_BLUR - MIN_BLUR) * (t * t)
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
          width: 'var(--edgefade)',
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
  className = '',
}: {
  children: React.ReactNode
  /** the section background the edges fade INTO (e.g. 'var(--br-bg-2)' or '#fff') */
  bg: string
  className?: string
}) {
  return (
    // overflow-x:clip guarantees nothing this wraps can push the page wider,
    // WITHOUT creating a scroll container. --edgefade carries the per-side band
    // width; it is 0 when the viewport <= CONTENT_WIDTH, which makes the mask,
    // the blur layers and the bg wash below all vanish (no separate breakpoint).
    <div
      className={`br-edgefade relative ${className}`}
      style={{ overflowX: 'clip', ['--edgefade' as string]: BAND }}
    >
      <div className="br-edgefade-mask">{children}</div>

      {/* progressive blur bands + bg wash. Each is --edgefade wide, so all of
          this is inert (zero width) at or below CONTENT_WIDTH. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
        {blurLayer('left')}
        {blurLayer('right')}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to right, ${bg} 0, transparent var(--edgefade), transparent calc(100% - var(--edgefade)), ${bg} 100%)`,
          }}
        />
      </div>
    </div>
  )
}
