import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as adminAnalytics from '../controllers/adminAnalytics.controller.js'
import * as adminOrder from '../controllers/adminOrder.controller.js'
import * as adminUser from '../controllers/adminUser.controller.js'
import * as adminProduct from '../controllers/adminProduct.controller.js'
import * as adminCoupon from '../controllers/adminCoupon.controller.js'
import * as adminReview from '../controllers/adminReview.controller.js'
import * as review from '../controllers/review.controller.js'
import {
  adminOrderIdValidators,
  adminProductStockValidators,
  adminUserIdValidators,
  listAdminOrdersValidators,
  listAdminProductsValidators,
  listAdminReviewsValidators,
  listAdminUsersValidators,
  updateOrderStatusValidators,
  updatePaymentStatusValidators,
  updateUserRoleValidators,
} from '../validators/admin.validators.js'
import {
  createCouponValidators,
  updateCouponValidators,
  couponIdValidators,
} from '../validators/coupon.validators.js'
import { reviewIdValidators } from '../validators/review.validators.js'

const router = Router()

router.use(...requireAdmin)

router.get('/analytics/overview', asyncHandler(adminAnalytics.getAnalyticsOverview))

router.get(
  '/products',
  validate(listAdminProductsValidators),
  asyncHandler(adminProduct.listAdminProducts),
)

router.patch(
  '/products/:id/stock',
  validate(adminProductStockValidators),
  asyncHandler(adminProduct.updateProductStock),
)

router.get('/coupons', asyncHandler(adminCoupon.listCoupons))
router.post('/coupons', validate(createCouponValidators), asyncHandler(adminCoupon.createCoupon))
router.patch('/coupons/:id', validate(updateCouponValidators), asyncHandler(adminCoupon.updateCoupon))
router.delete('/coupons/:id', validate(couponIdValidators), asyncHandler(adminCoupon.deleteCoupon))

router.get('/reviews', validate(listAdminReviewsValidators), asyncHandler(adminReview.listAdminReviews))
router.delete('/reviews/:id', validate(reviewIdValidators), asyncHandler(review.adminDeleteReview))

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
