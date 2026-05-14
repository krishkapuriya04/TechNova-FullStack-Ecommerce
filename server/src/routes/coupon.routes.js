import { Router } from 'express'
import { validate } from '../middleware/validate.middleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as couponPublic from '../controllers/couponPublic.controller.js'
import { validateCouponRequest } from '../validators/coupon.validators.js'

const router = Router()

router.post('/validate', validate(validateCouponRequest), asyncHandler(couponPublic.validateCoupon))

export default router
