import { useState } from 'react'
import toast from 'react-hot-toast'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { getErrorMessage } from '@/utils/apiError.js'
import * as adminService from '@/services/adminService.js'

function toDatetimeLocal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function defaultExpiryLocal() {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return toDatetimeLocal(d.toISOString())
}

export function CouponFormModal({ open, coupon, onClose, onSaved }) {
  const [code, setCode] = useState(() => (coupon ? coupon.code : ''))
  const [discountType, setDiscountType] = useState(() => (coupon ? coupon.discountType : 'percent'))
  const [discountValue, setDiscountValue] = useState(() => (coupon ? String(coupon.discountValue) : '10'))
  const [minimumOrder, setMinimumOrder] = useState(() => (coupon ? String(coupon.minimumOrder ?? 0) : '0'))
  const [expiryDate, setExpiryDate] = useState(() => (coupon ? toDatetimeLocal(coupon.expiryDate) : defaultExpiryLocal()))
  const [active, setActive] = useState(() => (coupon ? Boolean(coupon.active) : true))
  const [saving, setSaving] = useState(false)

  if (!open) return null

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minimumOrder: Number(minimumOrder || 0),
        expiryDate: new Date(expiryDate).toISOString(),
        active,
      }
      if (coupon) {
        await adminService.updateAdminCoupon(coupon.id, payload)
        toast.success('Coupon updated')
      } else {
        await adminService.createAdminCoupon(payload)
        toast.success('Coupon created')
      }
      onSaved?.()
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center">
      <button type="button" className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-label="Close" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative z-[91] w-full max-w-md rounded-t-2xl border border-white/10 bg-tn-950 p-6 shadow-2xl sm:rounded-2xl"
      >
        <h2 className="text-lg font-semibold text-white">{coupon ? 'Edit coupon' : 'New coupon'}</h2>
        <div className="mt-4 space-y-3 text-sm">
          <label className="block text-zinc-400">
            Code
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="mt-1 w-full rounded-tn border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </label>
          <label className="block text-zinc-400">
            Type
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className="mt-1 w-full rounded-tn border border-white/10 bg-black/30 px-3 py-2 text-white"
            >
              <option value="percent">Percent</option>
              <option value="fixed">Fixed amount</option>
            </select>
          </label>
          <label className="block text-zinc-400">
            Value {discountType === 'percent' ? '(%)' : '($)'}
            <input
              type="number"
              min="0"
              step="0.01"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              required
              className="mt-1 w-full rounded-tn border border-white/10 bg-black/30 px-3 py-2 text-white"
            />
          </label>
          <label className="block text-zinc-400">
            Minimum order ($)
            <input
              type="number"
              min="0"
              step="0.01"
              value={minimumOrder}
              onChange={(e) => setMinimumOrder(e.target.value)}
              className="mt-1 w-full rounded-tn border border-white/10 bg-black/30 px-3 py-2 text-white"
            />
          </label>
          <label className="block text-zinc-400">
            Expires
            <input
              type="datetime-local"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
              className="mt-1 w-full rounded-tn border border-white/10 bg-black/30 px-3 py-2 text-white"
            />
          </label>
          <label className="flex items-center gap-2 text-zinc-300">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            Active
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <SecondaryButton type="button" onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </PrimaryButton>
        </div>
      </form>
    </div>
  )
}
