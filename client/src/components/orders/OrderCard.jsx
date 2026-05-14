import { Link } from 'react-router-dom'
import { formatOrderMoney, formatShortDate, orderStatusBadgeClass, paymentStatusBadgeClass } from '@/utils/ecommerce.js'
import { orderDetailPath } from '@/constants/routes.js'

export function OrderCard({ order }) {
  return (
    <article className="flex flex-col gap-4 rounded-tn-xl border border-zinc-200/80 bg-white/90 p-5 shadow-sm transition hover:border-sky-300/50 dark:border-white/10 dark:bg-tn-900/80 dark:hover:border-sky-400/30 sm:flex-row sm:items-center">
      <div className="h-20 w-24 shrink-0 overflow-hidden rounded-tn border border-zinc-200/80 bg-zinc-100 dark:border-white/10 dark:bg-tn-950">
        {order.previewImage ? (
          <img src={order.previewImage} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-500">No image</div>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{order.id}</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${orderStatusBadgeClass(order.orderStatus)}`}>
            {order.orderStatus}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${paymentStatusBadgeClass(order.paymentStatus)}`}>
            {order.paymentStatus}
          </span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{formatShortDate(order.createdAt)}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'} · {order.paymentMethod?.toUpperCase()}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
        <p className="text-lg font-bold text-zinc-900 dark:text-white">{formatOrderMoney(order.totalPrice)}</p>
        <Link
          to={orderDetailPath(order.id)}
          className="text-sm font-semibold text-sky-600 transition hover:text-sky-500 dark:text-sky-300"
        >
          View details →
        </Link>
      </div>
    </article>
  )
}
