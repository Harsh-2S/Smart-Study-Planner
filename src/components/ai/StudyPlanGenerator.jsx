// components/ai/StudyPlanGenerator.jsx
import { useState } from 'react'
import { useSubjectStore } from '../../store/useSubjectStore'
import { useSessionStore } from '../../store/useSessionStore'
import { useGradeStore } from '../../store/useGradeStore'
import { generateStudyPlan } from '../../lib/claudeApi'

const priorityStyles = {
  high: 'text-redpen bg-redpen-light dark:bg-redpen-light-dark',
  medium: 'text-amber bg-amber-light dark:bg-amber-light-dark',
  low: 'text-forest dark:text-forest-dark bg-forest-light dark:bg-forest-light-dark',
}

export default function StudyPlanGenerator() {
  const subjects = useSubjectStore((s) => s.subjects)
  const sessions = useSessionStore((s) => s.sessions)
  const grades = useGradeStore((s) => s.grades)

  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const recentSessions = sessions.filter((s) => {
        const d = new Date(s.date)
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - 14)
        return d >= cutoff
      })
      const result = await generateStudyPlan({ subjects, sessions: recentSessions, grades })
      setPlan(result)
    } catch (err) {
      setError('Could not reach the AI assistant. Check that the proxy server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-card bg-surface dark:bg-surface-dark border border-rule dark:border-rule-dark p-5 transition-colors duration-300">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-lg text-ink dark:text-ink-dark">This week's plan</h3>
        <button
          onClick={handleGenerate}
          disabled={loading || subjects.length === 0}
          className="rounded-md bg-amber text-white text-sm font-medium px-4 py-2 hover:bg-amber/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Thinking…' : 'Generate plan'}
        </button>
      </div>
      <p className="text-xs text-ink-muted dark:text-ink-muted-dark mb-4">
        Prioritized using your recent sessions and grades
      </p>

      {subjects.length === 0 && <p className="text-sm text-ink-muted dark:text-ink-muted-dark">Add a subject first.</p>}
      {error && <p className="text-sm text-redpen">{error}</p>}

      {plan && plan.length > 0 && (
        <ul className="space-y-2">
          {plan.map((item, i) => (
            <li key={i} className="flex items-start gap-3 border-b border-rule/60 dark:border-rule-dark/60 pb-2 last:border-0">
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full shrink-0 ${priorityStyles[item.priority] || priorityStyles.medium}`}>
                {item.priority || 'medium'}
              </span>
              <div className="flex-1">
                <p className="text-sm text-ink dark:text-ink-dark font-medium">
                  {item.subjectName} — {item.suggestedMinutes} min
                </p>
                <p className="text-xs text-ink-muted dark:text-ink-muted-dark">{item.reason}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
