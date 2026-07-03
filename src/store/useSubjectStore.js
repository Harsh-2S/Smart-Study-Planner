// store/useSubjectStore.js
import { create } from 'zustand'
import { storage, makeId } from '../lib/storage'

const STORAGE_KEY = 'subjects'

export const useSubjectStore = create((set, get) => ({
  subjects: storage.read(STORAGE_KEY, []),

  addSubject: ({ name, targetGrade, weeklyHourGoal }) => {
    const subject = {
      id: makeId(),
      name,
      targetGrade: targetGrade || null,
      weeklyHourGoal: Number(weeklyHourGoal) || 0,
      createdAt: new Date().toISOString(),
    }
    const subjects = [...get().subjects, subject]
    storage.write(STORAGE_KEY, subjects)
    set({ subjects })
    return subject
  },

  updateSubject: (id, updates) => {
    const subjects = get().subjects.map((s) => (s.id === id ? { ...s, ...updates } : s))
    storage.write(STORAGE_KEY, subjects)
    set({ subjects })
  },

  removeSubject: (id) => {
    const subjects = get().subjects.filter((s) => s.id !== id)
    storage.write(STORAGE_KEY, subjects)
    set({ subjects })
  },
}))
