// store/useAuthStore.js
import { create } from 'zustand'

const API_URL = import.meta.env.VITE_API_BASE ? `${import.meta.env.VITE_API_BASE}/api/auth` : '/api/auth'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('auth_token') || null,
  isAuthenticated: false,
  isLoading: true, // start true so we can check on mount
  error: null,

  // Restore session from saved JWT on app start
  checkAuth: async () => {
    const token = get().token
    if (!token) {
      set({ isLoading: false, isAuthenticated: false })
      return
    }
    try {
      const res = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Invalid token')
      const data = await res.json()
      set({ user: data.user, isAuthenticated: true, isLoading: false, error: null })
    } catch {
      localStorage.removeItem('auth_token')
      set({ user: null, token: null, isAuthenticated: false, isLoading: false })
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')

      localStorage.setItem('auth_token', data.token)
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      return true
    } catch (err) {
      set({ isLoading: false, error: err.message })
      return false
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Signup failed')

      localStorage.setItem('auth_token', data.token)
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      return true
    } catch (err) {
      set({ isLoading: false, error: err.message })
      return false
    }
  },

  // Google OAuth — send Google ID token to our backend
  googleLogin: async (idToken) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Google authentication failed')

      localStorage.setItem('auth_token', data.token)
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      return true
    } catch (err) {
      set({ isLoading: false, error: err.message })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token')
    set({ user: null, token: null, isAuthenticated: false, error: null })
  },

  clearError: () => set({ error: null }),
}))

