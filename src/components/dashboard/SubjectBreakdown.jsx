// components/dashboard/SubjectBreakdown.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useThemeStore } from '../../store/useThemeStore'

export default function SubjectBreakdown({ subjects, minutesBySubject }) {
  const isDark = useThemeStore((s) => s.isDark())

  const gridColor = isDark ? '#2A3544' : '#C9D3DC'
  const tickColor = isDark ? '#7A8B9C' : '#5B6B7C'
  const barColor = isDark ? '#3D9B6A' : '#2F6F4E'
  const goalColor = isDark ? '#2A3544' : '#C9D3DC'
  const tooltipBg = isDark ? '#1A2332' : '#FFFFFF'
  const tooltipBorder = isDark ? '#2A3544' : '#C9D3DC'

  const data = subjects.map((s) => ({
    name: s.name,
    studied: Math.round((minutesBySubject[s.id] || 0) / 60),
    goal: s.weeklyHourGoal,
  }))

  if (data.length === 0) {
    return (
      <div className="rounded-card bg-surface dark:bg-surface-dark border border-rule dark:border-rule-dark p-5 transition-colors duration-300">
        <h3 className="font-display text-lg text-ink dark:text-ink-dark mb-1">Subject breakdown</h3>
        <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-4">
          Add a subject to see this week's hours against your goals.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-card bg-surface dark:bg-surface-dark border border-rule dark:border-rule-dark p-5 transition-colors duration-300">
      <h3 className="font-display text-lg text-ink dark:text-ink-dark mb-1">This week vs. goal</h3>
      <p className="text-xs text-ink-muted dark:text-ink-muted-dark mb-4">Hours studied against each subject's weekly goal</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickColor }} axisLine={{ stroke: gridColor }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, borderColor: tooltipBorder, fontSize: 12, backgroundColor: tooltipBg }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="studied" name="Studied (hrs)" fill={barColor} radius={[4, 4, 0, 0]} />
          <Bar dataKey="goal" name="Goal (hrs)" fill={goalColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
