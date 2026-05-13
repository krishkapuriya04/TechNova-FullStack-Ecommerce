/**
 * Pure cart math — keep pricing logic centralized for API + checkout alignment.
 */
export function roundMoney(value) {
  return Math.round(value * 100) / 100
}

export function lineSubtotal(unitPrice, quantity) {
  return roundMoney(Number(unitPrice) * Number(quantity))
}

export function sumCartLines(items) {
  let subtotal = 0
  let quantity = 0
  for (const item of items) {
    const unit = Number(item.unitPrice)
    const qty = Number(item.quantity)
    subtotal += unit * qty
    quantity += qty
  }
  return {
    subtotal: roundMoney(subtotal),
    quantity,
  }
}

export function buildCartResponse(cartDoc) {
  const items = (cartDoc.items ?? []).map((row) => {
    const populated = row.product && typeof row.product === 'object' && row.product._id
    const product = populated ? row.product : null
    const unitPrice = row.unitPrice
    const qty = row.quantity
    const subtotal = lineSubtotal(unitPrice, qty)
    return {
      id: row._id.toString(),
      quantity: qty,
      unitPrice,
      subtotal,
      product: product
        ? {
            id: product._id.toString(),
            title: product.title,
            slug: product.slug,
            image: product.images?.[0] ?? '',
            stock: product.stock,
            effectivePrice: product.effectivePrice,
          }
        : {
            id: row.product?.toString?.() ?? '',
            title: 'Unavailable',
            slug: '',
            image: '',
            stock: 0,
            effectivePrice: unitPrice,
          },
    }
  })

  const totals = sumCartLines(
    cartDoc.items.map((row) => ({ unitPrice: row.unitPrice, quantity: row.quantity })),
  )

  return {
    id: cartDoc._id.toString(),
    items,
    subtotal: totals.subtotal,
    totalPrice: totals.subtotal,
    itemCount: totals.quantity,
  }
}
