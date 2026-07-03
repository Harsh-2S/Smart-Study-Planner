// store/useNoteStore.js
import { create } from 'zustand'
import { storage, makeId } from '../lib/storage'

const STORAGE_KEY = 'notes'

export const useNoteStore = create((set, get) => ({
  notes: storage.read(STORAGE_KEY, []),

  addNote: ({ subjectId, title, content }) => {
    const note = {
      id: makeId(),
      subjectId,
      title: title.trim(),
      content: content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const notes = [...get().notes, note]
    storage.write(STORAGE_KEY, notes)
    set({ notes })
    return note
  },

  updateNote: (id, updates) => {
    const notes = get().notes.map((n) =>
      n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
    )
    storage.write(STORAGE_KEY, notes)
    set({ notes })
  },

  removeNote: (id) => {
    const notes = get().notes.filter((n) => n.id !== id)
    storage.write(STORAGE_KEY, notes)
    set({ notes })
  },

  notesForSubject: (subjectId) => {
    return get().notes.filter((n) => n.subjectId === subjectId)
  },

  getNoteById: (id) => {
    return get().notes.find((n) => n.id === id) ?? null
  },
}))
