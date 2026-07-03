// components/dashboard/ProgressChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useThemeStore } from '../../store/useThemeStore'

function buildDailyTotals(sessions, days = 14) {
  const out = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    const minutes = sessions.filter((s) => s.date === key).reduce((sum, s) => sum + s.minutes, 0)
    out.push({ date: label, minutes })
  }
  return out
}

export default function ProgressChart({ sessions }) {
  const data = buildDailyTotals(sessions)
  const isDark = useThemeStore((s) => s.isDark())

  const gridColor = isDark ? '#2A3544' : '#C9D3DC'
  const tickColor = isDark ? '#7A8B9C' : '#5B6B7C'
  const lineColor = isDark ? '#3D9B6A' : '#2F6F4E'
  const tooltipBg = isDark ? '#1A2332' : '#FFFFFF'
  const tooltipBorder = isDark ? '#2A3544' : '#C9D3DC'
  const tooltipLabel = isDark ? '#E1E8EF' : '#1E2A3A'

  return (
    <div className="rounded-card bg-surface dark:bg-surface-dark border border-rule dark:border-rule-dark p-5 transition-colors duration-300">
      <h3 className="font-display text-lg text-ink dark:text-ink-dark mb-1">Study time, last 14 days</h3>
      <p className="text-xs text-ink-muted dark:text-ink-muted-dark mb-4">Minutes logged per day, across all subjects</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: tickColor }} axisLine={{ stroke: gridColor }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 8, borderColor: tooltipBorder, fontSize: 12, backgroundColor: tooltipBg }}
            labelStyle={{ color: tooltipLabel, fontWeight: 600 }}
          />
          <Line type="monotone" dataKey="minutes" stroke={lineColor} strokeWidth={2} dot={{ r: 3, fill: lineColor }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
