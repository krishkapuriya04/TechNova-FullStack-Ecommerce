/** Mirrors server `orderTotals.js` for client-side estimates before submit. */
export const FLAT_SHIPPING_USD = 9.99
export const TAX_RATE = 0.08

export const PAYMENT_METHOD = {
  COD: 'cod',
  CARD: 'card',
}

export function estimateOrderTotals(subtotal, discountAmount = 0) {
  const s = Math.round((Number(subtotal) || 0) * 100) / 100
  const rawD = Number(discountAmount) || 0
  const d = Math.round(Math.min(Math.max(0, rawD), s) * 100) / 100
  const after = Math.round((s - d) * 100) / 100
  const tax = Math.round(after * TAX_RATE * 100) / 100
  const totalPrice = Math.round((after + FLAT_SHIPPING_USD + tax) * 100) / 100
  return {
    subtotal: s,
    discountAmount: d,
    shippingFee: FLAT_SHIPPING_USD,
    tax,
    totalPrice,
  }
}
