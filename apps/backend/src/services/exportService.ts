import ExcelJS from 'exceljs'
import prisma from '../prismaClient'
import { Response } from 'express'

export async function streamInventoryExcel(res: Response) {
  // Use a stream-capable workbook writer to avoid building entire file in memory
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res })
  const sheet = workbook.addWorksheet('Inventory_Snapshot')

  sheet.addRow(['Sport Category','Item Name','Item ID','Date Added','Current Status','Holder Name','Holder Roll','Holder Contact','Last Used By','Last Updated Timestamp','Item Age (days)']).commit()

  // Query products with sport and holders
  const products = await prisma.product.findMany({
    where: {},
    include: {
      sport: true,
      currentHolder: true,
      lastUsedBy: true
    },
    orderBy: [
      { sport: { name: 'asc' } },
      { name: 'asc' }
    ]
  })

  const now = new Date()
  for (const p of products) {
    const dateAdded = p.dateAdded ? new Date(p.dateAdded) : null
    const age = dateAdded ? Math.floor((now.getTime() - dateAdded.getTime()) / (1000 * 60 * 60 * 24)) : ''
    sheet.addRow([
      p.sport?.name || '',
      p.name,
      p.id,
      p.dateAdded ? p.dateAdded.toISOString().split('T')[0] : '',
      p.status,
      p.currentHolder?.name || '',
      p.currentHolder?.roll || '',
      p.currentHolder?.contact || '',
      p.lastUsedBy?.name || '',
      p.updatedAt ? p.updatedAt.toISOString() : '',
      age
    ]).commit()
  }

  await workbook.commit()
}
