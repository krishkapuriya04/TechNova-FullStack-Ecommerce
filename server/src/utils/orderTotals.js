import { roundMoney } from './cartCalculations.js'

/** Flat shipping + simple tax model — tax applies after discount on subtotal. */
export const DEFAULT_SHIPPING_FEE = 9.99
export const DEFAULT_TAX_RATE = 0.08

export function computeOrderTotals(subtotal, options = {}) {
  const s = roundMoney(Number(subtotal) || 0)
  const rawDiscount = Number(options.discountAmount ?? 0) || 0
  const discountAmount = roundMoney(Math.min(Math.max(0, rawDiscount), s))
  const subtotalAfterDiscount = roundMoney(s - discountAmount)
  const shippingFee = roundMoney(options.shippingFee ?? DEFAULT_SHIPPING_FEE)
  const taxRate = options.taxRate ?? DEFAULT_TAX_RATE
  const tax = roundMoney(subtotalAfterDiscount * taxRate)
  const totalPrice = roundMoney(subtotalAfterDiscount + shippingFee + tax)
  return {
    subtotal: s,
    discountAmount,
    shippingFee,
    tax,
    totalPrice,
  }
}
