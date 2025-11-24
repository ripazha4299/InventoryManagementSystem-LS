import { Router } from 'express'
import { streamInventoryExcel } from '../services/exportService'

const router = Router()

router.get('/inventory', async (req, res) => {
  const format = req.query.format || 'xlsx'
  if (format !== 'xlsx') return res.status(400).json({ message: 'Only xlsx supported' })

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', 'attachment; filename=inventory_snapshot.xlsx')

  try {
    console.log('Starting export: inventory snapshot')
    await streamInventoryExcel(res)
    console.log('Export completed')
  } catch (err) {
    console.error('Export error', err)
    res.status(500).end()
  }
})

export default router
