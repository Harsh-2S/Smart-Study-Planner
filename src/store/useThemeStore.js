// store/useThemeStore.js
import { create } from 'zustand'
import { storage } from '../lib/storage'

const STORAGE_KEY = 'theme'

function getSystemPreference() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(mode) {
  const resolved = mode === 'system' ? getSystemPreference() : mode
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

// Initialize on load (before React renders) to prevent flash
const savedTheme = storage.read(STORAGE_KEY, 'system')
applyTheme(savedTheme)

export const useThemeStore = create((set, get) => ({
  mode: savedTheme, // 'light' | 'dark' | 'system'

  isDark: () => {
    const mode = get().mode
    const resolved = mode === 'system' ? getSystemPreference() : mode
    return resolved === 'dark'
  },

  setTheme: (mode) => {
    storage.write(STORAGE_KEY, mode)
    applyTheme(mode)
    set({ mode })
  },

  toggleTheme: () => {
    const current = get().mode
    // Cycle: light → dark → system → light
    const next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light'
    get().setTheme(next)
  },
}))
