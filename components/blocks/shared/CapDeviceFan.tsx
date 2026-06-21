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
    <div className="relative mt-6 overflow-hidden rounded-[var(--br-card-radius)]">
      <div className="mx-auto" style={{ perspective: '2000px', perspectiveOrigin: '50% 30%' }}>
        <div
          className="mx-auto flex items-start justify-center gap-[1.5%] px-[4%] pb-[5%] pt-[1%]"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(36deg) rotateZ(-20deg) scale(0.98)',
            transformOrigin: '50% 40%',
          }}
        >
          {deck.map((s) => (
            <figure key={s.src} className="relative m-0 w-[15%] min-w-[88px] max-w-[180px] shrink-0">
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
    </div>
  )
}
