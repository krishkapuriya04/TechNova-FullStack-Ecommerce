import { Link } from 'react-router-dom'
import { productPath } from '@/constants/routes.js'
import { formatCurrency } from '@/utils/formatCurrency.js'

export function CartItemCard({ item, disabled, onIncrement, onDecrement, onRemove }) {
  const { product } = item
  const max = product.stock ?? 0
  const atMax = item.quantity >= max
  const detailTo = product.slug ? productPath(product.slug) : null

  return (
    <article className="flex flex-col gap-4 rounded-tn-xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-tn-900/80 sm:flex-row sm:items-center">
      <div className="flex flex-1 gap-4">
        <div className="h-24 w-28 shrink-0 overflow-hidden rounded-tn border border-zinc-200/80 bg-zinc-100 dark:border-white/10 dark:bg-tn-950">
          {product.image ? (
            <img src={product.image} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
              No image
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          {detailTo ? (
            <Link
              to={detailTo}
              className="block truncate text-base font-semibold text-zinc-900 transition hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300"
            >
              {product.title}
            </Link>
          ) : (
            <p className="truncate text-base font-semibold text-zinc-900 dark:text-white">{product.title}</p>
          )}
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {formatCurrency(product.effectivePrice ?? item.unitPrice)} each ·{' '}
            {max > 0 ? `${max} in stock` : 'Out of stock'}
          </p>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            Line total {formatCurrency(item.subtotal)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-col sm:items-end">
        <div className="inline-flex items-center rounded-tn border border-zinc-200 dark:border-white/10">
          <button
            type="button"
            disabled={disabled || item.quantity <= 1}
            onClick={() => onDecrement(item)}
            className="px-3 py-2 text-sm font-semibold text-zinc-800 transition enabled:hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-100 dark:enabled:hover:bg-white/5"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-[2.5rem] px-2 py-2 text-center text-sm font-semibold tabular-nums text-zinc-900 dark:text-white">
            {item.quantity}
          </span>
          <button
            type="button"
            disabled={disabled || atMax || max <= 0}
            onClick={() => onIncrement(item)}
            className="px-3 py-2 text-sm font-semibold text-zinc-800 transition enabled:hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-100 dark:enabled:hover:bg-white/5"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onRemove(item.id)}
          className="text-sm font-semibold text-red-600 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400"
        >
          Remove
        </button>
      </div>
    </article>
  )
}
