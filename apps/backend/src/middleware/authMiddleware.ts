import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient'

interface JwtPayload {
  userId: string
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ message: 'Missing Authorization header' })

  const parts = auth.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid Authorization format' })

  const token = parts[1]
  try {
    const secret = process.env.JWT_SECRET || 'changeme'
    const payload = jwt.verify(token, secret) as JwtPayload
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return res.status(401).json({ message: 'User not found' })
    ;(req as any).user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user
  if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Admin only' })
  next()
}
