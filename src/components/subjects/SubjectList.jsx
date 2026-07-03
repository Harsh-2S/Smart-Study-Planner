// components/subjects/SubjectList.jsx
import { useSubjectStore } from '../../store/useSubjectStore'
import { useGradeStore } from '../../store/useGradeStore'

export default function SubjectList() {
  const subjects = useSubjectStore((s) => s.subjects)
  const removeSubject = useSubjectStore((s) => s.removeSubject)
  const averageForSubject = useGradeStore((s) => s.averageForSubject)

  if (subjects.length === 0) {
    return <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-6">No subjects yet — add one above.</p>
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      {subjects.map((s) => {
        const avg = averageForSubject(s.id)
        return (
          <div key={s.id} className="rounded-card bg-surface dark:bg-surface-dark border border-rule dark:border-rule-dark p-4 flex items-center justify-between transition-colors duration-300">
            <div>
              <p className="font-display text-lg text-ink dark:text-ink-dark">{s.name}</p>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1">
                Target {s.targetGrade || '—'} · {s.weeklyHourGoal || 0} hrs/week goal
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`grade-stamp h-12 w-12 text-xs ${
                  avg === null ? 'text-ink-muted dark:text-ink-muted-dark' : avg >= 80 ? 'text-forest dark:text-forest-dark' : 'text-redpen'
                }`}
              >
                {avg === null ? '—' : `${avg}%`}
              </div>
              <button
                onClick={() => removeSubject(s.id)}
                className="text-xs text-ink-muted dark:text-ink-muted-dark hover:text-redpen transition-colors"
                aria-label={`Remove ${s.name}`}
              >
                Remove
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
