import type { FlowNodeType } from './loyaltyFlowData'

export type DeviceKind = 'mobile' | 'mobile-web' | 'desktop'

/* Node glyphs. Screens are drawn as real device silhouettes (phone or monitor)
 * so a screen is instantly distinguishable from an event (a branch/diamond) or
 * an API call (a server). 24px grid, currentColor. */
export function NodeGlyph({
  type,
  device,
  className,
}: {
  type: FlowNodeType
  device?: DeviceKind
  className?: string
}) {
  const p = { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true, className }
  if (type === 'screen') {
    if (device === 'desktop') {
      // desktop monitor
      return (
        <svg {...p}>
          <rect x="2" y="3.5" width="20" height="13" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
          <path d="M2 13.2h20" stroke="currentColor" strokeWidth="1.3" />
          <path d="M9 20h6M12 16.5V20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )
    }
    // phone (mobile / mobile-web)
    return (
      <svg {...p}>
        <rect x="6.5" y="2" width="11" height="20" rx="2.6" stroke="currentColor" strokeWidth="1.7" />
        <path d="M6.5 6h11M6.5 18.5h11" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="12" cy="20.2" r="0.9" fill="currentColor" />
      </svg>
    )
  }
  switch (type) {
    case 'entry': // QR code
      return (
        <svg {...p}>
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
          <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'event': // branch / decision — a fork, clearly not a device
      return (
        <svg {...p}>
          <circle cx="6" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="18" cy="5.5" r="2.4" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="18" cy="18.5" r="2.4" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8.2 10.8 15.8 6.6M8.2 13.2l7.6 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )
    case 'api': // server stack
      return (
        <svg {...p}>
          <rect x="3.5" y="4" width="17" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <rect x="3.5" y="14" width="17" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="7" cy="7" r="0.95" fill="currentColor" />
          <circle cx="7" cy="17" r="0.95" fill="currentColor" />
        </svg>
      )
  }
}

export const TYPE_LABEL: Record<FlowNodeType, string> = {
  entry: 'Entry',
  screen: 'Screen',
  event: 'Event',
  api: 'Backend / API',
}
