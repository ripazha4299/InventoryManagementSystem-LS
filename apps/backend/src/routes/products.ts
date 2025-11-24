import { Router } from 'express'
import { authMiddleware, adminOnly } from '../middleware/authMiddleware'
import { listProducts, createProduct, getProductDetail, changeProductStatus, deleteProduct } from '../controllers/productsController'

const router = Router()

router.get('/', listProducts)
router.post('/', authMiddleware, adminOnly, createProduct)
router.get('/:id', getProductDetail)
router.patch('/:id/status', authMiddleware, adminOnly, changeProductStatus)
router.delete('/:id', authMiddleware, adminOnly, deleteProduct)

export default router
