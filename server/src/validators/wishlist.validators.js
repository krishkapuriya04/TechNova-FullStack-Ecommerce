import { body, param } from 'express-validator'

export const wishlistAddValidators = [
  body('productId').isMongoId().withMessage('Invalid product id'),
]

export const wishlistRemoveValidators = [
  param('productId').isMongoId().withMessage('Invalid product id'),
]
