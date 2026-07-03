// components/layout/Header.jsx
export default function Header({ title, subtitle }) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="flex items-end justify-between border-b border-rule dark:border-rule-dark pb-4 mb-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink dark:text-ink-dark">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-muted dark:text-ink-muted-dark">{subtitle}</p>}
      </div>
      <span className="font-mono text-xs text-ink-muted dark:text-ink-muted-dark">{today}</span>
    </header>
  )
}
