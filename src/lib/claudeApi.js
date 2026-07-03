// lib/claudeApi.js
//
// IMPORTANT: Anthropic API keys must never be used directly in browser code —
// anyone could open devtools and steal it. This file calls a small backend
// proxy instead (see /server/index.js for a working example you can deploy
// as a Node server or adapt into a serverless function).
//
// Set ANTHROPIC_API_KEY as an environment variable on whatever runs
// /server/index.js — never in frontend code or a .env file shipped to the browser.

const API_BASE = import.meta.env.VITE_API_BASE || ''

async function callProxy(path, body) {
  const token = localStorage.getItem('auth_token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`AI request failed (${res.status}): ${text}`)
  }
  return res.json()
}

/**
 * Generates a prioritized weekly study plan from the student's current data.
 * subjects: [{ id, name, targetGrade, weeklyHourGoal }]
 * sessions: [{ subjectId, date, minutes }]  (last ~14 days is plenty of context)
 * grades:   [{ subjectId, label, score, maxScore, date }]
 */
export async function generateStudyPlan({ subjects, sessions, grades }) {
  const data = await callProxy('/api/study-plan', { subjects, sessions, grades })
  // Expected shape: { plan: [{ subjectId, subjectName, reason, suggestedMinutes, priority }] }
  return data.plan ?? []
}

/**
 * Generates flashcard-style Q&A pairs from pasted study notes.
 * notes: raw text the student pastes in
 */
export async function generateQuiz({ notes, subjectName, count = 8 }) {
  const data = await callProxy('/api/quiz', { notes, subjectName, count })
  // Expected shape: { cards: [{ question, answer }] }
  return data.cards ?? []
}
