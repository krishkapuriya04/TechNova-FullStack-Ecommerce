import { Router } from 'express'
import { apiPath } from '../constants/api.js'
import authRoutes from './auth.routes.js'
import cartRoutes from './cart.routes.js'
import healthRoutes from './health.routes.js'
import orderRoutes from './order.routes.js'
import productRoutes from './product.routes.js'
import wishlistRoutes from './wishlist.routes.js'

const router = Router()

router.use('/health', healthRoutes)
router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/cart', cartRoutes)
router.use('/wishlist', wishlistRoutes)
router.use('/orders', orderRoutes)

/**
 * Mount versioned API: /api/v1/*
 */
export function registerRoutes(app) {
  app.use(apiPath(), router)
}
