import toast from 'react-hot-toast'
import { formatOrderMoney, formatShortDate, orderStatusBadgeClass, paymentStatusBadgeClass } from '@/utils/ecommerce.js'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { printOrderInvoice } from '@/utils/invoicePrint.js'

const STATUS_FLOW = ['pending', 'processing', 'shipped', 'delivered']

function stepReached(orderStatus, step) {
  const cur = STATUS_FLOW.indexOf(orderStatus)
  const t = STATUS_FLOW.indexOf(step)
  if (orderStatus === 'cancelled') return false
  return cur >= t && t >= 0
}

export function AdminOrderDetailModal({ order, loading, onClose, onRefresh }) {
  if (!order && !loading) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <button type="button" className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-label="Close" onClick={onClose} />
      <div className="no-print relative z-[81] max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-white/10 bg-tn-950 p-6 shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">Order detail</p>
            <h2 className="mt-1 text-lg font-semibold text-white">{loading ? 'Loading…' : order?.id}</h2>
            <p className="text-xs text-zinc-500">{order ? formatShortDate(order.createdAt) : null}</p>
          </div>
          <SecondaryButton type="button" onClick={onClose} className="shrink-0">
            Close
          </SecondaryButton>
        </div>

        {loading ? <p className="mt-6 text-sm text-zinc-400">Fetching order…</p> : null}

        {order ? (
          <div className="mt-6 space-y-6 text-sm text-zinc-300">
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${orderStatusBadgeClass(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${paymentStatusBadgeClass(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Timeline</p>
              <ol className="mt-3 space-y-2 border-l border-white/10 pl-4">
                {STATUS_FLOW.map((step) => (
                  <li key={step} className="relative">
                    <span
                      className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 ${
                        stepReached(order.orderStatus, step)
                          ? 'border-sky-400 bg-sky-400'
                          : 'border-zinc-600 bg-zinc-800'
                      }`}
                    />
                    <p className="font-medium capitalize text-white">{step}</p>
                    <p className="text-xs text-zinc-500">
                      {stepReached(order.orderStatus, step) ? 'Recorded in workflow' : 'Pending'}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Customer</p>
              <p className="mt-1 text-white">{order.customerName}</p>
              <p className="text-xs text-zinc-400">{order.customerEmail}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Ship to</p>
              <p className="mt-1 whitespace-pre-line text-zinc-200">
                {order.shippingAddress?.fullName}
                {'\n'}
                {order.shippingAddress?.line1}
                {order.shippingAddress?.line2 ? `\n${order.shippingAddress.line2}` : ''}
                {'\n'}
                {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                {'\n'}
                {order.shippingAddress?.country} · {order.shippingAddress?.phone}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Items</p>
              <ul className="mt-2 space-y-2">
                {(order.orderItems ?? []).map((i, idx) => (
                  <li key={`${i.slug}-${idx}`} className="flex justify-between gap-3 border-b border-white/5 py-2 last:border-b-0">
                    <span className="min-w-0 text-zinc-200">
                      {i.title} × {i.quantity}
                    </span>
                    <span className="shrink-0 font-semibold text-white">{formatOrderMoney(i.lineTotal)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="grid gap-2 rounded-tn border border-white/10 bg-black/20 p-4 text-sm">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatOrderMoney(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Discount</dt>
                <dd>-{formatOrderMoney(order.discountAmount ?? 0)}</dd>
              </div>
              {order.couponCode ? (
                <div className="flex justify-between text-xs text-zinc-500">
                  <dt>Coupon</dt>
                  <dd className="font-mono">{order.couponCode}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd>{formatOrderMoney(order.shippingFee)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Tax</dt>
                <dd>{formatOrderMoney(order.tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 font-semibold text-white">
                <dt>Total</dt>
                <dd>{formatOrderMoney(order.totalPrice)}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-2">
              <PrimaryButton
                type="button"
                className="justify-center"
                onClick={() => {
                  const ok = printOrderInvoice(order)
                  if (!ok) toast.error('Allow pop-ups to print invoices')
                }}
              >
                Print invoice
              </PrimaryButton>
              <SecondaryButton type="button" onClick={onRefresh}>
                Refresh
              </SecondaryButton>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
