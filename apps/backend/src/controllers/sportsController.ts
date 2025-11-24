import { Request, Response } from 'express'
import prisma from '../prismaClient'

export async function listSports(req: Request, res: Response) {
  const items = await prisma.sport.findMany({ orderBy: { name: 'asc' } })
  res.json({ items })
}

export async function createSport(req: Request, res: Response) {
  const { name } = req.body
  if (!name) return res.status(400).json({ message: 'name required' })
  const sp = await prisma.sport.create({ data: { name } })
  res.status(201).json({ sport: sp })
}
