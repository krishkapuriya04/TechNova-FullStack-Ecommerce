import { roundMoney } from './cartCalculations.js'

/**
 * @param {number} subtotal
 * @param {{ active: boolean, expiryDate: Date, minimumOrder?: number, discountType: string, discountValue: number }} coupon
 */
export function computeCouponDiscount(subtotal, coupon) {
  if (!coupon || !coupon.active) return 0
  if (new Date(coupon.expiryDate).getTime() < Date.now()) return 0
  const min = Number(coupon.minimumOrder) || 0
  if (subtotal < min) return 0
  const s = roundMoney(Number(subtotal) || 0)
  if (coupon.discountType === 'percent') {
    const d = roundMoney(s * (Number(coupon.discountValue) / 100))
    return roundMoney(Math.min(d, s))
  }
  return roundMoney(Math.min(Number(coupon.discountValue) || 0, s))
}
