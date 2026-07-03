# Ledger — Student Study Dashboard

A study tracker: log subjects, study sessions, and grades; see progress in charts;
get an AI-generated weekly study plan and notes-to-flashcards via Claude.

## Stack
- React + Tailwind CSS
- Zustand for state
- Recharts for charts
- Claude API (via a small backend proxy — see below)
- localStorage now, swap to Firebase later (see `src/lib/storage.js`)
- React Router

## Getting started

```bash
npm install
npm run dev
```

App runs at http://localhost:5173. The Dashboard, Subjects, and Sessions pages work
immediately — no setup needed, since data lives in localStorage.

## Enabling the AI features

The AI Assistant page calls a backend proxy so your Anthropic API key never sits in
browser code. To run it locally:

```bash
cd server
npm install express cors @anthropic-ai/sdk
ANTHROPIC_API_KEY=sk-ant-... node index.js
```

This starts the proxy on http://localhost:8787. The frontend is already pointed at
that URL via `VITE_API_BASE` (see `src/lib/claudeApi.js`) — override it in a `.env`
file if you deploy the proxy elsewhere:

```
VITE_API_BASE=https://your-proxy.example.com
```

In production, deploy `server/index.js` as a small Node service or adapt the two
route handlers into serverless functions (Vercel/Netlify/Cloudflare Workers all work
fine — the logic is just two API calls to Claude with a JSON-only prompt).

## Migrating from localStorage to Firebase later

Every read/write goes through `src/lib/storage.js`. When you're ready:
1. Set up a Firestore project and add the Firebase SDK.
2. Rewrite the bodies of `read`/`write`/`remove` in `storage.js` to call Firestore
   instead of `localStorage`.
3. Nothing in the Zustand stores or components needs to change — they only ever
   call `storage.read` / `storage.write` / `storage.remove`.

## Project structure

```
src/
  components/
    layout/      Sidebar, Header
    dashboard/    StatsCard, ProgressChart, SubjectBreakdown
    subjects/     SubjectForm, SubjectList, GradeForm
    sessions/     SessionLogger, SessionHistory
    ai/           StudyPlanGenerator, QuizGenerator
  store/          useSubjectStore, useSessionStore, useGradeStore (Zustand)
  lib/            storage.js (persistence), claudeApi.js (AI proxy client)
  pages/          Dashboard, Subjects, Sessions, AIAssistant
server/
  index.js        Express proxy that calls the Anthropic API
```

## Design notes

Visual identity is a "gradebook ledger": graph-paper background, a red margin rule
down the main content area, and circular grade-stamp badges for progress and scores.
Fonts: Fraunces (display), Inter (body), IBM Plex Mono (data/numbers).
