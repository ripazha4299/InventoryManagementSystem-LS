import { Router } from 'express'
import { listKeys, handoverKey } from '../controllers/keysController'
import { authMiddleware, adminOnly } from '../middleware/authMiddleware'

const router = Router()

router.get('/', listKeys)
router.post('/:id/handover', authMiddleware, adminOnly, handoverKey)

export default router
