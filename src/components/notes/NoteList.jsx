// components/notes/NoteList.jsx
import { useState } from 'react'
import { useNoteStore } from '../../store/useNoteStore'
import { useSubjectStore } from '../../store/useSubjectStore'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function getPreview(content, maxLen = 120) {
  if (!content) return 'Empty note'
  // Strip markdown syntax for a clean preview
  const clean = content
    .replace(/```[\s\S]*?```/g, '[code]')
    .replace(/[#*_~>`\-]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
  return clean.length > maxLen ? clean.substring(0, maxLen) + '…' : clean
}

export default function NoteList({ onSelectNote, onNewNote, selectedNoteId, filterSubjectId }) {
  const notes = useNoteStore((s) => s.notes)
  const subjects = useSubjectStore((s) => s.subjects)
  const [search, setSearch] = useState('')

  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s.name]))

  // Filter and sort notes
  const filteredNotes = notes
    .filter((n) => {
      if (filterSubjectId && n.subjectId !== filterSubjectId) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          (subjectMap[n.subjectId] || '').toLowerCase().includes(q)
        )
      }
      return true
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  return (
    <div className="rounded-card bg-surface dark:bg-surface-dark border border-rule dark:border-rule-dark transition-colors duration-300 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-rule dark:border-rule-dark">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-sm font-semibold text-ink dark:text-ink-dark">
            All Notes
            <span className="ml-2 text-xs font-normal text-ink-muted dark:text-ink-muted-dark">
              ({filteredNotes.length})
            </span>
          </h3>
          <button
            onClick={onNewNote}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-forest text-white text-xs font-medium hover:bg-forest/90 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New note
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted dark:text-ink-muted-dark" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes…"
            className="w-full rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark pl-9 pr-3 py-2 text-xs text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors"
          />
        </div>
      </div>

      {/* Note list */}
      <div className="max-h-[480px] overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
              {search ? 'No notes match your search' : 'No notes yet — create your first one!'}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => onSelectNote(note)}
              className={[
                'w-full text-left px-4 py-3 border-b border-rule/50 dark:border-rule-dark/50 transition-colors',
                selectedNoteId === note.id
                  ? 'bg-forest-light dark:bg-forest-light-dark'
                  : 'hover:bg-paper dark:hover:bg-paper-dark',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium text-ink dark:text-ink-dark truncate flex-1">
                  {note.title}
                </h4>
                <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark whitespace-nowrap mt-0.5">
                  {timeAgo(note.updatedAt)}
                </span>
              </div>
              {note.subjectId && subjectMap[note.subjectId] && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber/15 text-amber dark:bg-amber-dark/15 dark:text-amber-dark">
                  {subjectMap[note.subjectId]}
                </span>
              )}
              <p className="mt-1 text-xs text-ink-muted dark:text-ink-muted-dark leading-relaxed line-clamp-2">
                {getPreview(note.content)}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
