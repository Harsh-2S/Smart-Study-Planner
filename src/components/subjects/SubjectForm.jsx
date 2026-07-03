// components/subjects/SubjectForm.jsx
import { useState } from 'react'
import { useSubjectStore } from '../../store/useSubjectStore'

export default function SubjectForm() {
  const addSubject = useSubjectStore((s) => s.addSubject)
  const [name, setName] = useState('')
  const [targetGrade, setTargetGrade] = useState('')
  const [weeklyHourGoal, setWeeklyHourGoal] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    addSubject({ name: name.trim(), targetGrade, weeklyHourGoal })
    setName('')
    setTargetGrade('')
    setWeeklyHourGoal('')
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card bg-surface dark:bg-surface-dark border border-rule dark:border-rule-dark p-5 flex gap-3 items-end transition-colors duration-300">
      <div className="flex-1">
        <label className="block text-xs text-ink-muted dark:text-ink-muted-dark mb-1">Subject name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Organic Chemistry"
          className="w-full rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark px-3 py-2 text-sm text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors"
        />
      </div>
      <div className="w-28">
        <label className="block text-xs text-ink-muted dark:text-ink-muted-dark mb-1">Target grade</label>
        <input
          value={targetGrade}
          onChange={(e) => setTargetGrade(e.target.value)}
          placeholder="A-"
          className="w-full rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark px-3 py-2 text-sm text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors"
        />
      </div>
      <div className="w-32">
        <label className="block text-xs text-ink-muted dark:text-ink-muted-dark mb-1">Weekly hrs goal</label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={weeklyHourGoal}
          onChange={(e) => setWeeklyHourGoal(e.target.value)}
          placeholder="5"
          className="w-full rounded-md border border-rule dark:border-rule-dark bg-white dark:bg-paper-dark px-3 py-2 text-sm text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-forest dark:focus:ring-forest-dark transition-colors"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-forest dark:bg-forest-dark text-white text-sm font-medium px-4 py-2 hover:opacity-90 transition-colors"
      >
        Add subject
      </button>
    </form>
  )
}
