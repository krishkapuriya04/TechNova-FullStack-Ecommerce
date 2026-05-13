import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as adminAnalytics from '../controllers/adminAnalytics.controller.js'
import * as adminOrder from '../controllers/adminOrder.controller.js'
import * as adminUser from '../controllers/adminUser.controller.js'
import * as adminProduct from '../controllers/adminProduct.controller.js'
import {
  adminOrderIdValidators,
  adminUserIdValidators,
  listAdminOrdersValidators,
  listAdminProductsValidators,
  listAdminUsersValidators,
  updateOrderStatusValidators,
  updatePaymentStatusValidators,
  updateUserRoleValidators,
} from '../validators/admin.validators.js'

const router = Router()

router.use(...requireAdmin)

router.get('/analytics/overview', asyncHandler(adminAnalytics.getAnalyticsOverview))

router.get(
  '/products',
  validate(listAdminProductsValidators),
  asyncHandler(adminProduct.listAdminProducts),
)

router.get(
  '/orders',
  validate(listAdminOrdersValidators),
  asyncHandler(adminOrder.listAdminOrders),
)
router.get('/orders/:id', validate(adminOrderIdValidators), asyncHandler(adminOrder.getAdminOrder))
router.patch(
  '/orders/:id/status',
  validate(updateOrderStatusValidators),
  asyncHandler(adminOrder.updateAdminOrderStatus),
)
router.patch(
  '/orders/:id/payment',
  validate(updatePaymentStatusValidators),
  asyncHandler(adminOrder.updateAdminPaymentStatus),
)

router.get('/users', validate(listAdminUsersValidators), asyncHandler(adminUser.listAdminUsers))
router.patch(
  '/users/:id/role',
  validate(updateUserRoleValidators),
  asyncHandler(adminUser.updateAdminUserRole),
)
router.delete('/users/:id', validate(adminUserIdValidators), asyncHandler(adminUser.deleteAdminUser))

export default router
