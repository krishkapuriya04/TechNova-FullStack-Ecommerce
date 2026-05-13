import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as cartController from '../controllers/cart.controller.js'
import {
  addCartValidators,
  removeCartItemValidators,
  updateCartItemValidators,
} from '../validators/cart.validators.js'

const router = Router()

router.use(authenticate)

router.get('/', asyncHandler(cartController.getCart))

router.post('/', validate(addCartValidators), asyncHandler(cartController.addToCart))

router.patch(
  '/:itemId',
  validate(updateCartItemValidators),
  asyncHandler(cartController.updateCartItem),
)

router.delete(
  '/:itemId',
  validate(removeCartItemValidators),
  asyncHandler(cartController.removeCartItem),
)

router.delete('/', asyncHandler(cartController.clearCart))

export default router
