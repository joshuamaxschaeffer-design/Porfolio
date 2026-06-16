'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * The masked radial "burst" behind the two rewards phones, inlined as real SVG
 * so each spoke can be animated. 31 strokes are diameters/long chords through
 * the centre (325,325); a donut mask (outer r325 minus inner r104) keeps the
 * centre clear behind the phones — identical geometry to the original
 * /public/panda/pivot/radial-masked.svg, just inlined.
 *
 * On first scroll-into-view the whole group rotates in (counter-clockwise,
 * +28° → 0°) while each spoke grows from the centre outward one-at-a-time. The
 * spokes fire in CLOCKWISE order (reverse the angle-ordered array). Each spoke
 * grows with transform: scale 0 -> 1 about the shared centre, so it shoots out
 * from the middle in both directions. Every transition is an ease-out (settles
 * gently at the end). Respects prefers-reduced-motion (everything just appears).
 */

// 31 spoke path-d strings, ordered by angle around the circle.
const SPOKES = [
  'M325 -37V687',
  'M288.377 -35.1427L361.623 685.143',
  'M252.13 -29.5898L397.87 679.59',
  'M216.63 -20.3984L433.369 670.398',
  'M182.243 -7.66272L467.757 657.663',
  'M149.321 8.48657L500.679 641.514',
  'M118.201 27.8837L531.799 622.116',
  'M89.2031 50.3296L560.797 599.67',
  'M62.625 75.594L587.375 574.406',
  'M38.7393 103.418L611.261 546.582',
  'M17.791 133.515L632.209 516.485',
  'M-0.00537109 165.577L650.005 484.423',
  'M-14.4663 199.276L664.466 450.725',
  'M-25.4438 234.264L675.444 415.736',
  'M-32.8257 270.183L682.825 379.817',
  'M-36.5352 306.665L686.536 343.335',
  'M-36.5352 343.335L686.536 306.665',
  'M-32.8257 379.817L682.825 270.183',
  'M-25.4438 415.736L675.444 234.264',
  'M-14.4663 450.724L664.466 199.275',
  'M-0.00537109 484.423L650.005 165.577',
  'M17.791 516.485L632.209 133.515',
  'M38.7393 546.582L611.261 103.418',
  'M62.625 574.406L587.375 75.5939',
  'M89.2031 599.67L560.797 50.3295',
  'M118.201 622.116L531.799 27.8837',
  'M149.321 641.513L500.679 8.48648',
  'M182.243 657.663L467.757 -7.66275',
  'M216.63 670.398L433.369 -20.3984',
  'M252.13 679.59L397.87 -29.5899',
  'M288.377 685.143L361.623 -35.1427',
]

// Does a spoke's path START at its TOP endpoint (smaller y)? Parses the first
// and last coordinate of the "M…L…" / "M…V…" path so we can draw every spoke
// upward (bottom → top) regardless of how the d-string is ordered.
function pathStartIsTop(d: string): boolean {
  // numbers in order: M x0 y0 … then either "L x1 y1" or "V y1"
  const nums = d.match(/-?\d*\.?\d+/g)?.map(Number) ?? []
  if (nums.length < 2) return true
  const y0 = nums[1] // start-point y
  const y1 = nums[nums.length - 1] // end-point y (last number, for both "L x y" and "V y")
  return y0 <= y1 // start y smaller (higher up) → start is the top
}

export function RewardsRadial({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<SVGSVGElement>(null)
  const [shown, setShown] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // Fire once when the burst first scrolls into view.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const on = shown || reduced
  // Per-spoke stagger: spokes draw one-by-one in circle order.
  // Stagger between spokes 3× faster (new lines start in quick succession);
  // each individual spoke takes 2× as long to draw.
  const step = 0.05 / 3 // s between spokes (was 0.05)
  const dur = 0.55 * 2 // s each spoke takes to draw (was 0.55)
  // Ease-out curve the devices/radial share, per the brief: cubic-bezier(0,0,.2,1).
  const EASE = 'cubic-bezier(0,0,.2,1)'

  return (
    <svg
      ref={ref}
      viewBox="0 0 650 650"
      fill="none"
      aria-hidden
      className={className}
      style={{
        ...style,
        // Group rotates COUNTER-CLOCKWISE as the spokes grow: start +28°, settle
        // to 0° (decreasing angle = CCW). Ease-out so it slows into rest.
        transform: reduced ? undefined : `rotate(${on ? 0 : 28}deg)`,
        opacity: on ? 1 : 0,
        transition: reduced
          ? undefined
          : `transform 1600ms ${EASE}, opacity 900ms ${EASE}`,
        transformOrigin: '325px 325px',
      }}
    >
      <defs>
        <mask id="rewards-radial-mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="650" height="650">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M325 0C504.493 0 650 145.507 650 325C650 504.493 504.493 650 325 650C145.507 650 0 504.493 0 325C0 145.507 145.507 0 325 0ZM325 221C267.562 221 221 267.562 221 325C221 382.438 267.562 429 325 429C382.438 429 429 382.438 429 325C429 267.562 382.438 221 325 221Z"
            fill="#D9D9D9"
          />
        </mask>
      </defs>
      <g mask="url(#rewards-radial-mask)">
        {SPOKES.map((d, i) => {
          // Array is ordered counter-clockwise by angle; reverse the stagger so
          // the spokes draw in CLOCKWISE order. Ease-out on draw + fade.
          const delay = (SPOKES.length - 1 - i) * step
          // Draw each line as ONE stroke from a single source — bottom → top —
          // via stroke-dash (NOT scale, which grew from the centre in BOTH
          // directions = two sources). With pathLength=1 and dasharray "1 1",
          // offset 0 = fully drawn. We start the dash from whichever endpoint is
          // LOWER on screen (larger y) so the stroke sweeps upward: offset +1
          // hides toward the path start, -1 toward the path end.
          const startFromEnd = pathStartIsTop(d) // start point is the top end?
          const hiddenOffset = startFromEnd ? -1 : 1
          return (
            <path
              key={i}
              d={d}
              stroke="white"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: on ? 0 : hiddenOffset,
                opacity: on ? 1 : 0,
                transition: reduced
                  ? undefined
                  : `stroke-dashoffset ${dur}s ${EASE} ${delay}s, opacity ${dur * 0.4}s ${EASE} ${delay}s`,
              }}
            />
          )
        })}
      </g>
    </svg>
  )
}
