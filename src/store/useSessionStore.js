// store/useSessionStore.js
import { create } from 'zustand'
import { storage, makeId } from '../lib/storage'

const STORAGE_KEY = 'sessions'

export const useSessionStore = create((set, get) => ({
  sessions: storage.read(STORAGE_KEY, []),

  logSession: ({ subjectId, minutes, date, notes }) => {
    const session = {
      id: makeId(),
      subjectId,
      minutes: Number(minutes) || 0,
      date: date || new Date().toISOString().slice(0, 10),
      notes: notes || '',
    }
    const sessions = [...get().sessions, session]
    storage.write(STORAGE_KEY, sessions)
    set({ sessions })
    return session
  },

  removeSession: (id) => {
    const sessions = get().sessions.filter((s) => s.id !== id)
    storage.write(STORAGE_KEY, sessions)
    set({ sessions })
  },

  // Minutes studied per subject within the last N days
  minutesBySubject: (days = 7) => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    const totals = {}
    for (const s of get().sessions) {
      if (new Date(s.date) >= cutoff) {
        totals[s.subjectId] = (totals[s.subjectId] || 0) + s.minutes
      }
    }
    return totals
  },
}))
