// components/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-paper-dark">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-forest dark:border-forest-dark border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark font-mono">Loading…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
