// server/routes/auth.js
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import User from '../models/User.js'
import { authenticateToken, JWT_SECRET } from '../middleware/authMiddleware.js'

const router = Router()

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null

function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' })
    }

    const user = await User.create({ name, email, password, authProvider: 'local' })
    const token = signToken(user)

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    console.error('Signup error:', err)
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message)
      return res.status(400).json({ error: messages.join('. ') })
    }
    res.status(500).json({ error: 'Server error during signup.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    // Find user and explicitly select password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    // If user signed up with Google, they can't use password login
    if (user.authProvider === 'google') {
      return res.status(401).json({ error: 'This account uses Google sign-in. Please use the Google button.' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const token = signToken(user)

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Server error during login.' })
  }
})

// POST /api/auth/google — Google ID token verification + login/signup
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body

    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token is required.' })
    }

    if (!googleClient) {
      return res.status(500).json({ error: 'Google auth is not configured on the server.' })
    }

    // Verify the ID token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    const { sub: googleId, email, name, picture } = payload

    // Try to find an existing user by googleId first, then by email
    let user = await User.findOne({ googleId })

    if (!user) {
      // Check if a local user with this email exists
      user = await User.findOne({ email: email.toLowerCase() })

      if (user) {
        // Link the existing local account with Google
        user.googleId = googleId
        user.authProvider = 'google'
        if (picture) user.avatar = picture
        await user.save()
      } else {
        // Create a brand-new user
        user = await User.create({
          name: name || email.split('@')[0],
          email,
          googleId,
          authProvider: 'google',
          avatar: picture || undefined,
        })
      }
    } else {
      // Update avatar if it changed
      if (picture && user.avatar !== picture) {
        user.avatar = picture
        await user.save()
      }
    }

    const token = signToken(user)

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    })
  } catch (err) {
    console.error('Google auth error:', err)
    if (err.message?.includes('Token used too late') || err.message?.includes('Invalid token')) {
      return res.status(401).json({ error: 'Invalid or expired Google token. Please try again.' })
    }
    res.status(500).json({ error: 'Server error during Google authentication.' })
  }
})

// GET /api/auth/me — restore session from JWT
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }
    res.json({ user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } })
  } catch (err) {
    console.error('Auth check error:', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

export default router
