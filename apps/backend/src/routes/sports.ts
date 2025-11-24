import { Router } from 'express'
import { listSports, createSport } from '../controllers/sportsController'
import { authMiddleware, adminOnly } from '../middleware/authMiddleware'

const router = Router()

router.get('/', listSports)
router.post('/', authMiddleware, adminOnly, createSport)

export default router
