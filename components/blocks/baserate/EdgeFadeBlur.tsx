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

const BLUR_STOPS = [2, 6, 12, 20] // px, inner → outer

function blurLayer(side: 'left' | 'right', width: number) {
  const dir = side === 'left' ? 'to left' : 'to right'
  // Each layer's mask reveals a progressively narrower sliver toward the edge,
  // so deeper layers (larger blur) only paint nearest the edge.
  return BLUR_STOPS.map((radius, i) => {
    const n = BLUR_STOPS.length
    const startPct = (i / n) * 100
    const midPct = ((i + 0.6) / n) * 100
    const mask = `linear-gradient(${dir}, transparent ${startPct}%, black ${midPct}%, black 100%)`
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
          backdropFilter: `blur(${radius}px)`,
          WebkitBackdropFilter: `blur(${radius}px)`,
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
  const fadeMask = `linear-gradient(to right, transparent 0, black ${width}px, black calc(100% - ${width}px), transparent 100%)`

  return (
    <div className={`relative ${className}`}>
      {/* scrolling content, edge-faded */}
      <div style={{ WebkitMaskImage: fadeMask, maskImage: fadeMask }}>{children}</div>

      {/* progressive blur bands (above content, nothing interactive) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
        {blurLayer('left', width)}
        {blurLayer('right', width)}
        {/* a faint wash of the bg color over the very edge so the dissolve reads
            cleanly even where content is sparse */}
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
