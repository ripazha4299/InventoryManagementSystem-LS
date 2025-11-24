import { Router } from 'express'
import { listAllowedEmails, addAllowedEmail, deleteAllowedEmail } from '../controllers/adminController'
import { authMiddleware, adminOnly } from '../middleware/authMiddleware'

const router = Router()

router.get('/allowed-emails', authMiddleware, adminOnly, listAllowedEmails)
router.post('/allowed-emails', authMiddleware, adminOnly, addAllowedEmail)
router.delete('/allowed-emails/:email', authMiddleware, adminOnly, deleteAllowedEmail)

export default router
