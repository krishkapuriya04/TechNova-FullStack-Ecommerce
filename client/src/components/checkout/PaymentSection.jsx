import { PAYMENT_METHOD } from '@/constants/checkout.js'

export function PaymentSection({
  method,
  onMethodChange,
  cardLast4,
  onCardLast4Change,
  disabled,
  errors,
}) {
  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="text-sm font-semibold text-zinc-900 dark:text-white">Payment method</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-tn border border-zinc-200 bg-white/80 px-4 py-3 text-sm font-medium text-zinc-800 has-[:checked]:border-indigo-500 has-[:checked]:ring-2 has-[:checked]:ring-indigo-400/30 dark:border-white/10 dark:bg-tn-950/80 dark:text-zinc-100 dark:has-[:checked]:border-indigo-400">
            <input
              type="radio"
              name="payment"
              className="accent-indigo-600"
              checked={method === PAYMENT_METHOD.COD}
              disabled={disabled}
              onChange={() => onMethodChange(PAYMENT_METHOD.COD)}
            />
            Cash on delivery
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-tn border border-zinc-200 bg-white/80 px-4 py-3 text-sm font-medium text-zinc-800 has-[:checked]:border-indigo-500 has-[:checked]:ring-2 has-[:checked]:ring-indigo-400/30 dark:border-white/10 dark:bg-tn-950/80 dark:text-zinc-100 dark:has-[:checked]:border-indigo-400">
            <input
              type="radio"
              name="payment"
              className="accent-indigo-600"
              checked={method === PAYMENT_METHOD.CARD}
              disabled={disabled}
              onChange={() => onMethodChange(PAYMENT_METHOD.CARD)}
            />
            Card (demo)
          </label>
        </div>
      </fieldset>

      {method === PAYMENT_METHOD.CARD ? (
        <div className="rounded-tn-xl border border-zinc-200/80 bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 text-white shadow-inner dark:border-white/10">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Demo checkout</p>
          <p className="mt-1 text-sm text-zinc-300">
            No real charges — enter any 4 digits to simulate card verification.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="rounded-md bg-white/10 px-3 py-2 font-mono text-sm tracking-[0.2em]">•••• •••• ••••</span>
            <input
              inputMode="numeric"
              maxLength={4}
              placeholder="4242"
              disabled={disabled}
              value={cardLast4}
              onChange={(e) => onCardLast4Change(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-24 rounded-md border border-white/20 bg-black/30 px-3 py-2 text-center font-mono text-sm outline-none ring-indigo-400/40 focus:ring-2"
            />
          </div>
          {errors.cardLast4 ? (
            <p className="mt-2 text-xs text-rose-300">{errors.cardLast4}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
