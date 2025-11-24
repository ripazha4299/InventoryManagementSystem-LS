import { Request, Response } from 'express'
import prisma from '../prismaClient'

export async function listAllowedEmails(req: Request, res: Response) {
  const items = await prisma.allowedEmail.findMany()
  res.json({ items })
}

export async function addAllowedEmail(req: Request, res: Response) {
  const { email } = req.body
  if (!email) return res.status(400).json({ message: 'email required' })
  const userId = (req as any).user?.id || null
  const rec = await prisma.allowedEmail.create({ data: { email, addedBy: userId } })
  res.status(201).json({ email: rec })
}

export async function deleteAllowedEmail(req: Request, res: Response) {
  const { email } = req.params
  await prisma.allowedEmail.delete({ where: { email } })
  res.status(204).send()
}
