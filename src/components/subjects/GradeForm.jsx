// components/subjects/GradeForm.jsx
import { useState } from 'react'
import { useSubjectStore } from '../../store/useSubjectStore'
import { useGradeStore } from '../../store/useGradeStore'

export default function GradeForm() {
  const subjects = useSubjectStore((s) => s.subjects)
  const addGrade = useGradeStore((s) => s.addGrade)

  const [subjectId, setSubjectId] = useState('')
  const [label, setLabel] = useState('')
  const [score, setScore] = useState('')
  const [maxScore, setMaxScore] = useState('100')

  function handleSubmit(e) {
    e.preventDefault()
    if (!subjectId || !label.trim() || score === '') return
    addGrade({ subjectId, label: label.trim(), score, maxScore })
    setLabel('')
    setScore('')
  }

  if (subjects.length === 0) return null

  return (
    <form onSubmit={handleSubmit} className="rounded-card bg-surface dark:bg-surface-dark border border-rule dark:border-rule-dark p-5 flex gap-3 items-end mt-4 transition-colors duration-300">
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
      <div className="flex-1">
        <label className="block text-xs text-ink-muted dark:text-ink-muted-dark mb-1">Assessment</label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Midterm 1"
          className="w-full rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark px-3 py-2 text-sm text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors"
        />
      </div>
      <div className="w-24">
        <label className="block text-xs text-ink-muted dark:text-ink-muted-dark mb-1">Score</label>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="87"
          className="w-full rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark px-3 py-2 text-sm text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors"
        />
      </div>
      <div className="w-24">
        <label className="block text-xs text-ink-muted dark:text-ink-muted-dark mb-1">Out of</label>
        <input
          type="number"
          value={maxScore}
          onChange={(e) => setMaxScore(e.target.value)}
          className="w-full rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark px-3 py-2 text-sm text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-ink dark:bg-ink-dark text-white dark:text-paper-dark text-sm font-medium px-4 py-2 hover:opacity-90 transition-colors"
      >
        Log grade
      </button>
    </form>
  )
}
