// components/layout/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { useThemeStore } from '../../store/useThemeStore'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/subjects', label: 'Subjects' },
  { to: '/sessions', label: 'Sessions' },
  { to: '/resources', label: 'Resources' },
  { to: '/notes', label: 'Notes' },
  { to: '/assistant', label: 'AI Assistant' },
]

const themeIcons = {
  light: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  dark: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  system: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
}

const themeLabels = { light: 'Light', dark: 'Dark', system: 'System' }

export default function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const mode = useThemeStore((s) => s.mode)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="w-56 shrink-0 border-r border-rule dark:border-rule-dark bg-surface/60 dark:bg-surface-dark/60 backdrop-blur-sm flex flex-col transition-colors duration-300">
      <div className="px-6 py-6">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">Ledger</span>
        </div>
        <p className="mt-1 text-xs text-ink-muted dark:text-ink-muted-dark font-mono">study log</p>
      </div>

      <nav className="px-3 space-y-1 flex-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              [
                'block rounded-card px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-forest-light dark:bg-forest-light-dark text-forest dark:text-forest-dark'
                  : 'text-ink-muted dark:text-ink-muted-dark hover:bg-rule/30 dark:hover:bg-rule-dark/30 hover:text-ink dark:hover:text-ink-dark',
              ].join(' ')
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Theme toggle + user info + logout */}
      <div className="px-4 py-4 border-t border-rule dark:border-rule-dark">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-2 px-3 py-2 mb-2 rounded-card text-sm font-medium text-ink-muted dark:text-ink-muted-dark hover:bg-rule/30 dark:hover:bg-rule-dark/30 hover:text-ink dark:hover:text-ink-dark transition-colors"
          title={`Theme: ${themeLabels[mode]}`}
        >
          {themeIcons[mode]}
          <span>{themeLabels[mode]} mode</span>
        </button>

        {user && (
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-ink dark:text-ink-dark truncate">{user.name}</p>
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-card text-sm font-medium text-redpen hover:bg-redpen-light dark:hover:bg-redpen-light-dark transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  )
}
