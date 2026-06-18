'use client'

import { useEffect, useRef, useState } from 'react'
import { marketing as defaults } from './data'

/**
 * THE BRAND ONLINE — a compact marketing-site coda that runs AFTER the product
 * story (the two apps), so it proves the brand-site breadth without breaking the
 * app→app momentum. Deliberately smaller and quieter than the Act sections:
 *
 *   • Nav / IA redesign — the real before (flat bar) vs after (grouped menu)
 *     crops, stacked and labeled. The clearest single proof of the IA work.
 *   • The page system — Homepage / Our Food / Innovation / Values / Shop named
 *     as a family. Page renders are asset-slotted; until filled, each shows a
 *     clean labeled placeholder (never a broken image).
 *
 * White ground (a calm palette break between the red Act II and the red
 * Outcomes). Reveal-on-scroll is opacity/transform only; reduced-motion safe.
 */
export function MarketingSection() {
  return (
    <section
      id="marketing"
      aria-label="The brand online — marketing site"
      className="relative w-full bg-white py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8">
        {/* section header */}
        <Reveal className="max-w-[680px]">
          <h2 className="text-[30px] font-semibold uppercase leading-none tracking-wide text-[var(--br-ink)] sm:text-[40px]">
            {defaults.heading}
          </h2>
          <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-[var(--br-body)] sm:text-lg">
            {defaults.intro}
          </p>
        </Reveal>

        {/* Nav before / after */}
        <div className="mt-14">
          <Reveal className="max-w-[640px]">
            <Eyebrow>{defaults.nav.eyebrow}</Eyebrow>
            <h3 className="mt-2 text-xl font-semibold leading-tight text-[var(--br-ink)] sm:text-2xl">
              {defaults.nav.title}
            </h3>
            <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-[var(--br-body)]">
              {defaults.nav.body}
            </p>
          </Reveal>

          <div className="mt-8 space-y-5">
            <NavShot
              src={defaults.nav.before.src}
              alt={defaults.nav.before.alt}
              label={defaults.nav.before.label}
              muted
            />
            <NavShot
              src={defaults.nav.after.src}
              alt={defaults.nav.after.alt}
              label={defaults.nav.after.label}
            />
          </div>
        </div>

        {/* The page system */}
        <div className="mt-16">
          <Reveal className="max-w-[640px]">
            <Eyebrow>{defaults.pages.eyebrow}</Eyebrow>
            <h3 className="mt-2 text-xl font-semibold leading-tight text-[var(--br-ink)] sm:text-2xl">
              {defaults.pages.title}
            </h3>
            <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-[var(--br-body)]">
              {defaults.pages.body}
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {defaults.pages.items.map((p, i) => (
              <Reveal key={p.key} delay={i * 70}>
                <PageTile label={p.label} src={p.src} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── building blocks ─────────────────────────────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--px-red)]">
      {children}
    </span>
  )
}

/** A full-width nav-bar crop in a browser-ish frame, with a corner label. */
function NavShot({
  src,
  alt,
  label,
  muted,
}: {
  src: string
  alt: string
  label: string
  muted?: boolean
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--br-line)] bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)]">
      <span
        className={[
          'br-data absolute left-3 top-3 z-10 rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wide',
          muted
            ? 'bg-[var(--br-bg-2,#f4f4f5)] text-[var(--br-muted-2,#71717a)]'
            : 'bg-[var(--px-red)] text-white',
        ].join(' ')}
      >
        {label}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="block w-full" />
    </div>
  )
}

/** Page render if slotted; otherwise a clean labeled placeholder (no broken img). */
function PageTile({ label, src }: { label: string; src: string }) {
  return (
    <figure className="m-0">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-[var(--br-line)] bg-[var(--br-bg-2,#f4f4f5)]">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={`${label} page`} loading="lazy" className="h-full w-full object-cover object-top" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="br-data text-[11px] uppercase tracking-wide text-[var(--br-muted-2,#a1a1aa)]">
              {label}
            </span>
          </div>
        )}
      </div>
      <figcaption className="mt-2 text-center text-[13px] text-[var(--br-body)]">{label}</figcaption>
    </figure>
  )
}

/** Opacity/transform reveal on scroll; static under reduced-motion. */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(18px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
