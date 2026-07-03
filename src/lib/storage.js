// lib/storage.js
//
// Every piece of persisted data goes through this file. When it's time to
// migrate to Firebase, rewrite the function bodies here (e.g. swap to
// Firestore calls) and the rest of the app — stores, components — never
// needs to change, since they only ever call get/set/remove.

const PREFIX = 'ledger:'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch (err) {
    console.error(`storage: failed to read ${key}`, err)
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch (err) {
    console.error(`storage: failed to write ${key}`, err)
    return false
  }
}

function remove(key) {
  localStorage.removeItem(PREFIX + key)
}

export const storage = { read, write, remove }

// Simple id generator — swap for Firestore auto-ids later
export function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
