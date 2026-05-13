import { formatOrderMoney } from '@/utils/ecommerce.js'

export function CheckoutOrderSummary({ cart, pricing }) {
  const items = cart?.items ?? []

  return (
    <div className="rounded-tn-2xl border border-zinc-200/80 bg-white/90 p-6 dark:border-white/10 dark:bg-tn-900/80">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Items</h2>
      <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
        {items.map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-3 text-sm">
            <div className="min-w-0">
              <p className="truncate font-medium text-zinc-900 dark:text-white">{row.product.title}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Qty {row.quantity}</p>
            </div>
            <p className="shrink-0 font-semibold tabular-nums text-zinc-900 dark:text-white">
              {formatOrderMoney(row.subtotal)}
            </p>
          </li>
        ))}
      </ul>
      <dl className="mt-6 space-y-2 border-t border-zinc-200 pt-4 text-sm dark:border-white/10">
        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <dt>Subtotal</dt>
          <dd className="font-medium text-zinc-900 dark:text-white">{formatOrderMoney(pricing.subtotal)}</dd>
        </div>
        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <dt>Shipping</dt>
          <dd className="font-medium text-zinc-900 dark:text-white">{formatOrderMoney(pricing.shippingFee)}</dd>
        </div>
        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <dt>Tax (est.)</dt>
          <dd className="font-medium text-zinc-900 dark:text-white">{formatOrderMoney(pricing.tax)}</dd>
        </div>
        <div className="flex justify-between border-t border-zinc-200 pt-3 text-base font-bold dark:border-white/10">
          <dt className="text-zinc-900 dark:text-white">Total</dt>
          <dd className="text-zinc-900 dark:text-white">{formatOrderMoney(pricing.totalPrice)}</dd>
        </div>
      </dl>
    </div>
  )
}
