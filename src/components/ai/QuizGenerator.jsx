// components/ai/QuizGenerator.jsx
import { useState } from 'react'
import { generateQuiz } from '../../lib/claudeApi'
import { useNoteStore } from '../../store/useNoteStore'
import { useSubjectStore } from '../../store/useSubjectStore'

export default function QuizGenerator() {
  const [notes, setNotes] = useState('')
  const [subjectName, setSubjectName] = useState('')
  const [cards, setCards] = useState(null)
  const [flipped, setFlipped] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showNotePicker, setShowNotePicker] = useState(false)

  const savedNotes = useNoteStore((s) => s.notes)
  const subjects = useSubjectStore((s) => s.subjects)
  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s.name]))

  async function handleGenerate() {
    if (!notes.trim()) return
    setLoading(true)
    setError(null)
    try {
      const result = await generateQuiz({ notes, subjectName: subjectName || 'this topic', count: 8 })
      setCards(result)
      setFlipped({})
    } catch (err) {
      setError('Could not reach the AI assistant. Check that the proxy server is running.')
    } finally {
      setLoading(false)
    }
  }

  function handleImportNote(note) {
    setNotes(note.content)
    if (note.subjectId && subjectMap[note.subjectId]) {
      setSubjectName(subjectMap[note.subjectId])
    }
    setShowNotePicker(false)
  }

  return (
    <div className="rounded-card bg-surface dark:bg-surface-dark border border-rule dark:border-rule-dark p-5 mt-5 transition-colors duration-300">
      <h3 className="font-display text-lg text-ink dark:text-ink-dark mb-1">Notes → flashcards</h3>
      <p className="text-xs text-ink-muted dark:text-ink-muted-dark mb-4">Paste your notes or import from your notebook to get practice questions</p>

      <input
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
        placeholder="Subject (optional)"
        className="w-full rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark px-3 py-2 text-sm text-ink dark:text-ink-dark mb-2 focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors"
      />

      {/* Import from Notes button */}
      {savedNotes.length > 0 && (
        <div className="mb-2">
          <button
            type="button"
            onClick={() => setShowNotePicker(!showNotePicker)}
            className="flex items-center gap-1.5 text-xs font-medium text-forest dark:text-forest-dark hover:text-forest/80 dark:hover:text-forest-dark/80 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            {showNotePicker ? 'Hide saved notes' : 'Import from saved notes'}
          </button>

          {showNotePicker && (
            <div className="mt-2 max-h-40 overflow-y-auto rounded-md border border-rule dark:border-rule-dark bg-paper dark:bg-paper-dark">
              {savedNotes
                .filter((n) => n.content.trim())
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .map((note) => (
                  <button
                    key={note.id}
                    onClick={() => handleImportNote(note)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-forest-light dark:hover:bg-forest-light-dark border-b border-rule/50 dark:border-rule-dark/50 last:border-b-0 transition-colors"
                  >
                    <span className="font-medium text-ink dark:text-ink-dark">{note.title}</span>
                    {note.subjectId && subjectMap[note.subjectId] && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-amber/15 text-amber dark:text-amber-dark">
                        {subjectMap[note.subjectId]}
                      </span>
                    )}
                    <p className="text-xs text-ink-muted dark:text-ink-muted-dark truncate mt-0.5">
                      {note.content.substring(0, 80)}…
                    </p>
                  </button>
                ))}
              {savedNotes.filter((n) => n.content.trim()).length === 0 && (
                <p className="px-3 py-3 text-xs text-ink-muted dark:text-ink-muted-dark text-center">
                  No notes with content yet
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste your notes here…"
        rows={5}
        className="w-full rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark px-3 py-2 text-sm text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors"
      />
      <button
        onClick={handleGenerate}
        disabled={loading || !notes.trim()}
        className="mt-3 rounded-md bg-amber text-white text-sm font-medium px-4 py-2 hover:bg-amber/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Generating…' : 'Generate flashcards'}
      </button>

      {error && <p className="text-sm text-redpen mt-3">{error}</p>}

      {cards && cards.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-5">
          {cards.map((c, i) => (
            <button
              key={i}
              onClick={() => setFlipped((f) => ({ ...f, [i]: !f[i] }))}
              className="text-left rounded-card border border-rule dark:border-rule-dark bg-paper dark:bg-paper-dark p-4 hover:border-forest dark:hover:border-forest-dark transition-colors"
            >
              <p className="text-[10px] uppercase tracking-wide text-ink-muted dark:text-ink-muted-dark mb-1">
                {flipped[i] ? 'Answer' : 'Question'}
              </p>
              <p className="text-sm text-ink dark:text-ink-dark">{flipped[i] ? c.answer : c.question}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
