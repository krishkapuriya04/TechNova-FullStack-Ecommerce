import { Coupon } from '../models/Coupon.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { computeCouponDiscount } from '../utils/couponApply.js'

export async function validateCoupon(req, res) {
  const code = String(req.body.code ?? '')
    .trim()
    .toUpperCase()
  const subtotal = Number(req.body.subtotal)

  const coupon = await Coupon.findOne({ code })
  if (!coupon) {
    return sendSuccess(res, { valid: false, message: 'Coupon not found', discountAmount: 0 })
  }

  const discountAmount = computeCouponDiscount(subtotal, coupon)
  const valid = discountAmount > 0

  sendSuccess(res, {
    valid,
    message: valid ? 'Coupon applied' : 'Coupon cannot be applied to this cart',
    discountAmount,
    coupon: valid
      ? {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        }
      : null,
  })
}
