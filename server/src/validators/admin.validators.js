import { body, param, query } from 'express-validator'

export const listAdminProductsValidators = [
  query('page').optional().toInt().isInt({ min: 1 }),
  query('limit').optional().toInt().isInt({ min: 1, max: 100 }),
  query('search').optional().isString().trim().isLength({ max: 120 }),
]

export const listAdminOrdersValidators = [
  query('page').optional().toInt().isInt({ min: 1 }),
  query('limit').optional().toInt().isInt({ min: 1, max: 100 }),
  query('status')
    .optional()
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
]

export const adminOrderIdValidators = [param('id').isMongoId().withMessage('Invalid order id')]

export const updateOrderStatusValidators = [
  param('id').isMongoId().withMessage('Invalid order id'),
  body('orderStatus')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
]

export const updatePaymentStatusValidators = [
  param('id').isMongoId().withMessage('Invalid order id'),
  body('paymentStatus').isIn(['pending', 'paid', 'failed']).withMessage('Invalid payment status'),
]

export const listAdminUsersValidators = [
  query('page').optional().toInt().isInt({ min: 1 }),
  query('limit').optional().toInt().isInt({ min: 1, max: 100 }),
  query('search').optional().isString().trim().isLength({ max: 120 }),
]

export const adminUserIdValidators = [param('id').isMongoId().withMessage('Invalid user id')]

export const updateUserRoleValidators = [
  param('id').isMongoId().withMessage('Invalid user id'),
  body('role').isIn(['user', 'admin']).withMessage('Invalid role'),
]
