// App.jsx
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import Subjects from './pages/Subjects'
import Sessions from './pages/Sessions'
import Resources from './pages/Resources'
import Notes from './pages/Notes'
import AIAssistant from './pages/AIAssistant'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useAuthStore } from './store/useAuthStore'

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Routes>
      {/* Public auth routes — no sidebar */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected dashboard routes — with sidebar */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 margin-rule pl-8 pr-10 py-8 max-w-5xl">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/subjects" element={<Subjects />} />
                  <Route path="/sessions" element={<Sessions />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/assistant" element={<AIAssistant />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
