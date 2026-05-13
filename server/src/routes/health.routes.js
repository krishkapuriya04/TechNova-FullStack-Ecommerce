import { Router } from 'express'
import { getHealth, getLive } from '../controllers/health.controller.js'

const router = Router()

router.get('/live', getLive)
router.get('/', getHealth)

export default router
