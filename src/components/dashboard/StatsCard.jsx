// components/dashboard/StatsCard.jsx

const toneStyles = {
  forest: { text: 'text-forest dark:text-forest-dark', bg: 'bg-forest-light dark:bg-forest-light-dark' },
  redpen: { text: 'text-redpen', bg: 'bg-redpen-light dark:bg-redpen-light-dark' },
  amber: { text: 'text-amber', bg: 'bg-amber-light dark:bg-amber-light-dark' },
}

export default function StatsCard({ label, value, stamp, tone = 'forest' }) {
  const styles = toneStyles[tone] ?? toneStyles.forest

  return (
    <div className="rounded-card bg-surface dark:bg-surface-dark border border-rule dark:border-rule-dark p-5 flex items-center justify-between transition-colors duration-300">
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-muted dark:text-ink-muted-dark font-medium">{label}</p>
        <p className="mt-2 font-display text-3xl text-ink dark:text-ink-dark">{value}</p>
      </div>
      {stamp && (
        <div className={`grade-stamp h-14 w-14 text-sm ${styles.text} ${styles.bg}`}>
          {stamp}
        </div>
      )}
    </div>
  )
}
