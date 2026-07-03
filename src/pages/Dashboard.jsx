// pages/Dashboard.jsx
import Header from '../components/layout/Header'
import StatsCard from '../components/dashboard/StatsCard'
import ProgressChart from '../components/dashboard/ProgressChart'
import SubjectBreakdown from '../components/dashboard/SubjectBreakdown'
import { useSubjectStore } from '../store/useSubjectStore'
import { useSessionStore } from '../store/useSessionStore'
import { useGradeStore } from '../store/useGradeStore'

export default function Dashboard() {
  const subjects = useSubjectStore((s) => s.subjects)
  const sessions = useSessionStore((s) => s.sessions)
  const minutesBySubject = useSessionStore((s) => s.minutesBySubject(7))
  const grades = useGradeStore((s) => s.grades)

  const totalMinutesThisWeek = Object.values(minutesBySubject).reduce((a, b) => a + b, 0)
  const totalHoursThisWeek = (totalMinutesThisWeek / 60).toFixed(1)

  const goalHours = subjects.reduce((sum, s) => sum + (s.weeklyHourGoal || 0), 0)
  const onPace = goalHours > 0 ? Math.round((totalMinutesThisWeek / 60 / goalHours) * 100) : null

  const overallAvg = (() => {
    if (grades.length === 0) return null
    const pct = grades.reduce((sum, g) => sum + g.score / g.maxScore, 0) / grades.length
    return Math.round(pct * 100)
  })()

  return (
    <div>
      <Header title="Dashboard" subtitle="Where things stand this week" />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatsCard label="Hours studied (7d)" value={totalHoursThisWeek} stamp={subjects.length === 0 ? '—' : `${totalHoursThisWeek}h`} tone="forest" />
        <StatsCard
          label="Pace vs. weekly goal"
          value={onPace === null ? '—' : `${onPace}%`}
          stamp={onPace === null ? '—' : `${onPace}%`}
          tone={onPace !== null && onPace < 70 ? 'redpen' : 'forest'}
        />
        <StatsCard label="Overall grade average" value={overallAvg === null ? '—' : `${overallAvg}%`} stamp={overallAvg === null ? '—' : `${overallAvg}%`} tone="amber" />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <ProgressChart sessions={sessions} />
        <SubjectBreakdown subjects={subjects} minutesBySubject={minutesBySubject} />
      </div>

      {subjects.length === 0 && (
        <p className="mt-8 text-sm text-ink-muted dark:text-ink-muted-dark">
          Nothing logged yet — head to <span className="text-forest font-medium">Subjects</span> to add your first course.
        </p>
      )}
    </div>
  )
}
