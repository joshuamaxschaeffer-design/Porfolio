'use client'

/**
 * CommentSystem — imported from the Baserate app
 * (`src/components/shared/CommentSystem.tsx`), reduced to its DEMO mode (the app
 * seeds a local fake thread when there's no Supabase session — exactly what the
 * portfolio needs, with zero DB footprint). All the DB/team-hook branches are
 * dropped; the render logic, hover toolbar, thread collapse/expand, inline
 * edit, soft-delete, seen/like toggles and Enter-to-send are kept.
 *
 * Re-skinned for the dark Handoff section: light text, translucent surfaces,
 * gold removed in favor of the app's blue accents for links/badges so it still
 * reads as the real product UI.
 */

import React, { useState, type ReactNode } from 'react'
import { S } from './baserate-tokens'
import { initialsAvatar } from './baserate-tokens'
import { IconEye, IconThumbsUp, IconReply, IconPencil, IconTrash, IconComment } from './baserate-icons'

// Dark-surface palette overrides (keep structure identical to the app).
const D = {
  text: 'rgba(255,255,255,0.92)',
  textMuted: 'rgba(255,255,255,0.55)',
  textFaint: 'rgba(255,255,255,0.4)',
  link: '#6ea8ff',
  line: 'rgba(255,255,255,0.18)',
  inputBg: 'rgba(255,255,255,0.06)',
  inputBgActive: 'rgba(255,255,255,0.02)',
  border: 'rgba(255,255,255,0.12)',
  badgeBlue: '#2563eb',
  toolbarBg: '#15171d',
}

type CommentReply = {
  id: string
  author: string
  avatar: string
  time: string
  mentions: string[]
  text: string
  isNew: boolean
  seenCount: number
  likeCount: number
  iLiked: boolean
  iSeen: boolean
  editedAt: string | null
  deleted: boolean
}
type Comment = CommentReply & { replies: CommentReply[] }

function buildSeed(): Comment[] {
  return [
    {
      id: 'c1',
      author: 'Joe Smith',
      avatar: initialsAvatar('Joe Smith', 'joe'),
      time: '3:45pm',
      mentions: ['@Robert Chavez', '@Matt Doug'],
      text: 'Let me know your thoughts on this',
      isNew: false,
      seenCount: 1,
      likeCount: 1,
      iLiked: false,
      iSeen: true,
      editedAt: null,
      deleted: false,
      replies: [
        {
          id: 'c1r1',
          author: 'Robert Chavez',
          avatar: initialsAvatar('Robert Chavez', 'robert'),
          time: '3:52pm',
          mentions: ['@Joe Smith'],
          text: 'Looks good to me.',
          isNew: false,
          seenCount: 0,
          likeCount: 0,
          iLiked: false,
          iSeen: false,
          editedAt: null,
          deleted: false,
        },
      ],
    },
  ]
}

// ─── Tooltip ───────────────────────────────────────────────────────────────

function Tooltip({ visible, children }: { visible: boolean; children: ReactNode }) {
  if (!visible) return null
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 8px)',
        left: '50%',
        transform: 'translateX(-50%)',
        background: D.toolbarBg,
        border: `1px solid ${D.border}`,
        borderRadius: 4,
        padding: '6px 10px',
        whiteSpace: 'nowrap',
        fontFamily: S.fontFamily,
        fontVariationSettings: S.fontVar,
        fontSize: 12,
        color: D.text,
        zIndex: 10,
      }}
    >
      {children}
    </div>
  )
}

function SeenBadge({ comment, toggleSeen, tooltipText }: { comment: CommentReply; toggleSeen: (id: string) => void; tooltipText: string }) {
  const [tip, setTip] = useState(false)
  return comment.seenCount > 0 ? (
    <div style={{ position: 'relative' }} onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
      <div
        onClick={() => toggleSeen(comment.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: comment.iSeen ? 'rgba(37,99,235,0.25)' : 'transparent',
          borderRadius: 4,
          padding: '2px 4px',
          cursor: 'pointer',
        }}
      >
        <IconEye color={comment.iSeen ? D.link : D.textMuted} />
        <span style={{ fontSize: 14, color: D.text, lineHeight: '20px' }}>{comment.seenCount}</span>
      </div>
      <Tooltip visible={tip}>{tooltipText}</Tooltip>
    </div>
  ) : null
}

function LikeBadge({ comment, toggleLike, tooltipText }: { comment: CommentReply; toggleLike: (id: string) => void; tooltipText: string }) {
  const [tip, setTip] = useState(false)
  return comment.likeCount > 0 ? (
    <div style={{ position: 'relative' }} onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
      <div
        onClick={() => toggleLike(comment.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: comment.iLiked ? 'rgba(37,99,235,0.25)' : 'transparent',
          borderRadius: 4,
          padding: '2px 4px',
          cursor: 'pointer',
        }}
      >
        <IconThumbsUp color={comment.iLiked ? D.link : D.textMuted} filled={comment.iLiked} />
        <span style={{ fontSize: 14, color: D.text, lineHeight: '20px' }}>{comment.likeCount}</span>
      </div>
      <Tooltip visible={tip}>{tooltipText}</Tooltip>
    </div>
  ) : null
}

function Avatar({ src }: { src: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
}

export function CommentSystem({ title = 'Comments' }: { title?: string }) {
  const [comments, setComments] = useState<Comment[]>(() => buildSeed())
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  // Threads are always auto-expanded (no collapse UI) — seed with every
  // comment id that has replies.
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(buildSeed().filter((c) => c.replies.length > 0).map((c) => c.id)),
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [threadInputs, setThreadInputs] = useState<Record<string, string>>({})

  const [activeInputs, setActiveInputs] = useState<Record<string, boolean>>({})

  const myAvatar = initialsAvatar('You', 'self')

  const mutateById = (id: string, fn: (c: CommentReply) => CommentReply) =>
    setComments((prev) =>
      prev.map((c) => {
        const nc = c.id === id ? { ...c, ...fn(c) } : c
        return { ...nc, replies: nc.replies.map((r) => (r.id === id ? { ...r, ...fn(r) } : r)) }
      }),
    )

  const toggleLike = (id: string) =>
    mutateById(id, (c) => ({ ...c, iLiked: !c.iLiked, likeCount: c.iLiked ? c.likeCount - 1 : c.likeCount + 1 }))
  const toggleSeen = (id: string) =>
    mutateById(id, (c) => ({ ...c, iSeen: !c.iSeen, seenCount: c.iSeen ? c.seenCount - 1 : c.seenCount + 1 }))
  const deleteComment = (id: string) => mutateById(id, (c) => ({ ...c, deleted: true, text: '' }))
  const startEditing = (id: string, text: string) => {
    setEditingId(id)
    setEditingText(text)
  }
  const saveEdit = (id: string) => {
    mutateById(id, (c) => ({ ...c, text: editingText, editedAt: 'Just now' }))
    setEditingId(null)
    setEditingText('')
  }
  const toggleThread = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const addReply = (parentId: string, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: `r-${Date.now()}`,
                  author: 'You',
                  avatar: myAvatar,
                  time: 'Just now',
                  mentions: [],
                  text: trimmed,
                  isNew: false,
                  seenCount: 0,
                  likeCount: 0,
                  iLiked: false,
                  iSeen: false,
                  editedAt: null,
                  deleted: false,
                },
              ],
            }
          : c,
      ),
    )
    setThreadInputs((p) => ({ ...p, [parentId]: '' }))
    if (!expanded.has(parentId)) toggleThread(parentId)
  }

  const renderComment = (comment: CommentReply, isThread = false, showLine = false, contentPb = 0, parentId: string | null = null) => {
    const isEditing = editingId === comment.id
    return (
      <div
        key={comment.id}
        style={{ position: 'relative', display: 'flex', gap: 8, alignItems: 'flex-start' }}
        onMouseEnter={() => setHoveredId(comment.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        {/* Avatar + connecting line */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch', flexShrink: 0 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `0.5px solid ${D.line}` }}>
            <Avatar src={comment.avatar} />
          </div>
          <div style={{ flex: '1 0 0', minHeight: 1, width: 0, position: 'relative' }}>
            {showLine && <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 1, background: D.line }} />}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: '1 0 0', display: 'flex', flexDirection: 'column', paddingBottom: contentPb, minWidth: 1 }}>
          {comment.deleted ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconComment color={D.textFaint} />
              <p style={{ fontFamily: S.fontFamily, fontVariationSettings: S.fontVar, fontSize: 14, color: D.textFaint, fontStyle: 'italic', margin: 0 }}>
                This comment has been deleted
              </p>
            </div>
          ) : isEditing ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '0 0 4px 0' }}>
                <IconPencil color={D.textFaint} />
                <span style={{ fontFamily: S.fontFamily, fontVariationSettings: S.fontVar, fontSize: 14, color: D.textFaint, lineHeight: '20px' }}>
                  Editing Comment
                </span>
              </div>
              <textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                style={{
                  width: '100%',
                  background: D.inputBgActive,
                  border: `1px solid ${D.link}`,
                  borderRadius: 2,
                  padding: '6px 8px',
                  fontFamily: S.fontFamily,
                  fontVariationSettings: S.fontVar,
                  fontSize: 14,
                  color: D.text,
                  outline: 'none',
                  minHeight: 60,
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, padding: '8px 0', borderTop: `1px solid ${D.line}` }}>
                <div style={{ flex: 1 }} />
                <button
                  onClick={() => saveEdit(comment.id)}
                  style={{
                    background: D.badgeBlue,
                    color: 'white',
                    border: 'none',
                    borderRadius: 2,
                    padding: '4px 12px',
                    fontFamily: S.fontFamily,
                    fontVariationSettings: S.fontVar,
                    fontSize: 14,
                    fontWeight: 700,
                    lineHeight: '20px',
                    cursor: 'pointer',
                    minWidth: 60,
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 8px', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start', fontSize: 14, lineHeight: '20px', whiteSpace: 'nowrap' }}>
                  <span style={{ fontFamily: S.fontFamily, fontVariationSettings: S.fontVar, fontWeight: 700, color: D.text }}>{comment.author}</span>
                  <span style={{ fontFamily: S.fontFamily, fontVariationSettings: S.fontVar, fontWeight: 400, color: D.textMuted }}>{comment.time}</span>
                  {comment.editedAt && (
                    <span style={{ fontFamily: S.fontFamily, fontVariationSettings: S.fontVar, fontSize: 14, color: D.textMuted, marginLeft: 'auto', lineHeight: '20px' }}>
                      Edited {comment.editedAt}
                    </span>
                  )}
                </div>
                {comment.mentions.length > 0 && (
                  <div style={{ fontFamily: S.fontFamily, fontVariationSettings: S.fontVar, fontSize: 14, color: D.link, lineHeight: '20px' }}>
                    {comment.mentions.join(' ')}
                  </div>
                )}
                <p style={{ fontFamily: S.fontFamily, fontVariationSettings: S.fontVar, fontSize: 14, color: D.text, margin: 0, lineHeight: '20px', whiteSpace: 'normal' }}>
                  {comment.text}
                </p>
              </div>
              {(comment.seenCount > 0 || comment.likeCount > 0) && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <SeenBadge comment={comment} toggleSeen={toggleSeen} tooltipText="Robert Chavez" />
                  <LikeBadge comment={comment} toggleLike={toggleLike} tooltipText="Warren Buffett" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hover actions */}
        {hoveredId === comment.id && !isEditing && !comment.deleted && (
          <div
            style={{
              position: 'absolute',
              top: -16,
              right: 0,
              background: D.toolbarBg,
              border: `1px solid ${D.border}`,
              borderRadius: 4,
              padding: 8,
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              boxShadow: '0 6px 16px rgba(0,0,0,0.5)',
              zIndex: 50,
            }}
          >
            {(
              [
                { icon: <IconEye color={D.textMuted} />, label: 'Seen', action: () => toggleSeen(comment.id) },
                { icon: <IconThumbsUp color={D.textMuted} />, label: 'Like', action: () => toggleLike(comment.id) },
                { divider: true as const },
                {
                  icon: <IconReply color={D.textMuted} />,
                  label: isThread ? 'Reply' : 'Thread',
                  action: () => {
                    const id = isThread && parentId ? parentId : comment.id
                    if (!expanded.has(id)) toggleThread(id)
                    setActiveInputs((p) => ({ ...p, ['thread-' + id]: true }))
                  },
                },
                { icon: <IconPencil color={D.textMuted} />, label: 'Edit', action: () => startEditing(comment.id, comment.text) },
                { icon: <IconTrash color={D.textMuted} />, label: 'Delete', action: () => deleteComment(comment.id) },
              ] as Array<{ divider: true } | { icon: ReactNode; label: string; action: () => void }>
            ).map((btn, i) =>
              'divider' in btn ? (
                <div key={`d${i}`} style={{ width: 0, alignSelf: 'stretch', borderLeft: `1px solid ${D.border}` }} />
              ) : (
                <button
                  key={btn.label}
                  onClick={btn.action}
                  title={btn.label}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                >
                  {btn.icon}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ fontFamily: S.fontFamily, fontVariationSettings: S.fontVar }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: D.text, margin: '0 0 16px 0' }}>{title}</h3>

      <div>
        {comments.map((c, idx) => {
          const hasThread = c.replies.length > 0
          const isExpanded = expanded.has(c.id)
          const hasNext = idx < comments.length - 1
          const showWrapperLine = (hasThread || isExpanded) && hasNext
          const parentShowLine = !(showWrapperLine && !isExpanded)
          const threadKey = 'thread-' + c.id
          const isInputOpen = activeInputs[threadKey] || !!threadInputs[c.id]?.trim()

          return (
            <div key={c.id} style={{ position: 'relative' }}>
              {renderComment(c, false, parentShowLine, hasThread || isExpanded ? 8 : 24)}

              {/* thread is always expanded (no collapse UI) */}
              {isExpanded && (
                <>
                  {c.replies.map((reply, rIdx) => (
                    <div key={reply.id} style={{ display: 'flex', paddingLeft: 12 }}>
                      <div style={{ width: 20, flexShrink: 0, display: 'flex', flexDirection: 'column', alignSelf: 'stretch' }}>
                        <div style={{ width: 20, height: 30, borderLeft: `1px solid ${D.line}`, borderBottom: `1px solid ${D.line}`, borderBottomLeftRadius: 6, boxSizing: 'border-box' }} />
                        {(rIdx < c.replies.length - 1) && <div style={{ flex: 1, width: 0, borderLeft: `1px dashed ${D.line}`, marginLeft: -0.5 }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, paddingTop: 6 }}>
                        {renderComment(reply, true, false, 16, c.id)}
                      </div>
                    </div>
                  ))}

                  {/* reply input */}
                  <div style={{ display: 'flex', paddingLeft: 12 }}>
                    <div style={{ width: 20, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0, paddingBottom: 8 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `0.5px solid ${D.line}` }}>
                          <Avatar src={myAvatar} />
                        </div>
                        <div
                          onFocus={() => setActiveInputs((p) => ({ ...p, [threadKey]: true }))}
                          style={{ flex: 1, borderRadius: 2, background: isInputOpen ? D.inputBgActive : D.inputBg, border: `1px solid ${isInputOpen ? D.border : 'transparent'}` }}
                        >
                          <textarea
                            placeholder="Add a reply"
                            value={threadInputs[c.id] || ''}
                            onChange={(e) => setThreadInputs((p) => ({ ...p, [c.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                addReply(c.id, threadInputs[c.id] || '')
                              }
                            }}
                            style={{ width: '100%', background: 'transparent', border: 'none', borderRadius: 2, padding: '6px 8px', fontFamily: S.fontFamily, fontVariationSettings: S.fontVar, fontSize: 14, color: D.text, outline: 'none', minHeight: 34, resize: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CommentSystem
