'use client'

/**
 * RankingReorder — a single-column drag-to-rank list, adapted from the Baserate
 * app's TakeRankingPollModal (`src/components/modals/TakeRankingPollModal.tsx`).
 * It uses the same displacement-animation drag the app uses: a rect-snapshot is
 * taken on mousedown, then as the cursor passes each row's midpoint the other
 * rows slide to open an insertion slot (no blue insertion line). Drop commits a
 * splice-reorder.
 *
 * Trimmed to one list (the app's version spans two columns) and re-skinned for
 * the dark Handoff section. Drag a row by its handle or body; the × removes it.
 */

import { useRef, useState } from 'react'
import { S } from './baserate-tokens'
import { IconDrag, IconX } from './baserate-icons'

export type RankItem = {
  id: string
  ticker: string
  name: string
  /** brand color for the ticker badge */
  color: string
}

const DEFAULT_ITEMS: RankItem[] = [
  { id: 'goog', ticker: '$GOOG', name: 'Google Inc', color: '#4285F4' },
  { id: 'amzn', ticker: '$AMZN', name: 'Amazon Inc', color: '#FF9900' },
  { id: 'brkb', ticker: '$BRK.B', name: 'Berkshire Hathway', color: '#1f3a93' },
]

type RectSnapshot = { id: string; top: number; height: number }

export function RankingReorder({ items: initial = DEFAULT_ITEMS }: { items?: RankItem[] }) {
  const [items, setItems] = useState<RankItem[]>(initial)

  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [insertIdx, setInsertIdx] = useState<number | null>(null)
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 })

  const colRef = useRef<HTMLDivElement | null>(null)
  const rectsRef = useRef<RectSnapshot[]>([])
  const dragIdxRef = useRef<number | null>(null)
  const insertIdxRef = useRef<number | null>(null)
  const draggedHeightRef = useRef(0)
  const didMoveRef = useRef(false)

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))

  const startDrag = (id: string, e: React.MouseEvent) => {
    if (draggingId !== null || e.button !== 0) return
    // Suppress the browser's native text selection while dragging a row.
    e.preventDefault()
    const dragIdx = items.findIndex((i) => i.id === id)
    if (dragIdx === -1) return

    const nodes = colRef.current?.querySelectorAll<HTMLElement>('[data-reorder-id]') ?? []
    rectsRef.current = Array.from(nodes).map((n) => {
      const r = n.getBoundingClientRect()
      return { id: n.dataset.reorderId ?? '', top: r.top, height: r.height }
    })
    draggedHeightRef.current = (rectsRef.current.find((r) => r.id === id)?.height ?? 40) + 6

    dragIdxRef.current = dragIdx
    insertIdxRef.current = dragIdx
    didMoveRef.current = false

    const startX = e.clientX
    const startY = e.clientY
    const DRAG_THRESHOLD = 5

    const handleMove = (me: MouseEvent) => {
      const dx = me.clientX - startX
      const dy = me.clientY - startY
      if (!didMoveRef.current && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
        didMoveRef.current = true
        me.preventDefault()
        setDraggingId(id)
        setInsertIdx(dragIdx)
      }
      if (!didMoveRef.current) return
      setDragDelta({ x: dx, y: dy })

      const rects = rectsRef.current
      let newInsertIdx = 0
      let seen = false
      for (let i = 0; i < rects.length; i++) {
        if (i === dragIdx) continue
        const mid = rects[i].top + rects[i].height / 2
        if (me.clientY > mid) {
          newInsertIdx = i < dragIdx ? i + 1 : i
          seen = true
        }
      }
      if (!seen) newInsertIdx = 0
      newInsertIdx = Math.max(0, Math.min(rects.length - 1, newInsertIdx))

      if (insertIdxRef.current !== newInsertIdx) {
        insertIdxRef.current = newInsertIdx
        setInsertIdx(newInsertIdx)
      }
    }

    const handleUp = () => {
      const finalIdx = insertIdxRef.current
      const origIdx = dragIdxRef.current
      if (didMoveRef.current && finalIdx !== null && origIdx !== null && finalIdx !== origIdx) {
        setItems((prev) => {
          const next = [...prev]
          const [moved] = next.splice(origIdx, 1)
          next.splice(finalIdx, 0, moved)
          return next
        })
      }
      setDraggingId(null)
      setInsertIdx(null)
      setDragDelta({ x: 0, y: 0 })
      dragIdxRef.current = null
      insertIdxRef.current = null
      draggedHeightRef.current = 0
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
  }

  const getItemStyle = (id: string, idx: number): React.CSSProperties => {
    if (id === draggingId) {
      return {
        transform: `translate(${dragDelta.x}px, ${dragDelta.y}px)`,
        transition: 'none',
        zIndex: 100,
        opacity: 0.97,
        position: 'relative',
        pointerEvents: 'none',
      }
    }
    if (draggingId === null || insertIdx === null) return {}
    const dragIdx = dragIdxRef.current
    if (dragIdx === null) return {}
    const itemH = draggedHeightRef.current
    let shift = 0
    if (dragIdx < insertIdx) {
      if (idx > dragIdx && idx <= insertIdx) shift = -itemH
    } else if (dragIdx > insertIdx) {
      if (idx >= insertIdx && idx < dragIdx) shift = itemH
    }
    return {
      transform: shift ? `translateY(${shift}px)` : undefined,
      transition: 'transform 180ms ease',
      position: 'relative',
    }
  }

  return (
    <div ref={colRef} style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: S.fontFamily, fontVariationSettings: S.fontVar }}>
      {items.map((item, idx) => {
        const isDragging = draggingId === item.id
        const isHovered = hoveredId === item.id
        // the row directly BEHIND the hovered one gets a 50% gold stroke
        const isBehindHovered = idx > 0 && items[idx - 1].id === hoveredId
        const borderColor = isDragging
          ? 'var(--br-gold)'
          : isBehindHovered
            ? 'rgba(174,125,0,0.5)'
            : isHovered
              ? 'rgba(255,255,255,0.22)'
              : 'rgba(255,255,255,0.08)'
        return (
          <div
            key={item.id}
            data-reorder-id={item.id}
            onMouseDown={(e) => startDrag(item.id, e)}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId((h) => (h === item.id ? null : h))}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 40,
              padding: '4px 10px',
              borderRadius: 6,
              cursor: 'grab',
              userSelect: 'none',
              transition: 'background 140ms ease, border-color 140ms ease',
              background: isDragging
                ? 'rgba(174,125,0,0.16)'
                : isHovered
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(255,255,255,0.04)',
              border: `1px solid ${borderColor}`,
              boxShadow: isDragging ? '0 8px 20px rgba(0,0,0,0.45)' : 'none',
              ...getItemStyle(item.id, idx),
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              {/* rank number */}
              <span
                style={{
                  width: 16,
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.55)',
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </span>
              {/* ticker badge */}
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 5,
                  background: item.color,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {item.ticker.replace('$', '').charAt(0)}
              </span>
              {/* ticker + name */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#5cc26a', flexShrink: 0 }}>{item.ticker}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.name}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
              <span style={{ display: 'flex', opacity: 0.7 }}>
                <IconDrag size={16} />
              </span>
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  removeItem(item.id)
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', borderRadius: 4 }}
                aria-label={`Remove ${item.name}`}
              >
                <IconX size={14} color="rgba(255,255,255,0.5)" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
