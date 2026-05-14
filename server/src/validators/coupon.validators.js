import { body, param } from 'express-validator'

export const validateCouponRequest = [
  body('code').trim().notEmpty().isLength({ min: 3, max: 32 }),
  body('subtotal').isFloat({ min: 0 }).toFloat(),
]

export const createCouponValidators = [
  body('code').trim().notEmpty().isLength({ min: 3, max: 32 }),
  body('discountType').isIn(['percent', 'fixed']),
  body('discountValue').isFloat({ min: 0 }).toFloat(),
  body('minimumOrder').optional({ checkFalsy: true }).isFloat({ min: 0 }).toFloat(),
  body('expiryDate').isISO8601().toDate(),
  body('active').optional().isBoolean().toBoolean(),
]

export const updateCouponValidators = [
  param('id').isMongoId(),
  body('code').optional().trim().notEmpty().isLength({ min: 3, max: 32 }),
  body('discountType').optional().isIn(['percent', 'fixed']),
  body('discountValue').optional().isFloat({ min: 0 }).toFloat(),
  body('minimumOrder').optional().isFloat({ min: 0 }).toFloat(),
  body('expiryDate').optional().isISO8601().toDate(),
  body('active').optional().isBoolean().toBoolean(),
]

export const couponIdValidators = [param('id').isMongoId()]
