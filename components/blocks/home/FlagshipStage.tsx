import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/animation/Reveal'
import type { FlagshipContent } from './data'

/**
 * Shared shell for the two home-page flagship showpieces (Baserate, Panda).
 *
 * A tall, full-bleed, scroll-pinned STAGE with named, empty layer slots. This
 * pass only renders labeled placeholder boxes — the point is to lock the
 * structure and the seams the later art (3D renders + parallax) drops into, so
 * the dedicated design project never has to refactor layout.
 *
 * Layer contract (read by the later scroll/parallax system):
 *   data-layer="bg"     speed slowest  — gradient field / large mark
 *   data-layer="render" speed pinned   — device(s) / extruded 3D object
 *   data-layer="mid"    speed faster   — UI cards / screens drifting
 *   data-layer="text"   speed normal   — kicker, title, one-line, meta, link
 *   data-layer="fg"     speed fastest  — orbs / chips / hairline accents
 *
 * Motion is intentionally NOT implemented here yet (placeholders are static).
 * When motion lands it must collapse to static under prefers-reduced-motion.
 */

interface FlagshipStageProps {
  content: FlagshipContent
  /** 'left' renders text left + media right; 'right' mirrors it. */
  align?: 'left' | 'right'
  /** Optional real render/parallax children, dropped into the media column later. */
  children?: ReactNode
  className?: string
}

function PlaceholderLayer({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-white/25 bg-white/[0.03]">
      <span className="select-none px-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
        {label}
      </span>
    </div>
  )
}

export function FlagshipStage({
  content,
  align = 'left',
  children,
  className,
}: FlagshipStageProps) {
  const { kicker, title, oneLine, meta, href, accent } = content
  const mediaFirst = align === 'right'

  return (
    <section
      data-flagship={title}
      className={cn(
        // Full-bleed: cancel the page gutter, clip at the physical screen edge.
        'relative isolate w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden',
        'min-h-[140vh] text-white',
        className,
      )}
      style={{ '--accent': accent } as CSSProperties}
    >
      {/* data-layer="bg" — slowest parallax: gradient field behind everything */}
      <div
        data-layer="bg"
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(120% 90% at 70% 10%, color-mix(in srgb, var(--accent) 85%, black) 0%, color-mix(in srgb, var(--accent) 55%, black) 45%, #05070f 100%)`,
        }}
      />

      {/* Sticky inner stage — pins while the section scrolls past it. */}
      <div className="sticky top-0 flex min-h-screen items-center py-20">
        <div className="br-container w-full">
          <div
            className={cn(
              'grid items-center gap-10 lg:gap-16',
              'lg:grid-cols-2',
            )}
          >
            {/* TEXT column */}
            <div
              data-layer="text"
              className={cn('max-w-xl', mediaFirst && 'lg:order-2')}
            >
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/60">
                  {kicker}
                </p>
                <h2 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
                  {title}
                </h2>
                <p className="mt-6 max-w-md text-lg text-white/80 md:text-xl">
                  {oneLine}
                </p>
                <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-white/50">
                  {meta}
                </p>
                <Link
                  href={href}
                  className="group mt-8 inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
                >
                  Read the case study
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </Reveal>
            </div>

            {/* MEDIA column — the 3D render + parallax layers live here. */}
            <div
              className={cn('relative h-[58vh] min-h-[420px]', mediaFirst && 'lg:order-1')}
            >
              {children ?? (
                <>
                  {/* data-layer="render" — pinned 3D device / object slot */}
                  <div data-layer="render" className="absolute inset-0">
                    <PlaceholderLayer label={`${title} — 3D render slot`} />
                  </div>
                  {/* data-layer="mid" — drifting UI cards / screens */}
                  <div
                    data-layer="mid"
                    className="absolute -right-4 top-6 hidden h-40 w-56 rotate-[-4deg] lg:block"
                  >
                    <PlaceholderLayer label="Parallax · UI" />
                  </div>
                  {/* data-layer="fg" — fastest accents: orbs / chips */}
                  <div
                    data-layer="fg"
                    aria-hidden
                    className="absolute -left-2 bottom-8 hidden h-20 w-20 rounded-full border border-dashed border-white/25 bg-white/[0.04] lg:block"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
