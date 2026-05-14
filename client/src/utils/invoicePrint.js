import { formatOrderMoney, formatShortDate } from '@/utils/ecommerce.js'

export function buildInvoiceDocument(order) {
  const lines =
    order?.orderItems?.map(
      (i) =>
        `<tr><td>${escapeHtml(i.title)}</td><td>${i.quantity}</td><td>${formatOrderMoney(i.unitPrice)}</td><td>${formatOrderMoney(i.lineTotal)}</td></tr>`,
    ) ?? []
  const addr = order?.shippingAddress
  const addrBlock = addr
    ? `<p>${escapeHtml(addr.fullName)}<br/>${escapeHtml(addr.line1)}${addr.line2 ? `<br/>${escapeHtml(addr.line2)}` : ''}<br/>${escapeHtml(addr.city)}, ${escapeHtml(addr.postalCode)}<br/>${escapeHtml(addr.country)}<br/>${escapeHtml(addr.phone)}</p>`
    : ''
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Invoice ${escapeHtml(order?.id ?? '')}</title>
  <style>
    body{font-family:system-ui,sans-serif;padding:24px;color:#111}
    h1{font-size:20px}
    table{width:100%;border-collapse:collapse;margin-top:16px;font-size:13px}
    th,td{border:1px solid #ddd;padding:8px;text-align:left}
    th{background:#f4f4f5}
    .meta{font-size:13px;color:#444;margin-top:8px}
  </style></head><body>
  <h1>TechNova — Order invoice</h1>
  <p class="meta">Order <strong>${escapeHtml(order?.id ?? '')}</strong> · ${formatShortDate(order?.createdAt)}</p>
  <p class="meta">Customer: ${escapeHtml(order?.customerName ?? '')} (${escapeHtml(order?.customerEmail ?? '')})</p>
  <p class="meta">Fulfillment: <strong>${escapeHtml(order?.orderStatus ?? '')}</strong> · Payment: <strong>${escapeHtml(order?.paymentStatus ?? '')}</strong></p>
  <h2>Ship to</h2>${addrBlock}
  <h2>Line items</h2>
  <table><thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Line</th></tr></thead><tbody>${lines.join('')}</tbody></table>
  <table style="max-width:320px;margin-top:20px;border:none">
    <tr><td>Subtotal</td><td>${formatOrderMoney(order?.subtotal ?? 0)}</td></tr>
    <tr><td>Discount</td><td>-${formatOrderMoney(order?.discountAmount ?? 0)}</td></tr>
    <tr><td>Shipping</td><td>${formatOrderMoney(order?.shippingFee ?? 0)}</td></tr>
    <tr><td>Tax</td><td>${formatOrderMoney(order?.tax ?? 0)}</td></tr>
    <tr><td><strong>Total</strong></td><td><strong>${formatOrderMoney(order?.totalPrice ?? 0)}</strong></td></tr>
  </table>
  </body></html>`
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function printOrderInvoice(order) {
  const html = buildInvoiceDocument(order)
  const w = window.open('', '_blank', 'noopener,noreferrer')
  if (!w) return false
  w.document.open()
  w.document.write(html)
  w.document.close()
  w.focus()
  w.print()
  return true
}
