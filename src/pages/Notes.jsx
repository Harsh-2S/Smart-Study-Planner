// pages/Notes.jsx
import { useState } from 'react'
import Header from '../components/layout/Header'
import NoteList from '../components/notes/NoteList'
import NoteEditor from '../components/notes/NoteEditor'
import { useNoteStore } from '../store/useNoteStore'
import { useSubjectStore } from '../store/useSubjectStore'

export default function Notes() {
  const subjects = useSubjectStore((s) => s.subjects)
  const addNote = useNoteStore((s) => s.addNote)
  const updateNote = useNoteStore((s) => s.updateNote)
  const removeNote = useNoteStore((s) => s.removeNote)

  const [activeNote, setActiveNote] = useState(null) // null = list view, object = editing
  const [isNew, setIsNew] = useState(false)
  const [filterSubjectId, setFilterSubjectId] = useState('')

  function handleNewNote() {
    setActiveNote({
      id: null,
      subjectId: filterSubjectId || (subjects[0]?.id ?? ''),
      title: '',
      content: '',
    })
    setIsNew(true)
  }

  function handleSelectNote(note) {
    setActiveNote(note)
    setIsNew(false)
  }

  function handleSave({ title, content }) {
    if (isNew) {
      const created = addNote({
        subjectId: activeNote.subjectId,
        title,
        content,
      })
      setActiveNote(created)
      setIsNew(false)
    } else {
      updateNote(activeNote.id, { title, content })
      setActiveNote({ ...activeNote, title, content, updatedAt: new Date().toISOString() })
    }
  }

  function handleDelete() {
    if (!activeNote?.id) return
    if (!confirm('Delete this note permanently?')) return
    removeNote(activeNote.id)
    setActiveNote(null)
    setIsNew(false)
  }

  function handleCancel() {
    setActiveNote(null)
    setIsNew(false)
  }

  return (
    <div>
      <Header title="Notes" subtitle="Write and organize your study notes in Markdown" />

      {/* Subject filter + back button when editing */}
      <div className="flex items-center gap-3 mb-5">
        {activeNote ? (
          <>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-sm text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to notes
            </button>
            <div className="flex-1" />
            {/* Subject picker when editing */}
            <select
              value={activeNote.subjectId}
              onChange={(e) => {
                const newSubjectId = e.target.value
                setActiveNote((prev) => ({ ...prev, subjectId: newSubjectId }))
                if (!isNew && activeNote.id) {
                  updateNote(activeNote.id, { subjectId: newSubjectId })
                }
              }}
              className="rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark px-3 py-1.5 text-xs text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors"
            >
              <option value="">No subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </>
        ) : (
          <>
            <select
              value={filterSubjectId}
              onChange={(e) => setFilterSubjectId(e.target.value)}
              className="rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark px-3 py-2 text-sm text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors"
            >
              <option value="">All subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Main content */}
      {activeNote ? (
        <NoteEditor
          key={activeNote.id || 'new'}
          note={activeNote}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={activeNote.id ? handleDelete : null}
        />
      ) : (
        <NoteList
          onSelectNote={handleSelectNote}
          onNewNote={handleNewNote}
          selectedNoteId={null}
          filterSubjectId={filterSubjectId}
        />
      )}
    </div>
  )
}
