// store/useGradeStore.js
import { create } from 'zustand'
import { storage, makeId } from '../lib/storage'

const STORAGE_KEY = 'grades'

export const useGradeStore = create((set, get) => ({
  grades: storage.read(STORAGE_KEY, []),

  addGrade: ({ subjectId, label, score, maxScore, date }) => {
    const grade = {
      id: makeId(),
      subjectId,
      label,
      score: Number(score),
      maxScore: Number(maxScore) || 100,
      date: date || new Date().toISOString().slice(0, 10),
    }
    const grades = [...get().grades, grade]
    storage.write(STORAGE_KEY, grades)
    set({ grades })
    return grade
  },

  removeGrade: (id) => {
    const grades = get().grades.filter((g) => g.id !== id)
    storage.write(STORAGE_KEY, grades)
    set({ grades })
  },

  averageForSubject: (subjectId) => {
    const subjectGrades = get().grades.filter((g) => g.subjectId === subjectId)
    if (subjectGrades.length === 0) return null
    const pct = subjectGrades.reduce((sum, g) => sum + g.score / g.maxScore, 0) / subjectGrades.length
    return Math.round(pct * 100)
  },
}))
