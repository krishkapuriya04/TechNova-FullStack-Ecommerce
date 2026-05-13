import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { formatCurrency } from '@/utils/formatCurrency.js'

export function CartSummary({ cart, disabled, onClear, onCheckout }) {
  const hasItems = (cart?.items?.length ?? 0) > 0

  return (
    <aside className="rounded-tn-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-tn-soft dark:border-white/10 dark:bg-tn-900/80">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Order summary</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <dt>Subtotal</dt>
          <dd className="font-medium text-zinc-900 dark:text-white">{formatCurrency(cart?.subtotal ?? 0)}</dd>
        </div>
        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <dt>Items</dt>
          <dd className="font-medium text-zinc-900 dark:text-white">{cart?.itemCount ?? 0}</dd>
        </div>
      </dl>
      <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-white/10">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Estimated total</span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white">
            {formatCurrency(cart?.totalPrice ?? 0)}
          </span>
        </div>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
          Shipping and tax are calculated at checkout.
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <PrimaryButton
          type="button"
          className="w-full justify-center"
          disabled={disabled || !hasItems}
          onClick={onCheckout}
        >
          Proceed to checkout
        </PrimaryButton>
        <button
          type="button"
          disabled={disabled || !hasItems}
          onClick={onClear}
          className="rounded-tn border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 transition enabled:hover:border-red-300 enabled:hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-zinc-100 dark:enabled:hover:border-red-400/40 dark:enabled:hover:text-red-300"
        >
          Clear cart
        </button>
      </div>
    </aside>
  )
}
