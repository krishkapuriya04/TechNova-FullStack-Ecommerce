import { Router } from 'express'
import * as authController from '../controllers/auth.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { registerValidators, loginValidators } from '../validators/auth.validators.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.post(
  '/register',
  validate(registerValidators),
  asyncHandler(authController.registerUser),
)

router.post('/login', validate(loginValidators), asyncHandler(authController.loginUser))

router.get('/me', authenticate, asyncHandler(authController.getCurrentUser))

export default router
