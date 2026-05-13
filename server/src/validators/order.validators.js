import { body, param } from 'express-validator'

export const createOrderValidators = [
  body('paymentMethod').isIn(['cod', 'card']).withMessage('Invalid payment method'),
  body('shippingAddress.fullName').trim().notEmpty().isLength({ max: 120 }),
  body('shippingAddress.line1').trim().notEmpty().isLength({ max: 200 }),
  body('shippingAddress.line2').optional({ checkFalsy: true }).trim().isLength({ max: 200 }),
  body('shippingAddress.city').trim().notEmpty().isLength({ max: 80 }),
  body('shippingAddress.postalCode').trim().notEmpty().isLength({ max: 24 }),
  body('shippingAddress.country').trim().notEmpty().isLength({ max: 80 }),
  body('shippingAddress.phone').trim().notEmpty().isLength({ max: 32 }),
  body('cardLast4')
    .optional()
    .matches(/^[0-9]{4}$/)
    .withMessage('Card last 4 must be 4 digits'),
]

export const orderIdValidators = [param('id').isMongoId().withMessage('Invalid order id')]
