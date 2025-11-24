import jwt from 'jsonwebtoken'

export function signToken(userId: string) {
  const secret = process.env.JWT_SECRET || 'changeme'
  return jwt.sign({ userId }, secret, { expiresIn: '12h' })
}
