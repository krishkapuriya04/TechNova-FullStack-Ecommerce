import { Router } from 'express'
import { apiPath } from '../constants/api.js'
import authRoutes from './auth.routes.js'
import healthRoutes from './health.routes.js'
import productRoutes from './product.routes.js'

const router = Router()

router.use('/health', healthRoutes)
router.use('/auth', authRoutes)
router.use('/products', productRoutes)

/**
 * Mount versioned API: /api/v1/*
 */
export function registerRoutes(app) {
  app.use(apiPath(), router)
}
