/** Mirrors server `orderTotals.js` for client-side estimates before submit. */
export const FLAT_SHIPPING_USD = 9.99
export const TAX_RATE = 0.08

export const PAYMENT_METHOD = {
  COD: 'cod',
  CARD: 'card',
}

export function estimateOrderTotals(subtotal) {
  const s = Number(subtotal) || 0
  const tax = Math.round(s * TAX_RATE * 100) / 100
  const totalPrice = Math.round((s + FLAT_SHIPPING_USD + tax) * 100) / 100
  return {
    subtotal: Math.round(s * 100) / 100,
    shippingFee: FLAT_SHIPPING_USD,
    tax,
    totalPrice,
  }
}
