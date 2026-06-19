'use client'

/**
 * CraveSlider — Wingstop's draggable scale, modelled on the Baserate
 * `FeelingSlider` teardrop-pin pattern but fully prop-driven so it can render
 * BOTH real shipped Wingstop UIs:
 *   - the Flavor "Heat Scale"  (No Heat → Blazing Hot)
 *   - the Wing Calculator "hunger" scale (Snacky → Starving)
 *
 * Recreates actual product UI, not a mock — both scales shipped in the app.
 * Self-contained (no Baserate-token import) so it lives cleanly in /wingstop.
 * Uncontrolled by default so it reads as alive on load; drag or click anywhere
 * on the track to set the value.
 */

import { useRef, useState, useEffect } from 'react'

const FONT = "var(--br-font-data), 'Recursive', ui-monospace, monospace"

export function CraveSlider({
  colors,
  labels,
  start,
  caption,
}: {
  /** gradient stops, low→high (length sets the number of steps) */
  colors: string[]
  /** one label per step (same length as colors) */
  labels: string[]
  /** initial step (defaults to the middle) */
  start?: number
  /** small caption under the track, e.g. the current label prefix */
  caption?: string
}) {
  const MIN = 0
  const MAX = colors.length - 1
  const STEPS = MAX - MIN
  const [value, setValue] = useState<number>(start ?? Math.round(MAX / 2))
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [rawPct, setRawPct] = useState<number | null>(null)
  const [filterId, setFilterId] = useState('cs_ssr')
  useEffect(() => setFilterId(`cs_${Math.random().toString(36).slice(2, 8)}`), [])

  const gradient = `linear-gradient(90deg, ${colors
    .map((c, i) => `${c} ${(i / (colors.length - 1)) * 100}%`)
    .join(', ')})`

  const valueToPct = (v: number) => Math.max(0, Math.min(100, ((v - MIN) / STEPS) * 100))
  const pctToValue = (p: number) => Math.max(MIN, Math.min(MAX, Math.round((p / 100) * STEPS + MIN)))

  const displayPct = dragging && rawPct != null ? rawPct : valueToPct(value)
  const displayValue = dragging && rawPct != null ? pctToValue(rawPct) : value
  const label = labels[displayValue] || ''

  const active = hovering || dragging
  const REST_BG = '#0c0d0d'
  const pinColor = colors[Math.max(0, Math.min(MAX, displayValue))]
  const pinFill = active ? pinColor : REST_BG
  const pinStroke = active ? 'none' : 'rgba(255,255,255,0.85)'

  const getPct = (e: { clientX: number }) => {
    if (!trackRef.current) return 50
    const r = trackRef.current.getBoundingClientRect()
    return Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
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
      setDragging(false)
      setRawPct(null)
      setValue(pctToValue(getPct(ev)))
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseDown={handleMouseDown}
      style={{
        position: 'relative',
        userSelect: 'none',
        paddingTop: 58,
        paddingBottom: 28,
        paddingLeft: 19,
        paddingRight: 19,
        fontFamily: FONT,
        cursor: 'pointer',
      }}
    >
      <div ref={trackRef} style={{ position: 'relative', height: 6, overflow: 'visible' }}>
        <div style={{ position: 'absolute', inset: 0, background: gradient, borderRadius: 3 }} />
        <div
          style={{
            position: 'absolute',
            left: `${displayPct}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: dragging ? 'grabbing' : 'grab',
            zIndex: 2,
            width: 24,
            height: 24,
          }}
        >
          {/* teardrop pin */}
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
            </svg>
          </div>
          {/* handle */}
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
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'white',
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: 'center',
          marginTop: 10,
          fontSize: 14,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.82)',
          fontWeight: 500,
          minHeight: 20,
        }}
      >
        {caption ? <span style={{ opacity: 0.55 }}>{caption} </span> : null}
        {label}
      </div>
    </div>
  )
}
