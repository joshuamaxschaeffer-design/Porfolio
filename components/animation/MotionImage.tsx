'use client'

import Image from 'next/image'
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useRef, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

export interface MotionImageProps {
  src: string
  alt: string
  width?: number
  height?: number

  /** Static skew applied to the image (degrees). */
  skewX?: number
  skewY?: number
  /** Static rotation (degrees). */
  rotate?: number

  /** Shadow treatment. */
  shadow?: 'none' | 'soft' | 'dramatic' | 'colored' | 'drop-png'
  /** Shadow color (any CSS color). Used for 'colored' and 'drop-png'. */
  shadowColor?: string
  /** Shadow blur in px. */
  shadowBlur?: number
  /** Shadow offset {x, y} in px. */
  shadowOffsetX?: number
  shadowOffsetY?: number

  /** Mask the image with another image's silhouette (for the "shadow clipped to another image" effect). */
  maskImageUrl?: string

  /** Hover behavior. */
  hover?: 'none' | 'lift' | 'tilt-3d' | 'parallax-skew'
  /** Max tilt angle in degrees for tilt-3d. */
  tiltMax?: number

  /** Optional rounded corners. */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

  /** Loading priority — set true for above-the-fold images. */
  priority?: boolean
  className?: string
}

/**
 * Image component with first-class motion controls. Skew, drop shadows
 * (including shadows that follow image transparency), image-clipped masking,
 * and mouse-tracked 3D hover — all driven from props that CMS blocks expose.
 *
 * Uses next/image for optimization. Respects prefers-reduced-motion.
 */
export function MotionImage({
  src,
  alt,
  width = 1200,
  height = 900,
  skewX = 0,
  skewY = 0,
  rotate = 0,
  shadow = 'none',
  shadowColor = '#000000',
  shadowBlur = 30,
  shadowOffsetX = 0,
  shadowOffsetY = 12,
  maskImageUrl,
  hover = 'none',
  tiltMax = 12,
  rounded = 'md',
  priority = false,
  className,
}: MotionImageProps) {
  const prefersReduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  // Mouse-tracked 3D tilt (only used when hover === 'tilt-3d')
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springConfig = { stiffness: 200, damping: 25 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tiltMax, -tiltMax]), springConfig)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tiltMax, tiltMax]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hover !== 'tilt-3d' || prefersReduced) return
    const rect = ref.current!.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    x.set(px)
    y.set(py)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  // Compose the static transform (skew + rotate)
  const baseTransform = [
    skewX ? `skewX(${skewX}deg)` : '',
    skewY ? `skewY(${skewY}deg)` : '',
    rotate ? `rotate(${rotate}deg)` : '',
  ]
    .filter(Boolean)
    .join(' ')

  // Compose the shadow
  let shadowStyle: CSSProperties = {}
  if (shadow === 'soft') {
    shadowStyle = { boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.15)' }
  } else if (shadow === 'dramatic') {
    shadowStyle = { boxShadow: '0 40px 80px -20px rgb(0 0 0 / 0.4)' }
  } else if (shadow === 'colored') {
    shadowStyle = {
      boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px -8px ${shadowColor}`,
    }
  } else if (shadow === 'drop-png') {
    // Uses filter: drop-shadow which follows image transparency.
    // Perfect for transparent-PNG product shots whose shadow should hug the silhouette.
    shadowStyle = {
      filter: `drop-shadow(${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor})`,
    }
  }

  // Optional mask — clip the image's render to another image's silhouette
  // (creates the "clipped shadow to another image" effect when combined with drop-png).
  const maskStyle: CSSProperties = maskImageUrl
    ? {
        WebkitMaskImage: `url(${maskImageUrl})`,
        maskImage: `url(${maskImageUrl})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }
    : {}

  const roundedClass = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }[rounded]

  // Hover variants
  const hoverProps =
    !prefersReduced && hover === 'lift'
      ? { whileHover: { y: -6, transition: { duration: 0.3 } } }
      : !prefersReduced && hover === 'parallax-skew'
        ? { whileHover: { skewX: skewX + 2, skewY: skewY - 1, transition: { duration: 0.4 } } }
        : {}

  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      style={{
        transform: baseTransform || undefined,
        transformStyle: hover === 'tilt-3d' ? 'preserve-3d' : undefined,
        perspective: hover === 'tilt-3d' ? 1200 : undefined,
        rotateX: hover === 'tilt-3d' ? rotateX : undefined,
        rotateY: hover === 'tilt-3d' ? rotateY : undefined,
        ...shadowStyle,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...hoverProps}
    >
      <div className={cn('overflow-hidden', roundedClass)} style={maskStyle}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="block h-auto w-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1280px"
        />
      </div>
    </motion.div>
  )
}
