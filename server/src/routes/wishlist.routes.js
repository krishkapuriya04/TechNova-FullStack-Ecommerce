import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as wishlistController from '../controllers/wishlist.controller.js'
import { wishlistAddValidators, wishlistRemoveValidators } from '../validators/wishlist.validators.js'

const router = Router()

router.use(authenticate)

router.get('/', asyncHandler(wishlistController.getWishlist))

router.post('/', validate(wishlistAddValidators), asyncHandler(wishlistController.addToWishlist))

router.delete(
  '/:productId',
  validate(wishlistRemoveValidators),
  asyncHandler(wishlistController.removeFromWishlist),
)

export default router
