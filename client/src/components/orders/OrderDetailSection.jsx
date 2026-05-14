import { Link } from 'react-router-dom'
import { productPath } from '@/constants/routes.js'
import { formatOrderMoney, formatShortDate, orderStatusBadgeClass, paymentStatusBadgeClass } from '@/utils/ecommerce.js'

export function OrderDetailSection({ order }) {
  if (!order) return null

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
            Order
          </p>
          <h1 className="mt-2 font-mono text-xl font-semibold text-zinc-900 dark:text-white sm:text-2xl">
            {order.id}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{formatShortDate(order.createdAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${orderStatusBadgeClass(order.orderStatus)}`}>
            {order.orderStatus}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${paymentStatusBadgeClass(order.paymentStatus)}`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>

      <section className="rounded-tn-xl border border-zinc-200/80 bg-white/80 p-5 dark:border-white/10 dark:bg-tn-900/70">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Items</h2>
        <ul className="mt-4 divide-y divide-zinc-100 dark:divide-white/5">
          {order.orderItems?.map((line, idx) => (
            <li key={`${line.slug}-${idx}`} className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0">
              <div className="h-16 w-20 shrink-0 overflow-hidden rounded-tn border border-zinc-200/80 bg-zinc-100 dark:border-white/10 dark:bg-tn-950">
                {line.image ? (
                  <img src={line.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                {line.slug ? (
                  <Link
                    to={productPath(line.slug)}
                    className="font-medium text-zinc-900 transition hover:text-sky-600 dark:text-white dark:hover:text-sky-300"
                  >
                    {line.title}
                  </Link>
                ) : (
                  <span className="font-medium text-zinc-900 dark:text-white">{line.title}</span>
                )}
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatOrderMoney(line.unitPrice)} × {line.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">{formatOrderMoney(line.lineTotal)}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-tn-xl border border-zinc-200/80 bg-white/80 p-5 dark:border-white/10 dark:bg-tn-900/70">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Shipping</h2>
          <address className="mt-3 text-sm not-italic leading-relaxed text-zinc-600 dark:text-zinc-300">
            {order.shippingAddress?.fullName}
            <br />
            {order.shippingAddress?.line1}
            <br />
            {order.shippingAddress?.line2 ? (
              <>
                {order.shippingAddress.line2}
                <br />
              </>
            ) : null}
            {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
            <br />
            {order.shippingAddress?.country}
            <br />
            {order.shippingAddress?.phone}
          </address>
        </section>
        <section className="rounded-tn-xl border border-zinc-200/80 bg-white/80 p-5 dark:border-white/10 dark:bg-tn-900/70">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Payment</h2>
          <p className="mt-3 text-sm capitalize text-zinc-600 dark:text-zinc-300">
            Method: <span className="font-semibold text-zinc-900 dark:text-white">{order.paymentMethod}</span>
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <dt>Subtotal</dt>
              <dd className="font-medium text-zinc-900 dark:text-white">{formatOrderMoney(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <dt>Shipping</dt>
              <dd className="font-medium text-zinc-900 dark:text-white">{formatOrderMoney(order.shippingFee)}</dd>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <dt>Tax</dt>
              <dd className="font-medium text-zinc-900 dark:text-white">{formatOrderMoney(order.tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-3 text-base font-bold dark:border-white/10">
              <dt className="text-zinc-900 dark:text-white">Total</dt>
              <dd className="text-zinc-900 dark:text-white">{formatOrderMoney(order.totalPrice)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  )
}
