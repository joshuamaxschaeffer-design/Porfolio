'use client'

import { useEffect, useId, useRef, useState } from 'react'

/**
 * PerspectiveDeviceGrid
 * =====================
 * A grid of very tall (vertically long) device screens that is rotated and
 * skewed so the devices appear to LIE DOWN on a surface in classic one-point
 * perspective: the grid is tilted back, rotated to the right toward a near-
 * horizontal angle, and squashed to ~50% width from that vantage. Rows that
 * sit farther back read smaller (they recede), the long screens auto-scroll
 * their UI, and a progressive depth-of-field blur ramps across the grid so the
 * far devices look out of focus — exactly like a real lens.
 *
 * Design / perf notes
 * -------------------
 * - REAL 3D: the stage uses `perspective` + a `transform-style: preserve-3d`
 *   plane that is rotateX (lay it down) / rotateZ (lean right) / scaleX(.5)
 *   (50% width from that point). Per-row `translateZ` pushes back rows into the
 *   distance so the recede is genuine perspective, not a fake scale.
 * - DOF BLUR IS STATIC PER ROW. We learned the hard way on ScalabilityTimeline
 *   that animating `filter: blur()` on big layers every scroll frame freezes
 *   the compositor. Here the blur is a FIXED value per row (front row crisp,
 *   each row back blurrier) so the GPU rasters each row's filter ONCE. The only
 *   thing that animates is the cheap, GPU-composited screen auto-scroll.
 * - AUTO-SCROLL is a CSS transform keyframe on the inner screen (translateY),
 *   staggered per device, paused off-screen and under prefers-reduced-motion.
 * - Safari: 3D + filter on the same node can rasterize oddly, so the blur lives
 *   on a WRAPPER and the 3D transform on its CHILD; perspective is set inline.
 *   backface-visibility hidden keeps edges clean.
 *
 * Content: pass `screens` (tall images). Until real app imagery is ready an
 * FPO gradient screen is generated per tile, so the effect is fully visible now
 * and real screenshots drop in later by populating `screens`.
 */

export interface DeviceScreen {
  /** Tall screenshot URL (portrait, much taller than the device frame). */
  src?: string
  /** Optional alt text for a real screenshot. */
  alt?: string
}

export interface PerspectiveDeviceGridProps {
  /**
   * Tall screen images, row-major. When omitted (or fewer than cols*rows are
   * given) the remaining tiles render an on-brand FPO gradient screen so the
   * perspective effect is fully visible before real imagery exists.
   */
  screens?: DeviceScreen[]
  /** Accent color (brand). Drives the FPO screens + ambient glow. */
  accent?: string
  /** Columns across the surface. Default 4. */
  cols?: number
  /** Rows receding into depth. Default 3. */
  rows?: number
  /** Caption shown under the stage (e.g. "App screens — in progress"). */
  caption?: string
  /** Extra classes on the outer wrapper. */
  className?: string
}

// --- responsive geometry -----------------------------------------------------
// The skew is dialled back on small screens: a near-horizontal lean reads as a
// thin sliver on a phone, so mobile uses a gentler tilt + less width squash so
// the screens stay legible. Desktop gets the full "lying on a table" pose.
type Pose = {
  /** lay-down tilt (deg) — rotateX */
  tiltX: number
  /** lean to the right (deg) — rotateZ */
  leanZ: number
  /** horizontal squash — scaleX (0.5 = "50% as wide" per the brief) */
  squashX: number
  /** perspective distance (px); smaller = stronger foreshortening */
  persp: number
  /** extra depth pushed onto each row back (px translateZ) */
  rowDepth: number
  /** stage aspect ratio (w/h) so it reserves the right height */
  ratio: number
}

const POSE_DESKTOP: Pose = { tiltX: 58, leanZ: 26, squashX: 0.5, persp: 1700, rowDepth: 320, ratio: 16 / 11 }
const POSE_TABLET: Pose = { tiltX: 52, leanZ: 22, squashX: 0.56, persp: 1500, rowDepth: 260, ratio: 16 / 12 }
const POSE_MOBILE: Pose = { tiltX: 44, leanZ: 16, squashX: 0.62, persp: 1100, rowDepth: 180, ratio: 16 / 13 }

function usePose(): { pose: Pose; cols: number } {
  const [state, setState] = useState<{ pose: Pose; cols: number }>({ pose: POSE_DESKTOP, cols: 4 })
  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 639px)')
    const mqTablet = window.matchMedia('(min-width: 640px) and (max-width: 1023px)')
    const apply = () => {
      if (mqMobile.matches) setState({ pose: POSE_MOBILE, cols: 3 })
      else if (mqTablet.matches) setState({ pose: POSE_TABLET, cols: 3 })
      else setState({ pose: POSE_DESKTOP, cols: 4 })
    }
    apply()
    mqMobile.addEventListener('change', apply)
    mqTablet.addEventListener('change', apply)
    return () => {
      mqMobile.removeEventListener('change', apply)
      mqTablet.removeEventListener('change', apply)
    }
  }, [])
  return state
}

// Pause the auto-scroll animations while the stage is off-screen (saves the
// compositor from animating transforms nobody can see). Returns a ref + bool.
function useOnScreen<T extends Element>(margin = '200px') {
  const ref = useRef<T>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => setOn(e.isIntersecting),
      { rootMargin: margin, threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return { ref, on }
}

// --- main component ----------------------------------------------------------
export function PerspectiveDeviceGrid({
  screens,
  accent = '#3b6fd4',
  cols: colsProp,
  rows = 3,
  caption,
  className,
}: PerspectiveDeviceGridProps) {
  const uid = useId().replace(/[:]/g, '')
  const { pose, cols: colsAuto } = usePose()
  const cols = colsProp ?? colsAuto
  const { ref, on } = useOnScreen<HTMLDivElement>()

  const total = cols * rows
  // Build the tile list: real screens first, FPO fills the rest.
  const tiles: DeviceScreen[] = Array.from({ length: total }, (_, i) => screens?.[i] ?? {})

  // Per-row depth cues. Row 0 = nearest (crisp, big), each row back is pushed
  // away in Z, dimmed and blurred a fixed amount. Quantized so the GPU rasters
  // each row's filter once (never per-frame). Blur grows non-linearly so the
  // back row clearly reads as out-of-focus DOF.
  const rowMeta = Array.from({ length: rows }, (_, r) => {
    const t = rows > 1 ? r / (rows - 1) : 0 // 0 front → 1 back
    return {
      z: -r * pose.rowDepth, // push back rows into the distance
      blur: Math.round(t * t * 9), // 0 → ~9px, fast falloff (DOF)
      dim: 0.5 * t * t, // back rows fade toward the surface
    }
  })

  return (
    <div ref={ref} className={className}>
      {/* The perspective viewport. Height is reserved via aspect-ratio so the
          laid-down plane doesn't collapse. overflow hidden clips the far rows
          that recede past the top edge into the "distance". */}
      <div
        className="relative w-full overflow-hidden rounded-[var(--br-card-radius)]"
        style={{
          aspectRatio: String(pose.ratio),
          perspective: `${pose.persp}px`,
          perspectiveOrigin: '62% 32%',
          WebkitPerspective: `${pose.persp}px`,
          // a soft ambient glow of the brand accent under the devices
          background: `radial-gradient(120% 90% at 64% 26%, ${hexA(accent, 0.10)} 0%, ${hexA(accent, 0.03)} 34%, transparent 64%)`,
        }}
      >
        {/* The laid-down plane: tilt back (rotateX), lean right (rotateZ), then
            squash to ~50% width (scaleX). This is the single skew the whole
            grid inherits — devices end up near-horizontal, leaning right, half
            width, exactly as briefed. */}
        <div
          className="absolute grid"
          style={{
            left: '50%',
            top: '46%',
            width: '118%',
            transform: `translate(-50%, -50%) rotateX(${pose.tiltX}deg) rotateZ(${pose.leanZ}deg) scaleX(${pose.squashX})`,
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            // tighten the laid-down rows so they overlap like a real stack
            gap: '7% 4%',
          }}
        >
          {tiles.map((tile, i) => {
            const r = Math.floor(i / cols)
            const c = i % cols
            const meta = rowMeta[r]
            return (
              <DeviceTile
                key={i}
                tile={tile}
                accent={accent}
                animate={on}
                uid={`${uid}-${i}`}
                index={i}
                col={c}
                cols={cols}
                z={meta.z}
                blur={meta.blur}
                dim={meta.dim}
              />
            )
          })}
        </div>

        {/* DOF / distance veil: a gradient over the FAR (upper) part of the
            stage so the receding rows dissolve softly into the section instead
            of ending on a hard line. Pointer-events-none, paints above the
            plane. Tuned to the white section background. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 12%, rgba(255,255,255,0) 34%)',
          }}
        />
      </div>

      {caption ? (
        <p className="br-data mt-3 text-[11px] uppercase tracking-[0.14em] text-[var(--br-muted-2)]">
          {caption}
        </p>
      ) : null}
    </div>
  )
}

// --- one device --------------------------------------------------------------
function DeviceTile({
  tile,
  accent,
  animate,
  uid,
  index,
  col,
  cols,
  z,
  blur,
  dim,
}: {
  tile: DeviceScreen
  accent: string
  animate: boolean
  uid: string
  index: number
  col: number
  cols: number
  z: number
  blur: number
  dim: number
}) {
  // Stagger the auto-scroll so the wall of screens doesn't move in lockstep.
  const dur = 26 + ((index * 7) % 16) // 26–42s, varied
  const delay = -((index * 3.3) % dur) // negative = start mid-loop
  // Columns toward the far (right, because we lean right) side sit a touch
  // deeper, so the recede reads diagonally like a real perspective grid.
  const colZ = -(col / Math.max(1, cols - 1)) * 80

  return (
    // BLUR WRAPPER (no 3D here): keeps Safari from re-rasterizing the filter
    // against the 3D transform. Fixed blur per row → rastered once.
    <div
      style={{
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        willChange: blur > 0 ? 'filter' : undefined,
      }}
    >
      {/* 3D-POSITIONED CHILD: pushed back in Z by its row (+ a little by col). */}
      <div
        style={{
          transform: `translateZ(${z + colZ}px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* The phone. Very tall (9 : 19.5), dark bezel, rounded, soft shadow
            that grounds it on the surface. */}
        <div
          className="relative mx-auto w-full overflow-hidden bg-[#0b0d12]"
          style={{
            aspectRatio: '9 / 19.5',
            borderRadius: 'clamp(10px, 2.2vw, 22px)',
            padding: 'clamp(3px, 0.7vw, 6px)',
            boxShadow: `0 2px 2px rgba(0,0,0,0.18), 0 18px 30px -14px rgba(8,12,24,0.55)`,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* screen viewport (clips the scrolling content) */}
          <div
            className="relative h-full w-full overflow-hidden bg-white"
            style={{ borderRadius: 'clamp(7px, 1.6vw, 16px)' }}
          >
            <ScreenContent
              tile={tile}
              accent={accent}
              uid={uid}
              animate={animate}
              dur={dur}
              delay={delay}
            />
            {/* subtle screen sheen so the glass reads as glass */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(115deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 26%)',
              }}
            />
            {/* per-depth dim veil (far devices fade toward the surface) */}
            {dim > 0 ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-white"
                style={{ opacity: dim }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- the scrolling screen (real image OR generated FPO) ----------------------
function ScreenContent({
  tile,
  accent,
  uid,
  animate,
  dur,
  delay,
}: {
  tile: DeviceScreen
  accent: string
  uid: string
  animate: boolean
  dur: number
  delay: number
}) {
  // The inner column is duplicated head-to-tail and animated upward by 50% so
  // it loops seamlessly (the classic marquee trick, vertical). Pure transform
  // → GPU-composited, cheap even with many tiles. Paused off-screen / reduced
  // motion (the CSS class only animates when `animate` is true).
  const animClass = animate ? `pdg-scroll-${uid}` : undefined
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={animClass}
        style={{
          // two stacked copies; translateY(-50%) shows exactly one full copy
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          willChange: 'transform',
          // start frame even before the animation kicks in (off-screen state)
          transform: 'translateY(0)',
        }}
      >
        <ScreenCopy tile={tile} accent={accent} />
        <ScreenCopy tile={tile} accent={accent} ariaHidden />
      </div>
      {/* keyframes: scoped per-tile so the negative delay/duration vary freely */}
      <style>{`
        @keyframes pdg-kf-${uid} { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        .pdg-scroll-${uid} { animation: pdg-kf-${uid} ${dur}s linear ${delay}s infinite; }
        @media (prefers-reduced-motion: reduce) {
          .pdg-scroll-${uid} { animation: none; }
        }
      `}</style>
    </div>
  )
}

function ScreenCopy({ tile, accent, ariaHidden }: { tile: DeviceScreen; accent: string; ariaHidden?: boolean }) {
  if (tile.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={tile.src}
        alt={ariaHidden ? '' : tile.alt ?? ''}
        aria-hidden={ariaHidden}
        draggable={false}
        className="block w-full select-none"
      />
    )
  }
  // FPO: a generated app-like screen (status bar, hero, cards) tinted with the
  // brand accent. Tall (≈2.4× the frame) so the scroll has real travel.
  return <FpoScreen accent={accent} ariaHidden={ariaHidden} />
}

// --- helpers -----------------------------------------------------------------
/** hex (#rgb/#rrggbb) → rgba() string at alpha a. Falls back to the accent. */
function hexA(hex: string, a: number): string {
  let h = hex.replace('#', '').trim()
  if (h.length === 3) h = h.split('').map((x) => x + x).join('')
  const n = parseInt(h, 16)
  if (h.length !== 6 || Number.isNaN(n)) return hex
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

/**
 * FpoScreen — a lightweight, generated "app screen" placeholder. Reads as a
 * real product UI at a glance (status bar, hero, a feed of cards) so the
 * perspective wall looks populated before real screenshots are dropped in.
 * Tinted with the brand accent. Built from divs (no images) so it's crisp at
 * any scale and weightless. Height ≈ 2.4× a frame for genuine scroll travel.
 */
function FpoScreen({ accent, ariaHidden }: { accent: string; ariaHidden?: boolean }) {
  const cards = Array.from({ length: 6 })
  return (
    <div
      aria-hidden={ariaHidden}
      className="w-full"
      style={{
        // tall: the column is ~2.4 viewports so scrolling reveals new content
        background: `linear-gradient(180deg, ${hexA(accent, 0.06)} 0%, #ffffff 22%, #ffffff 100%)`,
        paddingBottom: '8%',
      }}
    >
      {/* status bar */}
      <div className="flex items-center justify-between px-[8%] pt-[6%] pb-[3%]">
        <div className="h-[6px] w-[16%] rounded-full" style={{ background: hexA(accent, 0.5) }} />
        <div className="flex gap-[4px]">
          <span className="h-[6px] w-[6px] rounded-full" style={{ background: hexA(accent, 0.35) }} />
          <span className="h-[6px] w-[6px] rounded-full" style={{ background: hexA(accent, 0.35) }} />
          <span className="h-[6px] w-[10px] rounded-[2px]" style={{ background: hexA(accent, 0.35) }} />
        </div>
      </div>

      {/* hero block */}
      <div className="px-[8%]">
        <div
          className="w-full"
          style={{
            aspectRatio: '16 / 10',
            borderRadius: '10%/16%',
            background: `linear-gradient(135deg, ${accent} 0%, ${hexA(accent, 0.62)} 100%)`,
          }}
        />
        <div className="mt-[5%] h-[9px] w-[72%] rounded-full" style={{ background: hexA(accent, 0.85) }} />
        <div className="mt-[3%] h-[6px] w-[52%] rounded-full bg-[#e7e7ef]" />
      </div>

      {/* chip row */}
      <div className="mt-[6%] flex gap-[5%] px-[8%]">
        {[0.9, 0.5, 0.5].map((o, i) => (
          <span key={i} className="h-[16px] flex-1 rounded-full" style={{ background: i === 0 ? hexA(accent, o) : '#ececf2' }} />
        ))}
      </div>

      {/* feed cards */}
      <div className="mt-[6%] flex flex-col gap-[5%] px-[8%]">
        {cards.map((_, i) => (
          <div key={i} className="flex items-center gap-[5%]">
            <span
              className="aspect-square w-[22%] shrink-0 rounded-[18%]"
              style={{ background: i % 2 === 0 ? hexA(accent, 0.18) : '#eceef4' }}
            />
            <span className="flex-1">
              <span className="block h-[7px] w-[80%] rounded-full bg-[#dfe0ea]" />
              <span className="mt-[8px] block h-[6px] w-[55%] rounded-full bg-[#ebecf0]" />
              <span className="mt-[8px] block h-[6px] w-[40%] rounded-full" style={{ background: hexA(accent, 0.3) }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
