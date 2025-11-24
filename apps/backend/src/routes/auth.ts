import { Router } from 'express'
import prisma from '../prismaClient'
import { signToken } from '../services/authService'

const router = Router()

router.post('/login', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ message: 'Email required' })

  // Check allowlist
  const allow = await prisma.allowedEmail.findUnique({ where: { email } })
  if (!allow) return res.status(403).json({ message: 'Email not allowlisted' })

  // Find or create user record
  let user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    user = await prisma.user.create({ data: { email, name: email.split('@')[0] } })
  }

  const token = signToken(user.id)
  console.log(`Auth login for ${email}`)
  res.json({ token, user })
})

export default router
