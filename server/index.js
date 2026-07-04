// server/index.js
//
// Backend server with MongoDB auth + Google Gemini AI proxy.
// Run with: node --env-file=.env server/index.js
//
// Required env vars: GEMINI_API_KEY
// Optional env vars: MONGODB_URI, JWT_SECRET, PORT

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { connectDB } from './db.js'
import authRoutes from './routes/auth.js'
import { authenticateToken } from './middleware/authMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Connect to MongoDB
await connectDB()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
const app = express()
app.use(cors())
app.use(express.json())

// ── File Uploads ───────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir))

app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  // Return the URL path to access the file
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  res.json({ url: fileUrl })
})

// ── Auth routes (public) ───────────────────────────────────────────────
app.use('/api/auth', authRoutes)

// ── AI routes (protected) ──────────────────────────────────────────────

function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}

app.post('/api/study-plan', authenticateToken, async (req, res) => {
  try {
    const { subjects, sessions, grades } = req.body
    const prompt = `You are a study coach. Given this student's data, return ONLY a JSON object
(no preamble, no markdown fences) shaped like:
{"plan": [{"subjectId": string, "subjectName": string, "reason": string, "suggestedMinutes": number, "priority": "high"|"medium"|"low"}]}

Prioritize subjects that are behind their weeklyHourGoal or have recent low grades.
Keep each "reason" to one short sentence.

Subjects: ${JSON.stringify(subjects)}
Recent sessions: ${JSON.stringify(sessions)}
Recent grades: ${JSON.stringify(grades)}`

    const result = await geminiModel.generateContent(prompt)
    const text = result.response.text()
    res.json(extractJson(text))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate study plan' })
  }
})

app.post('/api/quiz', authenticateToken, async (req, res) => {
  try {
    const { notes, subjectName, count } = req.body
    const prompt = `Generate ${count} flashcard-style practice questions from these notes on "${subjectName}".
Return ONLY a JSON object (no preamble, no markdown fences) shaped like:
{"cards": [{"question": string, "answer": string}]}

Notes:
${notes}`

    const result = await geminiModel.generateContent(prompt)
    const text = result.response.text()
    res.json(extractJson(text))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate quiz' })
  }
})

// ── Production Static Serving ──────────────────────────────────────────
const distPath = path.join(__dirname, '../dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

const PORT = process.env.PORT || 8787
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
