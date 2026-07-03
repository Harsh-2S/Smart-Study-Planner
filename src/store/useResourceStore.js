// store/useResourceStore.js
import { create } from 'zustand'
import { storage, makeId } from '../lib/storage'

const STORAGE_KEY = 'resources'

export const useResourceStore = create((set, get) => ({
  resources: storage.read(STORAGE_KEY, []),

  addResource: ({ subjectId, title, url, type }) => {
    // Auto-detect YouTube links
    const detectedType =
      type ||
      (/youtu\.?be/i.test(url) ? 'Video' : 'Article')

    const resource = {
      id: makeId(),
      subjectId,
      title: title.trim(),
      url: url.trim(),
      type: detectedType,
      createdAt: new Date().toISOString(),
    }
    const resources = [...get().resources, resource]
    storage.write(STORAGE_KEY, resources)
    set({ resources })
    return resource
  },

  removeResource: (id) => {
    const resources = get().resources.filter((r) => r.id !== id)
    storage.write(STORAGE_KEY, resources)
    set({ resources })
  },

  resourcesForSubject: (subjectId) => {
    return get().resources.filter((r) => r.subjectId === subjectId)
  },
}))
