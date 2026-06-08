/**
 * Cleaned-up code snippets shown in the Handoff section's code box. Each one is
 * a readable distillation of the real component to the left — enough to convey
 * "this is what gets handed to engineering," not the full file.
 */

export type HandoffElementId = 'feeling' | 'ranking' | 'comments'

export const HANDOFF_SNIPPETS: Record<HandoffElementId, { lang: string; title: string; code: string }> = {
  feeling: {
    lang: 'tsx',
    title: 'FeelingSlider.tsx',
    code: `// 0–10 sentiment scale — red → yellow → green gradient,
// teardrop pin, drag or click to set, button to abstain.
const FEELING_COLORS = [
  '#e53935', '#f4511e', '#ff7043', '#ffaa42', '#ffbb42',
  '#ecd646', '#cad94f', '#8bc34a', '#5cc26a', '#47d56e', '#00c853',
]

export function FeelingSlider({ value, onChange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  const pctToValue = (p: number) =>
    Math.max(0, Math.min(10, Math.round((p / 100) * 10)))

  const handleMouseDown = (e: React.MouseEvent) => {
    const set = (ev: { clientX: number }) => {
      const r = trackRef.current!.getBoundingClientRect()
      const pct = ((ev.clientX - r.left) / r.width) * 100
      onChange(pctToValue(pct))
    }
    setDragging(true)
    set(e)
    const move = (ev: MouseEvent) => set(ev)
    const up = () => {
      setDragging(false)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  const pct = (value / 10) * 100
  const color = FEELING_COLORS[value]

  return (
    <div onMouseDown={handleMouseDown}>
      <div ref={trackRef} className="track" style={{ background: GRADIENT }}>
        <Pin left={\`\${pct}%\`} value={value} color={color} />
      </div>
      <span className="label">{FEELING_LABELS[value]}</span>
    </div>
  )
}`,
  },
  ranking: {
    lang: 'tsx',
    title: 'RankingReorder.tsx',
    code: `// Drag-to-rank list. On mousedown we snapshot every row's rect,
// then as the cursor crosses a midpoint the others slide to open
// an insertion slot. Drop commits a splice-reorder.

export function RankingReorder({ items: initial }: Props) {
  const [items, setItems] = useState(initial)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [insertIdx, setInsertIdx] = useState<number | null>(null)
  const rects = useRef<RectSnapshot[]>([])

  const startDrag = (id: string, e: React.MouseEvent) => {
    const dragIdx = items.findIndex((i) => i.id === id)
    rects.current = snapshotRows(colRef.current)

    const move = (me: MouseEvent) => {
      let next = 0
      for (let i = 0; i < rects.current.length; i++) {
        if (i === dragIdx) continue
        const mid = rects.current[i].top + rects.current[i].height / 2
        if (me.clientY > mid) next = i < dragIdx ? i + 1 : i
      }
      setInsertIdx(next)
    }

    const up = () => {
      setItems((prev) => reorder(prev, dragIdx, insertIdx))
      setDraggingId(null)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
    setDraggingId(id)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  return (
    <div ref={colRef}>
      {items.map((item, idx) => (
        <Row key={item.id} item={item} rank={idx + 1}
             onMouseDown={(e) => startDrag(item.id, e)}
             style={displacement(item.id, idx, draggingId, insertIdx)} />
      ))}
    </div>
  )
}`,
  },
  comments: {
    lang: 'tsx',
    title: 'CommentSystem.tsx',
    code: `// Threaded comments — hover toolbar (seen / like / reply / edit /
// delete), collapsible replies, @-mentions, optimistic updates,
// Enter-to-send. Persists to Postgres; falls back to a local thread.

export function CommentSystem({ sessionId }: Props) {
  const [comments, setComments] = useState(() => seed())
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [hovered, setHovered] = useState<string | null>(null)

  const toggleLike = (id: string) =>
    mutate(id, (c) => ({
      ...c,
      iLiked: !c.iLiked,
      likeCount: c.iLiked ? c.likeCount - 1 : c.likeCount + 1,
    }))

  const addReply = (parentId: string, text: string) => {
    if (!text.trim()) return
    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId
          ? { ...c, replies: [...c.replies, newReply(text)] }
          : c,
      ),
    )
  }

  return (
    <div>
      {comments.map((c) => (
        <Comment key={c.id} comment={c}
                 expanded={expanded.has(c.id)}
                 onHover={setHovered}
                 onToggleThread={() => toggleThread(c.id)}
                 onLike={() => toggleLike(c.id)}
                 onReply={addReply} />
      ))}
      <Composer onSubmit={addMainComment} />
    </div>
  )
}`,
  },
}
