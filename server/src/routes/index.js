import { Router } from 'express'
import { apiPath } from '../constants/api.js'
import healthRoutes from './health.routes.js'

const router = Router()

router.use('/health', healthRoutes)

/**
 * Mount versioned API: /api/v1/*
 */
export function registerRoutes(app) {
  app.use(apiPath(), router)
}
