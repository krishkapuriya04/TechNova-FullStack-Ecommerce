import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as review from '../controllers/review.controller.js'
import {
  createReviewValidators,
  productIdParamValidators,
  reviewIdValidators,
  updateReviewValidators,
} from '../validators/review.validators.js'

const router = Router()

router.get(
  '/product/:productId',
  validate(productIdParamValidators),
  asyncHandler(review.listProductReviews),
)

router.post('/', authenticate, validate(createReviewValidators), asyncHandler(review.createReview))

router.patch('/:id', authenticate, validate(updateReviewValidators), asyncHandler(review.updateReview))

router.delete('/:id', authenticate, validate(reviewIdValidators), asyncHandler(review.deleteOwnReview))

export default router
