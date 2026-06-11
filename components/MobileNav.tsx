'use client'

import Link from 'next/link'
import type { Brand } from '@/lib/brand'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AboutIcon, CloseIcon, ContactIcon, HomeIcon, MenuIcon, WorkIcon } from './nav-icons'
import type { WorkPill } from './WorkNavGlass'

/**
 * Mobile nav (below md). The hamburger releases a stack of BIG glass pills that
 * spring out from under the bar. There is no Work page — instead the Work pill
 * is a TALL glass pill that is itself a labeled container holding the project
 * links inside it. Home/About/Contact are single big pills.
 *
 * The scrim + pill stack are PORTALED to <body>: a backdrop-filter on a
 * descendant of the (already backdrop-filtered) header samples the header's
 * backdrop root instead of the page — on iOS Safari the pills rendered fully
 * clear. Same fix as the desktop Work flyout. Because the portal escapes the
 * header, the per-brand vars are re-declared on the portal root.
 */
export function MobileNav({ workItems, brand }: { workItems: WorkPill[]; brand: Brand }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  const headingFont = { fontFamily: 'var(--font-heading)', fontWeight: 500 } as const

  // Big glass pill — shared look (tall, rounded, frosted).
  const pill =
    'rounded-[26px] border border-[var(--glass-border)] bg-[var(--glass-fill)] backdrop-blur-[16px] backdrop-saturate-150 [box-shadow:0_10px_26px_rgba(7,14,44,0.14),inset_0_1px_0_rgba(255,255,255,0.5)]'

  // Each pill springs out with a staggered overshoot.
  const springIn = (i: number) =>
    ({
      transitionProperty: 'transform, opacity',
      transitionDuration: '460ms',
      transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
      transitionDelay: `${open ? 60 + i * 70 : 0}ms`,
      transform: open ? 'translateY(0) scale(1)' : 'translateY(-16px) scale(0.94)',
      opacity: open ? 1 : 0,
    }) as const

  const link =
    'flex items-center gap-3 px-5 text-[17px] uppercase tracking-[0.06em] text-[var(--nav-fg)]'

  // Mirrors the vars set on <header> in Nav.tsx (they don't reach the portal).
  const practice = brand === 'practice'
  const portalVars = {
    '--nav-fg': practice ? '#e7e7ea' : '#070E2C',
    '--nav-fg-hover': practice ? '#ffffff' : '#000000',
    '--nav-muted': practice ? '#9a9aa3' : '#7e7f88',
    '--glass-fill': practice ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.55)',
    '--glass-fill-hover': practice ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.78)',
    '--glass-border': practice ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.7)',
  } as React.CSSProperties

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid h-9 w-9 place-items-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-fill)] text-[var(--nav-fg)] backdrop-blur-[10px]"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {mounted &&
        createPortal(
          <div className="md:hidden" style={portalVars}>
      {/* Scrim — blurs the page behind the floating pills. */}
      <button
        aria-hidden
        tabIndex={-1}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 top-[52px] z-40 h-[calc(100dvh-52px)] w-full cursor-default backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ background: 'rgba(7,14,44,0.10)' }}
      />

      {/* Floating pill stack. Pointer-events gated so it never blocks when closed. */}
      <div
        className={`fixed inset-x-0 top-[52px] z-50 flex flex-col items-stretch gap-3 px-4 pt-4 ${
          open ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-label="Mobile"
        role="navigation"
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className={`${pill} ${link} h-[58px]`}
          style={{ ...headingFont, ...springIn(0) }}
        >
          <HomeIcon width={20} height={20} /> Home
        </Link>

        {/* WORK — tall pill that CONTAINS the projects (not a link). */}
        <div className={`${pill} px-5 py-4`} style={springIn(1)}>
          <p
            className="flex items-center gap-2 text-[13px] uppercase tracking-[0.16em] text-[var(--nav-muted)]"
            style={headingFont}
          >
            <WorkIcon width={17} height={17} /> Work
          </p>
          <div className="mt-3 flex flex-col gap-1.5">
            {workItems.map((it) => (
              <Link
                key={it.label}
                href={it.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-fill)] px-4 py-3 text-[16px] uppercase tracking-[0.05em] text-[var(--nav-fg)] transition-colors hover:bg-[var(--glass-fill-hover)] hover:text-[var(--nav-fg-hover)]"
                style={headingFont}
              >
                {it.label}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/about"
          onClick={() => setOpen(false)}
          className={`${pill} ${link} h-[58px]`}
          style={{ ...headingFont, ...springIn(2) }}
        >
          <AboutIcon width={20} height={20} /> About
        </Link>
        <Link
          href="/contact"
          onClick={() => setOpen(false)}
          className={`${pill} ${link} h-[58px]`}
          style={{ ...headingFont, ...springIn(3) }}
        >
          <ContactIcon width={20} height={20} /> Contact
        </Link>
      </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
