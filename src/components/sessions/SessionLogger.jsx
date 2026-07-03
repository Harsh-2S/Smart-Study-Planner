// components/sessions/SessionLogger.jsx
import { useState } from 'react'
import { useSubjectStore } from '../../store/useSubjectStore'
import { useSessionStore } from '../../store/useSessionStore'

export default function SessionLogger() {
  const subjects = useSubjectStore((s) => s.subjects)
  const logSession = useSessionStore((s) => s.logSession)

  const [subjectId, setSubjectId] = useState('')
  const [minutes, setMinutes] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!subjectId || !minutes) return
    logSession({ subjectId, minutes, date, notes })
    setMinutes('')
    setNotes('')
  }

  if (subjects.length === 0) {
    return (
      <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
        Add a subject first, then come back here to log study time.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card bg-surface dark:bg-surface-dark border border-rule dark:border-rule-dark p-5 flex gap-3 items-end flex-wrap transition-colors duration-300">
      <div className="w-44">
        <label className="block text-xs text-ink-muted dark:text-ink-muted-dark mb-1">Subject</label>
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="w-full rounded-md border border-rule dark:border-rule-dark px-3 py-2 text-sm text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark bg-white dark:bg-paper-dark transition-colors"
        >
          <option value="">Select…</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
      <div className="w-28">
        <label className="block text-xs text-ink-muted dark:text-ink-muted-dark mb-1">Minutes</label>
        <input
          type="number"
          min="1"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="45"
          className="w-full rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark px-3 py-2 text-sm text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors"
        />
      </div>
      <div className="w-40">
        <label className="block text-xs text-ink-muted dark:text-ink-muted-dark mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark px-3 py-2 text-sm text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors"
        />
      </div>
      <div className="flex-1 min-w-[160px]">
        <label className="block text-xs text-ink-muted dark:text-ink-muted-dark mb-1">Notes (optional)</label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Reviewed chapter 4"
          className="w-full rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark px-3 py-2 text-sm text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-forest dark:bg-forest-dark text-white text-sm font-medium px-4 py-2 hover:opacity-90 transition-colors"
      >
        Log session
      </button>
    </form>
  )
}
