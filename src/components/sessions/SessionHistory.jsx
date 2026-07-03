// components/sessions/SessionHistory.jsx
import { useSubjectStore } from '../../store/useSubjectStore'
import { useSessionStore } from '../../store/useSessionStore'

export default function SessionHistory() {
  const subjects = useSubjectStore((s) => s.subjects)
  const sessions = useSessionStore((s) => s.sessions)
  const removeSession = useSessionStore((s) => s.removeSession)

  const subjectName = (id) => subjects.find((s) => s.id === id)?.name || 'Unknown'

  const sorted = [...sessions].sort((a, b) => (a.date < b.date ? 1 : -1))

  if (sorted.length === 0) {
    return <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-6">No sessions logged yet.</p>
  }

  return (
    <table className="w-full mt-6 text-sm border-collapse">
      <thead>
        <tr className="border-b border-rule dark:border-rule-dark text-left text-xs uppercase tracking-wide text-ink-muted dark:text-ink-muted-dark">
          <th className="py-2 font-medium">Date</th>
          <th className="py-2 font-medium">Subject</th>
          <th className="py-2 font-medium">Minutes</th>
          <th className="py-2 font-medium">Notes</th>
          <th className="py-2"></th>
        </tr>
      </thead>
      <tbody className="font-mono text-xs">
        {sorted.map((s) => (
          <tr key={s.id} className="border-b border-rule/60 dark:border-rule-dark/60">
            <td className="py-2 text-ink dark:text-ink-dark">{s.date}</td>
            <td className="py-2 text-ink dark:text-ink-dark font-body">{subjectName(s.subjectId)}</td>
            <td className="py-2 text-ink dark:text-ink-dark">{s.minutes}m</td>
            <td className="py-2 text-ink-muted dark:text-ink-muted-dark font-body">{s.notes || '—'}</td>
            <td className="py-2 text-right">
              <button
                onClick={() => removeSession(s.id)}
                className="text-ink-muted dark:text-ink-muted-dark hover:text-redpen font-body"
              >
                remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
