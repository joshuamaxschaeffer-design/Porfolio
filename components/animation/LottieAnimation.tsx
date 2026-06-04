'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamic import keeps Lottie out of the main bundle until a page needs it.
const DotLottieReact = dynamic(
  () => import('@lottiefiles/dotlottie-react').then((m) => m.DotLottieReact),
  { ssr: false, loading: () => <div className="aspect-square w-full" /> }
)

interface LottieAnimationProps {
  /** URL to a .lottie or .json file (uploaded via Payload Media). */
  src: string
  /** Loop the animation. */
  loop?: boolean
  /** Autoplay on mount. */
  autoplay?: boolean
  /** Play on hover only (overrides autoplay). */
  playOnHover?: boolean
  /** Width/height as CSS. */
  width?: string | number
  height?: string | number
  className?: string
}

/**
 * Lottie player for designer-exported vector animations.
 * Use this for export-from-After-Effects-style polish:
 * loading spinners, illustrated explainers, micro-interactions.
 *
 * Dynamic-imported to keep the main bundle lean.
 */
export function LottieAnimation({
  src,
  loop = true,
  autoplay = true,
  playOnHover = false,
  width = '100%',
  height = 'auto',
  className,
}: LottieAnimationProps) {
  const [hovering, setHovering] = useState(false)
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mql.matches)
    const handler = () => setPrefersReduced(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const shouldPlay = playOnHover ? hovering : autoplay
  const playMode = prefersReduced ? false : shouldPlay

  return (
    <div
      className={className}
      style={{ width, height }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <DotLottieReact src={src} loop={loop} autoplay={playMode} />
    </div>
  )
}
