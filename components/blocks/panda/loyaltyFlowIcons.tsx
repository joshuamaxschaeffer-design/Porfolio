import type { FlowNodeType } from './loyaltyFlowData'

/* Node-type icons — 24px grid, currentColor, matching the portfolio's inline-SVG
 * house style. Each flow node is abstracted to one of these so the whole board
 * stays compact; the real screen / text / API content shows on hover. */
export function NodeGlyph({ type, className }: { type: FlowNodeType; className?: string }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true, className }
  switch (type) {
    case 'entry': // QR code
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
          <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'screen': // phone
      return (
        <svg {...common}>
          <rect x="6" y="2.5" width="12" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M10 5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="12" cy="18.5" r="0.9" fill="currentColor" />
        </svg>
      )
    case 'decision': // diamond / branch
      return (
        <svg {...common}>
          <path d="M12 3l9 9-9 9-9-9 9-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      )
    case 'api': // server stack
      return (
        <svg {...common}>
          <rect x="3.5" y="4" width="17" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <rect x="3.5" y="14" width="17" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="7" cy="7" r="0.9" fill="currentColor" />
          <circle cx="7" cy="17" r="0.9" fill="currentColor" />
        </svg>
      )
    case 'note': // comment
      return (
        <svg {...common}>
          <path d="M4 5.5h16v10H9l-4 3.5v-3.5H4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M8 9h8M8 12h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
  }
}

export const TYPE_LABEL: Record<FlowNodeType, string> = {
  entry: 'Entry',
  screen: 'Screen',
  decision: 'Decision',
  api: 'Backend / API',
  note: 'Note',
}
