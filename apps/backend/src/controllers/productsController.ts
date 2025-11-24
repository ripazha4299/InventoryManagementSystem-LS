import { Request, Response } from 'express'
import prisma from '../prismaClient'

export async function listProducts(req: Request, res: Response) {
  const { sport_id, status, q, page = '1', limit = '20' } = req.query as any
  const where: any = {}
  if (sport_id) where.sportId = sport_id
  if (status) where.status = status
  if (q) where.name = { contains: q, mode: 'insensitive' }

  const pageNum = parseInt(page, 10) || 1
  const lim = parseInt(limit, 10) || 20

  const items = await prisma.product.findMany({
    where,
    include: { currentHolder: true, lastUsedBy: true, sport: true },
    skip: (pageNum - 1) * lim,
    take: lim,
    orderBy: { name: 'asc' }
  })
  const total = await prisma.product.count({ where })
  res.json({ items, total })
}

export async function createProduct(req: Request, res: Response) {
  const { name, sport_id, date_added, notes } = req.body
  if (!name) return res.status(400).json({ message: 'name is required' })

  const created = await prisma.product.create({
    data: {
      name,
      sport: sport_id ? { connect: { id: sport_id } } : undefined,
      dateAdded: date_added ? new Date(date_added) : undefined,
      notes,
      createdBy: { connect: { id: (req as any).user.id } }
    }
  })

  console.log(`Product created: ${created.id} by ${(req as any).user.email}`)

  await prisma.productHistory.create({
    data: {
      product: { connect: { id: created.id } },
      action: 'ADDED',
      byUser: { connect: { id: (req as any).user.id } },
      notes: 'Created via API'
    }
  })

  res.status(201).json({ product: created })
}

export async function getProductDetail(req: Request, res: Response) {
  const { id } = req.params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { sport: true, currentHolder: true, lastUsedBy: true }
  })
  if (!product) return res.status(404).json({ message: 'Not found' })

  const history = await prisma.productHistory.findMany({ where: { productId: id }, orderBy: { createdAt: 'desc' }, include: { holder: true, byUser: true } })
  res.json({ product, history })
}

export async function changeProductStatus(req: Request, res: Response) {
  const { id } = req.params
  const { status, holder, notes } = req.body as any
  if (!status) return res.status(400).json({ message: 'status required' })

  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return res.status(404).json({ message: 'Product not found' })

  let holderRecord = null
  if (holder && holder.roll) {
    holderRecord = await prisma.holder.upsert({ where: { roll: holder.roll }, update: { name: holder.name, contact: holder.contact }, create: holder })
  } else if (holder && holder.name) {
    // create by name
    holderRecord = await prisma.holder.create({ data: holder })
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      status,
      currentHolder: holderRecord ? { connect: { id: holderRecord.id } } : undefined,
      updatedAt: new Date()
    }
  })

  await prisma.productHistory.create({
    data: {
      product: { connect: { id } },
      action: 'STATUS_UPDATE',
      holder: holderRecord ? { connect: { id: holderRecord.id } } : undefined,
      byUser: { connect: { id: (req as any).user.id } },
      notes: notes || null
    }
  })
  console.log(`Product ${id} status changed to ${status} by ${(req as any).user.email}`)

  res.json({ product: updated })
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return res.status(404).json({ message: 'Not found' })

  await prisma.product.update({ where: { id }, data: { status: 'DELETED', deletedAt: new Date() } })
  await prisma.productHistory.create({ data: { product: { connect: { id } }, action: 'DELETED', byUser: { connect: { id: (req as any).user.id } }, notes: 'Deleted via API' } })
  console.log(`Product ${id} deleted by ${(req as any).user.email}`)
  res.status(204).send()
}
