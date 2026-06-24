'use client'

/**
 * Trees UX — faithful recreation of the "Sitemap" frame from the Trees Wireframes
 * Figma (file ChRGTElERDmhPMpLKQZnN6, node 0:2). The arrangement is intentionally
 * aesthetic — it communicates the product's complexity — so this is a fixed
 * pixel-accurate layout, NOT an auto-laid-out graph and NOT tabbed.
 *
 * The native Figma artboard is 2532×2585. Every element is positioned as a % of
 * that canvas inside an aspect-ratio box, so the whole map scales to any width
 * with no JS. Block styles mirror the Figma legend exactly:
 *   page      — white, solid black 2px border
 *   stackContent ("page with stack of content") — white card + two faint
 *                offset cards behind it (down-right)
 *   stackPages   — three cards, the front one offset up-left (a stack of pages)
 *   content      — white, solid BLUE border (#0053ff)
 *   stackBlue ("stack of content") — blue card + two faint blue offset cards
 *   repo         — cylinder (repository / algorithm)
 * Dashed rectangles mark "Related Group". Connectors are real SVG polylines
 * traced from the Figma vector boxes.
 */
import { CSSProperties } from 'react'

const W = 2532
const H = 2585
const BLUE = '#0053ff'

type Kind = 'page' | 'stackContent' | 'stackPages' | 'content' | 'stackBlue'

interface NodeDef {
  x: number
  y: number
  w: number
  h: number
  label: string
  kind: Kind
  /** font px (Figma uses 30 for nodes); auto-fits via the canvas scale */
  fs?: number
}

// ── Every node, verbatim from the Figma (abs px on the 2532×2585 artboard) ──
const NODES: NodeDef[] = [
  // Bottom Navigation row
  { x: 1094, y: 172, w: 310, h: 88, label: 'Homepage', kind: 'page' },
  { x: 218, y: 172, w: 215, h: 88, label: 'Community', kind: 'page' },
  { x: 2100, y: 172, w: 151, h: 88, label: 'Profile', kind: 'stackContent' },
  // Community branch
  { x: 205, y: 369, w: 145, h: 88, label: 'Forum', kind: 'stackContent' },
  { x: 205, y: 481, w: 313, h: 88, label: 'Create Action Plan', kind: 'stackPages' },
  // Create Goal column (inside the dashed Related Group at 753,445 / 513×699)
  { x: 897, y: 494, w: 223, h: 88, label: 'Goal Search', kind: 'page' },
  { x: 874, y: 631, w: 269, h: 88, label: 'Goal Intro Page', kind: 'page' },
  { x: 895, y: 768, w: 227, h: 84, label: 'Questionaire', kind: 'stackPages' },
  { x: 851, y: 932, w: 270, h: 84, label: 'Action plan List', kind: 'stackContent' },
  { x: 851, y: 1036, w: 296, h: 88, label: 'Action plan detail', kind: 'page' },
  { x: 911, y: 1209, w: 197, h: 88, label: 'Goal Page', kind: 'stackContent' },
  // Goal Page branch (right of Create Goal)
  { x: 1405, y: 357, w: 197, h: 88, label: 'Goal Page', kind: 'stackContent' },
  { x: 1390, y: 547, w: 225, h: 84, label: 'Action Plans', kind: 'stackBlue' },
  { x: 1390, y: 647, w: 284, h: 88, label: 'Goal Community', kind: 'content' },
  { x: 1390, y: 785, w: 222, h: 88, label: 'User Profile', kind: 'page' },
  { x: 1390, y: 918, w: 313, h: 88, label: 'Create Action Plan', kind: 'stackPages' },
  // Profile branch
  { x: 2100, y: 330, w: 345, h: 88, label: 'Created Action Plans', kind: 'page' },
  { x: 2100, y: 468, w: 205, h: 88, label: 'Messages', kind: 'page' },
  { x: 2099, y: 606, w: 174, h: 88, label: 'Settings', kind: 'page' },
  // Create Action Plan group (inside dashed box at 1271,1335)
  { x: 1271 + 426, y: 1335 + 114, w: 313, h: 88, label: 'Create Action Plan', kind: 'page' },
  { x: 1760, y: 1596, w: 183, h: 88, label: 'Add Title', kind: 'content' },
  { x: 1760, y: 1709, w: 276, h: 88, label: 'Add Description', kind: 'content' },
  { x: 1760, y: 1822, w: 355, h: 88, label: 'Select profile secrecy', kind: 'content' },
  { x: 1271 + 489, y: 1335 + 692, w: 187, h: 88, label: 'Add Tags', kind: 'page' },
  { x: 1271 + 491.5, y: 1335 + 830, w: 182, h: 88, label: 'Task List', kind: 'stackContent' },
  { x: 1271 + 458.5, y: 1335 + 968, w: 248, h: 88, label: 'Task Creation', kind: 'page' },
]

// Section titles (Heebo Bold 35)
const TITLES: { x: number; y: number; label: string; center?: boolean }[] = [
  { x: 1253.5, y: 94, label: 'Bottom Navigation', center: true },
  { x: 1007.5, y: 383, label: 'Create Goal', center: true },
  { x: 1271 + 583.5, y: 1335 + 0, label: 'Create Action Plan', center: true },
]

// Dashed "Related Group" rectangles (x,y,w,h on artboard)
const GROUPS: { x: number; y: number; w: number; h: number }[] = [
  { x: 753, y: 445, w: 513, h: 699 },
  { x: 1271, y: 1335 + 63, w: 1165, h: 1093 },
]

// ── Connectors: straight orthogonal polylines traced from the Figma vector
// boxes (each entry is a list of [x,y] points on the artboard). ──
const LINES: number[][][] = [
  // Bottom Navigation horizontal bus + drops to the three roots
  [[326, 122], [2176, 122]], // top bus (spans Community↔Profile via the title)
  [[326, 121], [326, 172]], // drop → Community
  [[2176, 121], [2176, 172]], // drop → Profile
  [[1249, 146], [1249, 172]], // drop → Homepage (short stub under title)
  // Community → Forum, Create Action Plan (elbow down-left)
  [[154, 260], [154, 519], [205, 519]], // long left rail (Community down to CAP)
  [[154, 406], [205, 406]], // tee → Forum
  // Homepage → Create Goal bus + Goal Page
  [[1007, 308], [1504, 308]], // horizontal bus under Homepage
  [[1008, 308], [1008, 371]], // drop → Goal Search (into Create Goal)
  [[1503, 308], [1503, 357]], // drop → Goal Page (right branch)
  // Create Goal vertical chain
  [[1008, 582], [1008, 631]], // Goal Search → Goal Intro Page
  [[1008, 719], [1008, 768]], // Goal Intro → Questionaire
  [[1008, 843], [1008, 892]], // Questionaire → Action plan List area
  [[981, 1008], [981, 1036]], // Action plan List → Action plan detail
  [[823, 891], [823, 975], [1009, 975]], // elbow Action plan List ↔ detail (left rail)
  [[1008, 976], [1200, 976], [1200, 1160]], // detail → down to Goal Page (right rail)
  [[1008, 1159], [1008, 1209]], // → Goal Page
  [[1147, 1085], [1201, 1085]], // small tee near detail
  // Goal Page (right) → its children
  [[1503, 445], [1503, 494]], // Goal Page → Action Plans
  [[1357, 494], [1357, 962]], // left rail down the Goal Page children
  [[1357, 589], [1390, 589]], // tee → Action Plans
  [[1357, 691], [1391, 691]], // tee → Goal Community
  [[1504, 735], [1504, 784]], // → User Profile drop
  [[1356, 962], [1391, 962]], // tee → Create Action Plan
  // Profile → its children (right rail)
  [[2057, 260], [2057, 651]], // left rail of Profile children
  [[2057, 374], [2100, 374]], // tee → Created Action Plans
  [[2057, 512], [2100, 512]], // tee → Messages
  [[2057, 650], [2100, 650]], // tee → Settings
  // Create Action Plan group internal rail
  [[1700, 1537], [1700, 1996]], // left rail
  [[1700, 1640], [1760, 1640]], // tee → Add Title
  [[1700, 1753], [1760, 1753]], // tee → Add Description
  [[1700, 1866], [1760, 1866]], // tee → Select profile secrecy
  // Create Action Plan vertical chain (Add Tags → Task List → Task Creation)
  [[1271 + 582, 1335 + 693], [1271 + 582, 1335 + 692]],
  [[1853, 1335 + 780], [1853, 1335 + 830]], // Add Tags → Task List
  [[1853, 1335 + 918], [1853, 1335 + 968]], // Task List → Task Creation
]

// Dashed connector: Questionaire ⇢ Machine Learning Algorithm (the blue dashed
// line). Traced from Path 12 (713,892 110×616) + the oval joint at 809,878.
const DASHED: number[][] = [
  [823, 892], [713, 892], [713, 1508],
]

// Machine Learning Algorithm cylinder (repository) — Group 5 at 652,1508 122×125
const REPO = { x: 652, y: 1508, w: 122, h: 125, label: 'Machine\nLearning\nAlgorithm', labelY: 1639 }

const pct = (v: number, total: number) => `${(v / total) * 100}%`

function Node({ n }: { n: NodeDef }) {
  const style: CSSProperties = {
    position: 'absolute',
    left: pct(n.x, W),
    top: pct(n.y, H),
    width: pct(n.w, W),
    height: pct(n.h, H),
  }
  // font size as a % of canvas WIDTH (30px on the 2532px artboard) so labels
  // track the box widths exactly as drawn in Figma
  const fs = `${((n.fs ?? 30) / W) * 100}cqw`
  const label = (
    <span
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-[6%] text-center font-black leading-tight text-black"
      style={{ fontSize: fs, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}
    >
      {n.label}
    </span>
  )
  const radius = `${(10 / W) * 100}cqw`
  const bw = `${(2 / W) * 100}cqw`

  if (n.kind === 'page' || n.kind === 'content') {
    const color = n.kind === 'content' ? BLUE : '#000'
    return (
      <div style={style}>
        <div className="absolute inset-0 bg-white" style={{ border: `${bw} solid ${color}`, borderRadius: radius }} />
        {label}
      </div>
    )
  }
  if (n.kind === 'stackContent' || n.kind === 'stackBlue') {
    // front card top-left, two faint offset cards down-right
    const color = n.kind === 'stackBlue' ? BLUE : '#000'
    const faint = n.kind === 'stackBlue' ? 0.6 : 0.2
    return (
      <div style={style}>
        <div className="absolute" style={{ inset: '9.5% 0.2% 0 3.8%', border: `${bw} solid ${color}`, opacity: faint, borderRadius: radius }} />
        <div className="absolute" style={{ inset: '4.76% 2%', border: `${bw} solid ${color}`, opacity: faint, borderRadius: radius }} />
        <div className="absolute bg-white" style={{ inset: '0 3.8% 9.5% 0.2%', border: `${bw} solid ${color}`, borderRadius: radius }} />
        {label}
      </div>
    )
  }
  // stackPages — three cards, front one offset up-left
  return (
    <div style={style}>
      <div className="absolute" style={{ inset: '6.82% 2.84%', border: `${bw} solid #000`, borderRadius: radius }} />
      <div className="absolute" style={{ inset: '13.64% 0.22% 0 5.46%', border: `${bw} solid #000`, borderRadius: radius }} />
      <div className="absolute bg-white" style={{ inset: '0 5.46% 13.64% 0.22%', border: `${bw} solid #000`, borderRadius: radius }} />
      {label}
    </div>
  )
}

function Legend() {
  // Built from the same Node renderer so the legend swatches are identical to
  // the real blocks. Positions mirror the Figma legend panel.
  const items: { x: number; y: number; w: number; h: number; label: string; kind: Kind }[] = [
    { x: 166, y: 2047, w: 128, h: 88, label: 'Page', kind: 'page' },
    { x: 166, y: 2159, w: 413, h: 88, label: 'Page with stack of content', kind: 'stackContent' },
    { x: 166, y: 2267, w: 254, h: 88, label: 'Stack of pages', kind: 'stackPages' },
    { x: 667, y: 2047, w: 167, h: 88, label: 'Content', kind: 'content' },
    { x: 667, y: 2155, w: 276, h: 84, label: 'Stack of content', kind: 'stackBlue' },
  ]
  return (
    <>
      {/* panel bg */}
      <div className="absolute" style={{ left: pct(89, W), top: pct(1887, H), width: pct(1095, W), height: pct(604, H), background: '#d8d8d8', opacity: 0.3 }} />
      <span className="absolute font-black text-black" style={{ left: pct(166, W), top: pct(1939, H), fontSize: `${(60 / W) * 100}cqw`, letterSpacing: '-0.0162em' }}>Legend</span>
      {items.map((it) => (
        <Node key={it.label} n={it} />
      ))}
      {/* Related Group swatch (dashed) + label */}
      <div className="absolute" style={{ left: pct(667, W), top: pct(2267, H), width: pct(110, W), height: pct(63, H), border: `${(2 / W) * 100}cqw dashed #000`, borderRadius: `${(6 / W) * 100}cqw` }} />
      <span className="absolute font-black text-black" style={{ left: pct(793, W), top: pct(2276, H), fontSize: `${(30 / W) * 100}cqw`, whiteSpace: 'nowrap' }}>Related Group</span>
      {/* Repository swatch (cylinder) + label — aligned to the Related Group column */}
      <Cylinder x={667} y={2360} w={96} h={85} />
      <span className="absolute font-black text-black" style={{ left: pct(793, W), top: pct(2385, H), fontSize: `${(30 / W) * 100}cqw`, whiteSpace: 'nowrap' }}>Repository/Algorithm</span>
    </>
  )
}

function Cylinder({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label?: string }) {
  return (
    <div className="absolute" style={{ left: pct(x, W), top: pct(y, H), width: pct(w, W), height: pct(h, H) }}>
      <svg viewBox="0 0 100 90" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d="M4 14 V76 a46 12 0 0 0 92 0 V14" fill="white" stroke="#000" strokeWidth="3" />
        <ellipse cx="50" cy="14" rx="46" ry="12" fill="white" stroke="#000" strokeWidth="3" />
      </svg>
    </div>
  )
}

export function TreesUxFlow() {
  // viewBox in artboard units so polylines use raw Figma coordinates
  return (
    <div className="relative w-full overflow-x-auto [scrollbar-width:thin]">
      {/* On narrow screens the diagram keeps a legible min width and the
          container scrolls horizontally, rather than crushing 30px labels down
          to ~3px. cqw font sizing tracks this width so labels stay readable. */}
      <div
        className="relative mx-auto min-w-[900px]"
        style={{ width: '100%', aspectRatio: `${W} / ${H}`, containerType: 'inline-size' } as CSSProperties}
      >
        {/* connectors under the blocks */}
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" aria-hidden>
          {LINES.map((pts, i) => (
            <polyline
              key={i}
              points={pts.map((p) => p.join(',')).join(' ')}
              fill="none"
              stroke="#1a1a1a"
              strokeWidth={2.4}
              vectorEffect="non-scaling-stroke"
              shapeRendering="crispEdges"
            />
          ))}
          <polyline
            points={DASHED.map((p) => p.join(',')).join(' ')}
            fill="none"
            stroke={BLUE}
            strokeWidth={2.4}
            strokeDasharray="9 7"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx={809 + 14} cy={892} r={13} fill="white" stroke={BLUE} strokeWidth={2.4} vectorEffect="non-scaling-stroke" />
        </svg>

        {/* dashed Related Group rectangles */}
        {GROUPS.map((g, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: pct(g.x, W), top: pct(g.y, H), width: pct(g.w, W), height: pct(g.h, H), border: `${(2 / W) * 100}cqw dashed #000` }}
          />
        ))}

        {/* section titles */}
        {TITLES.map((t) => (
          <span
            key={t.label}
            className="absolute font-bold text-black"
            style={{
              left: pct(t.x, W),
              top: pct(t.y, H),
              transform: t.center ? 'translateX(-50%)' : undefined,
              fontSize: `${(35 / W) * 100}cqw`,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </span>
        ))}

        {/* nodes */}
        {NODES.map((n) => (
          <Node key={`${n.label}-${n.x}-${n.y}`} n={n} />
        ))}

        {/* Machine Learning Algorithm cylinder + 3-line caption */}
        <Cylinder x={REPO.x} y={REPO.y} w={REPO.w} h={REPO.h} />
        <span
          className="absolute text-center font-bold leading-tight text-black"
          style={{ left: pct(716.5, W), top: pct(REPO.labelY, H), transform: 'translateX(-50%)', fontSize: `${(35 / W) * 100}cqw`, whiteSpace: 'nowrap' }}
        >
          Machine<br />Learning<br />Algorithm
        </span>

        {/* legend */}
        <Legend />
      </div>
    </div>
  )
}
