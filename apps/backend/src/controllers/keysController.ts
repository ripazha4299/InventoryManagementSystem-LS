import { Request, Response } from 'express'
import prisma from '../prismaClient'

export async function listKeys(req: Request, res: Response) {
  const keys = await prisma.inventoryKey.findMany({ include: { currentHolder: true } })
  res.json({ keys })
}

export async function handoverKey(req: Request, res: Response) {
  const { id } = req.params
  const { to_holder, notes } = req.body as any
  const key = await prisma.inventoryKey.findUnique({ where: { id } })
  if (!key) return res.status(404).json({ message: 'Key not found' })

  let holderRecord = null
  if (to_holder && to_holder.roll) {
    holderRecord = await prisma.holder.upsert({ where: { roll: to_holder.roll }, update: { name: to_holder.name, contact: to_holder.contact }, create: to_holder })
  } else if (to_holder && to_holder.name) {
    holderRecord = await prisma.holder.create({ data: to_holder })
  }

  await prisma.keyHistory.create({ data: { key: { connect: { id } }, fromHolderId: key.currentHolderId || null, toHolder: holderRecord ? { connect: { id: holderRecord.id } } : undefined, notes: notes || null } })

  await prisma.inventoryKey.update({ where: { id }, data: { currentHolder: holderRecord ? { connect: { id: holderRecord.id } } : undefined, lastUpdated: new Date() } })

  console.log(`Key ${id} handed over to ${holderRecord?.name} by ${(req as any).user?.email || 'system'}`)
  res.json({ message: 'handover recorded' })
}
