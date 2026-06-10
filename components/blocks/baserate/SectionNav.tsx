'use client'

import { useEffect, useRef, useState } from 'react'

export interface SectionNavItem {
  /** DOM id of the section to track / jump to */
  id: string
  /** Title-case label shown in the hover tooltip */
  title: string
}

/**
 * Floating section rail — Figma node 234:53845 (drawn 1:1 in the oversized frame).
 * Measured from the source render, not eyeballed:
 *   pill   42px wide, fully rounded, neutral glass fill rgba(242,242,245,.24)
 *          + backdrop blur, hairline border, shadow biased downward
 *          (bottom contact ~9% ink, sides ~5%, top ~1%)
 *   steps  20px circles on 59px centers (39px gaps); visited/active = white
 *          fill + 1px #D6D6D6 ring + 13px #585B6B digit (heading font);
 *          upcoming = bare #AAAAAA digit, no ring
 *   line   1px #D6D6D6 connector spanning only consecutive visited circles
 *   tip    34px white tooltip, 1px #DCDCE1, 8px radius, 14px #585B6B body
 *          text, 12px gap from pill, 8px rotated-square tail on the left
 * Desktop-only by request: hidden below 1920px viewports.
 */
export function SectionNav({ items }: { items: SectionNavItem[] }) {
  const [active, setActive] = useState(0)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const compute = () => {
      raf.current = null
      // active = last section whose top has crossed the 45%-viewport line
      const line = window.innerHeight * 0.45
      let current = 0
      items.forEach((item, i) => {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= line) current = i
      })
      // pinned to the very bottom → always light up the last stop
      const doc = document.documentElement
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) current = items.length - 1
      setActive(current)
    }
    const queue = () => {
      if (raf.current == null) raf.current = requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
      if (raf.current != null) cancelAnimationFrame(raf.current)
    }
  }, [items])

  const jump = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <nav
      aria-label="Case study sections"
      className="fixed left-[42px] top-1/2 z-40 hidden -translate-y-1/2 min-[1920px]:block"
    >
      <ol
        className="flex w-[42px] list-none flex-col items-center rounded-full border border-[rgba(7,14,44,0.05)] bg-[rgba(242,242,245,0.24)] py-[17px] backdrop-blur-[10px] [box-shadow:0_8px_22px_rgba(7,14,44,0.09),0_2px_6px_rgba(7,14,44,0.05)]"
      >
        {items.map((item, i) => {
          const visited = i <= active
          return (
            <li key={item.id} className={`relative ${i > 0 ? 'mt-[39px]' : ''}`}>
              {/* connector — only between consecutive visited circles */}
              {i > 0 && (
                <span
                  aria-hidden
                  className={`absolute -top-[39px] left-1/2 h-[39px] w-px origin-top -translate-x-1/2 bg-[#D6D6D6] transition-[transform,opacity] duration-300 ${
                    visited ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
                  }`}
                />
              )}
              <button
                type="button"
                onClick={() => jump(item.id)}
                aria-label={`Jump to ${item.title}`}
                aria-current={i === active ? 'true' : undefined}
                className="group relative grid h-5 w-5 cursor-pointer place-items-center"
              >
                {/* generous hit area around the 20px circle */}
                <span aria-hidden className="absolute -inset-[10px]" />
                {/* white circle + ring, fades/scales in once visited */}
                <span
                  aria-hidden
                  className={`absolute inset-0 rounded-full border border-[#D6D6D6] bg-white transition-[transform,opacity] duration-300 ${
                    visited ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                  }`}
                />
                <span
                  className={`relative text-[13px] font-medium leading-none transition-colors duration-300 ${
                    visited ? 'text-[#585B6B]' : 'text-[#AAAAAA]'
                  }`}
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {i + 1}
                </span>
                {/* tooltip — 12px right of the pill edge, tail pointing at the circle */}
                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-[calc(100%+23px)] top-1/2 flex h-[34px] -translate-y-1/2 translate-x-1 items-center whitespace-nowrap rounded-[8px] border border-[#DCDCE1] bg-white px-3 text-[14px] font-normal normal-case text-[#585B6B] opacity-0 transition-[transform,opacity] duration-150 [box-shadow:0_4px_10px_rgba(7,14,44,0.08)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                >
                  <span
                    aria-hidden
                    className="absolute -left-[5.5px] h-[10px] w-[10px] rotate-45 rounded-[1px] border-b border-l border-[#DCDCE1] bg-white"
                  />
                  {item.title}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
