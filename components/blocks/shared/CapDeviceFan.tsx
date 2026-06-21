'use client'

/**
 * CapDeviceFan — real app screens laid down on a single receding plane (tilted
 * back + leaned right), full-bleed on the section field. This is the clean
 * "Seamless Reordering" look from the Panda marketing section — one consistent
 * 3D plane with soft per-screen shadows, NO per-row depth-of-field blur (that
 * was the janky/black-render failure mode). Screens are cropped to a clean fold
 * window; reduced-motion and tab-backgrounding are non-issues since nothing
 * animates here.
 */
export function CapDeviceFan({
  screens,
  caption,
  dark = false,
}: {
  screens: { src: string; alt?: string }[]
  caption?: string
  dark?: boolean
}) {
  const deck = screens.slice(0, 6)
  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] mt-6 w-screen overflow-hidden">
      <div className="mx-auto" style={{ perspective: '2200px', perspectiveOrigin: '50% 28%' }}>
        <div
          className="mx-auto flex items-start justify-center gap-[2vw] px-[5vw] pb-[5vw] pt-[2vw]"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateX(5vw) rotateX(38deg) rotateZ(-24deg) scale(0.96)',
            transformOrigin: '50% 40%',
          }}
        >
          {deck.map((s) => (
            <figure key={s.src} className="relative m-0 w-[13vw] min-w-[104px] max-w-[210px] shrink-0">
              <div
                className="relative overflow-hidden rounded-[16px] bg-white"
                style={{
                  aspectRatio: '9 / 19.5',
                  boxShadow:
                    '0 40px 80px -30px rgba(7,14,44,0.55), 0 10px 24px -12px rgba(7,14,44,0.4)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={s.alt ?? ''}
                  draggable={false}
                  className="block h-full w-full select-none object-cover object-top"
                  loading="lazy"
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
      {/* edge vignette so the plane dissolves into the section field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: dark
            ? 'linear-gradient(to right, #0b1020 0%, rgba(11,16,32,0) 12%, rgba(11,16,32,0) 88%, #0b1020 100%)'
            : 'linear-gradient(to right, var(--br-bg-2) 0%, rgba(244,245,247,0) 12%, rgba(244,245,247,0) 88%, var(--br-bg-2) 100%)',
        }}
      />
      {caption && (
        <p
          className={`br-data px-6 text-[11px] uppercase tracking-[0.08em] md:px-10 ${
            dark ? 'text-white/50' : 'text-[var(--br-muted-2)]'
          }`}
        >
          {caption}
        </p>
      )}
    </div>
  )
}
