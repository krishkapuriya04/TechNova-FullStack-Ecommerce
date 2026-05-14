import { useState } from 'react'
import toast from 'react-hot-toast'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import * as couponService from '@/services/couponService.js'
import { getErrorMessage } from '@/utils/apiError.js'
import { useNotifications } from '@/hooks/useNotifications.js'

export function CheckoutCouponField({
  subtotal,
  couponInput,
  onCouponInputChange,
  appliedCode,
  onApplied,
  onClear,
  disabled,
}) {
  const [checking, setChecking] = useState(false)
  const { push } = useNotifications()

  async function apply() {
    const code = couponInput.trim()
    if (!code) {
      toast.error('Enter a coupon code')
      return
    }
    setChecking(true)
    try {
      const res = await couponService.validateCouponRequest({ code, subtotal })
      if (!res.valid) {
        toast.error(res.message || 'Coupon not valid')
        return
      }
      onApplied(res.discountAmount ?? 0, res.coupon?.code ?? code.toUpperCase())
      toast.success(res.message || 'Coupon applied')
      push({
        type: 'coupon',
        title: 'Coupon applied',
        message: `${res.coupon?.code ?? code} saved on this order`,
      })
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not validate coupon'))
    } finally {
      setChecking(false)
    }
  }

  return (
    <section className="rounded-tn-xl border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-white/10 dark:bg-white/5">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Promo code</h3>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Discounts apply before tax, same as checkout totals on the server.</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          autoComplete="off"
          placeholder="e.g. TECH10"
          value={couponInput}
          disabled={disabled || Boolean(appliedCode)}
          onChange={(e) => onCouponInputChange(e.target.value)}
          className="w-full rounded-tn border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-sky-500/30 focus:ring-2 dark:border-white/10 dark:bg-tn-900 dark:text-white"
        />
        {appliedCode ? (
          <SecondaryButton type="button" disabled={disabled} onClick={onClear} className="shrink-0">
            Remove
          </SecondaryButton>
        ) : (
          <PrimaryButton type="button" className="shrink-0 justify-center" disabled={disabled || checking} onClick={apply}>
            {checking ? 'Checking…' : 'Apply'}
          </PrimaryButton>
        )}
      </div>
      {appliedCode ? (
        <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          Using <span className="font-mono">{appliedCode}</span>
        </p>
      ) : null}
    </section>
  )
}
