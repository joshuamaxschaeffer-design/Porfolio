'use client'

/**
 * FeelingSlider — imported from the Baserate app (`src/components/shared/sliders.tsx`,
 * the FeelingSlider export). 0-10 red→yellow→green gradient with a teardrop pin.
 * Drag or click anywhere on the track to set the value; the circle button on the
 * right toggles "abstain".
 *
 * Adapted for the portfolio's dark Handoff section: the value label is light,
 * and the default starts mid-scale so the element reads as alive on load. The
 * gradient + pin colors are the app's exact FEELING_COLORS.
 */

import { useRef, useState, useEffect } from 'react'
import { T, S, FEELING_COLORS, FEELING_LABELS } from './baserate-tokens'

type SliderValue = number | 'abstain' | null | undefined

function useFilterId(prefix: string) {
  const ref = useRef<string>('')
  const [, forceRender] = useState(0)
  useEffect(() => {
    if (!ref.current) {
      ref.current = `${prefix}_${Math.random().toString(36).slice(2, 8)}`
      forceRender((n) => n + 1)
    }
  }, [prefix])
  return ref.current || `${prefix}_ssr`
}

const FEELING_GRADIENT = `linear-gradient(90deg, ${FEELING_COLORS.map(
  (c, i) => `${c} ${(i / (FEELING_COLORS.length - 1)) * 100}%`,
).join(', ')})`

export function FeelingSlider({
  value: controlled,
  onChange,
  readonly = false,
  /** dark = light label text for dark surfaces */
  dark = true,
}: {
  value?: SliderValue
  onChange?: (v: SliderValue) => void
  readonly?: boolean
  dark?: boolean
}) {
  // Uncontrolled by default so it works as a standalone demo element.
  const [internal, setInternal] = useState<SliderValue>(8)
  const value = controlled !== undefined ? controlled : internal
  const setValue = (v: SliderValue) => {
    setInternal(v)
    onChange?.(v)
  }

  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [rawPct, setRawPct] = useState<number | null>(null)

  const GRAD = FEELING_GRADIENT
  const MIN = 0,
    MAX = 10,
    STEPS = MAX - MIN

  const isAbstaining = value === 'abstain'
  const hasValue = value != null && value !== 'abstain'

  const valueToPct = (v: number) => Math.max(0, Math.min(100, ((v - MIN) / STEPS) * 100))
  const pctToValue = (p: number) => Math.max(MIN, Math.min(MAX, Math.round((p / 100) * STEPS + MIN)))

  const displayPct = dragging && rawPct != null ? rawPct : hasValue ? valueToPct(value as number) : 50
  const displayValue = dragging && rawPct != null ? pctToValue(rawPct) : hasValue ? (value as number) : 5
  const label = FEELING_LABELS[displayValue] || ''
  const showPin = hasValue || dragging
  const showPlus = !hasValue && !dragging && !isAbstaining

  // Resting state = BLACK pin with a white stroke + white number (reads against
  // the dark section). On hover OR drag the whole thing fills with the live pin
  // color and the number flips to ink/white for contrast.
  const active = hovering || dragging
  const REST_BG = '#0c0f17' // near-black, matches the dark panel
  const pinColor = FEELING_COLORS[Math.max(0, Math.min(10, displayValue))]
  const pinFill = active ? pinColor : REST_BG
  const pinStroke = active ? 'none' : 'rgba(255,255,255,0.85)'
  const pinTextColor = active ? (displayValue <= 3 ? 'white' : T.textDark) : 'white'
  const dotColor = active ? 'white' : 'white'
  const filterId = useFilterId('fs')

  const labelColor = dark ? 'rgba(255,255,255,0.78)' : T.textDark

  const getPct = (e: { clientX: number }) => {
    if (!trackRef.current) return 50
    const r = trackRef.current.getBoundingClientRect()
    return Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (readonly || isAbstaining) return
    e.preventDefault()
    const p = getPct(e)
    setDragging(true)
    setRawPct(p)
    setValue(pctToValue(p))
    const onMove = (ev: MouseEvent) => {
      const mp = getPct(ev)
      setRawPct(mp)
      setValue(pctToValue(mp))
    }
    const onUp = (ev: MouseEvent) => {
      const fp = getPct(ev)
      setDragging(false)
      setRawPct(null)
      setValue(pctToValue(fp))
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <div
      onMouseEnter={() => !readonly && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).closest('button')) return
        handleMouseDown(e)
      }}
      style={{
        position: 'relative',
        userSelect: 'none',
        paddingTop: 58,
        paddingBottom: 32,
        paddingLeft: 19,
        paddingRight: 19,
        fontFamily: S.fontFamily,
        fontVariationSettings: S.fontVar,
        cursor: readonly ? 'default' : 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div ref={trackRef} style={{ position: 'relative', height: 6, flex: 1, overflow: 'visible' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: GRAD,
              opacity: hasValue || dragging ? 1 : 0.4,
              borderRadius: 3,
            }}
          />

          {!isAbstaining && (
            <div
              style={{
                position: 'absolute',
                left: `${displayPct}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                cursor: readonly ? 'default' : dragging ? 'grabbing' : 'grab',
                zIndex: 2,
                width: 24,
                height: 24,
              }}
            >
              {hovering && hasValue && !dragging && (
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: `${pinColor}18`,
                    pointerEvents: 'none',
                  }}
                />
              )}

              {showPin && (
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: '100%',
                    transform: 'translateX(-50%)',
                    marginBottom: 6,
                    width: 46,
                    height: 56,
                    pointerEvents: 'none',
                  }}
                >
                  {/* padded viewBox so the stroke + shadow aren't clipped at the
                      teardrop's left/right edges */}
                  <svg width="46" height="56" viewBox="-4 -4 46 56" fill="none">
                    <defs>
                      <filter id={filterId} x="-8" y="-6" width="54" height="64" filterUnits="userSpaceOnUse">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
                      </filter>
                    </defs>
                    <path
                      d="M19 46C19 46 0 28.5 0 18C0 8.06 8.51 0 19 0C29.49 0 38 8.06 38 18C38 28.5 19 46 19 46Z"
                      fill={pinFill}
                      stroke={pinStroke}
                      strokeWidth={active ? 0 : 1.5}
                      filter={`url(#${filterId})`}
                    />
                    {showPlus && (
                      <circle cx="19" cy="18" r="8" fill="none" stroke="#e3e3e3" strokeWidth="1" />
                    )}
                  </svg>
                  {/* center the number on the teardrop's round head. The svg
                      is 56px tall with a -4 viewBox offset, so the circle center
                      (path y≈18) lands at ~22px from the top of this box. */}
                  <span
                    style={{
                      position: 'absolute',
                      top: 4,
                      left: 0,
                      right: 0,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 19,
                      fontWeight: 700,
                      lineHeight: 1,
                      color: pinTextColor,
                    }}
                  >
                    {displayValue}
                  </span>
                </div>
              )}

              {/* On hover (or while dragging) the handle FILLS with the pin
                  color — switching from the white-outline state to full color
                  so it clearly reads as the interactive grabber. */}
              {(() => {
                // Rest: black bg, white border, white dot. Hover/drag: fills
                // with the pin color (white dot stays for contrast).
                return (
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: active ? pinColor : REST_BG,
                      border: `2px solid ${active ? pinColor : 'rgba(255,255,255,0.85)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: active ? `0 0 0 5px ${pinColor}26` : 'none',
                      transition: 'background 130ms ease, border-color 130ms ease, box-shadow 130ms ease',
                    }}
                  >
                    {showPlus ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1V11M1 6H11" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    ) : hasValue || dragging ? (
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: dotColor,
                          transition: 'background 130ms ease',
                        }}
                      />
                    ) : null}
                  </div>
                )
              })()}
            </div>
          )}

          {isAbstaining && (
            <div style={{ position: 'absolute', inset: 0, background: '#e3e3e3', opacity: 0.5, borderRadius: 3 }} />
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            if (readonly) return
            setValue(isAbstaining ? null : 'abstain')
          }}
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: isAbstaining ? `1.5px solid ${T.blue700}` : 'none',
            background: isAbstaining ? T.blue700 : 'transparent',
            cursor: readonly ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke={isAbstaining ? 'white' : dark ? 'rgba(255,255,255,0.5)' : '#999'} strokeWidth="1.2" />
            <line x1="4.5" y1="11.5" x2="11.5" y2="4.5" stroke={isAbstaining ? 'white' : dark ? 'rgba(255,255,255,0.5)' : '#999'} strokeWidth="1.2" />
          </svg>
        </button>
      </div>

      <div
        style={{
          textAlign: 'center',
          marginTop: 6,
          fontSize: 14,
          color: labelColor,
          fontWeight: 400,
          minHeight: 20,
        }}
      >
        {isAbstaining ? 'Abstaining From Answer' : hasValue || dragging ? label : ''}
      </div>
    </div>
  )
}
