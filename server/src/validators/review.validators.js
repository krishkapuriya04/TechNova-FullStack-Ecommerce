import { body, param } from 'express-validator'

export const productIdParamValidators = [param('productId').isMongoId().withMessage('Invalid product id')]

export const createReviewValidators = [
  body('productId').isMongoId().withMessage('Invalid product id'),
  body('rating').isInt({ min: 1, max: 5 }).toInt(),
  body('title').optional({ checkFalsy: true }).trim().isLength({ max: 120 }),
  body('comment').trim().notEmpty().isLength({ max: 2000 }),
]

export const updateReviewValidators = [
  param('id').isMongoId(),
  body('rating').optional().isInt({ min: 1, max: 5 }).toInt(),
  body('title').optional().trim().isLength({ max: 120 }),
  body('comment').optional().trim().notEmpty().isLength({ max: 2000 }),
]

export const reviewIdValidators = [param('id').isMongoId()]
