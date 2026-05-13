import { body, param } from 'express-validator'

export const addCartValidators = [
  body('productId').isMongoId().withMessage('Invalid product id'),
  body('quantity').isInt({ min: 1, max: 999 }).toInt(),
]

export const updateCartItemValidators = [
  param('itemId').isMongoId().withMessage('Invalid cart item id'),
  body('quantity').isInt({ min: 1, max: 999 }).toInt(),
]

export const removeCartItemValidators = [
  param('itemId').isMongoId().withMessage('Invalid cart item id'),
]
