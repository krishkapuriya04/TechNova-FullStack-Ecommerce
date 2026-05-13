import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader.jsx'
import { Skeleton } from '@/components/ui/LoadingSkeleton.jsx'
import * as adminService from '@/services/adminService.js'
import { formatOrderMoney, formatShortDate, orderStatusBadgeClass, paymentStatusBadgeClass } from '@/utils/ecommerce.js'
import { getErrorMessage } from '@/utils/apiError.js'

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const PAYMENT_STATUSES = ['pending', 'paid', 'failed']

export function AdminOrdersPage() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const payload = await adminService.fetchAdminOrders({
        page,
        limit: 15,
        ...(status ? { status } : {}),
      })
      setData(payload)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to load orders'))
    } finally {
      setLoading(false)
    }
  }, [page, status])

  useEffect(() => {
    const h = window.setTimeout(() => {
      void load()
    }, 0)
    return () => window.clearTimeout(h)
  }, [load])

  useEffect(() => {
    const h = window.setTimeout(() => {
      setPage(1)
    }, 0)
    return () => window.clearTimeout(h)
  }, [status])

  async function patchOrderStatus(id, orderStatus) {
    setBusyId(id)
    try {
      await adminService.updateAdminOrderStatus(id, orderStatus)
      toast.success('Order status updated')
      load()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Update failed'))
    } finally {
      setBusyId(null)
    }
  }

  async function patchPaymentStatus(id, paymentStatus) {
    setBusyId(id)
    try {
      await adminService.updateAdminPaymentStatus(id, paymentStatus)
      toast.success('Payment status updated')
      load()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Update failed'))
    } finally {
      setBusyId(null)
    }
  }

  const meta = data?.meta

  return (
    <div>
      <AdminPageHeader
        eyebrow="Fulfillment"
        title="Orders"
        subtitle="Filter by fulfillment state and reconcile payment flags before finance integrations land."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="text-xs font-semibold text-zinc-400">
          Filter
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="ml-2 rounded-tn border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        {meta ? (
          <span className="text-xs text-zinc-500">
            {meta.total} orders · page {meta.page}/{meta.pages}
          </span>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-tn-2xl border border-white/10 bg-white/5 backdrop-blur-md">
        {loading && !data ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Order status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(data?.orders ?? []).map((o) => (
                  <tr key={o.id} className="text-zinc-300">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{o.customerName}</p>
                      <p className="text-xs text-zinc-500">{o.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">{formatOrderMoney(o.totalPrice)}</td>
                    <td className="px-4 py-3">
                      <span className={`mr-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${orderStatusBadgeClass(o.orderStatus)}`}>
                        {o.orderStatus}
                      </span>
                      <select
                        value={o.orderStatus}
                        disabled={busyId === o.id}
                        onChange={(e) => patchOrderStatus(o.id, e.target.value)}
                        className="rounded-tn border border-white/10 bg-black/40 px-2 py-1 text-xs text-white"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`mr-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${paymentStatusBadgeClass(o.paymentStatus)}`}>
                        {o.paymentStatus}
                      </span>
                      <select
                        value={o.paymentStatus}
                        disabled={busyId === o.id}
                        onChange={(e) => patchPaymentStatus(o.id, e.target.value)}
                        className="rounded-tn border border-white/10 bg-black/40 px-2 py-1 text-xs text-white"
                      >
                        {PAYMENT_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{formatShortDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.orders?.length === 0 ? (
              <p className="py-12 text-center text-sm text-zinc-500">No orders for this filter.</p>
            ) : null}
          </div>
        )}
      </div>

      {meta && meta.pages > 1 ? (
        <div className="mt-6 flex justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-tn border border-white/10 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:bg-white/5 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= meta.pages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-tn border border-white/10 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:bg-white/5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  )
}
