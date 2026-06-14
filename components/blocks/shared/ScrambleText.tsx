'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>*#'

/**
 * ScrambleText — text that "decodes" from random glyphs into the final string
 * when it scrolls into view (and optionally re-scrambles on hover). The techy
 * kinetic-type accent (Active Theory / hacker-terminal vibe). Monospaced via
 * the br-data font. Reduced-motion → final text, no scramble.
 */
export function ScrambleText({
  text,
  className,
  as: Tag = 'span',
  speed = 28,
  hover = true,
}: {
  text: string
  className?: string
  as?: 'span' | 'h2' | 'h3' | 'p' | 'div'
  /** ms per reveal step (lower = faster) */
  speed?: number
  hover?: boolean
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.6 })
  const [display, setDisplay] = useState(reduce ? text : '')
  const frame = useRef(0)
  const raf = useRef<number>(0)

  const run = () => {
    if (reduce) { setDisplay(text); return }
    cancelAnimationFrame(raf.current)
    frame.current = 0
    const total = text.length
    let last = 0
    const tick = (t: number) => {
      if (t - last >= speed) {
        last = t
        const revealed = Math.floor(frame.current)
        let out = ''
        for (let i = 0; i < total; i++) {
          if (text[i] === ' ') { out += ' '; continue }
          if (i < revealed) out += text[i]
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
        setDisplay(out)
        frame.current += 1
        if (revealed >= total) { setDisplay(text); return }
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    if (inView) run()
    return () => cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      onMouseEnter={hover && !reduce ? run : undefined}
      aria-label={text}
    >
      <span aria-hidden>{display || ' '}</span>
    </Tag>
  )
}
