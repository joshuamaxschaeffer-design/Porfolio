/**
 * GradientBackdrop — the cinematic multi-color wash behind the Samsung
 * mockup sections (per Joshua, 2026-06-19: "a mixture of linear and radial
 * gradients overlaid over each other with a huge blur applied to the whole
 * thing twice"). Palette sampled from his original Behance comp:
 *   teal  #37c090 · cyan #2b98a0 · blue #1f84a9 · magenta #941eab
 *
 * How the double-blur is achieved without a heavy SVG filter: an outer wrapper
 * blurs its child (layer 1), and the child itself carries a second blur on its
 * own background layers (layer 2). Two stacked `filter: blur()` passes melt the
 * gradients into the soft, lava-lamp wash from the reference. The element is
 * absolutely positioned, pointer-events-none, and clipped by its parent.
 *
 * `intensity` scales opacity so the same component can be a loud hero wash or a
 * faint ambient tint behind darker sections.
 */
export function GradientBackdrop({
  intensity = 1,
  className = '',
}: {
  intensity?: number
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity: intensity }}
    >
      {/* Layer 1 blur (outer): blurs everything inside it once more. */}
      <div
        className="absolute"
        style={{
          inset: '-25%',
          filter: 'blur(70px)',
          WebkitFilter: 'blur(70px)',
        }}
      >
        {/* Layer 2 blur (inner) on the actual gradient stack. */}
        <div
          className="absolute inset-0"
          style={{
            filter: 'blur(60px)',
            WebkitFilter: 'blur(60px)',
            // Linear sweep + several radial blooms, overlaid. The blurs above
            // dissolve the hard stops into the soft multi-color wash.
            backgroundColor: '#1c8aa6',
            backgroundImage: [
              // overall left→right teal→blue diagonal
              'linear-gradient(105deg, #37c090 0%, #2b98a0 32%, #1f84a9 60%, #2766b0 100%)',
              // radial blooms of color, overlaid
              'radial-gradient(60% 80% at 12% 30%, rgba(74,222,150,0.95) 0%, rgba(74,222,150,0) 60%)',
              'radial-gradient(55% 75% at 78% 22%, rgba(148,30,171,0.85) 0%, rgba(148,30,171,0) 58%)',
              'radial-gradient(70% 90% at 92% 80%, rgba(31,132,169,0.95) 0%, rgba(31,132,169,0) 62%)',
              'radial-gradient(50% 70% at 45% 95%, rgba(43,200,160,0.7) 0%, rgba(43,200,160,0) 60%)',
              'radial-gradient(45% 60% at 60% 50%, rgba(33,150,190,0.6) 0%, rgba(33,150,190,0) 65%)',
            ].join(','),
            backgroundBlendMode: 'screen, normal, normal, normal, normal, normal',
          }}
        />
      </div>
    </div>
  )
}
