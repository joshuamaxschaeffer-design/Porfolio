'use client'

/**
 * Trees UX — faithful recreation of the "Sitemap" frame from the Trees
 * Wireframes Figma (file ChRGTElERDmhPMpLKQZnN6, node 0:2). The arrangement is
 * intentionally aesthetic — it communicates the product's complexity — so node
 * positions are pixel-traced from the Figma artboard (2532×2585) and laid out
 * as a % of an aspect-ratio box, scaling to any width with no JS.
 *
 * Block styles mirror the Figma legend exactly:
 *   page         — white, solid black 1.6px border
 *   stackContent ("page with stack of content") — white card + two faint
 *                  offset cards behind it (down-right)
 *   stackPages   — three cards, the front one offset up-left (a stack of pages)
 *   content      — white, solid BLUE border (#0053ff)
 *   stackBlue    ("stack of content") — blue card + two faint blue offsets
 *   repo         — cylinder (repository / ML algorithm)
 * Dashed rectangles mark "Related Group".
 *
 * CONNECTORS: unlike the earlier pass (plain polylines, no direction), edges now
 * read as the Panda/Wingstop flows do — every link is a DIRECTED arrow that
 * flows parent → child and fans out (splits) from shared parents. Routing stays
 * orthogonal (Manhattan elbows) to match the Figma's right-angle sitemap look;
 * a single SVG marker puts an arrowhead on the segment that enters each child,
 * so the eye follows the product from one screen to the next.
 */
import { CSSProperties } from 'react'

const W = 2532
const H = 2585
const BLUE = '#0053ff'
const INK = '#1a1a1a'

type Kind = 'page' | 'stackContent' | 'stackPages' | 'content' | 'stackBlue'

interface NodeDef {
  id: string
  x: number
  y: number
  w: number
  h: number
  label: string
  kind: Kind
}

// ── Every node, verbatim from the Figma (abs px on the 2532×2585 artboard) ──
const NODES: NodeDef[] = [
  // Bottom Navigation row
  { id: 'home', x: 1094, y: 172, w: 310, h: 88, label: 'Homepage', kind: 'page' },
  { id: 'community', x: 218, y: 172, w: 215, h: 88, label: 'Community', kind: 'page' },
  { id: 'profile', x: 2100, y: 172, w: 151, h: 88, label: 'Profile', kind: 'stackContent' },
  // Community branch
  { id: 'forum', x: 205, y: 369, w: 145, h: 88, label: 'Forum', kind: 'stackContent' },
  { id: 'community-cap', x: 205, y: 481, w: 313, h: 88, label: 'Create Action Plan', kind: 'stackPages' },
  // Create Goal column (inside the dashed Related Group at 753,445 / 513×699)
  { id: 'goal-search', x: 897, y: 494, w: 223, h: 88, label: 'Goal Search', kind: 'page' },
  { id: 'goal-intro', x: 874, y: 631, w: 269, h: 88, label: 'Goal Intro Page', kind: 'page' },
  { id: 'questionaire', x: 895, y: 768, w: 227, h: 84, label: 'Questionaire', kind: 'stackPages' },
  { id: 'plan-list', x: 851, y: 932, w: 270, h: 84, label: 'Action plan List', kind: 'stackContent' },
  { id: 'plan-detail', x: 851, y: 1036, w: 296, h: 88, label: 'Action plan detail', kind: 'page' },
  { id: 'goal-page-cg', x: 911, y: 1209, w: 197, h: 88, label: 'Goal Page', kind: 'stackContent' },
  // Goal Page branch (right of Create Goal)
  { id: 'goal-page', x: 1405, y: 357, w: 197, h: 88, label: 'Goal Page', kind: 'stackContent' },
  { id: 'action-plans', x: 1390, y: 547, w: 225, h: 84, label: 'Action Plans', kind: 'stackBlue' },
  { id: 'goal-community', x: 1390, y: 647, w: 284, h: 88, label: 'Goal Community', kind: 'content' },
  { id: 'user-profile', x: 1390, y: 785, w: 222, h: 88, label: 'User Profile', kind: 'page' },
  { id: 'goal-cap', x: 1390, y: 918, w: 313, h: 88, label: 'Create Action Plan', kind: 'stackPages' },
  // Profile branch
  { id: 'created-plans', x: 2100, y: 330, w: 345, h: 88, label: 'Created Action Plans', kind: 'page' },
  { id: 'messages', x: 2100, y: 468, w: 205, h: 88, label: 'Messages', kind: 'page' },
  { id: 'settings', x: 2099, y: 606, w: 174, h: 88, label: 'Settings', kind: 'page' },
  // Create Action Plan group (inside dashed box at 1271,1335)
  { id: 'cap', x: 1271 + 426, y: 1335 + 114, w: 313, h: 88, label: 'Create Action Plan', kind: 'page' },
  { id: 'add-title', x: 1760, y: 1596, w: 183, h: 88, label: 'Add Title', kind: 'content' },
  { id: 'add-desc', x: 1760, y: 1709, w: 276, h: 88, label: 'Add Description', kind: 'content' },
  { id: 'secrecy', x: 1760, y: 1822, w: 355, h: 88, label: 'Select profile secrecy', kind: 'content' },
  { id: 'add-tags', x: 1271 + 489, y: 1335 + 692, w: 187, h: 88, label: 'Add Tags', kind: 'page' },
  { id: 'task-list', x: 1271 + 491.5, y: 1335 + 830, w: 182, h: 88, label: 'Task List', kind: 'stackContent' },
  { id: 'task-create', x: 1271 + 458.5, y: 1335 + 968, w: 248, h: 88, label: 'Task Creation', kind: 'page' },
]

const N: Record<string, NodeDef> = Object.fromEntries(NODES.map((n) => [n.id, n]))

// Section titles (Heebo Bold)
const TITLES: { x: number; y: number; label: string; center?: boolean }[] = [
  { x: 1253.5, y: 96, label: 'Bottom Navigation', center: true },
  { x: 1007.5, y: 383, label: 'Create Goal', center: true },
  { x: 1271 + 583.5, y: 1335 + 4, label: 'Create Action Plan', center: true },
]

// Dashed "Related Group" rectangles (x,y,w,h on artboard)
const GROUPS: { x: number; y: number; w: number; h: number }[] = [
  { x: 753, y: 445, w: 513, h: 699 },
  { x: 1271, y: 1335 + 63, w: 1165, h: 1093 },
]

// Machine Learning Algorithm cylinder (repository) — Group 5 at 652,1508 122×125
const REPO = { x: 652, y: 1508, w: 122, h: 125, labelY: 1660 }

// ── Edges: directed parent → child. `via` controls the orthogonal elbow:
//   'h'  straight horizontal       'v'  straight vertical
//   'hv' go horizontal then drop   'vh' drop then go horizontal
// `fromSide`/`toSide` pin which edge of each box the link leaves / enters; the
// arrowhead sits on the entering segment. Mirrors the Figma's elbow routing
// while encoding the real tree (one parent fanning to many children). ──
type Side = 'top' | 'bottom' | 'left' | 'right'
interface Edge {
  from: string
  to: string
  via: 'h' | 'v' | 'hv' | 'vh'
  fromSide: Side
  toSide: Side
  /** shared bus corner override (artboard px), for fan-out rails / buses */
  busY?: number
  busX?: number
}

const EDGES: Edge[] = [
  // Bottom Navigation fans to the side roots (shared top bus at y≈122)
  { from: 'home', to: 'community', via: 'vh', fromSide: 'top', toSide: 'top', busY: 122 },
  { from: 'home', to: 'profile', via: 'vh', fromSide: 'top', toSide: 'top', busY: 122 },
  // Community → its two children (left rail at x≈154)
  { from: 'community', to: 'forum', via: 'vh', fromSide: 'bottom', toSide: 'left', busX: 154 },
  { from: 'community', to: 'community-cap', via: 'vh', fromSide: 'bottom', toSide: 'left', busX: 154 },
  // Homepage fans down to Create Goal (Goal Search) and the right Goal Page
  { from: 'home', to: 'goal-search', via: 'vh', fromSide: 'bottom', toSide: 'top', busY: 308 },
  { from: 'home', to: 'goal-page', via: 'vh', fromSide: 'bottom', toSide: 'top', busY: 308 },
  // Create Goal vertical chain
  { from: 'goal-search', to: 'goal-intro', via: 'v', fromSide: 'bottom', toSide: 'top' },
  { from: 'goal-intro', to: 'questionaire', via: 'v', fromSide: 'bottom', toSide: 'top' },
  { from: 'questionaire', to: 'plan-list', via: 'v', fromSide: 'bottom', toSide: 'top' },
  { from: 'plan-list', to: 'plan-detail', via: 'v', fromSide: 'bottom', toSide: 'top' },
  { from: 'plan-detail', to: 'goal-page-cg', via: 'vh', fromSide: 'bottom', toSide: 'top', busY: 1162 },
  // Goal Page (right) fans to its four children (left rail at x≈1357)
  { from: 'goal-page', to: 'action-plans', via: 'vh', fromSide: 'bottom', toSide: 'left', busX: 1357 },
  { from: 'goal-page', to: 'goal-community', via: 'vh', fromSide: 'bottom', toSide: 'left', busX: 1357 },
  { from: 'goal-community', to: 'user-profile', via: 'v', fromSide: 'bottom', toSide: 'top' },
  { from: 'goal-page', to: 'goal-cap', via: 'vh', fromSide: 'bottom', toSide: 'left', busX: 1357 },
  // Profile fans to its three children (left rail at x≈2057)
  { from: 'profile', to: 'created-plans', via: 'vh', fromSide: 'bottom', toSide: 'left', busX: 2057 },
  { from: 'profile', to: 'messages', via: 'vh', fromSide: 'bottom', toSide: 'left', busX: 2057 },
  { from: 'profile', to: 'settings', via: 'vh', fromSide: 'bottom', toSide: 'left', busX: 2057 },
  // Create Action Plan group: header fans to the three "content" fields (rail x≈1700)
  { from: 'cap', to: 'add-title', via: 'vh', fromSide: 'bottom', toSide: 'left', busX: 1700 },
  { from: 'cap', to: 'add-desc', via: 'vh', fromSide: 'bottom', toSide: 'left', busX: 1700 },
  { from: 'cap', to: 'secrecy', via: 'vh', fromSide: 'bottom', toSide: 'left', busX: 1700 },
  // …then the secrecy → Add Tags → Task List → Task Creation chain (rail rejoins center)
  { from: 'secrecy', to: 'add-tags', via: 'vh', fromSide: 'bottom', toSide: 'top', busX: 1853 },
  { from: 'add-tags', to: 'task-list', via: 'v', fromSide: 'bottom', toSide: 'top' },
  { from: 'task-list', to: 'task-create', via: 'v', fromSide: 'bottom', toSide: 'top' },
]

// Dashed connector: Questionaire ⇢ Machine Learning Algorithm (blue dashed).
const DASHED: number[][] = [
  [823, 810], [713, 810], [713, 1508],
]

const pct = (v: number, total: number) => `${(v / total) * 100}%`

// anchor point on a node's edge (artboard px)
function anchor(n: NodeDef, side: Side): [number, number] {
  const cx = n.x + n.w / 2
  const cy = n.y + n.h / 2
  switch (side) {
    case 'top': return [cx, n.y]
    case 'bottom': return [cx, n.y + n.h]
    case 'left': return [n.x, cy]
    case 'right': return [n.x + n.w, cy]
  }
}

// Build the orthogonal point list for an edge. The arrowhead lands on the last
// segment (the one entering the child), so its direction reads correctly.
function routePoints(e: Edge): [number, number][] {
  const a = N[e.from]
  const b = N[e.to]
  const [ax, ay] = anchor(a, e.fromSide)
  const [bx, by] = anchor(b, e.toSide)
  switch (e.via) {
    case 'h':
    case 'v':
      return [[ax, ay], [bx, by]]
    case 'hv': {
      const cx = e.busX ?? bx
      return [[ax, ay], [cx, ay], [cx, by], [bx, by]]
    }
    case 'vh': {
      const cy = e.busY ?? by
      const cx = e.busX ?? ax
      if (e.busX != null) {
        // exit downward to rail X, run down the rail, then turn into the child
        return ([[ax, ay], [ax, e.busY ?? by], [cx, e.busY ?? by], [cx, by], [bx, by]] as [number, number][])
          .filter((p, i, arr) => i === 0 || p[0] !== arr[i - 1][0] || p[1] !== arr[i - 1][1])
      }
      // simple drop-to-bus then across to the child's top
      return [[ax, ay], [ax, cy], [bx, cy], [bx, by]]
    }
  }
}

// shorten the final segment so the arrowhead tip kisses the box (not overlap)
function insetLast(pts: [number, number][], gap = 7): [number, number][] {
  if (pts.length < 2) return pts
  const out = pts.map((p) => [...p] as [number, number])
  const p1 = out[out.length - 2]
  const p2 = out[out.length - 1]
  const dx = p2[0] - p1[0]
  const dy = p2[1] - p1[1]
  const len = Math.hypot(dx, dy) || 1
  out[out.length - 1] = [p2[0] - (dx / len) * gap, p2[1] - (dy / len) * gap]
  return out
}

function Node({ n, fs }: { n: NodeDef; fs: string }) {
  const style: CSSProperties = {
    position: 'absolute',
    left: pct(n.x, W),
    top: pct(n.y, H),
    width: pct(n.w, W),
    height: pct(n.h, H),
  }
  const label = (
    <span
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-[6%] text-center font-bold leading-tight text-black"
      style={{ fontSize: fs, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}
    >
      {n.label}
    </span>
  )
  const radius = `${(8 / W) * 100}cqw`
  const bw = `${(1.6 / W) * 100}cqw`

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
    const color = n.kind === 'stackBlue' ? BLUE : '#000'
    const faint = n.kind === 'stackBlue' ? 0.6 : 0.25
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

function Cylinder({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <div className="absolute" style={{ left: pct(x, W), top: pct(y, H), width: pct(w, W), height: pct(h, H) }}>
      <svg viewBox="0 0 100 90" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d="M4 14 V76 a46 12 0 0 0 92 0 V14" fill="white" stroke="#000" strokeWidth="3" />
        <ellipse cx="50" cy="14" rx="46" ry="12" fill="white" stroke="#000" strokeWidth="3" />
      </svg>
    </div>
  )
}

function Legend({ fsNode, fsCap }: { fsNode: string; fsCap: string }) {
  const items: NodeDef[] = [
    { id: 'l1', x: 166, y: 2047, w: 128, h: 88, label: 'Page', kind: 'page' },
    { id: 'l2', x: 166, y: 2159, w: 413, h: 88, label: 'Page with stack of content', kind: 'stackContent' },
    { id: 'l3', x: 166, y: 2267, w: 254, h: 88, label: 'Stack of pages', kind: 'stackPages' },
    { id: 'l4', x: 667, y: 2047, w: 167, h: 88, label: 'Content', kind: 'content' },
    { id: 'l5', x: 667, y: 2155, w: 276, h: 84, label: 'Stack of content', kind: 'stackBlue' },
  ]
  return (
    <>
      <div className="absolute" style={{ left: pct(89, W), top: pct(1887, H), width: pct(1095, W), height: pct(604, H), background: '#d8d8d8', opacity: 0.3, borderRadius: `${(8 / W) * 100}cqw` }} />
      <span className="absolute font-black text-black" style={{ left: pct(166, W), top: pct(1933, H), fontSize: `${(56 / W) * 100}cqw`, letterSpacing: '-0.0162em' }}>Legend</span>
      {items.map((it) => (
        <Node key={it.id} n={it} fs={fsNode} />
      ))}
      {/* Related Group swatch (dashed) + label */}
      <div className="absolute" style={{ left: pct(667, W), top: pct(2267, H), width: pct(110, W), height: pct(63, H), border: `${(1.6 / W) * 100}cqw dashed #000`, borderRadius: `${(6 / W) * 100}cqw` }} />
      <span className="absolute flex items-center font-bold text-black" style={{ left: pct(793, W), top: pct(2267, H), height: pct(63, H), fontSize: fsCap, whiteSpace: 'nowrap' }}>Related Group</span>
      {/* Repository swatch (cylinder) + label */}
      <Cylinder x={667} y={2358} w={96} h={85} />
      <span className="absolute flex items-center font-bold text-black" style={{ left: pct(793, W), top: pct(2358, H), height: pct(85, H), fontSize: fsCap, whiteSpace: 'nowrap' }}>Repository/Algorithm</span>
    </>
  )
}

export function TreesUxFlow() {
  // Node labels target 10–12px on screen. The diagram keeps a legible min width
  // and the container scrolls horizontally on narrow screens rather than
  // crushing labels. clamp() pins the rendered label size into the 10–12px band
  // regardless of how wide the card is.
  const fsNode = 'clamp(10px, 1.05cqw, 12px)'
  const fsTitle = 'clamp(11px, 1.3cqw, 14px)'
  const fsCap = 'clamp(10px, 1.05cqw, 12px)'

  return (
    <div className="relative w-full overflow-x-auto [scrollbar-width:thin]">
      <div
        className="relative mx-auto min-w-[760px] max-w-[1080px]"
        style={{ width: '100%', aspectRatio: `${W} / ${H}`, containerType: 'inline-size' } as CSSProperties}
      >
        {/* connectors under the blocks — directed arrows, orthogonal routing */}
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <marker id="treesArrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
              <path d="M0,0 L10,5 L0,10 z" fill={INK} />
            </marker>
            <marker id="treesArrowBlue" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
              <path d="M0,0 L10,5 L0,10 z" fill={BLUE} />
            </marker>
          </defs>
          {EDGES.map((e, i) => {
            const pts = insetLast(routePoints(e))
            return (
              <polyline
                key={i}
                points={pts.map((p) => p.join(',')).join(' ')}
                fill="none"
                stroke={INK}
                strokeWidth={2.2}
                strokeLinejoin="round"
                strokeLinecap="round"
                markerEnd="url(#treesArrow)"
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
          {/* Questionaire ⇢ ML Algorithm (dashed, blue, with joint dot) */}
          <polyline
            points={DASHED.map((p) => p.join(',')).join(' ')}
            fill="none"
            stroke={BLUE}
            strokeWidth={2.2}
            strokeDasharray="9 7"
            markerEnd="url(#treesArrowBlue)"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx={823} cy={810} r={13} fill="white" stroke={BLUE} strokeWidth={2.2} vectorEffect="non-scaling-stroke" />
        </svg>

        {/* dashed Related Group rectangles */}
        {GROUPS.map((g, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: pct(g.x, W), top: pct(g.y, H), width: pct(g.w, W), height: pct(g.h, H), border: `${(1.6 / W) * 100}cqw dashed #000`, borderRadius: `${(6 / W) * 100}cqw` }}
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
              fontSize: fsTitle,
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </span>
        ))}

        {/* nodes */}
        {NODES.map((n) => (
          <Node key={n.id} n={n} fs={fsNode} />
        ))}

        {/* Machine Learning Algorithm cylinder + caption */}
        <Cylinder x={REPO.x} y={REPO.y} w={REPO.w} h={REPO.h} />
        <span
          className="absolute text-center font-bold leading-tight text-black"
          style={{ left: pct(713, W), top: pct(REPO.labelY, H), transform: 'translateX(-50%)', fontSize: fsCap, whiteSpace: 'nowrap' }}
        >
          Machine<br />Learning<br />Algorithm
        </span>

        {/* legend */}
        <Legend fsNode={fsNode} fsCap={fsCap} />
      </div>
    </div>
  )
}
