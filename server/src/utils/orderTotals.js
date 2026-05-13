import { roundMoney } from './cartCalculations.js'

/** Flat shipping + simple tax model — swap for carrier/zip lookups later. */
export const DEFAULT_SHIPPING_FEE = 9.99
export const DEFAULT_TAX_RATE = 0.08

export function computeOrderTotals(subtotal, options = {}) {
  const shippingFee = options.shippingFee ?? DEFAULT_SHIPPING_FEE
  const taxRate = options.taxRate ?? DEFAULT_TAX_RATE
  const tax = roundMoney(subtotal * taxRate)
  const totalPrice = roundMoney(subtotal + shippingFee + tax)
  return {
    subtotal: roundMoney(subtotal),
    shippingFee: roundMoney(shippingFee),
    tax,
    totalPrice,
  }
}
