/**
 * CapIcon — a small set of clean 20px line icons for capability cards.
 * Keyed by concept; falls back to a neutral dot grid. Stroke = currentColor
 * (the card sets it to gold), 1.6px, rounded — matches the editorial system.
 */

const P = {
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none' as const,
  stroke: 'currentColor',
}

const ICONS: Record<string, React.ReactNode> = {
  strategy: <><circle cx="12" cy="12" r="3" {...P} /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" {...P} /></>,
  ia: <><rect x="3" y="3" width="7" height="7" rx="1" {...P} /><rect x="14" y="3" width="7" height="7" rx="1" {...P} /><rect x="8.5" y="14" width="7" height="7" rx="1" {...P} /><path d="M6.5 10v2.5h11V10M12 12.5V14" {...P} /></>,
  app: <><rect x="6" y="2.5" width="12" height="19" rx="2.5" {...P} /><path d="M10 18.5h4" {...P} /></>,
  surfaces: <><rect x="2.5" y="5" width="14" height="9" rx="1.5" {...P} /><rect x="14" y="9" width="7.5" height="11" rx="1.5" {...P} /></>,
  workflow: <><path d="M4 7h10M4 12h7M4 17h12" {...P} /><circle cx="18" cy="7" r="2" {...P} /></>,
  loyalty: <><path d="M12 4.5l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4L7.4 18l.9-5L4.7 9.7l5-.7z" {...P} /></>,
  identity: <><circle cx="12" cy="12" r="8.5" {...P} /><circle cx="12" cy="12" r="3.2" {...P} /></>,
  type: <><path d="M5 7V5h14v2M12 5v14M9 19h6" {...P} /></>,
  color: <><circle cx="9" cy="9" r="4" {...P} /><circle cx="15" cy="15" r="4" {...P} /></>,
  voice: <><path d="M4 9v6h4l5 4V5L8 9z" {...P} /><path d="M17 9a4 4 0 010 6" {...P} /></>,
  grid: <><path d="M9 3v18M15 3v18M3 9h18M3 15h18" {...P} /></>,
  product: <><rect x="6" y="2.5" width="12" height="19" rx="2.5" {...P} /><path d="M9 6h6" {...P} /></>,
  components: <><rect x="3" y="3" width="7" height="7" rx="1" {...P} /><rect x="14" y="3" width="7" height="7" rx="1" {...P} /><rect x="3" y="14" width="7" height="7" rx="1" {...P} /><rect x="14" y="14" width="7" height="7" rx="1" {...P} /></>,
  tokens: <><circle cx="6" cy="12" r="2.5" {...P} /><circle cx="18" cy="6" r="2.5" {...P} /><circle cx="18" cy="18" r="2.5" {...P} /><path d="M8.2 11l7.6-3.8M8.2 13l7.6 3.8" {...P} /></>,
  handoff: <><path d="M4 8l-2 4 2 4M20 8l2 4-2 4M14 4l-4 16" {...P} /></>,
  consistency: <><path d="M20 6L9 17l-5-5" {...P} /></>,
  dataviz: <><path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-7" {...P} /></>,
  icons: <><circle cx="7" cy="7" r="2.5" {...P} /><rect x="13.5" y="4.5" width="5" height="5" rx="1" {...P} /><path d="M5 17l2-3 2 3z" {...P} /><circle cx="16" cy="16.5" r="2.5" {...P} /></>,
  motion: <><circle cx="6" cy="12" r="2" {...P} /><path d="M9 12h3M14 12h2.5M18.5 12H20" {...P} /></>,
  illustration: <><path d="M3 17.5L9 11l3.5 3.5L20 7" {...P} /><circle cx="7" cy="7" r="1.6" {...P} /></>,
  film: <><rect x="3" y="4" width="18" height="16" rx="2" {...P} /><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" {...P} /></>,
  character: <><circle cx="12" cy="8" r="3.5" {...P} /><path d="M5.5 20a6.5 6.5 0 0113 0" {...P} /></>,
  web: <><rect x="3" y="4" width="18" height="14" rx="2" {...P} /><path d="M3 8h18M6.5 6.2h.01" {...P} /></>,
  responsive: <><rect x="2.5" y="4" width="13" height="10" rx="1.5" {...P} /><rect x="14" y="9" width="7.5" height="11" rx="1.5" {...P} /></>,
  email: <><rect x="3" y="5" width="18" height="14" rx="2" {...P} /><path d="M4 7l8 6 8-6" {...P} /></>,
  campaign: <><path d="M3 11l14-6v14L3 13zM3 11v2M17 9a3 3 0 010 6" {...P} /></>,
  ecommerce: <><circle cx="9" cy="20" r="1.4" {...P} /><circle cx="17" cy="20" r="1.4" {...P} /><path d="M3 4h2l2.5 12h11l1.5-8H6" {...P} /></>,
  leadership: <><path d="M12 3l2.3 4.6 5 .8-3.6 3.5.8 5-4.5-2.3L7.5 17l.8-5L4.7 8.4l5-.8z" {...P} /></>,
  advocacy: <><path d="M3 11l13-6v14L3 13zM7 13v5l3 1" {...P} /></>,
  systems: <><circle cx="12" cy="5" r="2.2" {...P} /><circle cx="5" cy="18" r="2.2" {...P} /><circle cx="19" cy="18" r="2.2" {...P} /><path d="M12 7.2v4M10.2 13l-3 3M13.8 13l3 3" {...P} /></>,
  ai: <><rect x="6" y="6" width="12" height="12" rx="2.5" {...P} /><path d="M9 2.5v3M15 2.5v3M9 18.5v3M15 18.5v3M2.5 9h3M2.5 15h3M18.5 9h3M18.5 15h3" {...P} /><circle cx="12" cy="12" r="2" {...P} /></>,
}

export function CapIcon({ name }: { name?: string }) {
  const node = (name && ICONS[name]) || <><circle cx="7" cy="7" r="1.3" {...P} /><circle cx="12" cy="7" r="1.3" {...P} /><circle cx="17" cy="7" r="1.3" {...P} /><circle cx="7" cy="12" r="1.3" {...P} /><circle cx="12" cy="12" r="1.3" {...P} /><circle cx="17" cy="12" r="1.3" {...P} /></>
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      {node}
    </svg>
  )
}
